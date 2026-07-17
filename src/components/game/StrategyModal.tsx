'use client'

import { MOVE_COLORS, MOVE_LABELS, STRATEGY_DATA } from '@/data/blackjack-table'
import { motion, AnimatePresence } from 'framer-motion'

export function StrategyModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-101 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl bg-arcade-surface border border-white/10 p-6 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
              
              <h2 className="text-xl font-black text-white uppercase text-center">Estratégia Básica</h2>
              
              {/* Legenda Inline */}
              <div className="flex flex-wrap justify-center gap-4 my-4 text-[10px] font-bold uppercase tracking-widest">
                {Object.entries(MOVE_LABELS).map(([key, label]) => (
                  <div key={key} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${MOVE_COLORS[key]}`}>
                    <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                    {label}
                  </div>
                ))}
              </div>

              <div className="overflow-auto flex-1 border border-white/5 rounded-lg">
                <div className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest py-1 bg-white/5">
                  Mão do Dealer
                </div>
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 bg-white/5 text-gray-400">Mão</th>
                      {STRATEGY_DATA.headers.map(h => <th key={h} className="p-2 bg-white/5 text-gray-400">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {STRATEGY_DATA.rows.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="p-2 font-bold text-white bg-white/5 whitespace-nowrap">{row.hand}</td>
                        {row.moves.map((move, j) => (
                          <td key={j} className={`p-2 border border-white/5 ${MOVE_COLORS[move]}`}>
                            {move}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button onClick={onClose} className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-bold transition-all">
                Fechar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}