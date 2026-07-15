import { Hand as HandType } from '@/core/blackjack/types'
import { Card } from '@/components/ui/Card'
import { motion } from 'framer-motion'

interface HandProps {
  hand: HandType
  label: string
}

export function Hand({ hand, label }: HandProps) {
  if (hand.cards.length === 0) return null

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 font-medium uppercase tracking-widest text-sm">
          {label}
        </span>
        <div className={`px-3 py-1 rounded-full font-mono text-sm font-bold bg-arcade-surface border ${
          hand.isBusted ? 'border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-white/10 text-white'
        }`}>
          {hand.score}
        </div>
      </div>

      <div className="flex justify-center">
        {hand.cards.map((card, index) => {
          const isLastCard = index === hand.cards.length - 1
          return (
            <motion.div 
              key={`${label}-${index}-${card.rank}-${card.suit}`}
              initial={{ opacity: 0, y: -200, x: 200, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                x: 0, 
                scale: 1,
                rotate: isLastCard ? 2 : 0 
              }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="relative"
              style={{ 
                marginLeft: index > 0 ? '-4rem' : '0',
                zIndex: index
              }}
            >
              <Card suit={card.suit} rank={card.rank} isFacedown={card.isHidden} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}