import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Recycle,
  Bike,
  TreePine,
  Users,
  Sun,
  Leaf,
  Footprints,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  Calendar,
  ArrowRight,
} from 'lucide-react'

// Icon mapping for challenge categories and specific actions
const CHALLENGE_ICONS = {
  Zap,
  Recycle,
  Bike,
  TreePine,
  Users,
  Sun,
  Leaf,
  Footprints,
}

export default function ChallengeCard({
  challenge,
  onComplete,
  isRecentlyCompleted = false,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const IconComponent = CHALLENGE_ICONS[challenge.icon] || Leaf
  const isCompleted = challenge.isCompleted
  const isWeekly = challenge.frequency === 'weekly'

  const handleActionClick = async () => {
    if (isCompleted || isSubmitting) return

    setIsSubmitting(true)
    setShowCelebration(true)

    try {
      if (typeof onComplete === 'function') {
        await onComplete(challenge.id)
      }
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setShowCelebration(false), 2200)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border transition-all duration-300 min-w-0 ${
        isCompleted
          ? 'bg-gradient-to-b from-[#08291C]/90 to-[#041A12]/95 border-[#39B86B]/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          : 'bg-gradient-to-b from-[#0D3524]/90 to-[#08291C]/90 backdrop-blur-md border-[#39B86B]/25 hover:border-[#B8F34A]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)]'
      }`}
    >
      {/* ===================================================================
          CELEBRATION PARTICLES / SPARKLE BURST OVERLAY
          =================================================================== */}
      <AnimatePresence>
        {(showCelebration || isRecentlyCompleted) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 rounded-2xl pointer-events-none flex items-center justify-center bg-[#0D3524]/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: [0.5, 1.2, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center gap-2 text-center p-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#B8F34A] text-[#041A12] flex items-center justify-center shadow-[0_0_30px_rgba(184,243,74,0.8)]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <span className="font-heading font-black text-xl text-[#F3F7EF]">
                ACTION RECORDED!
              </span>
              <span className="font-mono text-sm font-bold text-[#B8F34A]">
                +{challenge.points} Eco Points Earned
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          CARD HEADER: FREQUENCY + CATEGORY + REWARD PILL
          =================================================================== */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Frequency Pill */}
            <span
              className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                isWeekly
                  ? 'bg-[#B8F34A]/15 text-[#B8F34A] border-[#B8F34A]/40'
                  : 'bg-[#39B86B]/15 text-[#39B86B] border-[#39B86B]/30'
              }`}
            >
              <span className="flex items-center gap-1">
                {isWeekly ? (
                  <Calendar className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                {challenge.frequency}
              </span>
            </span>

            {/* Category Tag */}
            <span className="text-[10px] font-mono text-[#A4B6A8] bg-[#041A12]/80 px-2 py-0.5 rounded-full border border-[#39B86B]/20">
              {challenge.category}
            </span>
          </div>

          {/* Reward Points Pill */}
          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border transition-colors ${
              isCompleted
                ? 'bg-[#041A12]/80 text-[#A4B6A8] border-[#39B86B]/20'
                : 'bg-[#B8F34A]/10 text-[#B8F34A] border-[#B8F34A]/40 shadow-[0_0_12px_rgba(184,243,74,0.15)]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>+{challenge.points} PTS</span>
          </div>
        </div>

        {/* Title and Icon Row */}
        <div className="flex items-start gap-3.5 mb-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
              isCompleted
                ? 'bg-[#041A12]/90 border border-[#39B86B]/25 text-[#39B86B]'
                : 'bg-gradient-to-br from-[#B8F34A]/20 via-[#39B86B]/20 to-[#041A12] border border-[#B8F34A]/50 text-[#B8F34A] shadow-[0_0_15px_rgba(184,243,74,0.15)]'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h4
              className={`font-heading text-base sm:text-lg font-bold leading-snug ${
                isCompleted ? 'text-[#F3F7EF]/80' : 'text-[#F3F7EF]'
              }`}
            >
              {challenge.title}
            </h4>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed mb-4">
          {challenge.description}
        </p>

        {/* Estimated Metric (Honest Mindfulness Disclosure) */}
        {challenge.impactMetric && (
          <div className="mb-5 p-2.5 rounded-xl bg-[#041A12]/70 border border-[#39B86B]/20 flex items-start gap-2 text-[11px] text-[#A4B6A8]">
            <Leaf className="w-3.5 h-3.5 text-[#39B86B] shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="text-[#F3F7EF]/90 font-medium">
                {challenge.impactMetric}
              </span>
              <span className="block text-[10px] text-[#A4B6A8]/60 mt-0.5 font-mono">
                *Estimated habit benchmark
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================
          CARD FOOTER: ACTION BUTTON OR COOLDOWN STATUS
          =================================================================== */}
      <div className="pt-3 border-t border-[#39B86B]/20">
        {isCompleted ? (
          /* Cooldown Lock State */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#39B86B] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#39B86B]" />
                Completed
              </span>

              {challenge.timeRemaining ? (
                <span className="flex items-center gap-1 text-[#A4B6A8] text-[11px]">
                  <Clock className="w-3 h-3 text-[#A4B6A8]/70" />
                  <span>Resets in {challenge.timeRemaining.formatted}</span>
                </span>
              ) : (
                <span className="text-[11px] text-[#A4B6A8]/70">
                  Resets next cycle
                </span>
              )}
            </div>

            <button
              type="button"
              disabled
              className="w-full py-2.5 px-4 rounded-xl bg-[#041A12]/80 border border-[#39B86B]/20 text-xs font-mono text-[#A4B6A8]/60 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {isWeekly ? 'Completed This Week' : 'Completed Today'}
              </span>
            </button>
          </div>
        ) : (
          /* Available State */
          <button
            type="button"
            onClick={handleActionClick}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(184,243,74,0.25)] hover:shadow-[0_0_25px_rgba(184,243,74,0.45)] transition-all duration-300 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#041A12] border-t-transparent rounded-full animate-spin" />
                <span>Recording...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Complete & Earn +{challenge.points}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}
