import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import useEcoJourney from '../../hooks/useEcoJourney'
import DashboardOverview from './DashboardOverview'
import ChallengesList from './ChallengesList'
import AnalyticsSummary from './AnalyticsSummary'
import BadgeGrid from './BadgeGrid'
import ActivityTimeline from './ActivityTimeline'
import BadgeUnlockModal from './BadgeUnlockModal'
import AchievementCardModal from './AchievementCardModal'

export default function EcoJourney() {
  const {
    totalPoints,
    level,
    streak,
    categoryTotals,
    badges,
    activityLog,
    challenges,
    completeChallenge,
    categories,
    disclaimer,
    resetJourney,
  } = useEcoJourney()

  // Track badge unlocked celebration modal
  const [unlockedBadgeForModal, setUnlockedBadgeForModal] = useState(null)

  // Track achievement card download modal preview
  const [cardModalConfig, setCardModalConfig] = useState({
    isOpen: false,
    cardType: 'badge',
    cardData: {},
  })

  // Calculate total completed actions from activity log
  const totalCompleted = useMemo(() => {
    return (activityLog || []).filter((act) => act.challengeId !== 'init').length
  }, [activityLog])

  // Wrap completeChallenge to intercept newly unlocked badges for celebratory modal
  const handleChallengeComplete = (challengeId) => {
    const res = completeChallenge(challengeId)
    if (res && res.success && res.newlyUnlockedBadges && res.newlyUnlockedBadges.length > 0) {
      setUnlockedBadgeForModal(res.newlyUnlockedBadges[0])
    }
    return res
  }

  // Open modal for downloading an individual badge card
  const handleDownloadBadge = (badge) => {
    setCardModalConfig({
      isOpen: true,
      cardType: 'badge',
      cardData: {
        badge,
        userLevel: level,
        totalPoints,
        unlockDate: badge.unlockedAt,
      },
    })
  }

  // Open modal for downloading current level advancement card
  const handleDownloadLevel = () => {
    setCardModalConfig({
      isOpen: true,
      cardType: 'level',
      cardData: {
        level,
        totalPoints,
        streak,
        date: new Date().toISOString(),
      },
    })
  }

  // Open modal for downloading the overall Eco Journey summary passport
  const handleDownloadSummary = () => {
    setCardModalConfig({
      isOpen: true,
      cardType: 'summary',
      cardData: {
        level,
        totalPoints,
        streak,
        totalCompleted,
        unlockedBadgesCount: badges.filter((b) => b.isUnlocked).length,
        categoryTotals,
        date: new Date().toISOString(),
      },
    })
  }

  // Calculate stats for milestone badge progress bars
  const badgeStats = useMemo(() => {
    const categoryCounts = {}
    let totalCompletedCount = 0
    let weeklyCompletedCount = 0

    ;(activityLog || []).forEach((act) => {
      if (act.challengeId !== 'init') {
        totalCompletedCount += 1
        categoryCounts[act.category] = (categoryCounts[act.category] || 0) + 1
        const orig = (challenges || []).find((c) => c.id === act.challengeId)
        if (orig && orig.frequency === 'weekly') {
          weeklyCompletedCount += 1
        }
      }
    })

    return {
      totalPoints,
      bestStreak: streak?.best || 0,
      currentStreak: streak?.current || 0,
      categoryCounts,
      totalCompletedCount,
      weeklyCompletedCount,
    }
  }, [activityLog, totalPoints, streak, challenges])

  return (
    <section
      id="eco-journey"
      className="scroll-mt-20 py-28 sm:py-36 relative bg-[#041A12] border-t border-[#39B86B]/15 overflow-hidden text-[#F3F7EF]"
    >
      {/* Background Ambient Lighting Blobs */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-48 w-[600px] h-[600px] bg-[#39B86B]/10 rounded-full blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -right-48 w-[650px] h-[650px] bg-[#B8F34A]/8 rounded-full blur-[190px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#08291C]/40 rounded-full blur-[220px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-24">
        {/* ===================================================================
            SECTION HERO / HEADER
            =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl text-left"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
            <span>ECOVERSE ECO JOURNEY</span>
          </div>

          {/* Main Heading */}
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#F3F7EF] leading-[1.08] mb-6">
            YOUR ECO JOURNEY.{' '}
            <span className="text-gradient-accent block sm:inline">
              MEASURABLE HABIT PROGRESS.
            </span>
          </h2>

          {/* Narrative Description */}
          <p className="text-base sm:text-xl text-[#F3F7EF]/90 font-normal leading-relaxed max-w-3xl">
            Transform everyday choices into lasting ecological habits. Complete daily challenges,
            earn Eco Points, unlock 12 milestone honors, and level up your planetary stewardship
            across 5 environmental pillars.
          </p>
        </motion.div>

        {/* ===================================================================
            1. DASHBOARD OVERVIEW (Points, Level XP, Streaks, Metric Tiles)
            =================================================================== */}
        <DashboardOverview
          totalPoints={totalPoints}
          level={level}
          streak={streak}
          totalCompleted={totalCompleted}
          disclaimer={disclaimer}
          onDownloadLevel={handleDownloadLevel}
          onDownloadSummary={handleDownloadSummary}
        />

        {/* ===================================================================
            2. INTERACTIVE SUSTAINABILITY CHALLENGES (Daily & Weekly Habits)
            =================================================================== */}
        <ChallengesList
          challenges={challenges}
          onCompleteChallenge={handleChallengeComplete}
        />

        {/* ===================================================================
            3. CATEGORY ANALYTICS & MOMENTUM (Weekly Points, Streak & Pillars)
            =================================================================== */}
        <AnalyticsSummary
          categoryTotals={categoryTotals}
          totalPoints={totalPoints}
          categories={categories}
          activityLog={activityLog}
          streak={streak}
        />

        {/* ===================================================================
            4. ACHIEVEMENT BADGES (12 Honors, Unlocked / Locked States, Rarity)
            =================================================================== */}
        <BadgeGrid
          badges={badges}
          stats={badgeStats}
          onDownloadBadge={handleDownloadBadge}
        />

        {/* ===================================================================
            5. ACTIVITY TIMELINE (Chronological Habit History)
            =================================================================== */}
        <ActivityTimeline
          activityLog={activityLog}
          categories={categories}
        />

        {/* ===================================================================
            FOOTER: TRANSPARENCY, PRIVACY & RESET CONTROLS
            =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pt-8 border-t border-[#39B86B]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#A4B6A8]"
        >
          <div className="flex items-start gap-3 max-w-2xl">
            <ShieldCheck className="w-4 h-4 text-[#39B86B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-[#F3F7EF]">Ethical Privacy Assurance: </span>
              All Eco Journey data is securely saved directly in your personal browser storage.
              Zero trackers, zero cookies, and zero server logging. Your sustainability habits belong entirely to you.
            </p>
          </div>

          {/* Optional Journey Reset button */}
          {totalPoints > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all Eco Journey progress? This will reset points, levels, and badges.')) {
                  resetJourney()
                }
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#39B86B]/30 hover:border-red-400/40 text-[#A4B6A8] hover:text-red-300 hover:bg-red-500/10 font-mono text-xs transition-colors shrink-0"
              title="Reset Eco Journey progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* ===================================================================
          BADGE UNLOCK CELEBRATION MODAL
          =================================================================== */}
      <BadgeUnlockModal
        badge={unlockedBadgeForModal}
        onClose={() => setUnlockedBadgeForModal(null)}
        onDownload={handleDownloadBadge}
      />

      {/* ===================================================================
          DOWNLOADABLE ACHIEVEMENT CARD MODAL PREVIEW
          =================================================================== */}
      <AchievementCardModal
        isOpen={cardModalConfig.isOpen}
        cardType={cardModalConfig.cardType}
        cardData={cardModalConfig.cardData}
        onClose={() => setCardModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  )
}
