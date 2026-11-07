import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Coins,
  Recycle,
  Sparkles,
  Flame,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react'

export default function ShiftSummaryModal({
  isOpen,
  summary,
  onPlayAgain,
  onExit,
  onOpenShop,
}) {
  if (!isOpen || !summary) return null

  const {
    score = 0,
    isNewHighScore = false,
    newHighScore = 0,
    litterCollected = 0,
    recycledByCategory = { plastic: 0, metal: 0, paper: 0 },
    sortingStreak = 0,
    coinsEarned = 0,
    newBalance = 0,
  } = summary

  const totalRecycled =
    (recycledByCategory.plastic || 0) +
    (recycledByCategory.metal || 0) +
    (recycledByCategory.paper || 0)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#041A12]/85 backdrop-blur-md">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shift-summary-title"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto p-4 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0D3524] via-[#08291C] to-[#041A12] border border-[#B8F34A]/50 shadow-[0_0_50px_rgba(184,243,74,0.3)] text-center"
        >
          {/* Top Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B8F34A]/15 border border-[#B8F34A]/40 text-xs font-mono font-bold text-[#B8F34A] uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(184,243,74,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLEANUP SHIFT COMPLETED</span>
          </div>

          <h3
            id="shift-summary-title"
            className="font-heading text-2xl sm:text-3xl font-black text-[#F3F7EF] tracking-tight mb-2"
          >
            Glade Restored!
          </h3>

          <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed mb-6">
            The 60-second shift has concluded. Outstanding cleanup agility, ranger!
          </p>

          {/* Primary Score & Coin Callout */}
          <div className="p-5 rounded-2xl bg-[#041A12]/85 border border-[#39B86B]/30 mb-6">
            <div className="text-xs font-mono uppercase tracking-wider text-[#A4B6A8] mb-1">
              Final Patrol Score
            </div>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-7 h-7 text-[#B8F34A]" />
              <span className="font-heading font-black text-4xl sm:text-5xl text-[#F3F7EF] tracking-tight">
                {score.toLocaleString()}
              </span>
              <span className="text-sm font-mono text-[#A4B6A8]">PTS</span>
            </div>

            {isNewHighScore && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FACC15]/20 border border-[#FACC15]/50 text-xs font-mono font-bold text-[#FACC15] animate-bounce">
                <span>★ NEW PERSONAL HIGH SCORE! ★</span>
              </div>
            )}

            {!isNewHighScore && newHighScore > 0 && (
              <div className="mt-2 text-xs font-mono text-[#A4B6A8]">
                Personal Record: {newHighScore.toLocaleString()} PTS
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-left">
            {/* Coins Earned */}
            <div className="p-3 rounded-xl bg-[#041A12]/80 border border-[#FACC15]/30">
              <span className="text-[10px] font-mono uppercase text-[#A4B6A8] block">
                Eco Coins
              </span>
              <div className="flex items-center gap-1 mt-1 text-[#FACC15] font-heading font-bold text-lg">
                <Coins className="w-4 h-4 fill-current" />
                <span>+{coinsEarned}</span>
              </div>
            </div>

            {/* Litter Collected */}
            <div className="p-3 rounded-xl bg-[#041A12]/80 border border-[#39B86B]/30">
              <span className="text-[10px] font-mono uppercase text-[#A4B6A8] block">
                Collected
              </span>
              <div className="mt-1 text-[#F3F7EF] font-heading font-bold text-lg">
                {litterCollected}
              </div>
            </div>

            {/* Litter Recycled */}
            <div className="p-3 rounded-xl bg-[#041A12]/80 border border-[#39B86B]/30">
              <span className="text-[10px] font-mono uppercase text-[#A4B6A8] block">
                Recycled
              </span>
              <div className="flex items-center gap-1 mt-1 text-[#39B86B] font-heading font-bold text-lg">
                <Recycle className="w-4 h-4" />
                <span>{totalRecycled}</span>
              </div>
            </div>

            {/* Best Streak */}
            <div className="p-3 rounded-xl bg-[#041A12]/80 border border-[#B8F34A]/30">
              <span className="text-[10px] font-mono uppercase text-[#A4B6A8] block">
                Best Streak
              </span>
              <div className="flex items-center gap-1 mt-1 text-[#B8F34A] font-heading font-bold text-lg">
                <Flame className="w-4 h-4 fill-current" />
                <span>{sortingStreak}</span>
              </div>
            </div>
          </div>

          {/* Recycling Stream Breakdown */}
          <div className="p-3.5 rounded-2xl bg-[#041A12]/80 border border-[#39B86B]/25 mb-6 text-xs font-mono">
            <span className="text-[11px] uppercase tracking-wider text-[#A4B6A8] block mb-2 text-left">
              Materials Diverted:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] text-center">
                <div className="font-bold text-sm">
                  {recycledByCategory.plastic || 0}
                </div>
                <div className="text-[10px] uppercase">Plastic</div>
              </div>
              <div className="p-2 rounded-lg bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15] text-center">
                <div className="font-bold text-sm">
                  {recycledByCategory.metal || 0}
                </div>
                <div className="text-[10px] uppercase">Metal</div>
              </div>
              <div className="p-2 rounded-lg bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] text-center">
                <div className="font-bold text-sm">
                  {recycledByCategory.paper || 0}
                </div>
                <div className="text-[10px] uppercase">Paper</div>
              </div>
            </div>
          </div>

          {/* Updated Total Eco Coin Balance */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#041A12]/90 border border-[#FACC15]/30 mb-6 text-xs font-mono">
            <span className="text-[#A4B6A8]">Total Balance:</span>
            <div className="flex items-center gap-1.5 text-[#FACC15] font-bold">
              <Coins className="w-4 h-4 fill-current text-[#FACC15]" />
              <span>{newBalance.toLocaleString()} Eco Coins</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onPlayAgain}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] font-mono font-bold text-sm shadow-[0_0_20px_rgba(184,243,74,0.35)] transition-all flex items-center justify-center gap-2 group"
            >
              <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90" />
              <span>Patrol Again</span>
            </button>

            {typeof onOpenShop === 'function' && (
              <button
                type="button"
                onClick={onOpenShop}
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#FACC15]/40 hover:border-[#FACC15]/80 text-[#FACC15] font-mono font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Wardrobe</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExit}
              className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/30 hover:border-[#B8F34A]/50 text-[#F3F7EF] font-mono text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Lobby</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
