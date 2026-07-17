'use client'

import { useTableStore } from '@/store/tableStore'
import { useBankrollStore } from '@/store/bankrollStore'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { useGameShortcuts } from '@/hooks/useGameShortcuts'

const AVAILABLE_CHIPS = [10, 50, 100, 500, 1000]

export function ActionBar() {
  const { state, pendingBet, selectedChipAmount, setSelectedChip, startGame, placeBet, dispatchAction, clearPendingBet, addPendingBet } = useTableStore()

  const { balance } = useBankrollStore()

  useGameShortcuts()

  const currentHand = state.playerHands[state.activeHandIndex]
  const canDouble = currentHand?.cards.length === 2 && balance >= currentHand.bet
  const canSplit = currentHand?.cards.length === 2 &&
    currentHand.cards[0].rank === currentHand.cards[1].rank &&
    balance >= currentHand.bet

  // ActionBar oculto em IDLE
  if (state.phase === 'IDLE') return null

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 w-full max-w-2xl px-4 z-50">

      {/* Visual de Casino Live para Betting */}
      {state.phase === 'BETTING' && (
        <div className="flex flex-col items-center gap-6 w-full">
          
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
              {AVAILABLE_CHIPS.map(amount => (
                <div 
                  key={amount} 
                  className={`transition-all duration-300 cursor-pointer ${selectedChipAmount === amount ? 'scale-110 ring-2 ring-yellow-400 rounded-full' : 'opacity-60 hover:opacity-100'}`} 
                  onClick={() => setSelectedChip(amount)}
                >
                  <Chip amount={amount} />
                </div>
              ))}
            </div>
            <div className="pl-4 border-l border-white/10">
              <Button variant="primary" label="DEAL" onClick={placeBet} disabled={pendingBet === 0} />
            </div>
          </div>

          {/* 2. Spot de Aposta (Abaixo das fichas) */}
          <button
            onClick={() => addPendingBet(selectedChipAmount)}
            className="w-32 h-32 rounded-full border-[3px] border-dashed border-white/40 bg-black/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all flex items-center justify-center cursor-pointer"
          >
            <span className="text-white/80 font-bold tracking-widest text-xl">
              {pendingBet > 0 ? `$${pendingBet}` : 'BET'}
            </span>
          </button>
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