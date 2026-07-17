'use client'

import { useState } from 'react'
import { DevBankroll } from './DevBankroll'
import { DevHandForcer } from './DevHandForcer'
import { DevStateXRay } from './DevStateXRay'

export function DevMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'

  if (!isDev) return null

  return (
    // Mudamos de bottom-4 para top-24 e adicionamos flex-col items-end
    <div className="fixed top-24 right-4 z-50 font-mono flex flex-col items-end">
      
      {/* Botão Flutuante (agora fica em cima) */}
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

      {/* Painel (agora abre para baixo, com mt-3) */}
      {isOpen && (
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg shadow-2xl mt-3 w-72">
          <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
            <h2 className="text-white font-bold text-sm tracking-widest">DEV MENU</h2>
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