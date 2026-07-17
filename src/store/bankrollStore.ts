import { create } from 'zustand'

interface BankrollStore {
  balance: number
  deduct: (amount: number) => boolean // Retorna true se a transação foi aprovada (tem saldo)
  add: (amount: number) => void
}

export const useBankrollStore = create<BankrollStore>((set, get) => ({
  balance: 40, // Saldo inicial para a v0.1.0-alpha
  // ! VER SE É O MELHOR LUGAR PARA SETAR 
  
  deduct: (amount: number) => {
    const currentBalance = get().balance
    // Validação de segurança básica direto no store
    if (currentBalance >= amount) {
      set({ balance: currentBalance - amount })
      return true
    }
    return false
  },
  
  add: (amount: number) => {
    set((state) => ({ balance: state.balance + amount }))
  }
}))