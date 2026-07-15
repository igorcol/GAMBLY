import { create } from 'zustand'
import { BlackjackEngine } from '../core/blackjack/engine'
import { GameState, GameAction } from '../core/blackjack/types'
import { useBankrollStore } from './bankrollStore'

interface TableStore {
  state: GameState
  isInitialized: boolean
  pendingBet: number
  initializeTable: () => void
  startGame: () => void
  addPendingBet: (amount: number) => void
  clearPendingBet: () => void
  placeBet: () => void
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
  pendingBet: 0,

  initializeTable: () => {
    if (engineInstance) return

    engineInstance = new BlackjackEngine((newState) => {
      const prevState = get().state
      
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
    if (engineInstance) {
      set({ pendingBet: 0 }) // Garante mesa limpa ao iniciar
      engineInstance.startGame()
    }
  },

  addPendingBet: (amount: number) => {
    const { balance } = useBankrollStore.getState()
    const currentPending = get().pendingBet
    
    // Trava para não apostar mais do que tem no banco
    if (currentPending + amount <= balance) {
      set({ pendingBet: currentPending + amount })
    }
  },

  clearPendingBet: () => {
    set({ pendingBet: 0 })
  },

  placeBet: () => {
    if (!engineInstance) return
    
    const { pendingBet } = get()
    if (pendingBet <= 0) return // Trava para não apostar vento
    
    const { deduct } = useBankrollStore.getState()
    const isApproved = deduct(pendingBet)
    
    if (isApproved) {
      engineInstance.placeBet(pendingBet)
    } else {
      console.warn('Transação negada: Saldo insuficiente')
    }
  },

  dispatchAction: (action: GameAction) => {
    if (engineInstance) engineInstance.dispatch(action)
  }
}))