/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Chip } from '@/components/ui/Chip'

interface BetStackProps {
  chips: { id: string; amount: number }[]
  phase: string
  result?: string
  isDealerPayout?: boolean
}

export function BetStack({ chips, phase, result = 'NONE', isDealerPayout = false }: BetStackProps) {
  return (
    <div className="relative w-16 h-16 flex items-end justify-center pointer-events-none">
      <AnimatePresence>
        {chips.map((chip, index) => {
          // Posição base (empilhado)
          let yPos = -(index * 6)
          let xPos = 0
          let opacity = 1
          let transition: any = { type: 'spring', damping: 20, stiffness: 100 }

          // Física de Fim de Rodada (Para as nossas fichas)
          if (phase === 'PAYOUT' && !isDealerPayout) {
            if (result === 'LOSS' || result === 'BUST') {
              yPos = -600 // Dealer puxa pro centro superior
              opacity = 0
              transition = { delay: index * 0.1, duration: 0.5, ease: 'easeIn' }
            } else if (result === 'PUSH') {
              yPos = -400 // Voa pro banco no canto
              xPos = 200
              opacity = 0
              transition = { delay: index * 0.1, duration: 0.5, ease: 'easeIn' }
            }
          }

          // Física de Pagamento (Clone do Dealer vindo até nós)
          let initialAnim: any = { opacity: 0, y: 50, scale: 0.5 } // Default (nascendo na Action Bar)
          if (isDealerPayout) {
            initialAnim = { opacity: 0, y: -400, x: 0, scale: 0.5 } // Nasce lá no dealer
            transition = { type: 'spring', damping: 15, delay: index * 0.1 } // Quica até a nossa mão
          }

          return (
            <motion.div
              key={isDealerPayout ? `dealer-${chip.id}` : chip.id}
              // O layoutId é o segredo do voo perfeito da Action Bar para a Mesa
              layoutId={isDealerPayout ? undefined : `chip-${chip.id}`}
              initial={initialAnim}
              animate={{ opacity, y: yPos, x: xPos, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={transition}
              className="absolute"
              style={{ zIndex: index }}
            >
              <Chip amount={chip.amount} disabled className="shadow-xl" />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}