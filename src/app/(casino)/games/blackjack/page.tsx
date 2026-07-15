'use client'

import { useEffect, useState } from 'react'
import { useTableStore } from '@/store/tableStore'
import { useBankrollStore } from '@/store/bankrollStore'
import { ActionBar } from '@/components/game/ActionBar'
import { Hand } from '@/components/game/Hand'
import { BetStack } from '@/components/game/BetStack'
import { motion } from 'framer-motion'

// Componente isolado para gerenciar o efeito de ganho
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
  const { isInitialized, initializeTable, state, pendingChips } = useTableStore()
  const balance = useBankrollStore((state) => state.balance)
  
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
      
      <div className="w-full flex items-center justify-between px-4">
        <h1 className="text-3xl font-mono font-black text-white/50 tracking-tighter">GAMBLY</h1>
        
        <div className="relative">
          <div className="flex items-center gap-3 bg-arcade-surface/50 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
            <span className="text-gray-400 font-medium text-sm uppercase tracking-widest">Bank</span>
            <span className="font-mono font-bold text-white text-xl">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(balance)}
            </span>
          </div>
          <DopaminePopup phase={state.phase} payout={payout} />
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
        
        <div className="relative flex flex-col items-center">
          <Hand hand={state.playerHands[0]} label="Player" />
          
          {state.phase !== 'BETTING' && state.phase !== 'IDLE' && (
            <div className="absolute -bottom-14 flex justify-center z-50">
              <BetStack chips={pendingChips} phase={state.phase} result={playerResult} />
              
              {(playerResult === 'WIN' || playerResult === 'BLACKJACK') && state.phase === 'PAYOUT' && (
                <div className="absolute">
                  <BetStack chips={pendingChips} phase={state.phase} isDealerPayout />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-32 w-full relative z-40">
        <ActionBar />
      </div>
    </main>
  )
}