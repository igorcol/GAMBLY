'use client'

import { useTableStore } from '@/store/tableStore'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { useGameShortcuts } from '@/hooks/useGameShortcuts'

const AVAILABLE_CHIPS = [10, 50, 100, 500, 1000]

export function ActionBar() {
  const { state, pendingBet, startGame, placeBet, dispatchAction, addPendingBet, clearPendingBet } = useTableStore()

  // Ativa os atalhos de teclado
  useGameShortcuts()

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
      
      {/* Fase de Aposta: Mostra as Fichas e o Painel de Confirmação */}
      {state.phase === 'BETTING' && (
        <div className="flex flex-col items-center gap-6 bg-arcade-surface/50 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
          
          {/* Valor pendente e botões de ação */}
          <div className="flex items-center gap-6 w-full justify-between">
            <button 
              onClick={clearPendingBet}
              disabled={pendingBet === 0}
              className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm transition-colors"
            >
              CLEAR
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">Total Bet</span>
              <span className="text-2xl font-mono font-black text-arcade-action">${pendingBet}</span>
            </div>

            <Button 
              variant="primary" 
              label="DEAL" 
              onClick={placeBet} 
              disabled={pendingBet === 0}
            />
          </div>

          {/* Fileira de Fichas para somar a aposta */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10 w-full justify-center">
            {AVAILABLE_CHIPS.map(amount => (
              <Chip 
                key={amount} 
                amount={amount} 
                onClick={() => addPendingBet(amount)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Container Padrão para as outras fases */}
      {state.phase !== 'BETTING' && (
        <div className="flex items-center gap-4 bg-arcade-surface/50 p-4 rounded-full border border-white/10 backdrop-blur-md transition-all">
          
          {(state.phase === 'IDLE' || state.phase === 'PAYOUT') && (
            <Button 
              variant="primary" 
              label={state.phase === 'PAYOUT' ? 'Play Again' : 'Start Game'} 
              onClick={startGame} 
            />
          )}

          {state.phase === 'PLAYER_TURN' && (
            <>
              <Button 
                variant="danger" 
                label="Stand" 
                shortcut="S" 
                onClick={() => dispatchAction({ type: 'STAND' })} 
              />
              <Button 
                variant="success" 
                label="Hit" 
                shortcut="H" 
                onClick={() => dispatchAction({ type: 'HIT' })} 
              />
            </>
          )}

          {(state.phase === 'DEALING' || state.phase === 'DEALER_TURN') && (
            <span className="text-gray-400 font-mono text-sm px-6 animate-pulse">
              Dealer is playing...
            </span>
          )}
        </div>
      )}
    </div>
  )
}