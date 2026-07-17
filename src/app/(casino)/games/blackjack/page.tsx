'use client'

import { useEffect, useState } from 'react'
import { useTableStore } from '@/store/tableStore'
import { useBankrollStore } from '@/store/bankrollStore'
import { ActionBar } from '@/components/game/ActionBar'
import { Hand } from '@/components/game/Hand'
import { BetStack } from '@/components/game/BetStack'
import { motion } from 'framer-motion'
import { DevMenu } from '@/components/dev/DevMenu'
import { BlackjackTutorialModal } from '@/components/game/BlackjackTutorialModal'

const DopaminePopup = ({ phase, payout }: { phase: string, payout: number }) => {
  const [visible, setVisible] = useState(false);
  const [prevPhase, setPrevPhase] = useState(phase);

  if (phase !== prevPhase) {
    setPrevPhase(phase);
    if (phase === 'PAYOUT' && payout > 0) {
      setVisible(true);
    }
  }

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.5 }}
      animate={{ opacity: 1, y: -30, scale: 1 }}
      exit={{ opacity: 0, y: -40 }}
      className="absolute top-0 right-4 text-green-400 font-mono font-black text-2xl drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] z-50 pointer-events-none"
    >
      +${payout}
    </motion.div>
  );
};

export default function BlackjackTable() {
  const {
    isInitialized,
    initializeTable,
    state,
    pendingChips,
    startGame,
  } = useTableStore()

  const balance = useBankrollStore((state) => state.balance)

  const [isHelpOpen, setIsHelpOpen] = useState(false); // Modal de ajuda

  const playerResult = state.playerHands[0]?.result || 'NONE'
  const payout = state.playerHands[0]?.payout || 0

  useEffect(() => {
    if (!isInitialized) initializeTable()
  }, [isInitialized, initializeTable])

  if (!isInitialized) return null

  const getResultConfig = (result: string) => {
    switch (result) {
      case 'WIN':
      case 'BLACKJACK':
        return { text: 'YOU WIN', color: 'text-green-400', shadow: 'shadow-[0_0_20px_rgba(74,222,128,0.4)]' }
      case 'LOSS':
        return { text: 'DEALER WINS', color: 'text-red-500', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' }
      case 'BUST':
        return { text: 'BUSTED', color: 'text-red-500', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' }
      case 'PUSH':
        return { text: 'PUSH', color: 'text-gray-300', shadow: 'shadow-[0_0_20px_rgba(209,213,219,0.2)]' }
      default:
        return { text: 'ROUND OVER', color: 'text-arcade-action', shadow: 'shadow-neon' }
    }
  }

  const bannerConfig = getResultConfig(playerResult)

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-10 relative overflow-hidden">


      {/* Header */}
      <div className="w-full flex justify-between px-4">

        {/* Coluna da Esquerda: Logo e Ajuda */}
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-mono font-black text-white/50 tracking-tighter">GAMBLY</h1>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center font-bold font-mono text-sm"
          >
            ?
          </button>
        </div>

        {/* Coluna da Direita: Bankroll e DevMenu */}
        <div className="flex flex-col items-end gap-5">
          <div className="relative">
            <div className="flex items-center gap-3 bg-arcade-surface/50 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
              <span className="text-gray-400 font-medium text-sm uppercase tracking-widest">Bank</span>
              <span className="font-mono font-bold text-white text-xl">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(balance)}
              </span>
            </div>
            <DopaminePopup phase={state.phase} payout={payout} />
          </div>

          <div className="mr-2"> {/* Margem para ajustar o alinhamento se precisar */}
            <DevMenu />
          </div>
        </div>
      </div>


      <div className="flex flex-col items-center justify-center w-full flex-1 mt-10 relative">
        <Hand hand={state.dealerHand} label="Dealer" />

        <div className="h-24 flex items-center justify-center w-full my-6">
          {state.phase === 'PAYOUT' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-mono font-black z-50 bg-arcade-surface/90 border border-white/10 px-8 py-4 rounded-full backdrop-blur-md ${bannerConfig.color} ${bannerConfig.shadow}`}
            >
              {bannerConfig.text}
            </motion.div>
          )}
        </div>

        {/* Mãos do Jogador (Sempre renderizadas para não desaparecerem) */}
        <div className="flex items-center justify-center gap-8 w-full">
          {state.playerHands.map((hand, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <Hand hand={hand} label={state.playerHands.length > 1 ? `Hand ${index + 1}` : "Player"} />

              {state.phase !== 'BETTING' && state.phase !== 'IDLE' && (
                <div className="absolute -bottom-14 flex justify-center z-50">
                  <BetStack chips={pendingChips} phase={state.phase} result={hand.result} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Camada de Interação: 5 Spots no IDLE, 1 Spot no BETTING */}
        {/* IDLE: Apenas os 5 spots para sentar */}
        {state.phase === 'IDLE' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center justify-center gap-4 sm:gap-10 w-full mt-16 pointer-events-auto">
              {[1, 2, 3, 4, 5].map((id) => (
                <button
                  key={id}
                  onClick={startGame}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-dashed border-white/40 bg-black/30 hover:border-yellow-400 hover:bg-yellow-400/10 hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer
                    ${id === 1 ? '-translate-y-12' : ''}
                    ${id === 2 ? '-translate-y-2' : ''}
                    ${id === 3 ? 'translate-y-4' : ''}
                    ${id === 4 ? '-translate-y-2' : ''}
                    ${id === 5 ? '-translate-y-12' : ''}
                  `}
                >
                  <span className="text-white/60 font-bold tracking-widest text-lg">SIT</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="h-32 w-full relative z-40">
        <ActionBar />
      </div>


      <BlackjackTutorialModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </main>
  )
}