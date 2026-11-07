import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Trophy,
  Coins,
  Clock,
  Sparkles,
  Recycle,
  X,
  Compass,
  ArrowRight,
  Keyboard,
  Smartphone,
  Target,
  ShoppingBag,
} from 'lucide-react'
import RangerAvatar from './RangerAvatar'

/**
 * ECOVERSE ECO ARCADE — LOBBY & MISSION HQ (PHASE 6)
 *
 * Polished game lobby featuring:
 * - Live animated ranger bio-suit preview with direct Wardrobe & Shop launcher
 * - Real-time statistics: coins balance, high score, total shifts, waste recycled
 * - Dynamic Next Unlock Target progress tracker with percentage bar
 * - Multi-pillar recycling education & circular economy progression guide
 * - Launch controls & accessible mission briefing dialog
 */
export default function ArcadeLobby({
  arcadeCoins = 0,
  highScore = 0,
  totalGamesPlayed = 0,
  totalLitterCollected = 0,
  totalLitterRecycled = 0,
  activeSkinData,
  unlockedCosmetics = [],
  cosmeticsCatalogue = [],
  wasteCategories = {},
  recyclingBins = [],
  onStartGame,
  onOpenShop,
}) {
  const [showBriefingModal, setShowBriefingModal] = useState(false)

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showBriefingModal) {
        setShowBriefingModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showBriefingModal])

  // Compute next unlockable suit in catalogue
  const nextTarget = cosmeticsCatalogue
    .filter((suit) => !unlockedCosmetics.includes(suit.id) && suit.cost > 0)
    .sort((a, b) => a.cost - b.cost)[0]

  const targetProgress = nextTarget
    ? Math.min(100, Math.round((arcadeCoins / nextTarget.cost) * 100))
    : 100

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* ===================================================================
          HERO ARCADE LOBBY VIEWPORT (ILLUSTRATED FOREST & MISSION BOARD)
          =================================================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-[#39B86B]/30 bg-gradient-to-b from-[#08291C] via-[#0D3524] to-[#041A12] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {/* Layered Forest SVG Background Scene */}
        <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 1200 600"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Mountain Silhouettes */}
            <path
              d="M0 380 L180 260 L360 340 L520 220 L720 360 L920 240 L1100 330 L1200 270 L1200 600 L0 600 Z"
              fill="#062217"
            />
            {/* Midground Forest Canopy Layer 1 */}
            <path
              d="M0 430 Q120 370 240 430 T480 410 T720 440 T960 400 T1200 420 L1200 600 L0 600 Z"
              fill="#08291C"
            />
            {/* Midground Trees Silhouettes */}
            <g fill="#0B3021">
              <polygon points="120,440 100,480 140,480" />
              <polygon points="120,420 105,450 135,450" />
              <polygon points="120,400 110,430 130,430" />
              <polygon points="320,430 295,480 345,480" />
              <polygon points="320,405 305,445 335,445" />
              <polygon points="320,380 310,420 330,420" />
              <polygon points="860,420 835,475 885,475" />
              <polygon points="860,395 845,440 875,440" />
              <polygon points="860,370 850,410 870,410" />
              <polygon points="1060,450 1040,490 1080,490" />
              <polygon points="1060,430 1045,465 1075,465" />
            </g>
            {/* Foreground Forest Path / Clearing */}
            <path
              d="M0 500 C300 480 500 520 800 495 C1000 480 1150 510 1200 500 L1200 600 L0 600 Z"
              fill="#0D3524"
              fillOpacity="0.8"
            />
            {/* Luminous Stream / Clearing Water Reflections */}
            <path
              d="M450 550 C600 535 750 545 900 560 L850 600 L500 600 Z"
              fill="#1B5E41"
              fillOpacity="0.3"
            />
          </svg>
        </div>

        {/* Ambient Glowing Fireflies */}
        <div aria-hidden="true" className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-[#B8F34A] blur-[1px] animate-pulse" />
        <div aria-hidden="true" className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-[#39B86B] blur-[1px] animate-pulse delay-700" />
        <div aria-hidden="true" className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-[#B8F34A] blur-[1px] animate-pulse delay-1000" />

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12">
          {/* Top Status Badges Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Game Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#041A12]/80 border border-[#B8F34A]/40 backdrop-blur-md text-xs font-mono font-bold text-[#B8F34A] uppercase tracking-wider shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MINI-GAME 01 • ECO COLLECTOR</span>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Eco Coins */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#041A12]/80 border border-[#FACC15]/30 text-xs font-mono text-[#FACC15]">
                <Coins className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold">{arcadeCoins.toLocaleString()}</span>
                <span className="text-[10px] text-[#A4B6A8]">Coins</span>
              </div>

              {/* High Score */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#041A12]/80 border border-[#B8F34A]/30 text-xs font-mono text-[#B8F34A]">
                <Trophy className="w-3.5 h-3.5" />
                <span className="font-bold">{highScore.toLocaleString()}</span>
                <span className="text-[10px] text-[#A4B6A8]">Best</span>
              </div>

              {/* Total Recycled Items */}
              {totalLitterRecycled > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#041A12]/80 border border-[#38BDF8]/30 text-xs font-mono text-[#38BDF8]">
                  <Recycle className="w-3.5 h-3.5" />
                  <span className="font-bold">{totalLitterRecycled}</span>
                  <span className="text-[10px] text-[#A4B6A8]">Recycled</span>
                </div>
              )}

              {/* Total Plays */}
              {totalGamesPlayed > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#041A12]/80 border border-[#39B86B]/30 text-xs font-mono text-[#39B86B]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-bold">{totalGamesPlayed}</span>
                  <span className="text-[10px] text-[#A4B6A8]">Plays</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Title & Mission Brief */}
          <div className="max-w-2xl space-y-4 mb-8">
            <h3 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-[#F3F7EF] tracking-tight leading-[1.05]">
              ECO COLLECTOR
            </h3>
            <p className="text-base sm:text-lg text-[#F3F7EF]/90 leading-relaxed font-normal">
              The forest sanctuary needs clean hands. Navigate the woodland glade, collect scattered
              bottles, cans, and paper waste, and race against the clock to sort them into the right
              recycling bins!
            </p>
          </div>

          {/* Active Ranger Gear Preview Card & Next Unlock Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 max-w-4xl">
            {/* Left: Active Ranger Equipped Card with Canvas Avatar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#041A12]/85 border border-[#39B86B]/30 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* 2D Canvas Avatar Preview */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border relative overflow-hidden"
                  style={{
                    backgroundColor: `${activeSkinData?.color || '#39B86B'}15`,
                    borderColor: `${activeSkinData?.color || '#39B86B'}50`,
                  }}
                >
                  <RangerAvatar skin={activeSkinData} size={56} scale={2.4} animate={true} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#F3F7EF] truncate">
                      {activeSkinData?.name || 'Forest Ranger'}
                    </span>
                    <span
                      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold"
                      style={{
                        backgroundColor: `${activeSkinData?.color || '#39B86B'}15`,
                        borderColor: `${activeSkinData?.color || '#39B86B'}40`,
                        color: activeSkinData?.color || '#39B86B',
                      }}
                    >
                      {activeSkinData?.rarity || 'Common'}
                    </span>
                  </div>
                  <p className="text-xs text-[#A4B6A8] truncate mt-0.5">
                    {activeSkinData?.tagline || 'Standard wilderness bio-suit'}
                  </p>
                </div>
              </div>

              {/* Wardrobe Quick Button */}
              {typeof onOpenShop === 'function' && (
                <button
                  type="button"
                  onClick={onOpenShop}
                  className="px-3.5 py-2 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/30 hover:border-[#B8F34A]/50 text-xs font-mono text-[#B8F34A] flex items-center gap-1.5 transition-all shrink-0"
                  title="Open Wardrobe & Shop"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Wardrobe</span>
                </button>
              )}
            </div>

            {/* Right: Next Unlock Target Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#041A12]/85 border border-[#39B86B]/30 backdrop-blur-md flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A4B6A8]">
                  {nextTarget ? 'Next Suit Target' : 'Master Wardrobe'}
                </span>
                {nextTarget ? (
                  <div className="flex items-center gap-1 text-xs font-mono text-[#FACC15]">
                    <Coins className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {arcadeCoins} / {nextTarget.cost}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-[#B8F34A] font-bold">
                    All 5 Suits Owned ★
                  </span>
                )}
              </div>

              {nextTarget ? (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="font-bold text-[#F3F7EF]">{nextTarget.name}</span>
                    <span className="text-[#A4B6A8]">{targetProgress}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#08291C] border border-[#39B86B]/25 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#B8F34A] to-[#39B86B] transition-all duration-500 rounded-full"
                      style={{ width: `${targetProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#A4B6A8]">
                  You have unlocked all available field suits! Continue collecting to build your legacy balance.
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] font-mono text-[#A4B6A8] pt-1">
                <span>Total Collected: {totalLitterCollected} Items</span>
                <span>Unlocked: {unlockedCosmetics.length}/5 Suits</span>
              </div>
            </div>
          </div>

          {/* Action Row: Start Cleanup Button, Briefing & Visit Shop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-wrap">
            <button
              type="button"
              onClick={onStartGame}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] px-8 py-4 rounded-2xl font-heading font-black text-base shadow-[0_0_25px_rgba(184,243,74,0.35)] hover:shadow-[0_0_35px_rgba(184,243,74,0.55)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#041A12] text-[#B8F34A] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span>Start Cleanup Shift (60s)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Prominent Visit Suit Shop Button */}
            {typeof onOpenShop === 'function' && (
              <button
                type="button"
                onClick={onOpenShop}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#041A12]/90 hover:bg-[#08291C] border border-[#FACC15]/40 hover:border-[#FACC15]/80 text-xs font-mono font-bold text-[#FACC15] transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Visit Suit Shop</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowBriefingModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#041A12]/80 hover:bg-[#08291C] border border-[#39B86B]/30 hover:border-[#B8F34A]/50 text-xs font-mono font-bold text-[#F3F7EF] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#B8F34A]" />
              <span>Mission Briefing</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================
          HOW PROGRESSION & CIRCULAR SORTING WORKS
          =================================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#B8F34A]" />
            <h4 className="font-heading text-xl sm:text-2xl font-black text-[#F3F7EF] tracking-tight">
              Glade Progression & Sorting Guide
            </h4>
          </div>
          <span className="text-xs font-mono text-[#A4B6A8]">
            Recycling Accuracy = Eco Coins = Bio-Suit Unlocks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Step 1: Collect Litter */}
          <div className="p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/20 hover:border-[#B8F34A]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#B8F34A]/15 text-[#B8F34A] flex items-center justify-center font-mono font-bold text-sm mb-4">
                01
              </div>
              <h5 className="font-heading text-lg font-bold text-[#F3F7EF] mb-2">
                1. Scour the Glade
              </h5>
              <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed">
                Walk across the clearing to find scattered plastic bottles, soda cans, and
                cardboard packaging. Avoid tree trunks and water rocks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#39B86B]/15 text-[11px] font-mono text-[#B8F34A]">
              Capacity: Max 5 items per run
            </div>
          </div>

          {/* Step 2: Navigate to Station */}
          <div className="p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/20 hover:border-[#B8F34A]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#39B86B]/20 text-[#39B86B] flex items-center justify-center font-mono font-bold text-sm mb-4">
                02
              </div>
              <h5 className="font-heading text-lg font-bold text-[#F3F7EF] mb-2">
                2. Approach Stations
              </h5>
              <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed">
                When your backpack is full, return to the southern clearing hub where 3 dedicated
                recycling stations (Plastic, Metal, Paper) process waste.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#39B86B]/15 text-[11px] font-mono text-[#39B86B]">
              Ground Spotlight Aura When In Range
            </div>
          </div>

          {/* Step 3: Sort Accurately */}
          <div className="p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/20 hover:border-[#B8F34A]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FACC15]/15 text-[#FACC15] flex items-center justify-center font-mono font-bold text-sm mb-4">
                03
              </div>
              <h5 className="font-heading text-lg font-bold text-[#F3F7EF] mb-2">
                3. Earn Coins & Unlock Suits
              </h5>
              <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed">
                Deposit items into their corresponding bin. Perfect streaks earn bonus Eco Coins,
                which unlock Solar, River, Neon, and Cyber Botanist suits in the Wardrobe!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#39B86B]/15 text-[11px] font-mono text-[#FACC15]">
              +10 Coins Streak Bonus • 5 Unlockable Suits
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          RECYCLING BIN STATIONS SHOWCASE
          =================================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#08291C]/50 border border-[#39B86B]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-[#F3F7EF]">
              Recycling Streams & Waste Classification
            </h4>
            <p className="text-xs text-[#A4B6A8] mt-0.5">
              Accurate sorting diverts materials into high-grade circular streams.
            </p>
          </div>
          <span className="text-xs font-mono text-[#B8F34A] px-3 py-1 rounded-full bg-[#041A12] border border-[#39B86B]/30 self-start sm:self-auto">
            Zero Contamination Goal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recyclingBins.map((bin) => {
            const cat = wasteCategories[bin.acceptedCategory]
            return (
              <div
                key={bin.id}
                className="p-4 rounded-2xl bg-[#041A12]/80 border flex flex-col justify-between gap-3"
                style={{ borderColor: `${bin.color}40` }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${bin.color}18`,
                        color: bin.color,
                        border: `1px solid ${bin.color}50`,
                      }}
                    >
                      {bin.label}
                    </span>
                    <Recycle className="w-4 h-4" style={{ color: bin.color }} />
                  </div>
                  <h5 className="font-heading text-sm font-bold text-[#F3F7EF]">
                    {bin.name}
                  </h5>
                  <p className="text-xs text-[#A4B6A8] mt-1">
                    {bin.description}
                  </p>
                </div>
                <div
                  className="text-[11px] font-mono pt-2 border-t"
                  style={{ borderColor: `${bin.color}25`, color: bin.color }}
                >
                  {cat?.badgeText || 'Recycle here'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ===================================================================
          MISSION BRIEFING MODAL
          =================================================================== */}
      <AnimatePresence>
        {showBriefingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#041A12]/85 backdrop-blur-md">
            {/* Backdrop click handler */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBriefingModal(false)}
              className="absolute inset-0"
            />

            {/* Modal Dialog Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="briefing-modal-title"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0D3524] via-[#08291C] to-[#041A12] border border-[#B8F34A]/50 shadow-[0_0_40px_rgba(184,243,74,0.25)] text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowBriefingModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524] transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Eyebrow Notification */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8F34A]/15 border border-[#B8F34A]/40 text-xs font-mono font-bold text-[#B8F34A] uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MISSION BRIEFING • ECO COLLECTOR</span>
              </div>

              {/* Title & Status */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3
                  id="briefing-modal-title"
                  className="font-heading text-2xl sm:text-3xl font-black text-[#F3F7EF] tracking-tight"
                >
                  Ranger Field Station
                </h3>
                <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B8F34A]/15 border border-[#B8F34A]/40 text-xs font-mono text-[#B8F34A] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#B8F34A] animate-ping" />
                  <span>READY</span>
                </div>
              </div>

              <p className="text-sm text-[#A4B6A8] leading-relaxed mb-5">
                Review your shift parameters, controls, and active equipment before heading into the glade:
              </p>

              {/* Objective Recap */}
              <div className="p-4 rounded-2xl bg-[#041A12]/80 border border-[#39B86B]/30 mb-5">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-[#B8F34A] font-bold">
                  <Target className="w-4 h-4" />
                  <span>Shift Objective</span>
                </div>
                <p className="text-xs text-[#F3F7EF]/90 leading-relaxed">
                  Scour the forest terrain for scattered litter (plastic, metal, paper). Deposit them into the
                  correct recycling bins before the 60-second timer expires to earn Eco Coins and build sorting streaks.
                </p>
              </div>

              {/* Controls Preview */}
              <div className="space-y-2 mb-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A4B6A8] block">
                  Movement & Interaction Controls
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#041A12]/80 border border-[#39B86B]/25">
                    <div className="text-[#B8F34A] font-bold mb-1 flex items-center gap-1.5">
                      <Keyboard className="w-3.5 h-3.5" />
                      <span>Desktop Keys</span>
                    </div>
                    <p className="text-[#A4B6A8] text-[11px] leading-tight font-sans">
                      WASD or Arrow Keys for movement; Space or E to collect and recycle.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#041A12]/80 border border-[#39B86B]/25">
                    <div className="text-[#39B86B] font-bold mb-1 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile Touch</span>
                    </div>
                    <p className="text-[#A4B6A8] text-[11px] leading-tight font-sans">
                      Floating 8-directional thumbpad (left) and context action button (right).
                    </p>
                  </div>
                </div>
              </div>

              {/* Equipment & Readiness Checklist */}
              <div className="space-y-2.5 mb-5 p-3.5 rounded-2xl bg-[#041A12]/80 border border-[#39B86B]/30 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#A4B6A8]">Active Suit:</span>
                  <span className="text-[#F3F7EF] font-bold">
                    {activeSkinData?.name || 'Forest Ranger'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A4B6A8]">Shift Duration:</span>
                  <span className="text-[#B8F34A] font-bold">60 Seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A4B6A8]">Backpack Limit:</span>
                  <span className="text-[#F3F7EF] font-bold">5 Items Max</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A4B6A8]">Economy Isolation:</span>
                  <span className="text-[#FACC15] font-bold">Safe Browser Storage</span>
                </div>
              </div>

              {/* Dismiss / Launch Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBriefingModal(false)
                    if (onStartGame) onStartGame()
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] font-mono font-bold text-sm shadow-[0_0_20px_rgba(184,243,74,0.35)] transition-all"
                >
                  Enter Forest Glade (Launch Game)
                </button>
                <button
                  type="button"
                  onClick={() => setShowBriefingModal(false)}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/30 text-[#A4B6A8] hover:text-[#F3F7EF] font-mono text-xs transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
