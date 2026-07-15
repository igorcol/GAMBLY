import { Hand as HandType } from '@/core/blackjack/types'
import { Card } from '@/components/ui/Card' 

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
        {hand.cards.map((card, index) => (
          <div 
            key={index} 
            className="relative transition-all duration-300"
            style={{ 
              marginLeft: index > 0 ? '-4rem' : '0',
              zIndex: index,
              transform: `rotate(${index === hand.cards.length - 1 ? '2deg' : '0deg'})` 
            }}
          >
            {/* O Hand traduz a lógica da Engine para props burras da UI */}
            <Card 
              suit={card.suit} 
              rank={card.rank} 
              isFacedown={card.isHidden} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}