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
  placeBet: () => Promise<void>
  dispatchAction: (action: GameAction) => Promise<void>
}

let engineInstance: BlackjackEngine | null = null

// Utilitário simples para criar pausas dramáticas (async/await)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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
        if (totalPayout > 0) useBankrollStore.getState().add(totalPayout)
      }
      set({ state: newState })
    })
    set({ isInitialized: true })
  },

  startGame: () => {
    if (engineInstance) {
      set({ pendingBet: 0 })
      engineInstance.startGame()
    }
  },

  addPendingBet: (amount: number) => {
    const { balance } = useBankrollStore.getState()
    const currentPending = get().pendingBet
    if (currentPending + amount <= balance) {
      set({ pendingBet: currentPending + amount })
    }
  },

  clearPendingBet: () => set({ pendingBet: 0 }),

  // COREOGRAFIA DO DEAL
  placeBet: async () => {
    if (!engineInstance) return
    const { pendingBet } = get()
    if (pendingBet <= 0) return
    
    const { deduct } = useBankrollStore.getState()
    const isApproved = deduct(pendingBet)
    
    if (isApproved) {
      engineInstance.startDealing(pendingBet)
      
      await delay(300) // Player Carta 1
      engineInstance.dealToPlayer()
      
      await delay(300) // Dealer Carta 1 (Aberta)
      engineInstance.dealToDealer(false)
      
      await delay(300) // Player Carta 2
      engineInstance.dealToPlayer()
      
      await delay(300) // Dealer Carta 2 (Oculta)
      engineInstance.dealToDealer(true)
      
      await delay(400) // Processa se foi Blackjack natural
      engineInstance.finishDealing()
    }
  },

  // COREOGRAFIA DO JOGO
  dispatchAction: async (action: GameAction) => {
    if (!engineInstance) return

    if (action.type === 'HIT') {
      engineInstance.playerHit()
    } 
    else if (action.type === 'STAND') {
      engineInstance.playerStand()
      
      // Vira a carta oculta e dá uma pausa para o player ver o score
      await delay(800)
      engineInstance.revealDealerCard()

      // Loop assíncrono: O dealer puxa cartas uma a uma com pausa dramática
      while (engineInstance.getState().dealerHand.score < 17) {
        await delay(1000)
        engineInstance.dealToDealer(false)
      }

      // Avalia o resultado só depois que as cartas terminaram de cair
      await delay(800)
      engineInstance.evaluateResults()
    }
  }
}))