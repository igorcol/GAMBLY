import { create } from 'zustand'
import { BlackjackEngine } from '../core/blackjack/engine'
import { GameState, GameAction } from '../core/blackjack/types'
import { useBankrollStore } from './bankrollStore'

interface PendingChip {
  id: string
  amount: number
}

interface TableStore {
  state: GameState
  isInitialized: boolean
  pendingBet: number
  pendingChips: PendingChip[] // NOVO: Guarda a pilha visual de fichas
  initializeTable: () => void
  startGame: () => void
  addPendingBet: (amount: number) => void
  clearPendingBet: () => void
  placeBet: () => Promise<void>
  dispatchAction: (action: GameAction) => Promise<void>
}

let engineInstance: BlackjackEngine | null = null

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
  pendingChips: [],

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
      set({ pendingBet: 0, pendingChips: [] }) // Limpa a mesa ao reiniciar
      engineInstance.startGame()
    }
  },

  addPendingBet: (amount: number) => {
    const { balance } = useBankrollStore.getState()
    const { pendingBet, pendingChips } = get()
    
    if (pendingBet + amount <= balance) {
      // Cria um ID único para o Framer Motion conseguir rastrear a animação individual de cada ficha
      const newChip = { id: `${Date.now()}-${Math.random()}`, amount }
      set({ 
        pendingBet: pendingBet + amount,
        pendingChips: [...pendingChips, newChip]
      })
    }
  },

  clearPendingBet: () => set({ pendingBet: 0, pendingChips: [] }),

  placeBet: async () => {
    if (!engineInstance) return
    const { pendingBet } = get()
    if (pendingBet <= 0) return
    
    const { deduct } = useBankrollStore.getState()
    const isApproved = deduct(pendingBet)
    
    if (isApproved) {
      engineInstance.startDealing(pendingBet)
      await delay(300)
      engineInstance.dealToPlayer()
      await delay(300)
      engineInstance.dealToDealer(false)
      await delay(300)
      engineInstance.dealToPlayer()
      await delay(300)
      engineInstance.dealToDealer(true)
      await delay(400)
      engineInstance.finishDealing()
    }
  },

  dispatchAction: async (action: GameAction) => {
    if (!engineInstance) return

    if (action.type === 'HIT') {
      engineInstance.playerHit()
    } 
    else if (action.type === 'STAND') {
      engineInstance.playerStand()
      await delay(800)
      engineInstance.revealDealerCard()
      while (engineInstance.getState().dealerHand.score < 17) {
        await delay(1000)
        engineInstance.dealToDealer(false)
      }
      await delay(800)
      engineInstance.evaluateResults()
    }
  }
}))