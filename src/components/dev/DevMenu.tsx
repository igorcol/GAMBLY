'use client'

import { useState } from 'react'
import { useBankrollStore } from '../../store/bankrollStore'

export function DevMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { add, setBalance, balance } = useBankrollStore()

  // Validação direta sem useEffect 
  const isDev = process.env.NODE_ENV === 'development'

  if (!isDev) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono">
      {isOpen && (
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg shadow-2xl mb-3 w-72">
          <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
            <h2 className="text-white font-bold text-sm tracking-widest">DEV PANEL</h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* SECTION 1: BANKROLL */}
          <div className="space-y-3">
            <h3 className="text-zinc-400 text-xs font-semibold flex justify-between">
              <span>1. BANKROLL</span>
              <span className="text-zinc-300">${balance}</span>
            </h3>
            
            {/* Incrementos Manuais */}
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => add(10)} className="bg-zinc-900 text-zinc-300 text-xs py-1.5 rounded hover:bg-zinc-800 transition-colors">+10</button>
              <button onClick={() => add(100)} className="bg-zinc-900 text-zinc-300 text-xs py-1.5 rounded hover:bg-zinc-800 transition-colors">+100</button>
              <button onClick={() => add(500)} className="bg-zinc-900 text-zinc-300 text-xs py-1.5 rounded hover:bg-zinc-800 transition-colors">+500</button>
              <button onClick={() => add(1000)} className="bg-zinc-900 text-zinc-300 text-xs py-1.5 rounded hover:bg-zinc-800 transition-colors">+1k</button>
            </div>

            {/* Stress Test */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button 
                onClick={() => setBalance(0)} 
                className="bg-red-950/30 text-red-500 text-xs py-2 rounded border border-red-900/50 hover:bg-red-900/40 transition-colors"
              >
                Falência ($0)
              </button>
              <button 
                onClick={() => setBalance(1000)} 
                className="bg-green-950/30 text-green-500 text-xs py-2 rounded border border-green-900/50 hover:bg-green-900/40 transition-colors"
              >
                Reset ($1k)
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Botão Flutuante (Terminal Icon) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white p-3 rounded-full shadow-lg ml-auto flex items-center justify-center transition-all"
        title="Open Dev Panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"></polyline>
          <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
      </button>
    </div>
  )
}