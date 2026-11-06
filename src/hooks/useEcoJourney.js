import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  STORAGE_KEY,
  PLEDGE_BONUS_KEY,
  IMPACT_DISCLAIMER,
  CATEGORIES,
  LEVELS,
  CHALLENGES,
  BADGES,
  getLocalDateString,
  getChallengeExpiry,
  calculateLevel,
  getInitialState,
  validateAndSanitizeState,
  evaluateNewBadges,
} from '../data/ecoJourneyData'

/**
 * In-memory fallback if localStorage is disabled or throws (e.g. strict private mode).
 */
let memoryStorageFallback = null
let memoryPledgeLock = false

/**
 * Safely reads state from localStorage with fallback to memory storage.
 */
function readStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(STORAGE_KEY)
      if (item) {
        const parsed = JSON.parse(item)
        return validateAndSanitizeState(parsed)
      }
    }
  } catch {
    // Fall through to memory storage fallback
  }

  if (memoryStorageFallback) {
    return memoryStorageFallback
  }

  const initial = getInitialState()
  memoryStorageFallback = initial
  return initial
}

/**
 * Safely writes state to localStorage with in-memory caching.
 */
function writeStorage(newState) {
  memoryStorageFallback = newState
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
    }
  } catch {
    // Graceful fallback for quota exceeded or storage blocked
  }
}

/**
 * Returns yesterday's local calendar date string (YYYY-MM-DD).
 */
function getYesterdayDateString() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return getLocalDateString(d)
}

/**
 * Custom React Hook: useEcoJourney
 *
 * Encapsulates all gamification business logic, storage sync, cooldown validations,
 * progression levels, streaks, badge evaluations, and activity timeline.
 */
export default function useEcoJourney() {
  // Initialize state once from storage
  const [state, setState] = useState(() => readStorage())

  // Sync state to storage whenever it updates
  useEffect(() => {
    writeStorage(state)
  }, [state])

  // Listen for storage events across browser tabs
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setState(validateAndSanitizeState(parsed))
        } catch {
          // Ignore external parse errors
        }
      } else if (e.key === PLEDGE_BONUS_KEY) {
        // Synchronize across tabs when pledge bonus key is updated in another tab
        setState(readStorage())
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageEvent)
      return () => window.removeEventListener('storage', handleStorageEvent)
    }
  }, [])

  // Periodically trigger a clean rerender to update cooldown countdowns
  const [nowMs, setNowMs] = useState(() => Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now())
    }, 30000) // check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  /**
   * Computed Level Progression (calculated dynamically from totalPoints)
   */
  const levelInfo = useMemo(() => {
    return calculateLevel(state.user.totalPoints)
  }, [state.user.totalPoints])

  /**
   * Computed Challenges List (enriched with cooldown and completion status)
   */
  const challenges = useMemo(() => {
    return CHALLENGES.map((challenge) => {
      const record = state.completedChallenges[challenge.id]
      const isCompleted = Boolean(record && record.expiresAt > nowMs)
      const expiresAt = record ? record.expiresAt : null
      const completedAt = record ? record.completedAt : null

      // Time remaining calculation
      let timeRemaining = null
      if (isCompleted && expiresAt) {
        const diffMs = Math.max(0, expiresAt - nowMs)
        const totalMinutes = Math.floor(diffMs / (1000 * 60))
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        timeRemaining = {
          ms: diffMs,
          hours,
          minutes,
          formatted: `${hours}h ${minutes}m`,
        }
      }

      return {
        ...challenge,
        isCompleted,
        completedAt,
        expiresAt,
        timeRemaining,
      }
    })
  }, [state.completedChallenges, nowMs])

  /**
   * Computed Badges List (enriched with unlocked status and timestamps)
   */
  const badges = useMemo(() => {
    const unlockedMap = new Map(
      state.unlockedBadges.map((b) => [b.badgeId, b.unlockedAt])
    )

    return BADGES.map((badge) => {
      const unlockedAt = unlockedMap.get(badge.id) || null
      return {
        ...badge,
        isUnlocked: Boolean(unlockedAt),
        unlockedAt,
      }
    })
  }, [state.unlockedBadges])

  /**
   * Completes a challenge and awards Eco Points with streak and badge evaluation.
   * Prevents duplicate rewards within the active challenge cycle.
   */
  const completeChallenge = useCallback(
    (challengeId) => {
      const challenge = CHALLENGES.find((c) => c.id === challengeId)
      if (!challenge) {
        return { success: false, reason: 'CHALLENGE_NOT_FOUND' }
      }

      const currentStored = readStorage()
      const existingRecord =
        state.completedChallenges[challengeId] ||
        currentStored.completedChallenges?.[challengeId]
      const currentNow = Date.now()

      // Duplicate reward prevention check
      if (existingRecord && existingRecord.expiresAt > currentNow) {
        return {
          success: false,
          reason: 'ALREADY_COMPLETED',
          expiresAt: existingRecord.expiresAt,
        }
      }

      const todayStr = getLocalDateString()
      const yesterdayStr = getYesterdayDateString()
      const baseUser = currentStored.user || state.user
      const lastActive = baseUser.streak?.lastActiveDate || state.user.streak.lastActiveDate

      // Streak calculation based on local calendar dates
      let newCurrentStreak = baseUser.streak?.current || state.user.streak.current
      if (lastActive === todayStr) {
        // Already active today; streak maintained
        newCurrentStreak = Math.max(1, newCurrentStreak)
      } else if (lastActive === yesterdayStr) {
        // Consecutive calendar day; streak increments
        newCurrentStreak += 1
      } else {
        // First activity or broken streak; resets to 1
        newCurrentStreak = 1
      }

      const newBestStreak = Math.max(state.user.streak.best, baseUser.streak?.best || 0, newCurrentStreak)
      const basePoints = Math.max(state.user.totalPoints, baseUser.totalPoints || 0)
      const newTotalPoints = basePoints + challenge.points
      const expiresAt = getChallengeExpiry(challenge.frequency)
      const timestampIso = new Date().toISOString()

      // New activity history entry
      const activityEntry = {
        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        challengeId: challenge.id,
        title: challenge.title,
        category: challenge.category,
        points: challenge.points,
        timestamp: timestampIso,
      }

      // Updated category totals
      const newCategoryTotals = {
        ...state.categoryTotals,
        [challenge.category]: (state.categoryTotals[challenge.category] || 0) + challenge.points,
      }

      // Count completed challenges by category across history
      const allActivities = [activityEntry, ...state.activityLog]
      const countsByCategory = {}
      let totalCompleted = 0
      let weeklyCompleted = 0

      allActivities.forEach((act) => {
        if (act.challengeId !== 'init') {
          totalCompleted += 1
          countsByCategory[act.category] = (countsByCategory[act.category] || 0) + 1
          const orig = CHALLENGES.find((c) => c.id === act.challengeId)
          if (orig && orig.frequency === 'weekly') {
            weeklyCompleted += 1
          }
        }
      })

      // Evaluate new badges
      const currentUnlockedIds = state.unlockedBadges.map((b) => b.badgeId)
      const statsForBadges = {
        totalPoints: newTotalPoints,
        bestStreak: newBestStreak,
        currentStreak: newCurrentStreak,
        categoryCounts: countsByCategory,
        totalCompletedCount: totalCompleted,
        weeklyCompletedCount: weeklyCompleted,
        isProfileActive: true,
      }

      const newlyUnlocked = evaluateNewBadges(currentUnlockedIds, statsForBadges)
      const updatedUnlockedBadges = [
        ...state.unlockedBadges,
        ...newlyUnlocked.map((b) => ({ badgeId: b.badgeId, unlockedAt: b.unlockedAt })),
      ]

      // Assemble new state
      const newState = {
        ...state,
        user: {
          ...state.user,
          totalPoints: newTotalPoints,
          streak: {
            current: newCurrentStreak,
            best: newBestStreak,
            lastActiveDate: todayStr,
          },
        },
        completedChallenges: {
          ...state.completedChallenges,
          [challengeId]: {
            completedAt: timestampIso,
            expiresAt,
          },
        },
        unlockedBadges: updatedUnlockedBadges,
        activityLog: [activityEntry, ...state.activityLog].slice(0, 100),
        categoryTotals: newCategoryTotals,
      }

      setState(newState)

      return {
        success: true,
        pointsAwarded: challenge.points,
        newTotalPoints,
        newStreak: newCurrentStreak,
        newlyUnlockedBadges: newlyUnlocked.map((b) => b.badge),
      }
    },
    [state]
  )

  /**
   * Idempotently records an official Green Pledge submission in Eco Journey.
   * Awards exactly 50 Eco Points, unlocks Pledge Pioneer badge, records an
   * activity history entry, and marks hasTakenGreenPledge: true.
   *
   * Multi-tab concurrency & idempotency guard:
   * Uses both synchronous in-memory flag and persistent storage token to guarantee
   * that concurrent submissions or page reloads never duplicate the 50-point bonus.
   */
  const recordGreenPledge = useCallback(() => {
    // 1. Check synchronous storage token, in-memory lock, and state
    let alreadyHasBonusToken = false
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        alreadyHasBonusToken = Boolean(window.localStorage.getItem(PLEDGE_BONUS_KEY))
      }
    } catch {
      // Fallback
    }

    const currentStored = readStorage()
    if (
      alreadyHasBonusToken ||
      memoryPledgeLock ||
      state.user.hasTakenGreenPledge ||
      currentStored.user?.hasTakenGreenPledge
    ) {
      return {
        success: false,
        reason: 'ALREADY_RECORDED',
        pointsAwarded: 0,
      }
    }

    const timestampIso = new Date().toISOString()

    // 2. Immediately mark memory and synchronous localStorage lock BEFORE async state computation
    memoryPledgeLock = true
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PLEDGE_BONUS_KEY, timestampIso)
      }
    } catch {
      // Fallback
    }

    const todayStr = getLocalDateString()
    const yesterdayStr = getYesterdayDateString()
    const lastActive = state.user.streak.lastActiveDate

    let newCurrentStreak = state.user.streak.current
    if (lastActive === todayStr) {
      newCurrentStreak = Math.max(1, newCurrentStreak)
    } else if (lastActive === yesterdayStr) {
      newCurrentStreak += 1
    } else {
      newCurrentStreak = Math.max(1, newCurrentStreak === 0 ? 1 : newCurrentStreak)
    }

    const newBestStreak = Math.max(state.user.streak.best, currentStored.user?.streak?.best || 0, newCurrentStreak)
    const pointsAwarded = 50
    const basePoints = Math.max(state.user.totalPoints, currentStored.user?.totalPoints || 0)
    const newTotalPoints = basePoints + pointsAwarded

    // Activity log entry for pledge submission
    const activityEntry = {
      id: `act_pledge_${Date.now()}`,
      challengeId: 'green_pledge_submission',
      title: 'Signed Official Green Pledge',
      category: 'Advocacy',
      points: pointsAwarded,
      timestamp: timestampIso,
    }

    const newCategoryTotals = {
      ...state.categoryTotals,
      Advocacy: (state.categoryTotals.Advocacy || 0) + pointsAwarded,
    }

    // Count completions for badge stats
    const allActivities = [activityEntry, ...state.activityLog]
    const countsByCategory = {}
    let totalCompleted = 0
    let weeklyCompleted = 0

    allActivities.forEach((act) => {
      if (act.challengeId !== 'init') {
        totalCompleted += 1
        countsByCategory[act.category] = (countsByCategory[act.category] || 0) + 1
        const orig = CHALLENGES.find((c) => c.id === act.challengeId)
        if (orig && orig.frequency === 'weekly') {
          weeklyCompleted += 1
        }
      }
    })

    const currentUnlockedIds = state.unlockedBadges.map((b) => b.badgeId)
    const statsForBadges = {
      totalPoints: newTotalPoints,
      bestStreak: newBestStreak,
      currentStreak: newCurrentStreak,
      categoryCounts: countsByCategory,
      totalCompletedCount: totalCompleted,
      weeklyCompletedCount: weeklyCompleted,
      isProfileActive: true,
      hasTakenGreenPledge: true,
    }

    const newlyUnlocked = evaluateNewBadges(currentUnlockedIds, statsForBadges)
    const updatedUnlockedBadges = [
      ...state.unlockedBadges,
      ...newlyUnlocked.map((b) => ({ badgeId: b.badgeId, unlockedAt: b.unlockedAt })),
    ]

    const newState = {
      ...state,
      user: {
        ...state.user,
        totalPoints: newTotalPoints,
        streak: {
          current: newCurrentStreak,
          best: newBestStreak,
          lastActiveDate: todayStr,
        },
        hasTakenGreenPledge: true,
        greenPledgeCompletedAt: timestampIso,
      },
      unlockedBadges: updatedUnlockedBadges,
      activityLog: [activityEntry, ...state.activityLog].slice(0, 100),
      categoryTotals: newCategoryTotals,
    }

    setState(newState)
    writeStorage(newState)

    return {
      success: true,
      pointsAwarded,
      newTotalPoints,
      newStreak: newCurrentStreak,
      newlyUnlockedBadges: newlyUnlocked.map((b) => b.badge),
    }
  }, [state])

  /**
   * Resets personal Eco Journey habit progress (challenges, daily streaks, levels)
   * while preserving the one-time Green Pledge commitment and Pledge Pioneer badge.
   * Ensures resetting Eco Journey cannot make the 50-point bonus claimable again.
   */
  const resetJourney = useCallback(() => {
    let hasPledged = Boolean(state.user.hasTakenGreenPledge || memoryPledgeLock)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        hasPledged = hasPledged || Boolean(window.localStorage.getItem(PLEDGE_BONUS_KEY))
      }
    } catch {
      // Fallback
    }

    const freshState = getInitialState()
    if (hasPledged) {
      freshState.user.hasTakenGreenPledge = true
      freshState.user.greenPledgeCompletedAt =
        state.user.greenPledgeCompletedAt || new Date().toISOString()
      // Preserve Pledge Pioneer achievement badge across journey resets
      freshState.unlockedBadges = state.unlockedBadges.filter(
        (b) => b.badgeId === 'pledge_pioneer'
      )
    }

    setState(freshState)
    writeStorage(freshState)
    return { success: true }
  }, [state.user.hasTakenGreenPledge, state.user.greenPledgeCompletedAt, state.unlockedBadges])

  return {
    // Primary User Progress
    totalPoints: state.user.totalPoints,
    level: levelInfo,
    streak: state.user.streak,
    categoryTotals: state.categoryTotals,
    hasTakenGreenPledge: state.user.hasTakenGreenPledge,

    // Entities
    challenges,
    badges,
    activityLog: state.activityLog,
    completedChallenges: state.completedChallenges,
    unlockedBadges: state.unlockedBadges,

    // Constants & Metadata
    categories: CATEGORIES,
    levels: LEVELS,
    disclaimer: IMPACT_DISCLAIMER,

    // Actions
    completeChallenge,
    recordGreenPledge,
    resetJourney,
  }
}
