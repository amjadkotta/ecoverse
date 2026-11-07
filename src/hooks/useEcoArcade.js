import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ARCADE_STORAGE_KEY,
  WASTE_CATEGORIES,
  LITTER_ITEMS,
  RECYCLING_BINS,
  COSMETICS_CATALOGUE,
  ARCADE_CONFIG,
  getInitialState,
  validateAndSanitizeState,
} from '../data/ecoArcadeData'

/**
 * In-memory fallback if localStorage is disabled or restricted (e.g. private mode).
 */
let memoryStorageFallback = null

/**
 * Safely reads state from localStorage with in-memory fallback.
 */
function readStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(ARCADE_STORAGE_KEY)
      if (item) {
        const parsed = JSON.parse(item)
        return validateAndSanitizeState(parsed)
      }
    }
  } catch {
    // Fallback to memory
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
      window.localStorage.setItem(ARCADE_STORAGE_KEY, JSON.stringify(newState))
      return true
    }
  } catch (err) {
    console.error('EcoArcade storage write failed:', err)
    return false
  }
  return true
}

/**
 * Custom React Hook: useEcoArcade
 *
 * Encapsulates all persistent state, Eco Coins economy, cosmetic unlocks,
 * lifetime recycling statistics, and session recording for Eco Arcade.
 *
 * STRICT ECONOMY ISOLATION:
 * This hook is 100% isolated from Eco Journey and Eco Points.
 */
export default function useEcoArcade() {
  // Initialize state once from storage
  const [state, setState] = useState(() => readStorage())

  // Sync state to storage whenever it changes
  useEffect(() => {
    writeStorage(state)
  }, [state])

  // Cross-tab storage synchronization
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === ARCADE_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setState(validateAndSanitizeState(parsed))
        } catch {
          // Ignore external parse errors
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageEvent)
      return () => window.removeEventListener('storage', handleStorageEvent)
    }
  }, [])

  /**
   * Adds Eco Coins to player's balance.
   * Prevents negative additions.
   */
  const addCoins = useCallback((amount) => {
    const validAmount = Math.max(0, Math.floor(Number(amount) || 0))
    if (validAmount <= 0) {
      return { success: false, reason: 'INVALID_AMOUNT' }
    }

    let newBalance = 0
    setState((prev) => {
      newBalance = prev.arcadeCoins + validAmount
      return {
        ...prev,
        arcadeCoins: newBalance,
      }
    })

    return { success: true, coinsAdded: validAmount, newBalance }
  }, [])

  /**
   * Spends Eco Coins from player's balance (e.g. purchasing cosmetic skins).
   * Prevents negative balances and invalid amounts.
   */
  const spendCoins = useCallback((amount) => {
    const validAmount = Math.max(0, Math.floor(Number(amount) || 0))
    if (validAmount <= 0) {
      return { success: false, reason: 'INVALID_AMOUNT' }
    }

    const currentStored = readStorage()
    const currentBalance = currentStored.arcadeCoins

    if (currentBalance < validAmount) {
      return {
        success: false,
        reason: 'INSUFFICIENT_COINS',
        required: validAmount,
        balance: currentBalance,
      }
    }

    const newBalance = currentBalance - validAmount
    const updated = {
      ...currentStored,
      arcadeCoins: newBalance,
    }

    setState(updated)
    writeStorage(updated)

    return { success: true, spent: validAmount, newBalance }
  }, [])

  /**
   * Updates player's personal high score.
   */
  const updateHighScore = useCallback((score) => {
    const validScore = Math.max(0, Math.floor(Number(score) || 0))
    let isNewHighScore = false

    setState((prev) => {
      if (validScore > prev.highScore) {
        isNewHighScore = true
        return {
          ...prev,
          highScore: validScore,
        }
      }
      return prev
    })

    return { isNewHighScore, score: validScore }
  }, [])

  /**
   * Records a completed Eco Collector game cleanup session.
   * Atomically updates high score, lifetime collected/recycled items,
   * category breakdown, sorting streaks, and awards round Eco Coins.
   */
  const recordGameSession = useCallback((sessionSummary) => {
    const score = Math.max(0, Math.floor(Number(sessionSummary?.score) || 0))
    const litterCollected = Math.max(
      0,
      Math.floor(Number(sessionSummary?.litterCollected) || 0)
    )
    const plastic = Math.max(
      0,
      Math.floor(Number(sessionSummary?.recycledByCategory?.plastic) || 0)
    )
    const metal = Math.max(
      0,
      Math.floor(Number(sessionSummary?.recycledByCategory?.metal) || 0)
    )
    const paper = Math.max(
      0,
      Math.floor(Number(sessionSummary?.recycledByCategory?.paper) || 0)
    )
    const recycledTotal = plastic + metal + paper
    const sortingStreak = Math.max(
      0,
      Math.floor(Number(sessionSummary?.sortingStreak) || 0)
    )
    const coinsEarned = Math.max(
      0,
      Math.floor(Number(sessionSummary?.coinsEarned) || 0)
    )

    const nowIso = new Date().toISOString()
    let isNewHighScore = false
    let newHighScore = 0
    let newBalance = 0

    setState((prev) => {
      isNewHighScore = score > prev.highScore
      newHighScore = Math.max(prev.highScore, score)
      newBalance = prev.arcadeCoins + coinsEarned

      return {
        ...prev,
        highScore: newHighScore,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        totalLitterCollected: prev.totalLitterCollected + litterCollected,
        totalLitterRecycled: prev.totalLitterRecycled + recycledTotal,
        bestSortingStreak: Math.max(prev.bestSortingStreak, sortingStreak),
        categoryStats: {
          plastic: prev.categoryStats.plastic + plastic,
          metal: prev.categoryStats.metal + metal,
          paper: prev.categoryStats.paper + paper,
        },
        arcadeCoins: newBalance,
        lastPlayedAt: nowIso,
      }
    })

    return {
      success: true,
      isNewHighScore,
      newHighScore,
      coinsEarned,
      newBalance,
    }
  }, [])

  /**
   * Unlocks a cosmetic skin.
   * If purchase === true, deducts the coin price from balance.
   */
  const unlockCosmetic = useCallback((skinId, purchase = false) => {
    const skin = COSMETICS_CATALOGUE.find((c) => c.id === skinId)
    if (!skin) {
      return { success: false, reason: 'INVALID_COSMETIC' }
    }

    const currentStored = readStorage()
    if (currentStored.unlockedCosmetics.includes(skinId)) {
      return { success: false, reason: 'ALREADY_UNLOCKED' }
    }

    if (purchase && skin.cost > 0) {
      if (currentStored.arcadeCoins < skin.cost) {
        return {
          success: false,
          reason: 'INSUFFICIENT_COINS',
          required: skin.cost,
          balance: currentStored.arcadeCoins,
        }
      }
    }

    const newBalance = purchase
      ? Math.max(0, currentStored.arcadeCoins - skin.cost)
      : currentStored.arcadeCoins
    const updated = {
      ...currentStored,
      arcadeCoins: newBalance,
      unlockedCosmetics: Array.from(new Set([...currentStored.unlockedCosmetics, skinId])),
      activeSkin: skinId, // Automatically equip newly acquired skin
    }

    const writeOk = writeStorage(updated)
    if (!writeOk) {
      return {
        success: false,
        reason: 'STORAGE_FAILED',
        message: 'Could not write to local storage.',
      }
    }

    setState(updated)
    return { success: true, unlockedSkin: skinId, newBalance, activeSkin: skinId }
  }, [])

  /**
   * Atomically purchases and equips an unlockable cosmetic skin.
   * Prevents duplicate purchases, insufficient balance overdrafts,
   * unowned equips, and storage failures.
   */
  const purchaseSkin = useCallback(
    (skinId) => {
      return unlockCosmetic(skinId, true)
    },
    [unlockCosmetic]
  )

  /**
   * Equips an unlocked cosmetic skin.
   * Strictly prevents selecting locked skins.
   */
  const setActiveSkin = useCallback((skinId) => {
    const currentStored = readStorage()
    if (!currentStored.unlockedCosmetics.includes(skinId)) {
      return { success: false, reason: 'SKIN_LOCKED' }
    }

    const updated = {
      ...currentStored,
      activeSkin: skinId,
    }

    const writeOk = writeStorage(updated)
    if (!writeOk) {
      return { success: false, reason: 'STORAGE_FAILED' }
    }

    setState(updated)
    return { success: true, activeSkin: skinId }
  }, [])

  /**
   * Resets all Eco Arcade local progress (coins, high scores, cosmetics).
   */
  const resetArcade = useCallback(() => {
    const freshState = getInitialState()
    setState(freshState)
    writeStorage(freshState)
    return { success: true }
  }, [])

  /**
   * Active cosmetic object lookup
   */
  const activeSkinData = useMemo(() => {
    return (
      COSMETICS_CATALOGUE.find((c) => c.id === state.activeSkin) ||
      COSMETICS_CATALOGUE[0]
    )
  }, [state.activeSkin])

  return {
    // Player Stats & Economy
    arcadeCoins: state.arcadeCoins,
    highScore: state.highScore,
    totalGamesPlayed: state.totalGamesPlayed,
    totalLitterCollected: state.totalLitterCollected,
    totalLitterRecycled: state.totalLitterRecycled,
    bestSortingStreak: state.bestSortingStreak,
    categoryStats: state.categoryStats,
    lastPlayedAt: state.lastPlayedAt,

    // Cosmetics
    unlockedCosmetics: state.unlockedCosmetics,
    activeSkin: state.activeSkin,
    activeSkinData,

    // Static Catalogs & Rules
    wasteCategories: WASTE_CATEGORIES,
    litterItems: LITTER_ITEMS,
    recyclingBins: RECYCLING_BINS,
    cosmeticsCatalogue: COSMETICS_CATALOGUE,
    config: ARCADE_CONFIG,

    // Actions
    addCoins,
    spendCoins,
    updateHighScore,
    recordGameSession,
    unlockCosmetic,
    purchaseSkin,
    setActiveSkin,
    resetArcade,
  }
}
