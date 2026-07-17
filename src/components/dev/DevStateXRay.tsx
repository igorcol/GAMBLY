import { useState } from 'react'
import { useTableStore } from '../../store/tableStore'

export function DevStateXRay() {
  const { state, pendingBet } = useTableStore()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLog = () => {
    console.log("🎲 GAME STATE:", state)
  }

  const handleReset = () => {
    window.location.reload()
  }

  return (
    <div className="space-y-3">
      <h3 className="text-zinc-400 text-xs font-semibold">3. STATE X-RAY</h3>
      
      {/* Métricas Rápidas */}
      <div className="grid grid-cols-3 gap-2 bg-zinc-900/50 p-2 rounded border border-zinc-800/50">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500">Mãos Ativas</span>
          <span className="text-xs text-zinc-300 font-bold">{state.playerHands.length}</span>
        </div>
        <div className="flex flex-col border-l border-zinc-800/50 pl-2">
          <span className="text-[10px] text-zinc-500">Idx Atual</span>
          <span className="text-xs text-zinc-300 font-bold">{state.activeHandIndex}</span>
        </div>
        <div className="flex flex-col border-l border-zinc-800/50 pl-2">
          <span className="text-[10px] text-zinc-500">Aposta Pend.</span>
          <span className="text-xs text-zinc-300 font-bold">${pendingBet}</span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={handleLog}
          className="bg-sky-950/40 text-sky-400 text-xs py-1.5 rounded border border-sky-900/50 hover:bg-sky-900/50 transition-colors flex items-center justify-center gap-1"
        >
          🖨️ Log
        </button>
        <button 
          onClick={handleCopy}
          className="bg-amber-950/40 text-amber-400 text-xs py-1.5 rounded border border-amber-900/50 hover:bg-amber-900/50 transition-colors flex items-center justify-center gap-1"
        >
          {copied ? '✅ Copiado' : '📋 Copy'}
        </button>
        <button 
          onClick={handleReset}
          className="bg-red-950/40 text-red-400 text-xs py-1.5 rounded border border-red-900/50 hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1"
        >
          🔄 Reload
        </button>
      </div>
    </div>
  )
}