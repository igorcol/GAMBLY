'use client'

import { useTableStore } from '@/store/tableStore'
import { Button } from '@/components/ui/Button'

export function ActionBar() {
  const { state, startGame, placeBet, dispatchAction } = useTableStore()

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-arcade-surface/50 p-4 rounded-full border border-white/10 backdrop-blur-md">
      {(state.phase === 'IDLE' || state.phase === 'PAYOUT') && (
        <Button 
          variant="primary" 
          label={state.phase === 'PAYOUT' ? 'Play Again' : 'Start Game'} 
          onClick={startGame} 
        />
      )}

      {state.phase === 'BETTING' && (
        // Fixado em 100 na v0.1.0 para manter o fluxo atômico antes de montar a UI de fichas
        <Button 
          variant="primary" 
          label="Deal (Bet 100)" 
          onClick={() => placeBet(100)} 
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
  )
}