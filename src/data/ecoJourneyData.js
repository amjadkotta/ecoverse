/**
 * ECOVERSE Eco Journey — Data & Progression Architecture
 *
 * Defines the core progression levels, daily & weekly challenge catalog,
 * achievement badge criteria, and ethical transparency disclosures.
 */

export const STORAGE_KEY = 'ecoverse_eco_journey_v1'
export const PLEDGE_BONUS_KEY = 'ecoverse_green_pledge_bonus_v1'

/**
 * Ethical Transparency Disclosure:
 * Clarifies that Eco Points and badges represent self-reported mindfulness
 * and habit formation rather than accredited or certified offset compliance.
 */
export const IMPACT_DISCLAIMER =
  'Self-Reported Community Action: Eco Points and badges celebrate personal sustainability mindfulness and habit formation. They represent estimated individual engagement and do not constitute verified carbon offset credits or certified compliance.'

/**
 * Challenge Categories
 */
export const CATEGORIES = {
  Energy: {
    id: 'Energy',
    name: 'Energy',
    color: '#B8F34A',
    description: 'Decarbonize daily living and reduce electricity demand',
    icon: 'Zap',
  },
  Conservation: {
    id: 'Conservation',
    name: 'Conservation',
    color: '#39B86B',
    description: 'Minimize waste, eliminate single-use plastics, and recycle responsibly',
    icon: 'Recycle',
  },
  Mobility: {
    id: 'Mobility',
    name: 'Mobility',
    color: '#4ADE80',
    description: 'Choose low-carbon transit, cycling, and conscious commuting',
    icon: 'Bike',
  },
  Nature: {
    id: 'Nature',
    name: 'Nature',
    color: '#2DD4BF',
    description: 'Protect local biodiversity, plant green life, and nurture soil',
    icon: 'TreePine',
  },
  Advocacy: {
    id: 'Advocacy',
    name: 'Advocacy',
    color: '#A3E635',
    description: 'Inspire peers, share knowledge, and unite community impact',
    icon: 'Users',
  },
}

/**
 * Five Progression Levels
 */
export const LEVELS = [
  {
    level: 1,
    title: 'Sprout Pioneer',
    minPoints: 0,
    maxPoints: 199,
    tagline: 'Starting your personal green habit journey.',
    description: 'Taking the first deliberate steps toward daily environmental mindfulness.',
    icon: 'Sprout',
    badgeColor: '#39B86B',
  },
  {
    level: 2,
    title: 'Canopy Guardian',
    minPoints: 200,
    maxPoints: 499,
    tagline: 'Establishing consistent daily ecological habits.',
    description: 'Developing resilient routines that steadily reduce your personal footprint.',
    icon: 'TreePine',
    badgeColor: '#2DD4BF',
  },
  {
    level: 3,
    title: 'Renewable Steward',
    minPoints: 500,
    maxPoints: 999,
    tagline: 'Active energy conservation and circular lifestyle.',
    description: 'Inspiring deeper resource consciousness across energy, consumption, and waste.',
    icon: 'Zap',
    badgeColor: '#B8F34A',
  },
  {
    level: 4,
    title: 'Biosphere Architect',
    minPoints: 1000,
    maxPoints: 1999,
    tagline: 'High-impact community and biodiversity advocate.',
    description: 'Driving meaningful collective progress through ongoing conscious decisions.',
    icon: 'Globe2',
    badgeColor: '#60A5FA',
  },
  {
    level: 5,
    title: 'Planetary Restorer',
    minPoints: 2000,
    maxPoints: Infinity,
    tagline: 'Master-level environmental champion.',
    description: 'Exemplifying planetary guardianship with sustained green leadership.',
    icon: 'ShieldCheck',
    badgeColor: '#FACC15',
  },
]

/**
 * Daily and Weekly Challenge Catalog
 */
export const CHALLENGES = [
  // --- DAILY CHALLENGES (20 - 30 Points) ---
  {
    id: 'daily_vampire_power',
    title: 'Eliminate Phantom Power',
    description: 'Unplug idle chargers, adapters, and electronics or switch off standby power strips.',
    category: 'Energy',
    frequency: 'daily',
    points: 25,
    impactMetric: '~0.4 kg CO2e avoided (est.)',
    icon: 'Zap',
  },
  {
    id: 'daily_zero_single_use',
    title: 'Zero Single-Use Day',
    description: 'Use reusable water bottles, grocery bags, and utensils throughout the entire day.',
    category: 'Conservation',
    frequency: 'daily',
    points: 25,
    impactMetric: '~3 single-use items diverted',
    icon: 'Recycle',
  },
  {
    id: 'daily_green_commute',
    title: 'Low-Carbon Commute',
    description: 'Walk, cycle, take public transit, or carpool instead of driving a personal vehicle alone.',
    category: 'Mobility',
    frequency: 'daily',
    points: 30,
    impactMetric: '~1.8 kg CO2e saved (est.)',
    icon: 'Bike',
  },
  {
    id: 'daily_nature_care',
    title: 'Nature Connection',
    description: 'Water domestic plants, care for green space, or spend 15 minutes outdoors connecting with nature.',
    category: 'Nature',
    frequency: 'daily',
    points: 20,
    impactMetric: 'Local flora vitality',
    icon: 'TreePine',
  },
  {
    id: 'daily_share_insight',
    title: 'Share Green Knowledge',
    description: 'Share one practical sustainability insight or climate tip with a friend, colleague, or family member.',
    category: 'Advocacy',
    frequency: 'daily',
    points: 20,
    impactMetric: '1 community dialogue sparked',
    icon: 'Users',
  },
  {
    id: 'daily_natural_light',
    title: 'Daylight Harvesting',
    description: 'Open curtains and rely on natural daylight instead of electric lighting for at least 4 daytime hours.',
    category: 'Energy',
    frequency: 'daily',
    points: 20,
    impactMetric: '~0.3 kWh saved (est.)',
    icon: 'Sun',
  },
  {
    id: 'daily_plant_meal',
    title: 'Plant-Powered Plate',
    description: 'Enjoy a delicious 100% plant-based meal today to reduce agricultural water and carbon intensity.',
    category: 'Conservation',
    frequency: 'daily',
    points: 25,
    impactMetric: '~1.5 kg CO2e avoided (est.)',
    icon: 'Leaf',
  },
  {
    id: 'daily_stairs_choice',
    title: 'Step Over Elevator',
    description: 'Take the stairs instead of the elevator or escalator for all multi-floor trips today.',
    category: 'Mobility',
    frequency: 'daily',
    points: 20,
    impactMetric: 'Zero elevator energy',
    icon: 'Footprints',
  },

  // --- WEEKLY CHALLENGES (60 - 80 Points) ---
  {
    id: 'weekly_energy_audit',
    title: 'Home Energy Audit',
    description: 'Check weather seals on windows, inspect refrigerator coils, and optimize thermostat settings.',
    category: 'Energy',
    frequency: 'weekly',
    points: 70,
    impactMetric: '~5% monthly power reduction potential',
    icon: 'Zap',
  },
  {
    id: 'weekly_kitchen_audit',
    title: 'Zero-Waste Kitchen Audit',
    description: 'Audit household packaging waste, start or optimize composting, and prioritize bulk groceries.',
    category: 'Conservation',
    frequency: 'weekly',
    points: 75,
    impactMetric: 'Substantial packaging diverted',
    icon: 'Recycle',
  },
  {
    id: 'weekly_car_free_day',
    title: 'Car-Free Weekend Day',
    description: 'Dedicate an entire weekend day to walking, cycling, or transit with zero personal car trips.',
    category: 'Mobility',
    frequency: 'weekly',
    points: 80,
    impactMetric: '~6.5 kg CO2e avoided (est.)',
    icon: 'Bike',
  },
  {
    id: 'weekly_neighborhood_cleanup',
    title: 'Habitat Litter Clean-Up',
    description: 'Spend 30 minutes picking up roadside litter or cleaning a local park, trail, or waterway.',
    category: 'Nature',
    frequency: 'weekly',
    points: 75,
    impactMetric: 'Direct habitat restoration',
    icon: 'TreePine',
  },
  {
    id: 'weekly_family_roundtable',
    title: 'Household Eco Roundtable',
    description: 'Engage family or roommates in a short conversation to adopt one shared eco habit for the coming week.',
    category: 'Advocacy',
    frequency: 'weekly',
    points: 65,
    impactMetric: 'Multi-person habit adoption',
    icon: 'Users',
  },
]

/**
 * Twelve Achievement Badges
 */
export const BADGES = [
  {
    id: 'first_spark',
    title: 'First Spark',
    tagline: 'Your sustainability voyage begins.',
    description: 'Completed your very first sustainability challenge.',
    icon: 'Sparkles',
    category: 'Milestone',
    rarity: 'Common',
    requirement: 'Complete 1 challenge',
    checkUnlocked: (stats) => stats.totalCompletedCount >= 1,
  },
  {
    id: 'habit_builder',
    title: 'Habit Builder',
    tagline: 'Consistency breeds transformation.',
    description: 'Maintained a 3-day active challenge streak.',
    icon: 'Flame',
    category: 'Streak',
    rarity: 'Common',
    requirement: '3-day challenge streak',
    checkUnlocked: (stats) => stats.bestStreak >= 3,
  },
  {
    id: 'week_of_action',
    title: 'Week of Action',
    tagline: 'A full week of ecological dedication.',
    description: 'Maintained a 7-day active sustainability streak.',
    icon: 'Calendar',
    category: 'Streak',
    rarity: 'Rare',
    requirement: '7-day challenge streak',
    checkUnlocked: (stats) => stats.bestStreak >= 7,
  },
  {
    id: 'energy_guardian',
    title: 'Energy Guardian',
    tagline: 'Championing clean power efficiency.',
    description: 'Completed 5 energy-saving actions.',
    icon: 'Zap',
    category: 'Energy',
    rarity: 'Rare',
    requirement: '5 Energy challenges completed',
    checkUnlocked: (stats) => (stats.categoryCounts.Energy || 0) >= 5,
  },
  {
    id: 'zero_waste_hero',
    title: 'Zero-Waste Champion',
    tagline: 'Closing the circular loop.',
    description: 'Completed 5 waste reduction and circularity actions.',
    icon: 'Recycle',
    category: 'Conservation',
    rarity: 'Rare',
    requirement: '5 Conservation challenges completed',
    checkUnlocked: (stats) => (stats.categoryCounts.Conservation || 0) >= 5,
  },
  {
    id: 'green_commuter',
    title: 'Green Commuter',
    tagline: 'Low-carbon footprint on the move.',
    description: 'Completed 4 low-carbon mobility challenges.',
    icon: 'Bike',
    category: 'Mobility',
    rarity: 'Rare',
    requirement: '4 Mobility challenges completed',
    checkUnlocked: (stats) => (stats.categoryCounts.Mobility || 0) >= 4,
  },
  {
    id: 'flora_defender',
    title: 'Flora Defender',
    tagline: 'Nurturing the green web of life.',
    description: 'Completed 3 nature restoration or biodiversity actions.',
    icon: 'TreePine',
    category: 'Nature',
    rarity: 'Rare',
    requirement: '3 Nature challenges completed',
    checkUnlocked: (stats) => (stats.categoryCounts.Nature || 0) >= 3,
  },
  {
    id: 'voice_for_earth',
    title: 'Voice for Earth',
    tagline: 'Empowering community stewardship.',
    description: 'Completed 3 community engagement or environmental advocacy actions.',
    icon: 'Users',
    category: 'Advocacy',
    rarity: 'Rare',
    requirement: '3 Advocacy challenges completed',
    checkUnlocked: (stats) => (stats.categoryCounts.Advocacy || 0) >= 3,
  },
  {
    id: 'eco_milestone_500',
    title: 'Eco Milestone 500',
    tagline: 'Halfway to planetary mastery.',
    description: 'Earned 500 or more total Eco Points.',
    icon: 'Award',
    category: 'Points',
    rarity: 'Epic',
    requirement: '500 total Eco Points',
    checkUnlocked: (stats) => stats.totalPoints >= 500,
  },
  {
    id: 'pledge_pioneer',
    title: 'Pledge Pioneer',
    tagline: 'Committed to conscious action.',
    description: 'Unlocked after taking the official ECOVERSE Green Pledge.',
    icon: 'Leaf',
    category: 'Pledge',
    rarity: 'Common',
    requirement: 'Submit Green Pledge',
    checkUnlocked: (stats) => Boolean(stats.hasTakenGreenPledge),
  },
  {
    id: 'weekly_completionist',
    title: 'Weekly Completionist',
    tagline: 'Mastering multi-day commitments.',
    description: 'Completed at least 3 weekly challenges in total.',
    icon: 'CheckCircle2',
    category: 'Milestone',
    rarity: 'Epic',
    requirement: '3 Weekly challenges completed',
    checkUnlocked: (stats) => stats.weeklyCompletedCount >= 3,
  },
  {
    id: 'planetary_master',
    title: 'Planetary Master',
    tagline: 'The pinnacle of ecological action.',
    description: 'Reached Level 5 (Planetary Restorer rank with 2,000+ points).',
    icon: 'ShieldCheck',
    category: 'Mastery',
    rarity: 'Legendary',
    requirement: 'Reach Level 5 (2,000+ points)',
    checkUnlocked: (stats) => stats.totalPoints >= 2000,
  },
]

// ============================================================================
// DATE & COOLDOWN HELPERS
// ============================================================================

/**
 * Returns the current local calendar date formatted as YYYY-MM-DD.
 * Avoids UTC timezone skew from Date.toISOString().
 */
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Calculates the Unix timestamp (ms) for the next local midnight (00:00:00).
 */
export function getNextMidnight(d = new Date()) {
  const next = new Date(d)
  next.setHours(24, 0, 0, 0)
  return next.getTime()
}

/**
 * Calculates the Unix timestamp (ms) for the next Monday local midnight (00:00:00).
 */
export function getNextMondayMidnight(d = new Date()) {
  const next = new Date(d)
  // d.getDay(): 0 = Sun, 1 = Mon, ..., 6 = Sat
  const day = next.getDay()
  // Days until next Monday: if Monday (1), next Monday is in 7 days; if Sun (0), in 1 day
  const daysUntilMonday = ((8 - day) % 7) || 7
  next.setDate(next.getDate() + daysUntilMonday)
  next.setHours(0, 0, 0, 0)
  return next.getTime()
}

/**
 * Returns the expiration timestamp (ms) for a challenge based on its frequency.
 */
export function getChallengeExpiry(frequency, d = new Date()) {
  if (frequency === 'weekly') {
    return getNextMondayMidnight(d)
  }
  return getNextMidnight(d)
}

/**
 * Computes level progression details purely from total Eco Points.
 * Never relies on untrusted stored level integers.
 */
export function calculateLevel(totalPoints) {
  const points = Math.max(0, Math.floor(Number(totalPoints) || 0))
  const currentLevel =
    LEVELS.slice().reverse().find((lvl) => points >= lvl.minPoints) || LEVELS[0]

  const nextLevel = LEVELS.find((lvl) => lvl.level === currentLevel.level + 1) || null

  let progressPercent = 100
  let pointsNeededForNext = 0
  const currentLevelPoints = points - currentLevel.minPoints

  if (nextLevel) {
    const range = nextLevel.minPoints - currentLevel.minPoints
    pointsNeededForNext = Math.max(0, nextLevel.minPoints - points)
    progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelPoints / range) * 100)))
  }

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    tagline: currentLevel.tagline,
    description: currentLevel.description,
    icon: currentLevel.icon,
    badgeColor: currentLevel.badgeColor,
    minPoints: currentLevel.minPoints,
    maxPoints: currentLevel.maxPoints,
    totalPoints: points,
    currentLevelPoints,
    pointsNeededForNext,
    progressPercent,
    isMaxLevel: !nextLevel,
    nextLevelTitle: nextLevel ? nextLevel.title : null,
  }
}

/**
 * Creates the pristine default state structure for Eco Journey.
 */
export function getInitialState() {
  const now = new Date()
  return {
    version: 1,
    user: {
      totalPoints: 0,
      streak: {
        current: 0,
        best: 0,
        lastActiveDate: null,
      },
      createdAt: now.toISOString(),
      hasTakenGreenPledge: false,
      greenPledgeCompletedAt: null,
    },
    completedChallenges: {}, // { [challengeId]: { completedAt: string, expiresAt: number } }
    unlockedBadges: [],
    activityLog: [
      {
        id: `init_${Date.now()}`,
        challengeId: 'init',
        title: 'Began Your Eco Journey',
        category: 'Advocacy',
        points: 0,
        timestamp: now.toISOString(),
      },
    ],
    categoryTotals: {
      Energy: 0,
      Conservation: 0,
      Mobility: 0,
      Nature: 0,
      Advocacy: 0,
    },
  }
}

/**
 * Sanitizes and validates arbitrary data from localStorage.
 * Ensures defensive fallbacks if localStorage contains invalid or corrupted data.
 */
export function validateAndSanitizeState(raw) {
  if (!raw || typeof raw !== 'object') {
    return getInitialState()
  }

  const initial = getInitialState()

  // Validate points
  const totalPoints = Math.max(0, Math.floor(Number(raw.user?.totalPoints) || 0))

  // Validate streaks
  const currentStreak = Math.max(0, Math.floor(Number(raw.user?.streak?.current) || 0))
  const bestStreak = Math.max(currentStreak, Math.floor(Number(raw.user?.streak?.best) || 0))
  const lastActiveDate =
    typeof raw.user?.streak?.lastActiveDate === 'string'
      ? raw.user.streak.lastActiveDate
      : null

  // Validate green pledge status: check raw user and persistent pledge bonus key
  let hasTakenGreenPledge = Boolean(raw.user?.hasTakenGreenPledge)
  if (!hasTakenGreenPledge && typeof window !== 'undefined' && window.localStorage) {
    try {
      hasTakenGreenPledge = Boolean(window.localStorage.getItem(PLEDGE_BONUS_KEY))
    } catch {
      // Fallback
    }
  }
  const greenPledgeCompletedAt =
    typeof raw.user?.greenPledgeCompletedAt === 'string'
      ? raw.user.greenPledgeCompletedAt
      : null

  // Validate completed challenges
  const completedChallenges = {}
  if (raw.completedChallenges && typeof raw.completedChallenges === 'object') {
    Object.entries(raw.completedChallenges).forEach(([id, record]) => {
      if (record && typeof record.expiresAt === 'number') {
        completedChallenges[id] = {
          completedAt: typeof record.completedAt === 'string' ? record.completedAt : new Date().toISOString(),
          expiresAt: record.expiresAt,
        }
      }
    })
  }

  // Validate unlocked badges
  const unlockedBadges = Array.isArray(raw.unlockedBadges)
    ? raw.unlockedBadges.filter(
        (b) => b && typeof b.badgeId === 'string' && typeof b.unlockedAt === 'string'
      )
    : initial.unlockedBadges

  // Validate activity log
  const activityLog = Array.isArray(raw.activityLog)
    ? raw.activityLog
        .filter((a) => a && typeof a.id === 'string' && typeof a.points === 'number')
        .slice(0, 100) // keep last 100 items for performance
    : initial.activityLog

  // Validate category totals
  const categoryTotals = {
    Energy: Math.max(0, Math.floor(Number(raw.categoryTotals?.Energy) || 0)),
    Conservation: Math.max(0, Math.floor(Number(raw.categoryTotals?.Conservation) || 0)),
    Mobility: Math.max(0, Math.floor(Number(raw.categoryTotals?.Mobility) || 0)),
    Nature: Math.max(0, Math.floor(Number(raw.categoryTotals?.Nature) || 0)),
    Advocacy: Math.max(0, Math.floor(Number(raw.categoryTotals?.Advocacy) || 0)),
  }

  return {
    version: 1,
    user: {
      totalPoints,
      streak: {
        current: currentStreak,
        best: bestStreak,
        lastActiveDate,
      },
      createdAt: typeof raw.user?.createdAt === 'string' ? raw.user.createdAt : initial.user.createdAt,
      hasTakenGreenPledge,
      greenPledgeCompletedAt,
    },
    completedChallenges,
    unlockedBadges,
    activityLog,
    categoryTotals,
  }
}

/**
 * Evaluates whether any locked badges should be unlocked given current stats.
 * Returns array of newly unlocked badge objects.
 */
export function evaluateNewBadges(currentUnlockedBadgeIds, stats) {
  const newBadges = []
  const now = new Date().toISOString()

  BADGES.forEach((badge) => {
    if (!currentUnlockedBadgeIds.includes(badge.id)) {
      if (typeof badge.checkUnlocked === 'function' && badge.checkUnlocked(stats)) {
        newBadges.push({
          badgeId: badge.id,
          unlockedAt: now,
          badge,
        })
      }
    }
  })

  return newBadges
}
