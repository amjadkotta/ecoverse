import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Gamepad2,
  Trophy,
  Coins,
  Recycle,
  Play,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react'
import useEcoArcade from '../../hooks/useEcoArcade'
import ArcadeLobby from './ArcadeLobby'
import GameContainer from './GameContainer'
import ArcadeShopModal from './ArcadeShopModal'

export default function EcoArcade() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const {
    arcadeCoins,
    highScore,
    totalGamesPlayed,
    totalLitterCollected,
    totalLitterRecycled,
    unlockedCosmetics,
    activeSkin,
    activeSkinData,
    wasteCategories,
    recyclingBins,
    cosmeticsCatalogue,
    purchaseSkin,
    setActiveSkin,
    recordGameSession,
    resetArcade,
  } = useEcoArcade()

  const hasProgress = arcadeCoins > 0 || highScore > 0 || totalGamesPlayed > 0

  return (
    <section
      id="eco-arcade"
      className="scroll-mt-20 py-28 sm:py-36 relative bg-[#041A12] border-t border-[#39B86B]/15 overflow-hidden text-[#F3F7EF]"
    >
      {/* Background Ambient Lighting Blobs */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-48 w-[600px] h-[600px] bg-[#39B86B]/10 rounded-full blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -left-48 w-[650px] h-[650px] bg-[#B8F34A]/8 rounded-full blur-[190px] pointer-events-none"
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
            <Gamepad2 className="w-3.5 h-3.5 text-[#B8F34A]" />
            <span>ECOVERSE ECO ARCADE</span>
          </div>

          {/* Main Heading */}
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#F3F7EF] leading-[1.08] mb-6">
            PLAY FOR THE PLANET.{' '}
            <span className="text-gradient-accent block sm:inline">
              CLEANUP IN ACTION.
            </span>
          </h2>

          {/* Narrative Description */}
          <p className="text-base sm:text-xl text-[#F3F7EF]/90 font-normal leading-relaxed max-w-3xl">
            Transform ecological knowledge into real-time sorting agility. Scour the forest glade,
            gather scattered waste, master precision recycling sorting, and earn Eco Coins to
            unlock upgraded ranger bio-suits.
          </p>
        </motion.div>

        {/* ===================================================================
            ARCADE TOP METRIC TILES
            =================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Tile 1: Eco Coins Balance */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#FACC15]/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
                Arcade Currency
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#FACC15]/15 text-[#FACC15] flex items-center justify-center">
                <Coins className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-3xl sm:text-4xl text-[#FACC15]">
                  {arcadeCoins.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-[#A4B6A8]">COINS</span>
              </div>
              <p className="text-xs text-[#A4B6A8]">
                Earned from cleanup sorting
              </p>
            </div>
          </div>

          {/* Tile 2: High Score */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#B8F34A]/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
                Personal Record
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#B8F34A]/15 text-[#B8F34A] flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-3xl sm:text-4xl text-[#F3F7EF]">
                  {highScore.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-[#A4B6A8]">PTS</span>
              </div>
              <p className="text-xs text-[#A4B6A8]">
                Highest 60-second score
              </p>
            </div>
          </div>

          {/* Tile 3: Games Played */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#39B86B]/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
                Shifts Completed
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#39B86B]/20 text-[#39B86B] flex items-center justify-center">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-3xl sm:text-4xl text-[#F3F7EF]">
                  {totalGamesPlayed}
                </span>
                <span className="text-xs font-mono text-[#A4B6A8]">ROUNDS</span>
              </div>
              <p className="text-xs text-[#A4B6A8]">
                Forest cleanup runs
              </p>
            </div>
          </div>

          {/* Tile 4: Total Recycled Items */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#08291C]/70 border border-[#39B86B]/25 hover:border-[#38BDF8]/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-[#A4B6A8] tracking-wider">
                Waste Diverted
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
                <Recycle className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-black text-3xl sm:text-4xl text-[#F3F7EF]">
                  {totalLitterRecycled}
                </span>
                <span className="text-xs font-mono text-[#A4B6A8]">ITEMS</span>
              </div>
              <p className="text-xs text-[#A4B6A8]">
                Sorted into circular bins
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================
            ARCADE VIEWPORT: LOBBY OR ACTIVE CANVAS GAME
            =================================================================== */}
        {isPlaying ? (
          <GameContainer
            activeSkinData={activeSkinData}
            wasteCategories={wasteCategories}
            recyclingBins={recyclingBins}
            recordGameSession={recordGameSession}
            onExit={() => setIsPlaying(false)}
            onOpenShop={() => setIsShopOpen(true)}
          />
        ) : (
          <ArcadeLobby
            arcadeCoins={arcadeCoins}
            highScore={highScore}
            totalGamesPlayed={totalGamesPlayed}
            totalLitterCollected={totalLitterCollected}
            totalLitterRecycled={totalLitterRecycled}
            activeSkinData={activeSkinData}
            unlockedCosmetics={unlockedCosmetics}
            cosmeticsCatalogue={cosmeticsCatalogue}
            wasteCategories={wasteCategories}
            recyclingBins={recyclingBins}
            onStartGame={() => setIsPlaying(true)}
            onOpenShop={() => setIsShopOpen(true)}
          />
        )}

        {/* ===================================================================
            COSMETIC RANGER WARDROBE & SUIT SHOP MODAL
            =================================================================== */}
        <ArcadeShopModal
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
          arcadeCoins={arcadeCoins}
          unlockedCosmetics={unlockedCosmetics}
          activeSkin={activeSkin}
          cosmeticsCatalogue={cosmeticsCatalogue}
          onPurchaseSkin={purchaseSkin}
          onSetActiveSkin={setActiveSkin}
        />

        {/* ===================================================================
            SECTION FOOTER: PRIVACY, ECONOMY ISOLATION & RESET
            =================================================================== */}
        <div className="pt-8 border-t border-[#39B86B]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#A4B6A8]">
          <div className="flex items-start gap-3 max-w-2xl">
            <ShieldCheck className="w-4 h-4 text-[#39B86B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-[#F3F7EF]">Isolated Arcade Economy: </span>
              Eco Coins are earned exclusively through gameplay and saved in your personal browser
              storage. They cannot be exchanged for Eco Journey points, preserving the integrity
              of genuine sustainability habit tracking.
            </p>
          </div>

          {/* Wardrobe & Reset Controls */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => setIsShopOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#FACC15]/40 hover:border-[#FACC15]/70 text-[#FACC15] hover:bg-[#FACC15]/10 font-mono text-xs transition-colors"
              title="Open Ranger Wardrobe & Shop"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Wardrobe ({unlockedCosmetics.length}/5)</span>
            </button>

            {hasProgress && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Reset all Eco Arcade local progress? This will reset high scores, coins, and cosmetic unlocks.'
                    )
                  ) {
                    resetArcade()
                  }
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#39B86B]/30 hover:border-red-400/40 text-[#A4B6A8] hover:text-red-300 hover:bg-red-500/10 font-mono text-xs transition-colors"
                title="Reset Eco Arcade progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Arcade</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
