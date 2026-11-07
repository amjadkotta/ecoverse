import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Pause,
  Play,
  Shield,
  Compass,
  Keyboard,
  Clock,
  Trophy,
  Coins,
  Package,
  Flame,
  AlertCircle,
  Smartphone,
} from 'lucide-react'
import GameCanvas from './GameCanvas'
import RecyclingModal from './RecyclingModal'
import ShiftSummaryModal from './ShiftSummaryModal'
import VirtualControls from './VirtualControls'

export default function GameContainer({
  activeSkinData,
  wasteCategories = {},
  recyclingBins = [],
  recordGameSession,
  onExit,
  onOpenShop,
}) {
  const engineRef = useRef(null)

  // 1. Core Shift & Timer State (60 Seconds)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [isPaused, setIsPaused] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isSortingOpen, setIsSortingOpen] = useState(false)
  const [activeBin, setActiveBin] = useState(null)

  // 2. Gameplay Score & Reward State
  const [score, setScore] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [litterCollectedCount, setLitterCollectedCount] = useState(0)
  const [, setRecycledCount] = useState(0)
  const [recycledByCategory, setRecycledByCategory] = useState({
    plastic: 0,
    metal: 0,
    paper: 0,
  })
  const [currentStreak, setCurrentStreak] = useState(0)
  const [bestSortingStreak, setBestSortingStreak] = useState(0)

  // 3. Dynamic Bag & World State
  const [backpack, setBackpack] = useState([])
  const [bagFullToast, setBagFullToast] = useState(false)
  const [gameState, setGameState] = useState({
    playerPos: { x: 360, y: 420 },
    facing: 'down',
    isMoving: false,
    nearbyLitter: null,
    nearbyBin: null,
  })

  // 4. Mobile & Touchscreen Detection with Manual Override
  const [touchOverride, setTouchOverride] = useState(null)
  const [hasTouchCapability] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia?.('(pointer: coarse)')?.matches ||
        false)
    )
  })

  const showVirtualControls = touchOverride !== null ? touchOverride : hasTouchCapability

  const handleVirtualDirection = useCallback((dir) => {
    if (engineRef.current) {
      engineRef.current.setVirtualDirection(dir)
    }
  }, [])

  const handleVirtualInteract = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.interact()
    }
  }, [])

  // 5. Duplicate Session Recording Protection (Idempotent Guard)
  const sessionRecordedRef = useRef(false)
  const sessionIdRef = useRef('session_1')
  const [roundSummary, setRoundSummary] = useState(null)

  // Keep latest game stats in refs for clean timer conclusion callback
  const statsRef = useRef({
    score: 0,
    litterCollectedCount: 0,
    recycledByCategory: { plastic: 0, metal: 0, paper: 0 },
    bestSortingStreak: 0,
    coinsEarned: 0,
  })

  useEffect(() => {
    statsRef.current = {
      score,
      litterCollectedCount,
      recycledByCategory,
      bestSortingStreak,
      coinsEarned,
    }
  }, [score, litterCollectedCount, recycledByCategory, bestSortingStreak, coinsEarned])

  // End Round handler: concludes session and calls recordGameSession exactly once
  const endRound = useCallback(() => {
    if (sessionRecordedRef.current) return
    sessionRecordedRef.current = true

    // Pause the engine
    if (engineRef.current) {
      engineRef.current.pause()
    }

    setIsGameOver(true)
    setIsSortingOpen(false)

    const currentStats = statsRef.current

    let result = { isNewHighScore: false, newHighScore: currentStats.score }
    if (typeof recordGameSession === 'function') {
      result = recordGameSession({
        score: currentStats.score,
        litterCollected: currentStats.litterCollectedCount,
        recycledByCategory: currentStats.recycledByCategory,
        sortingStreak: currentStats.bestSortingStreak,
        coinsEarned: currentStats.coinsEarned,
      })
    }

    setRoundSummary({
      score: currentStats.score,
      isNewHighScore: result?.isNewHighScore || false,
      newHighScore: result?.newHighScore || currentStats.score,
      litterCollected: currentStats.litterCollectedCount,
      recycledByCategory: currentStats.recycledByCategory,
      sortingStreak: currentStats.bestSortingStreak,
      coinsEarned: currentStats.coinsEarned,
      newBalance: result?.newBalance ?? 0,
    })
  }, [recordGameSession])

  // =========================================================================
  // 60-SECOND SHIFT COUNTDOWN TIMER
  // Pauses automatically when paused, sorting modal is open, or tab is hidden.
  // =========================================================================
  useEffect(() => {
    if (isPaused || isSortingOpen || isGameOver) return

    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval)
          endRound()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [isPaused, isSortingOpen, isGameOver, endRound])

  // =========================================================================
  // ENGINE STATE & INTERACTION CALLBACKS
  // =========================================================================

  const handleEngineReady = useCallback((engine) => {
    engineRef.current = engine
  }, [])

  const handleStateChange = useCallback((state) => {
    if (state.isPaused !== undefined) {
      setIsPaused(state.isPaused)
    }
    if (state.backpack) {
      setBackpack(state.backpack)
    }
    setGameState((prev) => ({
      ...prev,
      playerPos: state.playerPos || prev.playerPos,
      facing: state.facing || prev.facing,
      isMoving: state.isMoving !== undefined ? state.isMoving : prev.isMoving,
      nearbyLitter: state.nearbyLitter,
      nearbyBin: state.nearbyBin,
    }))
  }, [])

  const handleItemCollected = useCallback((item) => {
    setScore((prev) => prev + (item.baseScore || 10))
    setLitterCollectedCount((prev) => prev + 1)
  }, [])

  const handleOpenRecycling = useCallback((bin) => {
    setActiveBin(bin)
    setIsSortingOpen(true)
  }, [])

  const handleBagFull = useCallback(() => {
    setBagFullToast(true)
    setTimeout(() => {
      setBagFullToast(false)
    }, 2800)
  }, [])

  // =========================================================================
  // RECYCLING & SORTING LOGIC
  // =========================================================================

  const handleSortItem = useCallback(
    (item, chosenCategory) => {
      if (!item) return { correct: false }

      const isCorrect = chosenCategory === item.category

      if (isCorrect) {
        const bonusScore = item.sortBonusScore || 15
        const coinReward = item.coinReward || 2

        setScore((prev) => prev + bonusScore)
        setCoinsEarned((prev) => prev + coinReward)
        setRecycledCount((prev) => prev + 1)
        setRecycledByCategory((prev) => ({
          ...prev,
          [item.category]: (prev[item.category] || 0) + 1,
        }))

        setCurrentStreak((prev) => {
          const newStreak = prev + 1
          setBestSortingStreak((best) => Math.max(best, newStreak))
          return newStreak
        })

        // Remove item from engine's backpack
        if (engineRef.current) {
          engineRef.current.removeItemFromBackpack(item.id)
        }

        return { correct: true, bonusScore, coinReward }
      } else {
        // Incorrect sorting
        setCurrentStreak(0)

        // Still remove contaminated item so player cannot spam it
        if (engineRef.current) {
          engineRef.current.removeItemFromBackpack(item.id)
        }

        return { correct: false, expected: item.category }
      }
    },
    []
  )

  // =========================================================================
  // RESET / RESTART HANDLER
  // =========================================================================

  const handlePlayAgain = () => {
    setTimeRemaining(60)
    setScore(0)
    setCoinsEarned(0)
    setLitterCollectedCount(0)
    setRecycledCount(0)
    setRecycledByCategory({ plastic: 0, metal: 0, paper: 0 })
    setCurrentStreak(0)
    setBestSortingStreak(0)
    setBackpack([])
    setIsGameOver(false)
    setIsPaused(false)
    setIsSortingOpen(false)
    setRoundSummary(null)

    // Reset duplicate-reward protection for the new shift
    sessionRecordedRef.current = false
    sessionIdRef.current = `session_${Date.now()}`

    if (engineRef.current) {
      engineRef.current.resetGameState()
      engineRef.current.resume()
    }
  }

  const togglePause = () => {
    if (isGameOver) return
    setIsPaused((prev) => !prev)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#B8F34A]/30 bg-gradient-to-b from-[#08291C] via-[#0D3524] to-[#041A12] shadow-[0_0_50px_rgba(184,243,74,0.15)] select-none">
      {/* ===================================================================
          GAME TOP CONTROL & HUD TOOLBAR
          =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-6 py-3 bg-[#041A12]/95 border-b border-[#39B86B]/25 backdrop-blur-md z-20 relative">
        {/* Left: Return to Lobby + Shift Countdown Timer */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/30 hover:border-[#B8F34A]/50 text-xs font-mono font-medium text-[#F3F7EF] transition-all hover:scale-105 active:scale-95 group"
            title="Return to Arcade Lobby"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B8F34A] transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Lobby</span>
          </button>

          {/* 60s Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-colors ${
              timeRemaining <= 10
                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                : timeRemaining <= 25
                ? 'bg-[#FACC15]/15 border-[#FACC15]/40 text-[#FACC15]'
                : 'bg-[#041A12] border-[#39B86B]/40 text-[#B8F34A]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Center: Live Score, Eco Coins & Bag Capacity HUD */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          {/* Current Score */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#08291C]/90 border border-[#39B86B]/25 text-[#F3F7EF]">
            <Trophy className="w-3.5 h-3.5 text-[#B8F34A]" />
            <span className="font-bold">{score.toLocaleString()}</span>
            <span className="text-[10px] text-[#A4B6A8] hidden sm:inline">PTS</span>
          </div>

          {/* Eco Coins */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#08291C]/90 border border-[#FACC15]/30 text-[#FACC15]">
            <Coins className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold">+{coinsEarned}</span>
          </div>

          {/* Backpack Capacity (Max 5) */}
          <div
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-colors ${
              backpack.length >= 5
                ? 'bg-red-500/20 border-red-500/50 text-red-300 font-bold'
                : 'bg-[#08291C]/90 border-[#39B86B]/25 text-[#F3F7EF]'
            }`}
          >
            <Package
              className={`w-3.5 h-3.5 ${
                backpack.length >= 5 ? 'text-red-400' : 'text-[#39B86B]'
              }`}
            />
            <span>{backpack.length}/5</span>
          </div>

          {/* Sorting Streak Pill */}
          {currentStreak > 0 && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FACC15]/15 border border-[#FACC15]/40 text-[#FACC15] font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{currentStreak} Streak</span>
            </div>
          )}
        </div>

        {/* Right: Pause Control & Suit Indicator */}
        <div className="flex items-center gap-2">
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#08291C]/70 border border-[#39B86B]/20 text-xs font-mono text-[#A4B6A8]">
            <Shield
              className="w-3.5 h-3.5"
              style={{ color: activeSkinData?.color || '#39B86B' }}
            />
            <span className="text-[#F3F7EF] truncate max-w-[100px]">
              {activeSkinData?.name || 'Forest Ranger'}
            </span>
          </div>

          {/* Touch Controls Toggle Button */}
          <button
            type="button"
            onClick={() => setTouchOverride((prev) => (prev === null ? !hasTouchCapability : !prev))}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              showVirtualControls
                ? 'bg-[#B8F34A]/20 border border-[#B8F34A]/50 text-[#B8F34A]'
                : 'bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/30 text-[#A4B6A8]'
            }`}
            title="Toggle On-Screen Virtual Touch Controls"
            aria-label="Toggle Virtual Controls"
            aria-pressed={showVirtualControls}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Touch</span>
          </button>

          <button
            type="button"
            onClick={togglePause}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              isPaused
                ? 'bg-[#B8F34A] text-[#041A12] shadow-[0_0_15px_rgba(184,243,74,0.4)]'
                : 'bg-[#08291C] hover:bg-[#0D3524] text-[#F3F7EF] border border-[#39B86B]/30 hover:border-[#B8F34A]/50'
            }`}
            title="Toggle Pause (Press P)"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pause</span>
              </>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-[#041A12]/40 text-[#A4B6A8]">
              P
            </kbd>
          </button>
        </div>
      </div>

      {/* ===================================================================
          CANVAS GAME WORLD VIEWPORT
          =================================================================== */}
      <div className="relative">
        <GameCanvas
          activeSkinData={activeSkinData}
          isPaused={isPaused || isSortingOpen || isGameOver}
          onEngineReady={handleEngineReady}
          onStateChange={handleStateChange}
          onItemCollected={handleItemCollected}
          onOpenRecycling={handleOpenRecycling}
          onBagFull={handleBagFull}
        />

        {/* Responsive Mobile / Tablet Touch Controls */}
        {showVirtualControls && !isPaused && !isSortingOpen && !isGameOver && (
          <VirtualControls
            onDirectionChange={handleVirtualDirection}
            onInteract={handleVirtualInteract}
            nearbyLitter={gameState.nearbyLitter}
            nearbyBin={gameState.nearbyBin}
            isBagFull={backpack.length >= 5}
            isPaused={isPaused}
            isGameOver={isGameOver}
          />
        )}

        {/* Dynamic Bag Full Toast Warning */}
        <AnimatePresence>
          {bagFullToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-red-950/90 border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.35)] backdrop-blur-md flex items-center gap-2 text-xs font-mono text-red-200"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Backpack is Full (5/5)! Visit a Recycling Station to empty.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IN-GAME PAUSE OVERLAY MODAL */}
        <AnimatePresence>
          {isPaused && !isGameOver && !isSortingOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-[#041A12]/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0D3524] to-[#041A12] border border-[#B8F34A]/40 shadow-[0_0_40px_rgba(184,243,74,0.2)] text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#B8F34A]/15 text-[#B8F34A] flex items-center justify-center mx-auto mb-4 border border-[#B8F34A]/30">
                  <Pause className="w-6 h-6" />
                </div>

                <h3 className="font-heading text-2xl font-black text-[#F3F7EF] tracking-tight mb-2">
                  SHIFT PAUSED
                </h3>

                <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed mb-6">
                  Shift timer and litter movements are suspended. Take a breather, ranger!
                </p>

                {/* Quick Controls Reminder */}
                <div className="p-3.5 rounded-2xl bg-[#041A12]/80 border border-[#39B86B]/25 text-left text-xs font-mono space-y-2 mb-6">
                  <div className="flex items-center justify-between text-[#A4B6A8]">
                    <span>Movement:</span>
                    <span className="text-[#F3F7EF] font-bold">WASD / Arrow Keys</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A4B6A8]">
                    <span>Collect / Recycle:</span>
                    <span className="text-[#B8F34A] font-bold">E or Space</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A4B6A8]">
                    <span>Time Remaining:</span>
                    <span className="text-[#F3F7EF] font-bold">{formatTime(timeRemaining)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPaused(false)}
                    className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] font-mono font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(184,243,74,0.35)] transition-all"
                  >
                    Resume Shift
                  </button>
                  <button
                    type="button"
                    onClick={onExit}
                    className="w-full py-3 px-5 rounded-xl bg-[#08291C] hover:bg-[#0D3524] text-[#F3F7EF] border border-[#39B86B]/30 font-mono text-xs sm:text-sm transition-all"
                  >
                    Exit to Lobby
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===================================================================
          BOTTOM HUD / CONTROLS & INTERACTION STATUS BAR
          =================================================================== */}
      <div className="px-3 sm:px-6 py-2.5 bg-[#041A12]/95 border-t border-[#39B86B]/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#A4B6A8]">
        {/* Controls Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          {showVirtualControls ? (
            <div className="flex items-center gap-2 text-[#B8F34A]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Thumbpad (Left) & Action Button (Right) Active • Desktop Keys Supported</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>Move:</span>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[#08291C] border border-[#39B86B]/30 text-[#F3F7EF] text-[11px] font-bold">
                  WASD
                </kbd>
                <span className="text-[10px] text-[#A4B6A8]">/</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#08291C] border border-[#39B86B]/30 text-[#F3F7EF] text-[11px] font-bold">
                  Arrows
                </kbd>
              </div>

              <span className="mx-1 text-[#39B86B]/40">•</span>

              <div className="flex items-center gap-1">
                <span>Action:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#08291C] border border-[#B8F34A]/40 text-[#B8F34A] text-[11px] font-bold">
                  E
                </kbd>
                <span className="text-[10px] text-[#A4B6A8]">or</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#08291C] border border-[#B8F34A]/40 text-[#B8F34A] text-[11px] font-bold">
                  Space
                </kbd>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Context Status (Nearby Litter or Station) */}
        <div className="flex items-center gap-3">
          {gameState.nearbyLitter && (
            <span className="text-[#B8F34A] font-bold flex items-center gap-1.5 animate-pulse">
              <span>● In Range: {gameState.nearbyLitter.name}</span>
            </span>
          )}

          {gameState.nearbyBin && !gameState.nearbyLitter && (
            <span
              className="font-bold flex items-center gap-1.5 animate-pulse"
              style={{ color: gameState.nearbyBin.color }}
            >
              <span>● At {gameState.nearbyBin.name} (Press E to Recycle)</span>
            </span>
          )}

          {!gameState.nearbyLitter && !gameState.nearbyBin && (
            <div className="flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-[#39B86B]" />
              <span>Scouring Clearing...</span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================
          CIRCULAR RECYCLING MODAL
          =================================================================== */}
      <RecyclingModal
        isOpen={isSortingOpen}
        backpack={backpack}
        activeBin={activeBin}
        wasteCategories={wasteCategories}
        recyclingBins={recyclingBins}
        currentStreak={currentStreak}
        onSortItem={handleSortItem}
        onClose={() => setIsSortingOpen(false)}
      />

      {/* ===================================================================
          SHIFT SUMMARY MODAL (ROUND COMPLETE / GAME OVER)
          =================================================================== */}
      <ShiftSummaryModal
        isOpen={isGameOver}
        summary={roundSummary}
        onPlayAgain={handlePlayAgain}
        onExit={onExit}
        onOpenShop={() => {
          if (typeof onExit === 'function') onExit()
          if (typeof onOpenShop === 'function') onOpenShop()
        }}
      />
    </div>
  )
}
