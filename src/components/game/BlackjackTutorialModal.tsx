'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BlackjackTutorialModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm" 
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg bg-arcade-surface border border-white/10 p-8 rounded-2xl shadow-2xl pointer-events-auto max-h-[80vh] overflow-y-auto">
              
              <h2 className="text-2xl font-black text-white mb-6 tracking-tight uppercase border-b border-white/10 pb-4">
                Como Jogar
              </h2>
              
              <div className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed">
                <section>
                  <h3 className="text-yellow-400 font-bold mb-1">1. Objetivo</h3>
                  <p>Chegar o mais perto de 21 sem estourar. Você joga contra o dealer, não contra outros jogadores.</p>
                </section>

                <section>
                  <h3 className="text-yellow-400 font-bold mb-1">2. Valores das cartas</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><span className="text-white">Números (2-10):</span> valor de face</li>
                    <li><span className="text-white">Figuras (J, Q, K):</span> valem 10</li>
                    <li><span className="text-white">Ás:</span> vale 1 ou 11 (o que for melhor)</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-yellow-400 font-bold mb-1">3. Sua vez</h3>
                  <p>Você recebe 2 cartas. Escolha sua estratégia:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <span className="bg-white/5 p-1 rounded">Hit: +1 carta</span>
                    <span className="bg-white/5 p-1 rounded">Stand: Parar</span>
                    <span className="bg-white/5 p-1 rounded">Double: Dobrar</span>
                    <span className="bg-white/5 p-1 rounded">Split: Separar</span>
                  </div>
                </section>

                <section>
                  <h3 className="text-yellow-400 font-bold mb-1">4. Blackjack</h3>
                  <p>Ás + 10 nas duas primeiras cartas = Blackjack (Paga 3:2).</p>
                </section>

                <section>
                  <h3 className="text-yellow-400 font-bold mb-1">5. Dealer</h3>
                  <p>O dealer compra até ter 17 ou mais. Sem decisões, apenas regra fixa.</p>
                </section>

                <section>
                  <h3 className="text-yellow-400 font-bold mb-1">6. Quem ganha</h3>
                  <p>Maior mão sem estourar vence. Mesma pontuação = Push (Aposta devolvida).</p>
                </section>
              </div>

              <button 
                onClick={onClose}
                className="mt-8 w-full py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg transition-all font-bold uppercase tracking-widest"
              >
                Entendi
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}