'use client'

import { useEffect } from 'react'
import { useTableStore } from '@/store/tableStore'
import { ActionBar } from '@/components/game/ActionBar'

export default function BlackjackTable() {
  const { isInitialized, initializeTable, state } = useTableStore()

  useEffect(() => {
    if (!isInitialized) {
      initializeTable()
    }
  }, [isInitialized, initializeTable])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-mono font-black text-white drop-shadow-md tracking-tighter">
          MIDNIGHT <span className="text-arcade-action">ARCADE</span>
        </h1>
        
        {/* Temporário: Log do estado do jogo para debug visual antes de renderizarmos as cartas */}
        <div className="text-gray-400 font-mono text-sm bg-black/50 p-4 rounded-xl border border-white/5">
          <div>Phase: <span className="text-white">{state.phase}</span></div>
          <div>Player Score: <span className="text-white">{state.playerHands[0]?.score || 0}</span></div>
          <div>Dealer Score: <span className="text-white">{state.dealerHand?.score || 0}</span></div>
        </div>
      </div>

      {isInitialized && <ActionBar />}
    </main>
  )
}