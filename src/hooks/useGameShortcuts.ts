import { useEffect } from 'react'
import { useTableStore } from '@/store/tableStore'

export function useGameShortcuts() {
  const { state, pendingBet, dispatchAction, placeBet, clearPendingBet } = useTableStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Segurança: Não faz ação com chat aberto
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const key = e.key.toLowerCase()

      // Atalhos da fase de Aposta
      if (state.phase === 'BETTING') {
        if ((key === 'd' || key === 'enter') && pendingBet > 0) {
          placeBet()
        }
        if (key === 'c' || key === 'escape') {
          clearPendingBet()
        }
      }

      // Atalhos da fase de Jogo
      if (state.phase === 'PLAYER_TURN') {
        if (key === 'h') dispatchAction({ type: 'HIT' })
        if (key === 's') dispatchAction({ type: 'STAND' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    // Cleanup para evitar memory leak quando o componente desmontar
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.phase, pendingBet, dispatchAction, placeBet, clearPendingBet])
}