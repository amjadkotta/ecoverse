/**
 * ECOVERSE Eco Arcade — Data & Economy Foundation
 *
 * Dedicated data models, litter classification, recycling bins,
 * cosmetic catalog, and defensive state sanitization for Eco Arcade.
 *
 * STRICT ECONOMY ISOLATION:
 * Eco Coins (Arcade Currency) are completely isolated from Eco Points (Eco Journey).
 * Never read or write the Eco Journey storage key.
 */

export const ARCADE_STORAGE_KEY = 'ecoverse_eco_arcade_v1'
export const ARCADE_STORAGE_VERSION = 1
export const DEFAULT_SKIN_ID = 'ranger_forest'

/**
 * Waste Categories for Recycling & Sorting
 */
export const WASTE_CATEGORIES = {
  plastic: {
    id: 'plastic',
    name: 'Plastic',
    color: '#38BDF8', // Cyan
    accentBg: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    description: 'Polymers, single-use containers, and synthetic packaging diverted from ecosystems',
    badgeText: 'Recycle in Blue Bin',
  },
  metal: {
    id: 'metal',
    name: 'Metal & Cans',
    color: '#FACC15', // Amber / Gold
    accentBg: 'rgba(250, 204, 21, 0.15)',
    borderColor: 'rgba(250, 204, 21, 0.4)',
    description: 'Aluminum drink cans, steel food tins, and clean foil ready for infinite smelting',
    badgeText: 'Recycle in Yellow Bin',
  },
  paper: {
    id: 'paper',
    name: 'Paper & Cardboard',
    color: '#4ADE80', // Emerald / Lime
    accentBg: 'rgba(74, 222, 128, 0.15)',
    borderColor: 'rgba(74, 222, 128, 0.4)',
    description: 'Cellulose fibers, paper packaging, and clean cardboard diverted from landfills',
    badgeText: 'Recycle in Green Bin',
  },
}

/**
 * Catalog of Collectible Forest Litter
 */
export const LITTER_ITEMS = [
  // --- PLASTIC ITEMS ---
  {
    id: 'plastic_bottle',
    name: 'Plastic Water Bottle',
    category: 'plastic',
    baseScore: 10,
    sortBonusScore: 15,
    coinReward: 2,
    symbol: '🍾',
    description: 'Polyethylene terephthalate (PET) beverage bottle.',
  },
  {
    id: 'plastic_bag',
    name: 'Single-Use Plastic Film',
    category: 'plastic',
    baseScore: 10,
    sortBonusScore: 15,
    coinReward: 2,
    symbol: '🛍️',
    description: 'Lightweight polybag that poses entanglement hazards to wildlife.',
  },
  {
    id: 'plastic_cup',
    name: 'Takeaway Iced Cup',
    category: 'plastic',
    baseScore: 12,
    sortBonusScore: 18,
    coinReward: 2,
    symbol: '🥤',
    description: 'Disposable plastic drink container with straw lid.',
  },

  // --- METAL ITEMS ---
  {
    id: 'soda_can',
    name: 'Aluminum Soda Can',
    category: 'metal',
    baseScore: 15,
    sortBonusScore: 20,
    coinReward: 3,
    symbol: '🥫',
    description: 'Highly recyclable aluminum beverage can.',
  },
  {
    id: 'tin_can',
    name: 'Steel Food Tin',
    category: 'metal',
    baseScore: 15,
    sortBonusScore: 20,
    coinReward: 3,
    symbol: '🥫',
    description: 'Food grade tin-plated steel container.',
  },
  {
    id: 'foil_wrapper',
    name: 'Crinkled Snack Foil',
    category: 'metal',
    baseScore: 10,
    sortBonusScore: 15,
    coinReward: 2,
    symbol: '🍫',
    description: 'Composite foil packaging collected before soil degradation.',
  },

  // --- PAPER ITEMS ---
  {
    id: 'newspaper',
    name: 'Discarded Newspaper',
    category: 'paper',
    baseScore: 10,
    sortBonusScore: 15,
    coinReward: 2,
    symbol: '📰',
    description: 'Biodegradable wood pulp newsprint.',
  },
  {
    id: 'cardboard_box',
    name: 'Crushed Cardboard Box',
    category: 'paper',
    baseScore: 15,
    sortBonusScore: 20,
    coinReward: 3,
    symbol: '📦',
    description: 'Corrugated cardboard fiber box.',
  },
  {
    id: 'coffee_sleeve',
    name: 'Paper Coffee Sleeve',
    category: 'paper',
    baseScore: 10,
    sortBonusScore: 15,
    coinReward: 2,
    symbol: '📜',
    description: 'Recyclable Kraft paper cup insulator.',
  },
]

/**
 * Recycling Bins Station Definitions
 */
export const RECYCLING_BINS = [
  {
    id: 'bin_plastic',
    acceptedCategory: 'plastic',
    name: 'Plastic Bin',
    label: 'PLASTIC',
    color: '#38BDF8',
    accentBg: 'rgba(56, 189, 248, 0.18)',
    borderColor: '#38BDF8',
    icon: 'Milk',
    description: 'Accepts bottles, wrappers, and polymers.',
  },
  {
    id: 'bin_metal',
    acceptedCategory: 'metal',
    name: 'Metal & Can Bin',
    label: 'METALS',
    color: '#FACC15',
    accentBg: 'rgba(250, 204, 21, 0.18)',
    borderColor: '#FACC15',
    icon: 'Sparkles',
    description: 'Accepts aluminum cans, tins, and foils.',
  },
  {
    id: 'bin_paper',
    acceptedCategory: 'paper',
    name: 'Paper Bin',
    label: 'PAPER',
    color: '#4ADE80',
    accentBg: 'rgba(74, 222, 128, 0.18)',
    borderColor: '#4ADE80',
    icon: 'FileText',
    description: 'Accepts newsprint, cartons, and cardboard.',
  },
]

/**
 * Cosmetic Ranger Skins Catalogue (Arcade Shop)
 */
export const COSMETICS_CATALOGUE = [
  {
    id: 'ranger_forest',
    name: 'Forest Ranger',
    tagline: 'Standard wilderness bio-suit',
    description: 'Durable natural emerald field uniform tuned for clean forest navigation.',
    cost: 0,
    isDefault: true,
    color: '#39B86B', // Natural emerald green
    accentColor: '#B8F34A', // Neon lime
    rarity: 'Common',
  },
  {
    id: 'ranger_solar',
    name: 'Solar Ranger',
    tagline: 'Photovoltaic solar hazard plating',
    description: 'Warm gold armor equipped with solar micro-cells and bright green energy channels.',
    cost: 100,
    isDefault: false,
    color: '#EAB308', // Warm gold
    accentColor: '#22C55E', // Bright green
    rarity: 'Rare',
  },
  {
    id: 'ranger_river',
    name: 'River Guardian',
    tagline: 'Hydro-sealed riparian bio-armor',
    description: 'Submersible aqua-mesh suit with deep ocean blue stabilizers for riparian cleanup.',
    cost: 250,
    isDefault: false,
    color: '#06B6D4', // Aqua
    accentColor: '#1E40AF', // Deep blue
    rarity: 'Rare',
  },
  {
    id: 'ranger_neon',
    name: 'Neon Ranger',
    tagline: 'Bioluminescent night-patrol weave',
    description: 'Electric lime exosuit infused with vivid green optics that illuminate woodland paths.',
    cost: 500,
    isDefault: false,
    color: '#B8F34A', // Electric lime
    accentColor: '#10B981', // Vivid green
    rarity: 'Epic',
  },
  {
    id: 'ranger_cyber_botanist',
    name: 'Cyber Botanist',
    tagline: 'Futuristic planetary synthesis armor',
    description: 'Advanced teal cyber-chassis with botanical mint accents for planetary re-wilding.',
    cost: 1000,
    isDefault: false,
    color: '#14B8A6', // Futuristic teal
    accentColor: '#A7F3D0', // Botanical mint accents
    rarity: 'Legendary',
  },
]

/**
 * Game Configuration & Economy Tuning
 */
export const ARCADE_CONFIG = {
  defaultBagCapacity: 5,
  roundDurationSeconds: 60,
  perfectSortBonusCoins: 10,
  basePointsPerCoin: 50,
}

/**
 * Pristine Initial State Structure
 */
export function getInitialState() {
  return {
    version: ARCADE_STORAGE_VERSION,
    arcadeCoins: 0,
    highScore: 0,
    totalGamesPlayed: 0,
    totalLitterCollected: 0,
    totalLitterRecycled: 0,
    bestSortingStreak: 0,
    unlockedCosmetics: [DEFAULT_SKIN_ID],
    activeSkin: DEFAULT_SKIN_ID,
    categoryStats: {
      plastic: 0,
      metal: 0,
      paper: 0,
    },
    lastPlayedAt: null,
  }
}

/**
 * Defensive Sanitizer for LocalStorage Data
 *
 * Validates, repairs, and clamps arbitrary or corrupt stored payloads.
 */
export function validateAndSanitizeState(raw) {
  if (!raw || typeof raw !== 'object') {
    return getInitialState()
  }

  // Clamp numeric values to valid positive integers
  const arcadeCoins = Math.max(0, Math.floor(Number(raw.arcadeCoins) || 0))
  const highScore = Math.max(0, Math.floor(Number(raw.highScore) || 0))
  const totalGamesPlayed = Math.max(0, Math.floor(Number(raw.totalGamesPlayed) || 0))
  const totalLitterCollected = Math.max(0, Math.floor(Number(raw.totalLitterCollected) || 0))
  const totalLitterRecycled = Math.max(0, Math.floor(Number(raw.totalLitterRecycled) || 0))
  const bestSortingStreak = Math.max(0, Math.floor(Number(raw.bestSortingStreak) || 0))

  // Validate unlocked cosmetics (always guarantee DEFAULT_SKIN_ID is unlocked)
  const validCatalogIds = new Set(COSMETICS_CATALOGUE.map((c) => c.id))
  let unlockedCosmetics = [DEFAULT_SKIN_ID]

  if (Array.isArray(raw.unlockedCosmetics)) {
    const validFiltered = raw.unlockedCosmetics.filter(
      (id) => typeof id === 'string' && validCatalogIds.has(id)
    )
    if (validFiltered.length > 0) {
      unlockedCosmetics = Array.from(new Set([DEFAULT_SKIN_ID, ...validFiltered]))
    }
  }

  // Validate active cosmetic (must be one of the user's unlocked cosmetics)
  let activeSkin = DEFAULT_SKIN_ID
  if (typeof raw.activeSkin === 'string' && unlockedCosmetics.includes(raw.activeSkin)) {
    activeSkin = raw.activeSkin
  }

  // Validate category recycling stats
  const categoryStats = {
    plastic: Math.max(0, Math.floor(Number(raw.categoryStats?.plastic) || 0)),
    metal: Math.max(0, Math.floor(Number(raw.categoryStats?.metal) || 0)),
    paper: Math.max(0, Math.floor(Number(raw.categoryStats?.paper) || 0)),
  }

  const lastPlayedAt =
    typeof raw.lastPlayedAt === 'string' && !isNaN(Date.parse(raw.lastPlayedAt))
      ? raw.lastPlayedAt
      : null

  return {
    version: ARCADE_STORAGE_VERSION,
    arcadeCoins,
    highScore,
    totalGamesPlayed,
    totalLitterCollected,
    totalLitterRecycled,
    bestSortingStreak,
    unlockedCosmetics,
    activeSkin,
    categoryStats,
    lastPlayedAt,
  }
}
