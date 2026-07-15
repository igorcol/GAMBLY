'use client'

import { useEffect } from 'react'
import { useTableStore } from '@/store/tableStore'
import { ActionBar } from '@/components/game/ActionBar'
import { Hand } from '@/components/game/Hand'

export default function BlackjackTable() {
  const { isInitialized, initializeTable, state } = useTableStore()

  useEffect(() => {
    if (!isInitialized) {
      initializeTable()
    }
  }, [isInitialized, initializeTable])

  if (!isInitialized) return null // Evita flash de conteúdo antes do Zustand acoplar

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-10 relative overflow-hidden">
      
      {/* Topo: Logo ou Status */}
      <div className="text-center w-full">
        <h1 className="text-3xl font-mono font-black text-white/50 tracking-tighter">
          GAMBLY
        </h1>
        {state.phase === 'PAYOUT' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-mono font-black text-arcade-action animate-bounce z-50 shadow-neon bg-black/50 px-8 py-4 rounded-full backdrop-blur-md">
            ROUND OVER
          </div>
        )}
      </div>

      {/* Centro: A Mesa de Jogo */}
      <div className="flex flex-col items-center justify-center gap-20 w-full flex-1 mt-10">
        <Hand hand={state.dealerHand} label="Dealer" />
        
        {/* Renderiza a mão principal do jogador (índice 0) */}
        <Hand hand={state.playerHands[0]} label="Player" />
      </div>

      {/* Rodapé: Controles */}
      <div className="h-32 w-full relative">
        <ActionBar />
      </div>

    </main>
  )
}