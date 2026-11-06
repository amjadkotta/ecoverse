import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Flame,
  Calendar,
  Zap,
  Recycle,
  Bike,
  TreePine,
  Users,
  Award,
  Leaf,
  CheckCircle2,
  ShieldCheck,
  X,
  Check,
  Download,
} from 'lucide-react'

// Map badge icon names to components
const BADGE_ICONS = {
  Sparkles,
  Flame,
  Calendar,
  Zap,
  Recycle,
  Bike,
  TreePine,
  Users,
  Award,
  Leaf,
  CheckCircle2,
  ShieldCheck,
}

// Rarity styles
const RARITY_STYLES = {
  Legendary: {
    pill: 'bg-amber-400/20 text-amber-300 border-amber-400/50',
    glow: 'shadow-[0_0_35px_rgba(251,191,36,0.4)]',
    ring: 'border-amber-400/60',
  },
  Epic: {
    pill: 'bg-purple-400/20 text-purple-300 border-purple-400/50',
    glow: 'shadow-[0_0_30px_rgba(192,132,252,0.35)]',
    ring: 'border-purple-400/60',
  },
  Rare: {
    pill: 'bg-sky-400/20 text-sky-300 border-sky-400/50',
    glow: 'shadow-[0_0_25px_rgba(56,189,248,0.3)]',
    ring: 'border-sky-400/60',
  },
  Common: {
    pill: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.25)]',
    ring: 'border-emerald-400/50',
  },
}

export default function BadgeUnlockModal({ badge, onClose, onDownload }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && typeof onClose === 'function') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!badge) return null

  const IconComponent = BADGE_ICONS[badge.icon] || Award
  const rarityStyle = RARITY_STYLES[badge.rarity] || RARITY_STYLES.Common

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#041A12]/85 backdrop-blur-md">
        {/* Backdrop click handler */}
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
          aria-labelledby="badge-unlock-title"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0D3524] via-[#08291C] to-[#041A12] border border-[#B8F34A]/50 ${rarityStyle.glow} text-center overflow-hidden`}
        >
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#B8F34A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#39B86B]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Eyebrow Notification */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8F34A]/15 border border-[#B8F34A]/40 text-xs font-mono font-bold text-[#B8F34A] uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACHIEVEMENT UNLOCKED</span>
          </div>

          {/* Celebratory Icon Circle */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[#B8F34A]/30 via-[#39B86B]/25 to-[#041A12] border-2 ${rarityStyle.ring} text-[#B8F34A] flex items-center justify-center mb-5 shadow-[0_0_35px_rgba(184,243,74,0.35)]`}
          >
            <IconComponent className="w-12 h-12" />
          </motion.div>

          {/* Rarity Pill */}
          <div className="mb-2">
            <span
              className={`text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${rarityStyle.pill}`}
            >
              {badge.rarity} Honor
            </span>
          </div>

          {/* Badge Title & Tagline */}
          <h3 id="badge-unlock-title" className="font-heading text-2xl sm:text-3xl font-black text-[#F3F7EF] tracking-tight mb-1">
            {badge.title}
          </h3>
          <p className="text-xs sm:text-sm font-mono text-[#B8F34A] mb-3">
            {badge.tagline}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed mb-6">
            {badge.description}
          </p>

          {/* Criteria Achieved Tag */}
          <div className="p-3 rounded-xl bg-[#041A12]/80 border border-[#39B86B]/25 mb-6 text-xs font-mono text-[#A4B6A8] flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-[#B8F34A] stroke-[2.5]" />
            <span>Criteria: {badge.requirement}</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {typeof onDownload === 'function' && (
              <button
                type="button"
                onClick={() => {
                  onDownload(badge)
                  onClose()
                }}
                className="w-full py-3 px-4 rounded-xl border border-[#39B86B]/40 hover:border-[#B8F34A]/60 bg-[#08291C] hover:bg-[#0D3524] text-[#B8F34A] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Card</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] font-mono font-bold text-xs shadow-[0_0_20px_rgba(184,243,74,0.35)] hover:shadow-[0_0_25px_rgba(184,243,74,0.5)] transition-all active:scale-[0.98]"
            >
              Add to Collection
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
