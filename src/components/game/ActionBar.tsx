'use client'

import { useTableStore } from '@/store/tableStore'
import { useBankrollStore } from '@/store/bankrollStore'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { useGameShortcuts } from '@/hooks/useGameShortcuts'
import { BetStack } from './BetStack'
import { useState } from 'react'

const STAKE_GROUPS = {
  LOW: [1.5, 2, 5, 10, 25],
  MID: [10, 50, 100, 500, 1000],
  HIGH: [100, 500, 1000, 5000, 10000]
};


export function ActionBar() {
  const { state, pendingBet, selectedChipAmount, setSelectedChip, startGame, placeBet, dispatchAction, clearPendingBet, addPendingBet, pendingChips } = useTableStore()

  const { balance } = useBankrollStore()

  const [stakeLevel, setStakeLevel] = useState<'LOW' | 'MID' | 'HIGH'>('MID');

  const AVAILABLE_CHIPS = STAKE_GROUPS[stakeLevel];

  useGameShortcuts()

  const currentHand = state.playerHands[state.activeHandIndex]
  const canDouble = currentHand?.cards.length === 2 && balance >= currentHand.bet
  const canSplit = currentHand?.cards.length === 2 &&
    currentHand.cards[0].rank === currentHand.cards[1].rank &&
    balance >= currentHand.bet

  // ActionBar oculto em IDLE
  if (state.phase === 'IDLE') return null

  // Define o posicionamento baseada na fase
  const positionClass = state.phase === 'BETTING'
    ? "fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
    : "fixed bottom-10 left-1/2 -translate-x-1/2";

  return (
    <div className={`${positionClass} flex flex-col items-center gap-6 w-full max-w-2xl px-4 z-50 transition-all duration-500`}>

      {/* Visual de Casino Live para Betting */}
      {state.phase === 'BETTING' && (
        <div className="flex flex-col items-center gap-6 w-full">

          {/* Seletor de Nível*/}
          <div className="flex gap-2 -mb-4">
            {(['LOW', 'MID', 'HIGH'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setStakeLevel(level)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${stakeLevel === level ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* 1. Barra de Fichas (Centro da tela) */}
          <div className="flex items-center gap-4 bg-arcade-surface/50 p-4 rounded-full border border-white/10 backdrop-blur-md">
            <button
              onClick={clearPendingBet}
              disabled={pendingBet === 0}
              className="text-gray-400 hover:text-white font-mono text-xs uppercase px-4"
            >
              Clear
            </button>
            <div className="flex items-center gap-2">
              {AVAILABLE_CHIPS.map((amount, i) => (
                <div
                  key={amount}
                  className={`...`}
                  onClick={() => setSelectedChip(amount)}
                >
                  <Chip
                    amount={amount}
                    index={i} // Passao índice para garantir a cor consistente
                    layoutId={`chip-source-${amount}`}
                  />
                </div>
              ))}
            </div>
            <div className="pl-4 border-l border-white/10">
              <Button variant="primary" label="DEAL" onClick={placeBet} disabled={pendingBet === 0} />
            </div>
          </div>

          {/* 2. Spot de Aposta com BetStack Integrado */}
          <div
            onClick={() => addPendingBet(selectedChipAmount)}
            role="button"
            tabIndex={0}
            className="relative w-32 h-32 rounded-full border-[3px] border-dashed border-white/40 bg-black/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all flex items-center justify-center cursor-pointer"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {pendingChips.length > 0 ? (
                <BetStack chips={pendingChips} phase={state.phase} />
              ) : (
                <span className="text-white/80 font-bold tracking-widest text-xl group-hover:text-yellow-400">
                  BET
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ações de Jogo */}
      {state.phase !== 'BETTING' && (
        <div className="flex items-center gap-4 bg-arcade-surface/50 p-4 rounded-full border border-white/10 backdrop-blur-md transition-all">

          {state.phase === 'PAYOUT' && (
            <Button variant="primary" label="Play Again" onClick={startGame} />
          )}

          {state.phase === 'PLAYER_TURN' && (
            <>
              <Button variant="danger" label="Stand" shortcut="S" onClick={() => dispatchAction({ type: 'STAND' })} />
              {canSplit && (
                <Button variant="secondary" label="Split" onClick={() => dispatchAction({ type: 'SPLIT' })} />
              )}
              {canDouble && (
                <Button variant="warning" label="Double" onClick={() => dispatchAction({ type: 'DOUBLE' })} />
              )}
              <Button variant="success" label="Hit" shortcut="H" onClick={() => dispatchAction({ type: 'HIT' })} />
            </>
          )}

          {(state.phase === 'DEALING' || state.phase === 'DEALER_TURN') && (
            <span className="text-gray-400 font-mono text-sm px-6 animate-pulse">Dealer is playing...</span>
          )}
        </div>
      )}
    </div>
  )
}