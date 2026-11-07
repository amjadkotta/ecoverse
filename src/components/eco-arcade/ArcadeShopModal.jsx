import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Coins,
  Check,
  CheckCircle2,
  Lock,
  X,
  Shield,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react'
import RangerAvatar from './RangerAvatar'

/**
 * ECOVERSE ECO ARCADE — COSMETIC RANGER WARDROBE & SHOP (PHASE 6)
 *
 * Full-featured accessible cosmetic store for unlockable ranger bio-suits:
 * - Live animated 2D procedural Canvas character preview for every suit
 * - Clear visual states: Equipped, Owned (Equippable), Locked (Purchasable)
 * - Atomic coin purchase with instant equip and balance synchronization
 * - Insufficient balance guard with required-coins calculation
 * - Fully responsive modal layout with keyboard (ESC) dismissal & ARIA dialog semantics
 */
export default function ArcadeShopModal({
  isOpen,
  onClose,
  arcadeCoins = 0,
  unlockedCosmetics = [],
  activeSkin = 'ranger_forest',
  cosmeticsCatalogue = [],
  onPurchaseSkin,
  onSetActiveSkin,
}) {
  const [purchaseFeedback, setPurchaseFeedback] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleClose = useCallback(() => {
    setPurchaseFeedback(null)
    setErrorMessage(null)
    onClose()
  }, [onClose])

  // ESC key handler for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const handlePurchase = (suit) => {
    setErrorMessage(null)
    if (arcadeCoins < suit.cost) {
      setErrorMessage(`Insufficient Eco Coins! You need ${suit.cost - arcadeCoins} more coins.`)
      return
    }

    if (typeof onPurchaseSkin === 'function') {
      const result = onPurchaseSkin(suit.id)
      if (result?.success) {
        setPurchaseFeedback({
          skinId: suit.id,
          name: suit.name,
          cost: suit.cost,
        })
        // Clear success notification after 3.5s
        setTimeout(() => setPurchaseFeedback(null), 3500)
      } else {
        setErrorMessage(
          result?.reason === 'INSUFFICIENT_COINS'
            ? 'Insufficient Eco Coins for this suit.'
            : result?.reason === 'ALREADY_UNLOCKED'
              ? 'Suit is already unlocked.'
              : 'Purchase could not be completed.'
        )
      }
    }
  }

  const handleEquip = (suitId) => {
    setErrorMessage(null)
    if (typeof onSetActiveSkin === 'function') {
      onSetActiveSkin(suitId)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#041A12]/85 backdrop-blur-md">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="arcade-shop-title"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#0D3524] via-[#08291C] to-[#041A12] border border-[#B8F34A]/40 shadow-[0_0_60px_rgba(184,243,74,0.25)] text-[#F3F7EF] overflow-hidden"
        >
          {/* ===================================================================
              SHOP HEADER BAR
              =================================================================== */}
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-[#39B86B]/20 bg-[#041A12]/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B8F34A]/15 text-[#B8F34A] flex items-center justify-center border border-[#B8F34A]/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="arcade-shop-title"
                  className="font-heading text-xl sm:text-2xl font-black text-[#F3F7EF] tracking-tight"
                >
                  Ranger Wardrobe & Shop
                </h3>
                <p className="text-xs text-[#A4B6A8]">
                  Spend Eco Coins earned from recycling to equip specialized bio-suits
                </p>
              </div>
            </div>

            {/* Right: Coin Balance & Close Button */}
            <div className="flex items-center gap-3">
              {/* Live Eco Coin Balance */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#041A12] border border-[#FACC15]/40 text-[#FACC15] font-mono text-xs sm:text-sm">
                <Coins className="w-4 h-4 fill-current text-[#FACC15]" />
                <span className="font-bold">{arcadeCoins.toLocaleString()}</span>
                <span className="text-[10px] text-[#A4B6A8] hidden sm:inline">Coins</span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="w-9 h-9 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/30 hover:border-[#B8F34A]/50 text-[#A4B6A8] hover:text-[#F3F7EF] flex items-center justify-center transition-colors"
                aria-label="Close Wardrobe"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ===================================================================
              ALERTS & CONFIRMATION BANNERS
              =================================================================== */}
          <AnimatePresence>
            {purchaseFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-3 bg-[#B8F34A]/20 border-b border-[#B8F34A]/50 text-[#B8F34A] flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B8F34A] shrink-0" />
                  <span>
                    Successfully unlocked and equipped <strong>{purchaseFeedback.name}</strong> (-{purchaseFeedback.cost} Coins)!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPurchaseFeedback(null)}
                  className="text-xs hover:underline text-[#B8F34A]"
                >
                  Dismiss
                </button>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-3 bg-red-950/80 border-b border-red-500/50 text-red-200 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-xs hover:underline text-red-300"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===================================================================
              SUITS CATALOGUE GRID (SCROLLABLE BODY)
              =================================================================== */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cosmeticsCatalogue.map((suit) => {
                const isOwned = unlockedCosmetics.includes(suit.id)
                const isEquipped = activeSkin === suit.id
                const canAfford = arcadeCoins >= suit.cost
                const missingCoins = suit.cost - arcadeCoins

                return (
                  <div
                    key={suit.id}
                    className={`relative rounded-2xl p-4 flex flex-col justify-between border transition-all duration-300 ${
                      isEquipped
                        ? 'bg-[#08291C] border-[#B8F34A] shadow-[0_0_25px_rgba(184,243,74,0.2)]'
                        : isOwned
                          ? 'bg-[#08291C]/75 border-[#39B86B]/35 hover:border-[#39B86B]/70'
                          : 'bg-[#041A12]/80 border-[#39B86B]/20 hover:border-[#39B86B]/40'
                    }`}
                  >
                    {/* Top Status & Rarity Row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold"
                        style={{
                          backgroundColor: `${suit.color}15`,
                          borderColor: `${suit.color}50`,
                          color: suit.color,
                        }}
                      >
                        {suit.rarity}
                      </span>

                      {isEquipped ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#B8F34A]">
                          <Check className="w-3.5 h-3.5" />
                          <span>EQUIPPED</span>
                        </span>
                      ) : isOwned ? (
                        <span className="text-[11px] font-mono text-[#39B86B] font-bold">
                          OWNED
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#FACC15]">
                          <Coins className="w-3.5 h-3.5 fill-current" />
                          <span>{suit.cost}</span>
                        </div>
                      )}
                    </div>

                    {/* Animated Ranger Canvas Avatar Display */}
                    <div className="flex items-center justify-center py-2 mb-3 bg-[#041A12]/60 rounded-xl border border-[#39B86B]/15 relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none blur-xl rounded-full"
                        style={{ backgroundColor: suit.color }}
                      />
                      <RangerAvatar skin={suit} size={100} scale={2.5} animate={true} />
                    </div>

                    {/* Suit Identity Info */}
                    <div className="space-y-1 mb-4 flex-1">
                      <h4 className="font-heading font-black text-lg text-[#F3F7EF] tracking-tight">
                        {suit.name}
                      </h4>
                      <p className="text-xs font-mono text-[#B8F34A]">{suit.tagline}</p>
                      <p className="text-xs text-[#A4B6A8] leading-relaxed pt-1">
                        {suit.description}
                      </p>
                    </div>

                    {/* Action Button: Equipped / Equip / Purchase */}
                    <div>
                      {isEquipped ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-[#B8F34A]/20 border border-[#B8F34A]/50 text-[#B8F34A] font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-default"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Currently Wearing</span>
                        </button>
                      ) : isOwned ? (
                        <button
                          type="button"
                          onClick={() => handleEquip(suit.id)}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/40 hover:border-[#B8F34A]/60 text-[#F3F7EF] hover:text-[#B8F34A] font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Equip Suit</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePurchase(suit)}
                          disabled={!canAfford}
                          className={`w-full py-2.5 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                            canAfford
                              ? 'bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] shadow-[0_0_15px_rgba(184,243,74,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                              : 'bg-[#041A12] border border-red-500/30 text-[#A4B6A8] cursor-not-allowed opacity-75'
                          }`}
                          title={
                            canAfford
                              ? `Unlock ${suit.name} for ${suit.cost} Eco Coins`
                              : `Need ${missingCoins} more Eco Coins`
                          }
                        >
                          {canAfford ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Unlock ({suit.cost} Coins)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-red-400" />
                              <span>Need {missingCoins} More</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ===================================================================
              SHOP FOOTER: PROGRESSION REMINDER & CLOSE
              =================================================================== */}
          <div className="p-4 sm:p-5 border-t border-[#39B86B]/20 bg-[#041A12]/95 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A4B6A8] shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F34A] shrink-0" />
              <span>
                Suits modify your visual appearance in the glade and have identical speed and backpack capacity.
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#08291C] hover:bg-[#0D3524] border border-[#39B86B]/30 text-[#F3F7EF] font-mono text-xs transition-colors shrink-0"
            >
              Back to Glade
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
