'use client'

import { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'

export type Suit = 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  suit?: Suit
  rank?: string
  isFacedown?: boolean
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  HEARTS: '♥',
  DIAMONDS: '♦',
  CLUBS: '♣',
  SPADES: '♠'
}

const SUIT_COLORS: Record<Suit, string> = {
  HEARTS: 'text-red-600',
  DIAMONDS: 'text-red-600',
  CLUBS: 'text-black',
  SPADES: 'text-black'
}

export function Card({ suit, rank, isFacedown = false, className = '', ...props }: CardProps) {
  // Estilo base extraído para os dois lados da carta. O absolute inset-0 garante que um lado sobreponha o outro.
  const baseStyles = 'w-32 h-44 rounded-2xl shadow-card flex items-center justify-center select-none absolute inset-0'

  const colorClass = suit ? SUIT_COLORS[suit] : ''
  const symbol = suit ? SUIT_SYMBOLS[suit] : ''

  return (
    // O container principal dita a perspectiva 3D
    <div className={`relative w-32 h-44 ${className}`} style={{ perspective: 1000 }} {...props}>
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        initial={false}
        // Se a carta estiver virada para baixo, gira 180 graus. Se não, fica em 0 (frente).
        animate={{ rotateY: isFacedown ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ y: -8 }} // Substitui o hover do Tailwind para não conflitar com o transform do Framer
      >
        
        {/* FRENTE DA CARTA (Lado 0 graus) */}
        <div 
          className={`${baseStyles} bg-white`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {suit && rank && (
            <div className="flex flex-col items-center leading-none pointer-events-none">
              <span className={`text-6xl font-black font-mono ${colorClass}`}>
                {rank}
              </span>
              <span className={`text-5xl mt-2 ${colorClass}`}>
                {symbol}
              </span>
            </div>
          )}
        </div>

        {/* VERSO DA CARTA (Lado 180 graus) */}
        <div 
          className={`${baseStyles} bg-arcade-surface border-2 border-arcade-glow/50 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-arcade-glow/20 to-transparent`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-20 h-28 border border-white/10 rounded-lg flex items-center justify-center opacity-50">
            <span className="font-mono text-xs tracking-widest text-white/50">GAMBLY</span>
          </div>
        </div>
        
      </motion.div>
    </div>
  )
}