import { create } from 'zustand'
import { BlackjackEngine } from '../core/blackjack/engine'
import { GameState, GameAction, Rank } from '../core/blackjack/types'
import { useBankrollStore } from './bankrollStore'

interface PendingChip {
  id: string
  amount: number
}

interface TableStore {
  state: GameState
  isInitialized: boolean
  pendingBet: number
  pendingChips: PendingChip[]
  initializeTable: () => void
  startGame: () => void
  addPendingBet: (amount: number) => void
  clearPendingBet: () => void
  placeBet: () => Promise<void>
  dispatchAction: (action: GameAction) => Promise<void>
  processDealerTurn: () => Promise<void>                // Método para controlar o tempo
  devForcePlayerHand: (ranks: Rank[]) => void           // Método DEV
  devForceDealerHand: (ranks: Rank[]) => void           // Método DEV
}

let engineInstance: BlackjackEngine | null = null
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useTableStore = create<TableStore>((set, get) => ({
  state: {
    phase: 'IDLE',
    playerHands: [{ 
      cards: [], isBusted: false, isStanding: false, score: 0, result: 'NONE', 
      bet: 0, payout: 0, isDoubled: false, isSplitted: false 
    }],
    activeHandIndex: 0,
    dealerHand: { 
      cards: [], isBusted: false, isStanding: false, score: 0, result: 'NONE', 
      bet: 0, payout: 0, isDoubled: false, isSplitted: false 
    }
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
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).blackjackEngine = engineInstance;
    set({ isInitialized: true })
  },

  startGame: () => {
    if (engineInstance) {
      set({ pendingBet: 0, pendingChips: [] })
      engineInstance.startGame()
    }
  },

  addPendingBet: (amount: number) => {
    const { balance } = useBankrollStore.getState()
    const { pendingBet, pendingChips } = get()
    
    if (pendingBet + amount <= balance) {
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
    if (deduct(pendingBet)) {
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
    const { deduct } = useBankrollStore.getState()

    switch (action.type) {
      case 'HIT':
        engineInstance.playerHit()
        // Após o hit verifica se a engine entrou no turno do dealer
        if (engineInstance.getState().phase === 'DEALER_TURN') {
          await get().processDealerTurn()
        }
        break

      case 'STAND':
        engineInstance.playerStand()
        // Após o stand verifica se a engine entrou no turno do dealer
        if (engineInstance.getState().phase === 'DEALER_TURN') {
          await get().processDealerTurn()
        }
        break

      case 'DOUBLE': {
        const currentHand = engineInstance.getState().playerHands[engineInstance.getState().activeHandIndex]
        if (deduct(currentHand.bet)) {
          engineInstance.performDouble()
          // Se após o double a fase virar Dealer, processa o dealer
          if (engineInstance.getState().phase === 'DEALER_TURN') {
            await get().processDealerTurn()
          }
        }
        break
      }

      case 'SPLIT': {
        const currentHand = engineInstance.getState().playerHands[engineInstance.getState().activeHandIndex]
        if (deduct(currentHand.bet)) {
          engineInstance.performSplit()
        }
        break
      }
    }
  },

  processDealerTurn: async () => {
    if (!engineInstance) return
    
    // Verifica se todas as mãos de player estouraram
    const allPlayersBusted = engineInstance.getState().playerHands.every(hand => hand.isBusted)

    // Dealer só joga se houver alguma mão ativa
    if (!allPlayersBusted) {
      // Loop async respeitando tempo de animação
      while (engineInstance.getState().dealerHand.score < 17) { // Da carta enquano mão do dealer é menor que 17
        await delay(1000)
        engineInstance.dealToDealer(false)
      }
    }

    await delay(800)
    engineInstance.evaluateResults()

  },

  //* --- DEV / DEBUG FUNCTIONS ---
  devForcePlayerHand: (ranks: Rank[]) => {
    if (engineInstance) engineInstance.forceHand(ranks)
  },

  devForceDealerHand: (ranks: Rank[]) => {
    if (engineInstance) engineInstance.forceDealerHand(ranks)
  }
}))