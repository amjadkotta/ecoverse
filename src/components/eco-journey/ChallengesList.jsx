import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame,
  Award,
  CheckCircle2,
  Filter,
  X,
  RotateCcw,
  Zap,
} from 'lucide-react'
import ChallengeCard from './ChallengeCard'

// Primary filter configurations matching requirements
const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'Energy', label: 'Energy' },
  { id: 'Conservation', label: 'Conservation' },
  { id: 'Mobility', label: 'Mobility' },
  { id: 'Nature', label: 'Nature' },
  { id: 'Advocacy', label: 'Advocacy' },
]

export default function ChallengesList({
  challenges = [],
  onCompleteChallenge,
}) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'available' | 'completed'
  const [lastCompletion, setLastCompletion] = useState(null)

  // Status counts
  const availableCount = useMemo(
    () => challenges.filter((c) => !c.isCompleted).length,
    [challenges]
  )
  const completedCount = challenges.length - availableCount

  // Filter count helper
  const getFilterCount = (filterId) => {
    if (filterId === 'all') return challenges.length
    if (filterId === 'daily') return challenges.filter((c) => c.frequency === 'daily').length
    if (filterId === 'weekly') return challenges.filter((c) => c.frequency === 'weekly').length
    return challenges.filter((c) => c.category === filterId).length
  }

  // Filtered challenges list
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Primary category/frequency filter
      let matchesPrimary = true
      if (activeFilter === 'daily') {
        matchesPrimary = c.frequency === 'daily'
      } else if (activeFilter === 'weekly') {
        matchesPrimary = c.frequency === 'weekly'
      } else if (activeFilter !== 'all') {
        matchesPrimary = c.category === activeFilter
      }

      // Secondary status filter
      let matchesStatus = true
      if (statusFilter === 'available') {
        matchesStatus = !c.isCompleted
      } else if (statusFilter === 'completed') {
        matchesStatus = c.isCompleted
      }

      return matchesPrimary && matchesStatus
    })
  }, [challenges, activeFilter, statusFilter])

  // Handle completion invocation with feedback capture
  const handleComplete = async (challengeId) => {
    if (typeof onCompleteChallenge !== 'function') return

    const result = onCompleteChallenge(challengeId)
    if (result && result.success) {
      setLastCompletion({
        challengeId,
        pointsAwarded: result.pointsAwarded,
        newStreak: result.newStreak,
        newlyUnlockedBadges: result.newlyUnlockedBadges || [],
        timestamp: Date.now(),
      })

      // Auto dismiss feedback banner after 6 seconds
      setTimeout(() => {
        setLastCompletion((prev) => {
          if (prev && prev.challengeId === challengeId) {
            return null
          }
          return prev
        })
      }, 6000)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ===================================================================
          SECTION HEADER
          =================================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2 border-b border-[#39B86B]/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#B8F34A] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#B8F34A] uppercase">
              DAILY & WEEKLY HABITS
            </span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#F3F7EF] tracking-tight">
            Sustainability Challenges
          </h3>
          <p className="text-sm text-[#A4B6A8] mt-1">
            Log your real-world sustainable actions. Daily reset at local midnight; weekly reset Sunday midnight.
          </p>
        </div>

        {/* Status Counter Pills */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              statusFilter === 'all'
                ? 'bg-[#08291C] border-[#B8F34A]/50 text-[#F3F7EF] shadow-sm'
                : 'bg-[#041A12]/80 border-[#39B86B]/20 text-[#A4B6A8] hover:text-[#F3F7EF]'
            }`}
          >
            All ({challenges.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              statusFilter === 'available'
                ? 'bg-[#B8F34A]/15 border-[#B8F34A]/60 text-[#B8F34A] shadow-[0_0_12px_rgba(184,243,74,0.2)]'
                : 'bg-[#041A12]/80 border-[#39B86B]/20 text-[#A4B6A8] hover:text-[#F3F7EF]'
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              statusFilter === 'completed'
                ? 'bg-[#39B86B]/20 border-[#39B86B]/60 text-[#39B86B] shadow-[0_0_12px_rgba(57,184,107,0.2)]'
                : 'bg-[#041A12]/80 border-[#39B86B]/20 text-[#A4B6A8] hover:text-[#F3F7EF]'
            }`}
          >
            In Cooldown ({completedCount})
          </button>
        </div>
      </div>

      {/* ===================================================================
          CATEGORY & FREQUENCY FILTER CHIPS
          =================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono text-[#A4B6A8]/70 flex items-center gap-1.5 pl-1 pr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.id
          const count = getFilterCount(opt.id)

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveFilter(opt.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono shrink-0 transition-all border ${
                isActive
                  ? 'bg-[#B8F34A] text-[#041A12] font-bold border-[#B8F34A] shadow-[0_0_15px_rgba(184,243,74,0.35)]'
                  : 'bg-[#08291C]/70 text-[#A4B6A8] border-[#39B86B]/20 hover:text-[#F3F7EF] hover:border-[#39B86B]/40 hover:bg-[#0D3524]/60'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`ml-1.5 text-[11px] ${isActive ? 'text-[#041A12]/80 font-bold' : 'text-[#A4B6A8]/60'}`}>
                ({count})
              </span>
            </button>
          )
        })}
      </div>

      {/* ===================================================================
          COMPLETION SUCCESS NOTIFICATION BANNER
          =================================================================== */}
      <AnimatePresence>
        {lastCompletion && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0D3524] via-[#08291C] to-[#0D3524] border border-[#B8F34A]/50 shadow-[0_0_30px_rgba(184,243,74,0.2)] flex items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B8F34A] text-[#041A12] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(184,243,74,0.5)]">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading font-bold text-base text-[#F3F7EF]">
                    Challenge Completed!
                  </span>
                  <span className="text-xs font-mono font-bold text-[#041A12] bg-[#B8F34A] px-2.5 py-0.5 rounded-full">
                    +{lastCompletion.pointsAwarded} Eco Points
                  </span>
                  {lastCompletion.newStreak > 0 && (
                    <span className="text-xs font-mono text-[#FACC15] flex items-center gap-1 bg-[#041A12]/80 border border-[#FACC15]/30 px-2 py-0.5 rounded-full">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{lastCompletion.newStreak}d streak</span>
                    </span>
                  )}
                </div>

                {lastCompletion.newlyUnlockedBadges.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-[#F3F7EF]">
                    <Award className="w-4 h-4 text-[#FACC15] shrink-0" />
                    <span>
                      <strong className="text-[#B8F34A]">New Badge Unlocked: </strong>
                      {lastCompletion.newlyUnlockedBadges.map((b) => b.title).join(', ')}!
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLastCompletion(null)}
              className="text-[#A4B6A8] hover:text-[#F3F7EF] p-1 rounded-lg hover:bg-[#0D3524] transition-colors shrink-0"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          CHALLENGES GRID OR EMPTY STATE
          =================================================================== */}
      {filteredChallenges.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#08291C]/60 border border-[#39B86B]/20">
          <div className="w-12 h-12 rounded-2xl bg-[#0D3524] text-[#A4B6A8] flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-[#A4B6A8]/60" />
          </div>
          <h4 className="font-heading text-lg font-bold text-[#F3F7EF]">
            No Challenges Found
          </h4>
          <p className="text-sm text-[#A4B6A8] mt-1 max-w-md mx-auto mb-4">
            {statusFilter === 'available'
              ? 'All challenges in this filter are currently completed and in cooldown! Great work.'
              : 'No challenges match your selected category and status filters.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all')
              setStatusFilter('all')
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D3524] hover:bg-[#0D3524]/80 text-[#B8F34A] border border-[#39B86B]/30 text-xs font-mono transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onComplete={handleComplete}
                isRecentlyCompleted={
                  lastCompletion && lastCompletion.challengeId === challenge.id
                }
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
