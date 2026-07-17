'use client'

import { useState } from 'react'
import { DevBankroll } from './DevBankroll'
import { DevHandForcer } from './DevHandForcer'
import { DevStateXRay } from './DevStateXRay'
import { useTableStore } from '../../store/tableStore'

export function DevMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { state } = useTableStore()
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) return null

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'IDLE':
      case 'BETTING': return 'bg-yellow-950/50 text-yellow-500 border-yellow-900/50'
      case 'DEALING':
      case 'PLAYER_TURN': return 'bg-blue-950/50 text-blue-400 border-blue-900/50'
      case 'DEALER_TURN': return 'bg-purple-950/50 text-purple-400 border-purple-900/50'
      case 'PAYOUT': return 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50'
      default: return 'bg-zinc-900 text-zinc-400 border-zinc-700'
    }
  }

  return (
    // relative = ancora o painel absolute em relação a este container
    <div className="relative z-50 font-mono">

      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all"
        title="Open Dev Panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"></polyline>
          <line x1="12" y1="19" x2="20" y2="19"></line>
        </svg>
      </button>

      {/* Painel: agora absolute, sai do fluxo, flutua sobre o resto */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 bg-zinc-950 border border-zinc-800 p-4 rounded-lg shadow-2xl w-72">

          <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-sm tracking-widest">DEV PANEL</h2>
              <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold tracking-wider ${getPhaseColor(state.phase)}`}>
                {state.phase}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <DevBankroll />
            <div className="border-b border-zinc-800/60" />
            <DevHandForcer />
            <div className="border-b border-zinc-800/60" />
            <DevStateXRay />
          </div>
        </div>
      )}
    </div>
  )
}