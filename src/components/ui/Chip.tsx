'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ButtonHTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ChipProps extends Omit<HTMLMotionProps<"button">, "children"> {
  amount: number
}

const CHIP_COLORS: Record<number, string> = {
  10: 'bg-slate-700 ring-slate-500 text-white',
  50: 'bg-blue-800 ring-blue-500 text-white',
  100: 'bg-violet-700 ring-violet-400 text-white',
  500: 'bg-yellow-500 ring-yellow-300 text-black',
  1000: 'bg-orange-500 ring-orange-300 text-black',
}

export function Chip({ amount, className = '', ...props }: ChipProps) {
  const colorClass = CHIP_COLORS[amount] || 'bg-arcade-surface ring-white/20 text-white'

  return (
    <motion.button
      className={`relative w-14 h-14 rounded-full flex items-center justify-center font-mono font-black text-sm shadow-[0_4px_10px_rgba(0,0,0,0.5)] ring-4 ring-inset transition-all hover:shadow-neon ${colorClass} ${className}`}
      whileHover={{ y: -5 }} // Hover agora é gerenciado pelo Framer
      whileTap={{ scale: 0.9 }} // Efeito de clique físico
      {...props}
    >
      <div className="absolute inset-1.5 rounded-full border border-dashed border-current opacity-60 pointer-events-none"></div>
      
      <span className="z-10 drop-shadow-md">
        {amount >= 1000 ? `${amount / 1000}k` : amount}
      </span>
    </motion.button>
  )
}