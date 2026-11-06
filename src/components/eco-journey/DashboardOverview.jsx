import { motion } from 'framer-motion'
import {
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Sprout,
  TreePine,
  Zap,
  Globe2,
  ShieldCheck,
  Info,
  TrendingUp,
  Download,
} from 'lucide-react'

// Map level icon names to React components
const LEVEL_ICONS = {
  Sprout,
  TreePine,
  Zap,
  Globe2,
  ShieldCheck,
}

export default function DashboardOverview({
  totalPoints = 0,
  level = {},
  streak = { current: 0, best: 0 },
  totalCompleted = 0,
  disclaimer = '',
  onDownloadLevel,
  onDownloadSummary,
}) {
  const LevelIcon = LEVEL_ICONS[level.icon] || Sprout
  const isFirstTimeUser = totalPoints === 0 && totalCompleted === 0

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ===================================================================
          FIRST-TIME WELCOME OR ACTIVE MOMENTUM BANNER
          =================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isFirstTimeUser
            ? 'bg-gradient-to-r from-[#0D3524]/90 via-[#08291C]/90 to-[#0D3524]/90 border-[#B8F34A]/40 shadow-[0_0_30px_rgba(184,243,74,0.15)]'
            : 'bg-gradient-to-r from-[#08291C]/95 via-[#0D3524]/90 to-[#08291C]/95 border-[#39B86B]/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#B8F34A] to-[#39B86B] text-[#041A12] flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(184,243,74,0.45)]">
              {isFirstTimeUser ? (
                <Sparkles className="w-8 h-8" />
              ) : (
                <LevelIcon className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold tracking-widest text-[#B8F34A] uppercase px-3 py-0.5 rounded-full bg-[#041A12]/80 border border-[#B8F34A]/30">
                  {isFirstTimeUser ? 'WELCOME PIONEER' : `LEVEL ${level.level || 1} • ${level.title || 'Sprout Pioneer'}`}
                </span>
                {streak.current > 0 && (
                  <span className="text-xs font-mono text-[#FACC15] flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#041A12]/80 border border-[#FACC15]/30">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{streak.current}d streak</span>
                  </span>
                )}
              </div>

              <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-[#F3F7EF] leading-tight">
                {isFirstTimeUser
                  ? 'Begin Your Personal Habit Voyage'
                  : 'Sustained Ecological Momentum'}
              </h3>

              <p className="text-sm sm:text-base text-[#A4B6A8] mt-1 max-w-2xl leading-relaxed">
                {isFirstTimeUser
                  ? 'Welcome to Eco Journey! Complete your first daily challenge to earn Eco Points, ignite your streak, and climb the five progression levels.'
                  : `You've recorded ${totalCompleted} mindful environmental action${totalCompleted === 1 ? '' : 's'}. Every daily habit builds shared planetary resilience.`}
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#39B86B]/20 shrink-0">
            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs font-mono text-[#A4B6A8] uppercase tracking-wider">
                Total Points
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-3xl sm:text-4xl text-[#B8F34A]">
                  {totalPoints.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-[#A4B6A8]">PTS</span>
              </div>
            </div>

            {/* Quick Action Download Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {typeof onDownloadLevel === 'function' && (
                <button
                  type="button"
                  onClick={onDownloadLevel}
                  className="px-3 py-1.5 rounded-lg bg-[#041A12]/80 hover:bg-[#B8F34A]/15 border border-[#39B86B]/30 hover:border-[#B8F34A]/50 text-xs font-mono text-[#F3F7EF] flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Download Current Level Certificate PNG"
                >
                  <Award className="w-3.5 h-3.5 text-[#B8F34A]" />
                  <span>Level Card</span>
                </button>
              )}
              {typeof onDownloadSummary === 'function' && (
                <button
                  type="button"
                  onClick={onDownloadSummary}
                  className="px-3 py-1.5 rounded-lg bg-[#041A12]/80 hover:bg-[#B8F34A]/15 border border-[#39B86B]/30 hover:border-[#B8F34A]/50 text-xs font-mono text-[#B8F34A] flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Download Eco Journey Summary Passport PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Summary Passport</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===================================================================
          FOUR TOP METRIC TILES
          =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Tile 1: Current Rank & Level */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-5 sm:p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
              Current Rank
            </span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${level.badgeColor || '#39B86B'}22`, color: level.badgeColor || '#39B86B' }}
            >
              <LevelIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#B8F34A]">
                LEVEL {level.level || 1}
              </span>
            </div>
            <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#F3F7EF] truncate">
              {level.title || 'Sprout Pioneer'}
            </h4>
            <p className="text-xs text-[#A4B6A8] line-clamp-1">
              {level.tagline || 'Starting your green journey.'}
            </p>
          </div>
        </motion.div>

        {/* Tile 2: Total Eco Points */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="p-5 sm:p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
              Eco Points
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#B8F34A]/15 text-[#B8F34A] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#F3F7EF]">
              {totalPoints.toLocaleString()}
            </span>
            <p className="text-xs text-[#A4B6A8] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>Earned from personal actions</span>
            </p>
          </div>
        </motion.div>

        {/* Tile 3: Habit Streak */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-5 sm:p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
              Active Streak
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FACC15]/15 text-[#FACC15] flex items-center justify-center">
              <Flame className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-3xl sm:text-4xl text-[#F3F7EF]">
                {streak.current || 0}
              </span>
              <span className="text-xs font-mono text-[#A4B6A8]">DAYS</span>
            </div>
            <p className="text-xs text-[#A4B6A8]">
              Personal Best: <span className="text-[#F3F7EF] font-semibold">{streak.best || 0} days</span>
            </p>
          </div>
        </motion.div>

        {/* Tile 4: Total Completed Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="p-5 sm:p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
              Actions Logged
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#39B86B]/20 text-[#39B86B] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#F3F7EF]">
              {totalCompleted}
            </span>
            <p className="text-xs text-[#A4B6A8]">
              Daily & weekly challenges completed
            </p>
          </div>
        </motion.div>
      </div>

      {/* ===================================================================
          DYNAMIC LEVEL PROGRESSION BAR
          =================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 sm:p-8 rounded-3xl bg-[#08291C]/60 border border-[#39B86B]/25"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#B8F34A] block mb-1">
              Tier Progression
            </span>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-[#F3F7EF]">
              {level.isMaxLevel ? (
                <span>Highest Rank Achieved: Planetary Restorer</span>
              ) : (
                <span>
                  {level.title} →{' '}
                  <span className="text-[#B8F34A]">{level.nextLevelTitle}</span>
                </span>
              )}
            </h4>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-[#A4B6A8]">
              {level.isMaxLevel ? (
                'MAX LEVEL'
              ) : (
                <>
                  <span className="text-[#F3F7EF] font-bold">
                    {level.pointsNeededForNext.toLocaleString()} PTS
                  </span>{' '}
                  needed for next rank
                </>
              )}
            </span>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-3.5 rounded-full bg-[#041A12] border border-[#39B86B]/30 overflow-hidden relative p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level.progressPercent || 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#39B86B] via-[#B8F34A] to-[#B8F34A] shadow-[0_0_15px_rgba(184,243,74,0.5)]"
          />
        </div>

        {/* Level Footnote */}
        <div className="flex items-center justify-between text-xs text-[#A4B6A8] mt-3 font-mono">
          <span>{level.minPoints.toLocaleString()} PTS</span>
          <span>{level.progressPercent}% of current tier</span>
          <span>
            {level.maxPoints === Infinity ? '2,000+ PTS' : `${level.maxPoints.toLocaleString()} PTS`}
          </span>
        </div>
      </motion.div>

      {/* ===================================================================
          SELF-REPORTED ACTIVITY DISCLAIMER
          =================================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#041A12]/80 border border-[#39B86B]/25 flex items-start gap-3.5 text-xs text-[#A4B6A8] leading-relaxed">
        <Info className="w-4 h-4 text-[#B8F34A] shrink-0 mt-0.5" />
        <p>{disclaimer}</p>
      </div>
    </div>
  )
}
