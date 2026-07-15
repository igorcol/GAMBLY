'use client'

import { useEffect } from 'react'
import { useTableStore } from '@/store/tableStore' 

export default function BlackjackTable() {
  const { isInitialized, initializeTable } = useTableStore()

  // Conecta o DOM à Engine isolada quando a tela monta
  useEffect(() => {
    if (!isInitialized) {
      initializeTable()
    }
  }, [isInitialized, initializeTable])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-mono font-black text-white drop-shadow-md tracking-tighter">
          MIDNIGHT <span className="text-arcade-action">ARCADE</span>
        </h1>
        
        <p className="font-sans text-gray-400">
          Engine: {isInitialized ? (
            <span className="text-green-400 font-medium tracking-wide">Online</span>
          ) : (
            <span className="text-yellow-400 font-medium animate-pulse">Booting...</span>
          )}
        </p>
      </div>
    </main>
  )
}