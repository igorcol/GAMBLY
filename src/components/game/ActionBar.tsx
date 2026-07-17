'use client'

import { useTableStore } from '@/store/tableStore'
import { useBankrollStore } from '@/store/bankrollStore'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { useGameShortcuts } from '@/hooks/useGameShortcuts'
import { BetStack } from '@/components/game/BetStack'

const AVAILABLE_CHIPS = [10, 50, 100, 500, 1000]

export function ActionBar() {
  const { state, pendingBet, pendingChips, startGame, placeBet, dispatchAction, addPendingBet, clearPendingBet } = useTableStore()
  const { balance } = useBankrollStore()
  
  useGameShortcuts()

  // Lógica de condições para as novas regras
  const currentHand = state.playerHands[state.activeHandIndex]
  const canDouble = currentHand?.cards.length === 2 && balance >= currentHand.bet
  const canSplit = currentHand?.cards.length === 2 && 
                   currentHand.cards[0].rank === currentHand.cards[1].rank && 
                   balance >= currentHand.bet

  // Se o jogo não começou, a ActionBar fica invisível 
  // (O usuário deve clicar em um Spot na mesa para iniciar)
  if (state.phase === 'IDLE') return null

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-full max-w-2xl px-4 z-50">
      
      {state.phase === 'BETTING' && (
        <div className="flex flex-col items-center gap-6 bg-arcade-surface/50 p-6 rounded-3xl border border-white/10 backdrop-blur-md w-full">
          <div className="flex items-center w-full justify-between px-4">
            <button 
              onClick={clearPendingBet}
              disabled={pendingBet === 0}
              className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm transition-colors w-24 text-left"
            >
              CLEAR
            </button>
            
            <div className="flex flex-col items-center min-h-30 justify-end">
              <div className="mb-4">
                <BetStack chips={pendingChips} phase={state.phase} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1">Total Bet</span>
                <span className="text-2xl font-mono font-black text-arcade-action">${pendingBet}</span>
              </div>
            </div>

            <div className="w-24 flex justify-end">
              <Button variant="primary" label="DEAL" onClick={placeBet} disabled={pendingBet === 0} />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10 w-full justify-center">
            {AVAILABLE_CHIPS.map(amount => (
              <Chip key={amount} amount={amount} onClick={() => addPendingBet(amount)} />
            ))}
          </div>
        </div>
      )}

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