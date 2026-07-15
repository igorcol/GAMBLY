import { create } from 'zustand'
import { BlackjackEngine } from '../core/blackjack/engine'
import { GameState, GameAction } from '../core/blackjack/types'
import { useBankrollStore } from './bankrollStore'

interface TableStore {
  state: GameState
  isInitialized: boolean
  initializeTable: () => void
  startGame: () => void
  placeBet: (amount: number) => void
  dispatchAction: (action: GameAction) => void
}

let engineInstance: BlackjackEngine | null = null

export const useTableStore = create<TableStore>((set, get) => ({
  state: {
    phase: 'IDLE',
    playerHands: [{ cards: [], isBusted: false, isStanding: false, score: 0, result: 'NONE', bet: 0, payout: 0 }],
    activeHandIndex: 0,
    dealerHand: { cards: [], isBusted: false, isStanding: false, score: 0, result: 'NONE', bet: 0, payout: 0 }
  },
  isInitialized: false,

  initializeTable: () => {
    if (engineInstance) return

    engineInstance = new BlackjackEngine((newState) => {
      const prevState = get().state
      
      // Escuta a transição exata para o fim da rodada para pagar o player
      if (prevState.phase !== 'PAYOUT' && newState.phase === 'PAYOUT') {
        const totalPayout = newState.playerHands.reduce((acc, hand) => acc + hand.payout, 0)
        if (totalPayout > 0) {
          useBankrollStore.getState().add(totalPayout)
        }
      }
      
      set({ state: newState })
    })

    set({ isInitialized: true })
  },

  startGame: () => {
    if (engineInstance) engineInstance.startGame()
  },

  placeBet: (amount: number) => {
    if (!engineInstance) return
    
    // Controle transacional
    const { deduct } = useBankrollStore.getState()
    const isApproved = deduct(amount) // Tenta sacar do banco
    
    if (isApproved) {
      engineInstance.placeBet(amount)
    } else {
      // TODO: Toast de notificação na UI
      console.warn('Transação negada: Saldo insuficiente')
    }
  },

  dispatchAction: (action: GameAction) => {
    if (engineInstance) engineInstance.dispatch(action)
  }
}))