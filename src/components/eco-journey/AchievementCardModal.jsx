import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Check,
  X,
  AlertCircle,
  FileImage,
  Lock,
} from 'lucide-react'
import {
  generateBadgeCardCanvas,
  generateLevelCardCanvas,
  generateSummaryCardCanvas,
  downloadCanvasAsPng,
} from '../../utils/achievementCanvas'

function AchievementCardModalDialog({
  cardType = 'badge',
  cardData = {},
  onClose,
}) {
  const isLockedBadge = cardType === 'badge' && cardData.badge && !cardData.badge.isUnlocked
  const [isGenerating, setIsGenerating] = useState(!isLockedBadge)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(
    isLockedBadge
      ? 'Locked badges cannot be downloaded as achievements. Complete the required challenges to unlock this honor.'
      : null
  )
  const [isDownloaded, setIsDownloaded] = useState(false)
  const canvasRef = useRef(null)

  // Determine file name
  const fileName = (() => {
    if (cardType === 'badge' && cardData.badge) {
      const safeTitle = (cardData.badge.title || 'Badge').replace(/[^a-zA-Z0-9]/g, '-')
      return `ECOVERSE-Badge-${safeTitle}.png`
    }
    if (cardType === 'level' && cardData.level) {
      const safeTitle = (cardData.level.title || 'Level').replace(/[^a-zA-Z0-9]/g, '-')
      return `ECOVERSE-Level-${cardData.level.level || 1}-${safeTitle}.png`
    }
    return 'ECOVERSE-Eco-Journey-Summary.png'
  })()

  // Generate canvas preview on mount
  useEffect(() => {
    if (isLockedBadge) return

    let isMounted = true

    async function renderCard() {
      try {
        let canvas = null
        if (cardType === 'badge') {
          canvas = await generateBadgeCardCanvas({
            badge: cardData.badge,
            userLevel: cardData.userLevel || {},
            totalPoints: cardData.totalPoints || 0,
            unlockDate: cardData.badge?.unlockedAt || cardData.unlockDate,
          })
        } else if (cardType === 'level') {
          canvas = await generateLevelCardCanvas({
            level: cardData.level,
            totalPoints: cardData.totalPoints || 0,
            streak: cardData.streak || { current: 0, best: 0 },
            date: cardData.date,
          })
        } else {
          // summary
          canvas = await generateSummaryCardCanvas({
            level: cardData.level || {},
            totalPoints: cardData.totalPoints || 0,
            streak: cardData.streak || { current: 0, best: 0 },
            totalCompleted: cardData.totalCompleted || 0,
            unlockedBadgesCount: cardData.unlockedBadgesCount || 0,
            categoryTotals: cardData.categoryTotals || {},
            date: cardData.date,
          })
        }

        if (isMounted && canvas) {
          canvasRef.current = canvas
          const dataUrl = canvas.toDataURL('image/png')
          setPreviewUrl(dataUrl)
        }
      } catch {
        if (isMounted) {
          setError('Unable to render achievement certificate. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsGenerating(false)
        }
      }
    }

    renderCard()

    return () => {
      isMounted = false
    }
  }, [cardType, cardData, isLockedBadge])

  // Handle Download
  const handleDownload = async () => {
    if (!canvasRef.current || isGenerating || isLockedBadge) return

    try {
      await downloadCanvasAsPng(canvasRef.current, fileName)
      setIsDownloaded(true)
      setTimeout(() => setIsDownloaded(false), 3500)
    } catch {
      setError('Download failed. Please check browser permissions and try again.')
    }
  }

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && typeof onClose === 'function') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#041A12]/85 backdrop-blur-md overflow-y-auto">
      {/* Backdrop click */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0"
      />

      {/* Modal Dialog */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-modal-title"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-3xl my-auto p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0D3524] via-[#08291C] to-[#041A12] border border-[#39B86B]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center overflow-hidden"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#39B86B]/20">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#B8F34A]/15 text-[#B8F34A] flex items-center justify-center">
              <FileImage className="w-4 h-4" />
            </div>
            <div>
              <h3 id="achievement-modal-title" className="font-heading text-lg font-bold text-[#F3F7EF] leading-tight">
                {cardType === 'badge'
                  ? 'Badge Certificate Preview'
                  : cardType === 'level'
                  ? 'Level Advancement Certificate'
                  : 'Eco Journey Passport Summary'}
              </h3>
              <span className="text-[11px] font-mono text-[#B8F34A]">
                1200 × 800 HD Canvas PNG
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Preview Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-[#39B86B]/30 bg-[#041A12] shadow-inner min-h-[220px] sm:min-h-[340px] flex items-center justify-center mb-5">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3 p-8">
              <div className="w-10 h-10 border-3 border-[#B8F34A] border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-xs text-[#A4B6A8]">
                Rendering 3D Earth Globe & Certificate...
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 p-8 max-w-md text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/30">
                {isLockedBadge ? <Lock className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <h4 className="font-heading font-bold text-sm text-[#F3F7EF]">
                {isLockedBadge ? 'Badge Not Yet Unlocked' : 'Generation Error'}
              </h4>
              <p className="text-xs text-[#A4B6A8] leading-relaxed">
                {error}
              </p>
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Achievement certificate preview"
              className="w-full h-auto object-contain rounded-xl max-h-[60vh]"
            />
          ) : null}
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs font-mono text-[#A4B6A8] truncate max-w-xs sm:max-w-md text-left">
            File: <strong className="text-[#F3F7EF]">{fileName}</strong>
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#39B86B]/30 text-xs font-mono text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524] transition-colors"
            >
              Close
            </button>

            {!isLockedBadge && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating || !previewUrl}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isDownloaded
                    ? 'bg-[#39B86B] text-[#041A12] shadow-[0_0_20px_rgba(57,184,107,0.4)]'
                    : 'bg-gradient-to-r from-[#B8F34A] to-[#39B86B] hover:from-[#c5f762] hover:to-[#42cb78] text-[#041A12] shadow-[0_0_20px_rgba(184,243,74,0.3)] hover:shadow-[0_0_25px_rgba(184,243,74,0.5)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isDownloaded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Saved to Downloads</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PNG (1200×800)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AchievementCardModal({
  isOpen = false,
  onClose,
  cardType = 'badge',
  cardData = {},
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <AchievementCardModalDialog
          cardType={cardType}
          cardData={cardData}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  )
}
