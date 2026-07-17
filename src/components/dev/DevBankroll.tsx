import { useBankrollStore } from '../../store/bankrollStore'

// ABA DE BANKROLL DO MENU DEV DO BLACKJACK

export function DevBankroll() {
  const { add, setBalance, balance } = useBankrollStore()

  return (
    <div className="space-y-3">
      <h3 className="text-zinc-400 text-xs font-semibold flex justify-between">
        <span>1. BANKROLL</span>
        <span className="text-zinc-300">${balance}</span>
      </h3>
      
      <div className="grid grid-cols-4 gap-2">
        <button onClick={() => add(10)} className="bg-zinc-900 text-zinc-300 text-xs py-1.5 rounded hover:bg-zinc-800 transition-colors">+10</button>
        <button onClick={() => add(100)} className="bg-zinc-900 text-zinc-300 text-xs py-1.5 rounded hover:bg-zinc-800 transition-colors">+100</button>
        <button onClick={() => add(500)} className="bg-zinc-900 text-zinc-300 text-xs py-1.5 rounded hover:bg-zinc-800 transition-colors">+500</button>
        <button onClick={() => add(1000)} className="bg-zinc-900 text-zinc-300 text-xs py-1.5 rounded hover:bg-zinc-800 transition-colors">+1k</button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <button 
          onClick={() => setBalance(0)} 
          className="bg-red-950/30 text-red-500 text-xs py-2 rounded border border-red-900/50 hover:bg-red-900/40 transition-colors"
        >
          Falência ($0)
        </button>
        <button 
          onClick={() => setBalance(10000)} 
          className="bg-green-950/30 text-green-500 text-xs py-2 rounded border border-green-900/50 hover:bg-green-900/40 transition-colors"
        >
          Reset ($10k)
        </button>
      </div>
    </div>
  )
}