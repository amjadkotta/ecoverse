import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Recycle,
  X,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Package,
} from 'lucide-react'

export default function RecyclingModal({
  isOpen,
  backpack = [],
  activeBin,
  wasteCategories = {},
  recyclingBins = [],
  currentStreak = 0,
  onSortItem,
  onClose,
}) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const [lastFeedback, setLastFeedback] = useState(null) // { correct: bool, message: string }

  // Clamp selected index purely during render (eliminates cascading renders)
  const safeIndex = Math.min(selectedItemIndex, Math.max(0, backpack.length - 1))
  const currentItem = backpack[safeIndex]

  const handleSort = useCallback(
    (item, chosenCategory) => {
      if (!item || typeof onSortItem !== 'function') return

      const result = onSortItem(item, chosenCategory)

      if (result.correct) {
        setLastFeedback({
          correct: true,
          message: `✓ Correctly Sorted! +${result.bonusScore} Pts, +${result.coinReward} Eco Coins!`,
        })
      } else {
        const catName = wasteCategories[item.category]?.name || item.category
        setLastFeedback({
          correct: false,
          message: `✗ Contaminated Stream! That was ${catName}. Sorting streak reset.`,
        })
      }
    },
    [onSortItem, wasteCategories]
  )

  // Keep callback refs updated for keyboard shortcuts
  const handleSortRef = useRef(handleSort)
  const onCloseRef = useRef(onClose)
  const currentItemRef = useRef(currentItem)

  useEffect(() => {
    handleSortRef.current = handleSort
  }, [handleSort])

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    currentItemRef.current = currentItem
  }, [currentItem])

  // Handle keyboard shortcuts (1: Plastic, 2: Metal, 3: Paper, Escape: Close)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onCloseRef.current) onCloseRef.current()
        return
      }

      const activeItem = currentItemRef.current
      if (!activeItem) return

      if (e.key === '1') {
        if (handleSortRef.current) handleSortRef.current(activeItem, 'plastic')
      } else if (e.key === '2') {
        if (handleSortRef.current) handleSortRef.current(activeItem, 'metal')
      } else if (e.key === '3') {
        if (handleSortRef.current) handleSortRef.current(activeItem, 'paper')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#041A12]/85 backdrop-blur-md">
        {/* Backdrop click to dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Dialog Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="recycling-station-title"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0D3524] via-[#08291C] to-[#041A12] border border-[#39B86B]/40 shadow-[0_0_50px_rgba(57,184,107,0.25)] text-left"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524] transition-colors focus:outline-none"
            aria-label="Close recycling station"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Row */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#39B86B]/20 border border-[#39B86B]/40 flex items-center justify-center text-[#39B86B]">
              <Recycle className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-[#B8F34A] uppercase tracking-wider">
              {activeBin?.name || 'Forest Glade Recycling Station'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h3
              id="recycling-station-title"
              className="font-heading text-xl sm:text-2xl font-black text-[#F3F7EF] tracking-tight"
            >
              Circular Sorting Hub
            </h3>

            {/* Streak & Bag Count Badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#041A12] border border-[#39B86B]/30 text-xs font-mono text-[#F3F7EF]">
                <Package className="w-3.5 h-3.5 text-[#B8F34A]" />
                <span>{backpack.length}/5 in Bag</span>
              </div>

              {currentStreak > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FACC15]/15 border border-[#FACC15]/40 text-xs font-mono text-[#FACC15] font-bold animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{currentStreak} Streak</span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Feedback Toast */}
          <AnimatePresence mode="wait">
            {lastFeedback && (
              <motion.div
                key={lastFeedback.message}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`p-3 rounded-xl mb-4 text-xs font-mono flex items-center gap-2.5 border ${
                  lastFeedback.correct
                    ? 'bg-[#39B86B]/15 border-[#39B86B]/40 text-[#B8F34A]'
                    : 'bg-red-500/15 border-red-500/40 text-red-300'
                }`}
              >
                {lastFeedback.correct ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#B8F34A]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{lastFeedback.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===================================================================
              BACKPACK CONTENT / SORTING WORKSPACE
              =================================================================== */}
          {backpack.length === 0 ? (
            /* EMPTY BACKPACK STATE */
            <div className="py-10 px-6 rounded-2xl bg-[#041A12]/80 border border-[#39B86B]/25 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#39B86B]/10 border border-[#39B86B]/30 text-[#39B86B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-bold text-[#F3F7EF]">
                  Backpack is Clean!
                </h4>
                <p className="text-xs sm:text-sm text-[#A4B6A8] max-w-sm mx-auto leading-relaxed">
                  All collected forest litter has been sorted. Head back into the clearing to collect
                  more scattered waste!
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] font-mono font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(184,243,74,0.3)] transition-all"
              >
                <span>Return to Field Patrol</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* ACTIVE ITEM SORTING VIEW */
            <div className="space-y-5">
              {/* Item Carousel / Picker */}
              <div className="p-4 rounded-2xl bg-[#041A12]/85 border border-[#39B86B]/30">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono uppercase text-[#A4B6A8]">
                    Item to Sort ({safeIndex + 1} of {backpack.length})
                  </span>
                  <div className="flex items-center gap-1.5">
                    {backpack.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItemIndex(idx)}
                        className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                          idx === safeIndex
                            ? 'bg-[#B8F34A] text-[#041A12] scale-110 shadow-[0_0_10px_rgba(184,243,74,0.4)]'
                            : 'bg-[#08291C] text-[#A4B6A8] hover:bg-[#0D3524]'
                        }`}
                        title={item.name}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Item Card */}
                {currentItem && (
                  <div className="flex items-start gap-4 pt-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#08291C] border border-[#39B86B]/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      {currentItem.symbol || '📦'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-bold text-base sm:text-lg text-[#F3F7EF] truncate">
                          {currentItem.name}
                        </h4>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#B8F34A]/10 border border-[#B8F34A]/30 text-[#B8F34A]">
                          +{currentItem.sortBonusScore} Bonus Pts
                        </span>
                      </div>
                      <p className="text-xs text-[#A4B6A8] mt-1 leading-relaxed">
                        {currentItem.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sorting Destination Buttons (3 Streams) */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A4B6A8] block mb-2.5">
                  Select Matching Stream (Press 1, 2, or 3):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recyclingBins.map((bin, idx) => {
                    const cat = wasteCategories[bin.acceptedCategory]
                    const hotkey = idx + 1

                    return (
                      <button
                        key={bin.id}
                        type="button"
                        onClick={() => handleSort(currentItem, bin.acceptedCategory)}
                        className="group relative p-4 rounded-2xl border text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between gap-3 overflow-hidden"
                        style={{
                          backgroundColor: `${bin.color}10`,
                          borderColor: `${bin.color}50`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-mono font-black uppercase px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${bin.color}25`,
                              color: bin.color,
                            }}
                          >
                            [{hotkey}] {bin.label}
                          </span>
                          <Recycle
                            className="w-4 h-4 transition-transform group-hover:rotate-45"
                            style={{ color: bin.color }}
                          />
                        </div>

                        <div>
                          <div className="font-heading font-bold text-sm text-[#F3F7EF] group-hover:text-white transition-colors">
                            {bin.name}
                          </div>
                          <div className="text-[11px] text-[#A4B6A8] mt-0.5">
                            {cat?.name || bin.acceptedCategory}
                          </div>
                        </div>

                        <div
                          className="pt-2 border-t text-[10px] font-mono"
                          style={{
                            borderColor: `${bin.color}25`,
                            color: bin.color,
                          }}
                        >
                          Deposit Here →
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Quick Return Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/30 text-xs font-mono text-[#A4B6A8] hover:text-[#F3F7EF] transition-colors"
                >
                  Return to Glade (Escape)
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
