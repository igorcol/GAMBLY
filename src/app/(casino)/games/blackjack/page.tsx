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

  if (!isInitialized) return null

  // Mapeia o resultado do Core para as cores do Tailwind e Neon Shadow
  const getResultConfig = (result: string) => {
    switch (result) {
      case 'WIN': 
        return { text: 'YOU WIN', color: 'text-green-400', shadow: 'shadow-[0_0_20px_rgba(74,222,128,0.4)]' }
      case 'LOSS': 
        return { text: 'DEALER WINS', color: 'text-red-500', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' }
      case 'BUST': 
        return { text: 'BUSTED', color: 'text-red-500', shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]' }
      case 'PUSH': 
        return { text: 'PUSH', color: 'text-gray-300', shadow: 'shadow-[0_0_20px_rgba(209,213,219,0.2)]' }
      default: 
        return { text: 'ROUND OVER', color: 'text-arcade-action', shadow: 'shadow-neon' }
    }
  }

  const playerResult = state.playerHands[0]?.result || 'NONE'
  const bannerConfig = getResultConfig(playerResult)

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-10 relative overflow-hidden">
      
      {/* Topo: Logo */}
      <div className="text-center w-full">
        <h1 className="text-3xl font-mono font-black text-white/50 tracking-tighter">
          GAMBLY
        </h1>
      </div>

      {/* Centro: A Mesa de Jogo */}
      <div className="flex flex-col items-center justify-center w-full flex-1 mt-10 relative">
        <Hand hand={state.dealerHand} label="Dealer" />
        
        {/* Container invisível de altura fixa para o Banner não quebrar o layout */}
        <div className="h-24 flex items-center justify-center w-full my-6">
          {state.phase === 'PAYOUT' && (
            <div className={`text-4xl font-mono font-black animate-bounce z-50 bg-arcade-surface/90 border border-white/10 px-8 py-4 rounded-full backdrop-blur-md ${bannerConfig.color} ${bannerConfig.shadow}`}>
              {bannerConfig.text}
            </div>
          )}
        </div>
        
        <Hand hand={state.playerHands[0]} label="Player" />
      </div>

      {/* Rodapé: Controles */}
      <div className="h-32 w-full relative">
        <ActionBar />
      </div>

    </main>
  )
}