import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Recycle,
  Bike,
  TreePine,
  Users,
  PieChart,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Flame,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

// Map category icon names to Lucide components
const CATEGORY_ICONS = {
  Zap,
  Recycle,
  Bike,
  TreePine,
  Users,
}

export default function AnalyticsSummary({
  categoryTotals = {},
  totalPoints = 0,
  categories = {},
  activityLog = [],
  streak = { current: 0, best: 0 },
}) {
  const categoryList = useMemo(() => {
    return Object.values(categories)
  }, [categories])

  // Find the leading category with the highest points
  const leadingCategory = useMemo(() => {
    if (totalPoints === 0) return null
    let max = -1
    let lead = null
    categoryList.forEach((cat) => {
      const pts = categoryTotals[cat.id] || 0
      if (pts > max && pts > 0) {
        max = pts
        lead = { ...cat, points: pts }
      }
    })
    return lead
  }, [categoryList, categoryTotals, totalPoints])

  // Calculate current calendar week points and actions
  const weeklyStats = useMemo(() => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - diffToMonday,
      0,
      0,
      0,
      0
    )
    const startOfWeekMs = startOfWeek.getTime()

    let weeklyPoints = 0
    let weeklyCompletedCount = 0

    ;(activityLog || []).forEach((act) => {
      if (act.challengeId !== 'init') {
        const actTime = new Date(act.timestamp).getTime()
        if (actTime >= startOfWeekMs) {
          weeklyPoints += act.points || 0
          weeklyCompletedCount += 1
        }
      }
    })

    return {
      weeklyPoints,
      weeklyCompletedCount,
    }
  }, [activityLog])

  // Count active pillars with points > 0
  const activePillarsCount = useMemo(() => {
    return Object.values(categoryTotals).filter((p) => p > 0).length
  }, [categoryTotals])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ===================================================================
          HEADER
          =================================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#39B86B]/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#39B86B]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#39B86B] uppercase">
              IMPACT DISTRIBUTION & ANALYTICS
            </span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#F3F7EF] tracking-tight">
            Sustainability Analytics
          </h3>
          <p className="text-sm text-[#A4B6A8] mt-1">
            Track weekly habit momentum and point distribution across all five ecological pillars.
          </p>
        </div>

        {/* Lead Category Summary Pill */}
        {leadingCategory ? (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#08291C] border border-[#39B86B]/30 self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-[#B8F34A] shrink-0" />
            <div className="text-xs">
              <span className="text-[#A4B6A8]">Top Focus: </span>
              <span className="font-bold text-[#F3F7EF]">{leadingCategory.name}</span>
              <span className="font-mono text-[#B8F34A] ml-1.5">
                ({leadingCategory.points} pts)
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-[#A4B6A8]/70 px-3 py-1.5 rounded-lg bg-[#08291C]/50 border border-[#39B86B]/15 self-start md:self-auto">
            <PieChart className="w-3.5 h-3.5" />
            <span>Ready for your first action</span>
          </div>
        )}
      </div>

      {/* ===================================================================
          WEEKLY & MOMENTUM KPI SUMMARY TILES
          =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Tile 1: Weekly Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-5 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
              This Week
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#B8F34A]/15 text-[#B8F34A] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[#B8F34A]">
                {weeklyStats.weeklyPoints.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-[#A4B6A8]">PTS</span>
            </div>
            <p className="text-xs text-[#A4B6A8]">
              Points earned this calendar week
            </p>
          </div>
        </motion.div>

        {/* Tile 2: Weekly Completed Challenge Count */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="p-5 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
              Weekly Actions
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#39B86B]/20 text-[#39B86B] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[#F3F7EF]">
                {weeklyStats.weeklyCompletedCount}
              </span>
              <span className="text-xs font-mono text-[#A4B6A8]">LOGGED</span>
            </div>
            <p className="text-xs text-[#A4B6A8]">
              Challenges logged since Monday
            </p>
          </div>
        </motion.div>

        {/* Tile 3: Personal Best Streak */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="p-5 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
              Best Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FACC15]/15 text-[#FACC15] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[#F3F7EF]">
                {streak.best || 0}
              </span>
              <span className="text-xs font-mono text-[#A4B6A8]">DAYS</span>
            </div>
            <p className="text-xs text-[#A4B6A8]">
              Current active: <span className="text-[#B8F34A] font-semibold">{streak.current || 0} days</span>
            </p>
          </div>
        </motion.div>

        {/* Tile 4: Active Category Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="p-5 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
              Pillar Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/20 text-[#2DD4BF] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[#F3F7EF]">
                {activePillarsCount}
              </span>
              <span className="text-xs font-mono text-[#A4B6A8]">/ 5 ACTIVE</span>
            </div>
            <p className="text-xs text-[#A4B6A8]">
              {activePillarsCount === 5 ? 'Balanced across all pillars' : 'Diversify habits across pillars'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ===================================================================
          FIVE CATEGORY IMPACT CARDS
          =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        {categoryList.map((cat, idx) => {
          const Icon = CATEGORY_ICONS[cat.icon] || Zap
          const points = categoryTotals[cat.id] || 0
          const percentage = totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-[#0D3524] to-[#08291C] border border-[#39B86B]/20 hover:border-[#B8F34A]/50 transition-all duration-300 min-w-0"
            >
              <div>
                {/* Category Header Row */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      border: `1px solid ${cat.color}40`,
                      color: cat.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-xs font-mono font-bold text-[#A4B6A8] group-hover:text-[#F3F7EF] transition-colors">
                    {percentage}%
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className="font-heading text-lg font-bold text-[#F3F7EF] mb-1">
                  {cat.name}
                </h4>
                <p className="text-xs text-[#A4B6A8] leading-relaxed mb-4 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              {/* Progress and Points Footer */}
              <div className="pt-3 border-t border-[#39B86B]/15">
                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-[#041A12] overflow-hidden mb-2.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>

                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className="text-[#A4B6A8]/70 uppercase tracking-wider text-[11px]">
                    Points Earned
                  </span>
                  <span className="text-sm font-bold text-[#F3F7EF]">
                    {points.toLocaleString()}
                    <span className="text-[10px] text-[#A4B6A8] ml-1">PTS</span>
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ===================================================================
          ZERO STATE OR HABIT DIVERSIFICATION TIP
          =================================================================== */}
      {totalPoints === 0 ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/20 flex items-start sm:items-center gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#0D3524] text-[#B8F34A] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed">
            <span className="font-bold text-[#F3F7EF]">Ecosystem Balance: </span>
            As you complete challenges across Energy, Conservation, Mobility, Nature, and Advocacy, your category distribution will dynamically reflect your lifestyle footprint.
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#A4B6A8]">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-[#B8F34A] shrink-0" />
            <span>
              Tip: Aim for a balanced distribution across all 5 categories to build comprehensive sustainability habits.
            </span>
          </div>
          <span className="font-mono text-[#B8F34A] shrink-0 text-xs">
            {activePillarsCount} of 5 active pillars
          </span>
        </div>
      )}
    </div>
  )
}
