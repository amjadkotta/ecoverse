import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Recycle,
  Bike,
  TreePine,
  Users,
  Sparkles,
  Clock,
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// Map category names to icons
const CATEGORY_ICONS = {
  Energy: Zap,
  Conservation: Recycle,
  Mobility: Bike,
  Nature: TreePine,
  Advocacy: Users,
}

// Category colors for timeline dots and badges
const CATEGORY_COLORS = {
  Energy: '#B8F34A',
  Conservation: '#39B86B',
  Mobility: '#4ADE80',
  Nature: '#2DD4BF',
  Advocacy: '#A3E635',
}

const DEFAULT_PAGE_SIZE = 5

export default function ActivityTimeline({
  activityLog = [],
  categories = {},
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter out any internal profile init items if present
  const genuineActivities = useMemo(() => {
    return (activityLog || []).filter((act) => act.challengeId !== 'init')
  }, [activityLog])

  // Paginated activities
  const displayedActivities = useMemo(() => {
    if (isExpanded) {
      return genuineActivities
    }
    return genuineActivities.slice(0, DEFAULT_PAGE_SIZE)
  }, [genuineActivities, isExpanded])

  // Format timestamp into human-readable local date and time
  const formatTimestamp = (isoString) => {
    if (!isoString) return ''
    try {
      const date = new Date(isoString)
      const now = new Date()

      // Check if today or yesterday
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()

      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()

      const timeStr = date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })

      if (isToday) {
        return `Today at ${timeStr}`
      }
      if (isYesterday) {
        return `Yesterday at ${timeStr}`
      }

      return `${date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })} • ${timeStr}`
    } catch {
      return isoString
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ===================================================================
          HEADER
          =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#39B86B]/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#39B86B]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#39B86B] uppercase">
              HABIT LOG & HISTORY
            </span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#F3F7EF] tracking-tight">
            Activity Timeline
          </h3>
          <p className="text-sm text-[#A4B6A8] mt-1">
            Chronological record of all completed environmental challenges.
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#08291C] border border-[#39B86B]/25 self-start sm:self-auto text-xs font-mono text-[#A4B6A8]">
          <History className="w-3.5 h-3.5 text-[#B8F34A]" />
          <span>
            <strong className="text-[#F3F7EF]">{genuineActivities.length}</strong>{' '}
            {genuineActivities.length === 1 ? 'Action' : 'Actions'} Logged
          </span>
        </div>
      </div>

      {/* ===================================================================
          TIMELINE LIST OR EMPTY STATE
          =================================================================== */}
      {genuineActivities.length === 0 ? (
        <div className="p-10 sm:p-12 text-center rounded-3xl bg-[#08291C]/50 border border-[#39B86B]/20">
          <div className="w-12 h-12 rounded-2xl bg-[#0D3524] text-[#A4B6A8] flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-[#A4B6A8]/60" />
          </div>
          <h4 className="font-heading text-lg font-bold text-[#F3F7EF]">
            No Activity Recorded Yet
          </h4>
          <p className="text-sm text-[#A4B6A8] mt-1 max-w-md mx-auto">
            Complete your first daily challenge from the list above to ignite your habit streak
            and start building your personal sustainability timeline.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#B8F34A] before:via-[#39B86B]/40 before:to-transparent">
          <AnimatePresence>
            {displayedActivities.map((activity, index) => {
              const Icon = CATEGORY_ICONS[activity.category] || Sparkles
              const categoryColor =
                CATEGORY_COLORS[activity.category] ||
                categories[activity.category]?.color ||
                '#B8F34A'

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="relative group"
                >
                  {/* Timeline Dot Node */}
                  <div
                    className="absolute -left-6 sm:-left-8 top-3.5 w-5 h-5 rounded-full bg-[#041A12] border-2 flex items-center justify-center -translate-x-1/2 transition-transform group-hover:scale-125"
                    style={{ borderColor: categoryColor }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: categoryColor }}
                    />
                  </div>

                  {/* Activity Entry Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0D3524]/80 via-[#08291C]/80 to-[#08291C]/60 border border-[#39B86B]/20 hover:border-[#B8F34A]/40 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{
                          backgroundColor: `${categoryColor}18`,
                          color: categoryColor,
                          border: `1px solid ${categoryColor}40`,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: `${categoryColor}15`,
                              borderColor: `${categoryColor}35`,
                              color: categoryColor,
                            }}
                          >
                            {activity.category}
                          </span>

                          <span className="text-xs font-mono text-[#A4B6A8]/70">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>

                        <h4 className="font-heading text-sm sm:text-base font-bold text-[#F3F7EF] truncate">
                          {activity.title}
                        </h4>
                      </div>
                    </div>

                    {/* Points Pill */}
                    <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#041A12]/80 border border-[#B8F34A]/30 text-xs font-mono font-bold text-[#B8F34A] shrink-0 self-start sm:self-center">
                      <Sparkles className="w-3 h-3" />
                      <span>+{activity.points} PTS</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Show More / Show Less Toggle Button */}
          {genuineActivities.length > DEFAULT_PAGE_SIZE && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#08291C] hover:bg-[#0D3524] text-xs font-mono text-[#B8F34A] border border-[#39B86B]/30 transition-all hover:border-[#B8F34A]/50"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Show Recent ({DEFAULT_PAGE_SIZE})</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>
                      Show All ({genuineActivities.length - DEFAULT_PAGE_SIZE} more)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
