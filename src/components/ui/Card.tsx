import { HTMLAttributes } from 'react'

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
  const baseStyles = 'w-32 h-44 rounded-2xl shadow-card flex items-center justify-center transition-transform hover:-translate-y-2 select-none'

  // Verso da carta genérica
  if (isFacedown || !suit || !rank) {
    return (
      <div 
        className={`${baseStyles} bg-arcade-surface border-2 border-arcade-glow/50 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-arcade-glow/20 to-transparent ${className}`}
        {...props}
      >
        <div className="w-20 h-28 border border-white/10 rounded-lg flex items-center justify-center opacity-50">
          <span className="font-mono text-xs tracking-widest text-white/50">GAMBLY</span>
        </div>
      </div>
    )
  }

  // Frente da carta
  const colorClass = SUIT_COLORS[suit]
  const symbol = SUIT_SYMBOLS[suit]

  return (
    <div className={`${baseStyles} bg-white ${className}`} {...props}>
      <div className="flex flex-col items-center leading-none pointer-events-none">
        <span className={`text-6xl font-black font-mono ${colorClass}`}>
          {rank}
        </span>
        <span className={`text-5xl mt-2 ${colorClass}`}>
          {symbol}
        </span>
      </div>
    </div>
  )
}