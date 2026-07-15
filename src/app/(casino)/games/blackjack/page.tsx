'use client'

import { useEffect } from 'react'
import { useTableStore } from '@/store/tableStore'
import { useBankrollStore } from '@/store/bankrollStore'
import { ActionBar } from '@/components/game/ActionBar'
import { Hand } from '@/components/game/Hand'
import { motion } from 'framer-motion'

export default function BlackjackTable() {
  const { isInitialized, initializeTable, state } = useTableStore()
  const balance = useBankrollStore((state) => state.balance)

  useEffect(() => {
    if (!isInitialized) {
      initializeTable()
    }
  }, [isInitialized, initializeTable])

  if (!isInitialized) return null

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
      
      {/* Topo: Logo e HUD de Saldo */}
      <div className="w-full flex items-center justify-between px-4">
        <h1 className="text-3xl font-mono font-black text-white/50 tracking-tighter">
          GAMBLY
        </h1>
        
        <div className="flex items-center gap-3 bg-arcade-surface/50 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
          <span className="text-gray-400 font-medium text-sm uppercase tracking-widest">Bank</span>
          <span className="font-mono font-bold text-white text-xl">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(balance)}
          </span>
        </div>
      </div>

      {/* Centro: A Mesa de Jogo */}
      <div className="flex flex-col items-center justify-center w-full flex-1 mt-10 relative">
        <Hand hand={state.dealerHand} label="Dealer" />
        
        <div className="h-24 flex items-center justify-center w-full my-6">
          {state.phase === 'PAYOUT' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-4xl font-mono font-black z-50 bg-arcade-surface/90 border border-white/10 px-8 py-4 rounded-full backdrop-blur-md ${bannerConfig.color} ${bannerConfig.shadow}`}
            >
              {bannerConfig.text}
            </motion.div>
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