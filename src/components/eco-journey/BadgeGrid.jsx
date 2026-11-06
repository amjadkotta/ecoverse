import { useState, useMemo } from 'react'
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
  Lock,
  Unlock,
  Check,
  Download,
} from 'lucide-react'

// Map badge icon names to React icon components
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

// Visual styling accents for badge rarity tiers
const RARITY_STYLES = {
  Legendary: {
    pill: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.25)]',
    accentText: 'text-amber-300',
  },
  Epic: {
    pill: 'bg-purple-400/15 text-purple-300 border-purple-400/40',
    glow: 'shadow-[0_0_20px_rgba(192,132,252,0.2)]',
    accentText: 'text-purple-300',
  },
  Rare: {
    pill: 'bg-sky-400/15 text-sky-300 border-sky-400/40',
    glow: 'shadow-[0_0_20px_rgba(56,189,248,0.2)]',
    accentText: 'text-sky-300',
  },
  Common: {
    pill: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
    glow: 'shadow-[0_0_15px_rgba(52,211,153,0.15)]',
    accentText: 'text-emerald-300',
  },
}

/**
 * Calculates current user milestone progress toward a specific badge.
 */
function getBadgeProgress(badge, stats = {}) {
  const {
    totalPoints = 0,
    bestStreak = 0,
    categoryCounts = {},
    totalCompletedCount = 0,
    weeklyCompletedCount = 0,
  } = stats

  switch (badge.id) {
    case 'first_spark': {
      const cur = Math.min(1, totalCompletedCount)
      return {
        label: `${cur} / 1 challenge`,
        percentage: Math.min(100, Math.round((cur / 1) * 100)),
      }
    }
    case 'habit_builder': {
      const cur = Math.min(3, bestStreak)
      return {
        label: `${cur} / 3 days streak`,
        percentage: Math.min(100, Math.round((cur / 3) * 100)),
      }
    }
    case 'week_of_action': {
      const cur = Math.min(7, bestStreak)
      return {
        label: `${cur} / 7 days streak`,
        percentage: Math.min(100, Math.round((cur / 7) * 100)),
      }
    }
    case 'energy_guardian': {
      const count = categoryCounts.Energy || 0
      const cur = Math.min(5, count)
      return {
        label: `${cur} / 5 Energy actions`,
        percentage: Math.min(100, Math.round((cur / 5) * 100)),
      }
    }
    case 'zero_waste_hero': {
      const count = categoryCounts.Conservation || 0
      const cur = Math.min(5, count)
      return {
        label: `${cur} / 5 Conservation actions`,
        percentage: Math.min(100, Math.round((cur / 5) * 100)),
      }
    }
    case 'green_commuter': {
      const count = categoryCounts.Mobility || 0
      const cur = Math.min(4, count)
      return {
        label: `${cur} / 4 Mobility actions`,
        percentage: Math.min(100, Math.round((cur / 4) * 100)),
      }
    }
    case 'flora_defender': {
      const count = categoryCounts.Nature || 0
      const cur = Math.min(3, count)
      return {
        label: `${cur} / 3 Nature actions`,
        percentage: Math.min(100, Math.round((cur / 3) * 100)),
      }
    }
    case 'voice_for_earth': {
      const count = categoryCounts.Advocacy || 0
      const cur = Math.min(3, count)
      return {
        label: `${cur} / 3 Advocacy actions`,
        percentage: Math.min(100, Math.round((cur / 3) * 100)),
      }
    }
    case 'eco_milestone_500': {
      const cur = Math.min(500, totalPoints)
      return {
        label: `${cur} / 500 PTS`,
        percentage: Math.min(100, Math.round((cur / 500) * 100)),
      }
    }
    case 'pledge_pioneer': {
      return {
        label: 'Submit Green Pledge',
        percentage: 0,
      }
    }
    case 'weekly_completionist': {
      const cur = Math.min(3, weeklyCompletedCount)
      return {
        label: `${cur} / 3 Weekly actions`,
        percentage: Math.min(100, Math.round((cur / 3) * 100)),
      }
    }
    case 'planetary_master': {
      const cur = Math.min(2000, totalPoints)
      return {
        label: `${cur} / 2,000 PTS`,
        percentage: Math.min(100, Math.round((cur / 2000) * 100)),
      }
    }
    default:
      return null
  }
}

export default function BadgeGrid({ badges = [], stats = {}, onDownloadBadge }) {
  const [filter, setFilter] = useState('all') // 'all' | 'unlocked' | 'locked'

  const unlockedCount = useMemo(
    () => badges.filter((b) => b.isUnlocked).length,
    [badges]
  )
  const lockedCount = badges.length - unlockedCount
  const unlockPercentage = badges.length > 0 ? Math.round((unlockedCount / badges.length) * 100) : 0

  const filteredBadges = useMemo(() => {
    if (filter === 'unlocked') {
      return badges.filter((b) => b.isUnlocked)
    }
    if (filter === 'locked') {
      return badges.filter((b) => !b.isUnlocked)
    }
    return badges
  }, [badges, filter])

  const formatUnlockedDate = (isoString) => {
    if (!isoString) return ''
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return ''
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ===================================================================
          HEADER & FILTER BAR
          =================================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2 border-b border-[#39B86B]/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B8F34A] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#B8F34A] uppercase">
              MILESTONE HONORS
            </span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#F3F7EF] tracking-tight">
            Achievement Badges
          </h3>
          <p className="text-sm text-[#A4B6A8] mt-1">
            Unlock 12 personal sustainability distinctions as you establish daily routines.
          </p>
        </div>

        {/* Progress & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
          {/* Progress pill */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#08291C] border border-[#39B86B]/20">
            <div className="text-xs font-mono text-[#A4B6A8]">
              <span className="text-sm font-bold text-[#B8F34A]">{unlockedCount}</span>
              <span className="text-[#A4B6A8]/60"> / {badges.length}</span>
              <span className="hidden sm:inline text-xs text-[#A4B6A8]/80 ml-1">Unlocked</span>
            </div>
            <div className="w-16 h-2 rounded-full bg-[#041A12] overflow-hidden border border-[#39B86B]/30">
              <div
                className="h-full bg-gradient-to-r from-[#39B86B] to-[#B8F34A] transition-all duration-500 rounded-full"
                style={{ width: `${unlockPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-[#B8F34A] font-bold">
              {unlockPercentage}%
            </span>
          </div>

          {/* Filter Segmented Controls */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#08291C] border border-[#39B86B]/20">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === 'all'
                  ? 'bg-[#B8F34A] text-[#041A12] font-bold shadow-[0_0_12px_rgba(184,243,74,0.3)]'
                  : 'text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524]/60'
              }`}
            >
              All ({badges.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === 'unlocked'
                  ? 'bg-[#B8F34A] text-[#041A12] font-bold shadow-[0_0_12px_rgba(184,243,74,0.3)]'
                  : 'text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524]/60'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('locked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filter === 'locked'
                  ? 'bg-[#B8F34A] text-[#041A12] font-bold shadow-[0_0_12px_rgba(184,243,74,0.3)]'
                  : 'text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524]/60'
              }`}
            >
              Locked ({lockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
          BADGE GRID
          =================================================================== */}
      {filteredBadges.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#08291C]/60 border border-[#39B86B]/20">
          <div className="w-12 h-12 rounded-2xl bg-[#0D3524] text-[#A4B6A8] flex items-center justify-center mx-auto mb-3">
            <Unlock className="w-6 h-6" />
          </div>
          <h4 className="font-heading text-lg font-bold text-[#F3F7EF]">
            {filter === 'unlocked' ? 'No Badges Unlocked Yet' : 'No Badges Found'}
          </h4>
          <p className="text-sm text-[#A4B6A8] mt-1 max-w-md mx-auto">
            {filter === 'unlocked'
              ? 'Complete your first daily challenge or maintain a streak to earn milestone achievements.'
              : 'All badges are currently unlocked! Amazing dedication.'}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredBadges.map((badge) => {
              const IconComponent = BADGE_ICONS[badge.icon] || Award
              const rarityStyle = RARITY_STYLES[badge.rarity] || RARITY_STYLES.Common
              const isUnlocked = badge.isUnlocked
              const progress = getBadgeProgress(badge, stats)

              return (
                <motion.div
                  layout
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 min-w-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-[#0D3524] to-[#08291C] border-[#B8F34A]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-[#B8F34A]/70 hover:shadow-[0_0_25px_rgba(184,243,74,0.18)]'
                      : 'bg-[#08291C]/50 border-[#39B86B]/15 hover:border-[#39B86B]/30 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Card Content Top */}
                  <div>
                    {/* Top Row: Rarity Tag + Status Pill */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${rarityStyle.pill}`}
                      >
                        {badge.rarity}
                      </span>

                      {isUnlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-[#B8F34A] bg-[#B8F34A]/10 border border-[#B8F34A]/30 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-[#A4B6A8]/70 bg-[#041A12]/80 border border-[#39B86B]/20 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3 text-[#A4B6A8]/60" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    {/* Icon + Title + Tagline */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-[#B8F34A]/25 via-[#39B86B]/20 to-[#041A12] border border-[#B8F34A]/60 text-[#B8F34A] shadow-[0_0_18px_rgba(184,243,74,0.2)]'
                            : 'bg-[#041A12]/90 border border-[#39B86B]/20 text-[#A4B6A8]/40'
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <div className="min-w-0">
                        <h4
                          className={`font-heading text-base font-bold truncate leading-tight ${
                            isUnlocked ? 'text-[#F3F7EF]' : 'text-[#F3F7EF]/75'
                          }`}
                        >
                          {badge.title}
                        </h4>
                        <p className="text-xs text-[#A4B6A8] truncate mt-0.5">
                          {badge.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#A4B6A8]/90 leading-relaxed mb-4 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>

                  {/* Card Bottom / Criteria & Dynamic Milestone Progress */}
                  <div className="pt-3 border-t border-[#39B86B]/15 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#A4B6A8]/60 uppercase tracking-wider">
                        Criteria
                      </span>
                      <span
                        className={`truncate max-w-[170px] text-right font-medium ${
                          isUnlocked ? 'text-[#B8F34A]' : 'text-[#A4B6A8]'
                        }`}
                        title={badge.requirement}
                      >
                        {badge.requirement}
                      </span>
                    </div>

                    {/* Milestone Progress Bar or Unlocked Date */}
                    {isUnlocked ? (
                      <div className="space-y-2 pt-0.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#B8F34A]/80">
                          <span className="flex items-center gap-1 text-[#39B86B]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Achieved</span>
                          </span>
                          <span>{formatUnlockedDate(badge.unlockedAt)}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => typeof onDownloadBadge === 'function' && onDownloadBadge(badge)}
                          className="w-full py-1.5 px-3 rounded-lg bg-[#041A12]/80 hover:bg-[#B8F34A]/15 border border-[#39B86B]/30 hover:border-[#B8F34A]/50 text-xs font-mono text-[#B8F34A] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          title="Download Certificate PNG"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Card</span>
                        </button>
                      </div>
                    ) : progress ? (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#A4B6A8]/70">
                          <span>Progress:</span>
                          <span className="text-[#F3F7EF]/90 font-medium">
                            {progress.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#041A12] overflow-hidden border border-[#39B86B]/20">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#39B86B] to-[#B8F34A] transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
