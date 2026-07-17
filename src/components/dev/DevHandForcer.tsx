import { useState } from 'react'
import { useTableStore } from '../../store/tableStore'
import { Rank } from '../../core/blackjack/types'


// ABA DE RAND FORCER DO MENU DEV DO BLACKJACK

const VALID_RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

export function DevHandForcer() {
  const { devForcePlayerHand, devForceDealerHand } = useTableStore()
  const [customHand, setCustomHand] = useState('A, 7')
  const [error, setError] = useState('')

  // Função que transforma a string "A, 7" em um array validado ["A", "7"]
  const parseAndApply = (isPlayer: boolean, inputStr?: string) => {
    setError('')
    const targetStr = inputStr || customHand
    const rawParts = targetStr.split(',').map(s => s.trim().toUpperCase())
    
    const isValid = rawParts.every(part => VALID_RANKS.includes(part))
    
    if (!isValid) {
      setError('Use vírgula: 2-10, J, Q, K, A')
      return
    }

    const ranks = rawParts as Rank[]
    if (isPlayer) devForcePlayerHand(ranks)
    else devForceDealerHand(ranks)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-zinc-400 text-xs font-semibold">2. HAND FORCER</h3>
      
      {/* Input Customizado */}
      <div className="space-y-1">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={customHand}
            onChange={(e) => setCustomHand(e.target.value)}
            placeholder="Ex: A, 7, 2"
            className="bg-zinc-900 border border-zinc-700 text-white text-xs px-2 py-1.5 rounded w-full outline-none focus:border-zinc-500 transition-colors"
          />
          <button 
            onClick={() => parseAndApply(true)}
            className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded hover:bg-zinc-700 transition-colors"
          >
            P1
          </button>
          <button 
            onClick={() => parseAndApply(false)}
            className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded hover:bg-zinc-700 transition-colors"
          >
            DL
          </button>
        </div>
        {error && <p className="text-red-400 text-[10px]">{error}</p>}
      </div>

      {/* Atalhos Rápidos */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button 
          onClick={() => parseAndApply(true, '8, 8')}
          className="bg-indigo-950/40 text-indigo-400 text-xs py-1.5 rounded border border-indigo-900/50 hover:bg-indigo-900/50 transition-colors"
        >
          [8, 8] Split
        </button>
        <button 
          onClick={() => parseAndApply(true, 'A, K')}
          className="bg-emerald-950/40 text-emerald-400 text-xs py-1.5 rounded border border-emerald-900/50 hover:bg-emerald-900/50 transition-colors"
        >
          [A, K] P1-BJ
        </button>
        <button 
          onClick={() => parseAndApply(false, 'A, K')}
          className="bg-rose-950/40 text-rose-400 text-xs py-1.5 rounded border border-rose-900/50 hover:bg-rose-900/50 transition-colors col-span-2"
        >
          [A, K] Dealer-BJ
        </button>
      </div>
    </div>
  )
}