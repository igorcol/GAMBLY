import { create } from 'zustand'
import { BlackjackEngine } from '../core/blackjack/engine'
import { GameState, GameAction } from '../core/blackjack/types'

interface TableStore {
  state: GameState
  isInitialized: boolean
  initializeTable: () => void
  startGame: () => void
  placeBet: (amount: number) => void
  dispatchAction: (action: GameAction) => void
}

// Singleton da engine vivendo fora da árvore reativa do React
let engineInstance: BlackjackEngine | null = null

export const useTableStore = create<TableStore>((set) => ({
  // Estado inicial fake para a UI não quebrar no primeiro render
  state: {
    phase: 'IDLE',
    playerHands: [{ cards: [], isBusted: false, isStanding: false, score: 0 }],
    activeHandIndex: 0,
    dealerHand: { cards: [], isBusted: false, isStanding: false, score: 0 }
  },
  isInitialized: false,

  initializeTable: () => {
    if (engineInstance) return

    // Instancia o motor e injeta o callback que atualiza o Zustand
    engineInstance = new BlackjackEngine((newState) => {
      set({ state: newState })
    })

    set({ isInitialized: true })
  },

  startGame: () => {
    if (engineInstance) engineInstance.startGame()
  },

  placeBet: (amount: number) => {
    if (engineInstance) engineInstance.placeBet(amount)
  },

  dispatchAction: (action: GameAction) => {
    if (engineInstance) engineInstance.dispatch(action)
  }
}))