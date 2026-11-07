import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Sparkles,
  Hand,
  Recycle,
  Package,
} from 'lucide-react'

/**
 * ECOVERSE ECO COLLECTOR — VIRTUAL TOUCH CONTROLS (PHASE 5)
 *
 * Ergonomic, responsive on-screen controls for mobile and tablet touchscreens:
 * - Analog/8-directional floating thumb joystick & D-Pad in the lower-left area
 * - Prominent context-aware action/interaction button in the lower-right area
 * - Robust Pointer Events handling (pointerdown, pointermove, pointerup, pointercancel)
 * - Automatic pointer capture & lost-capture safety (never leaves directions stuck)
 * - Safe area inset padding and non-scrolling touch-action: none
 */
export default function VirtualControls({
  onDirectionChange,
  onInteract,
  nearbyLitter,
  nearbyBin,
  isBagFull,
  isPaused,
  isGameOver,
}) {
  const dpadBaseRef = useRef(null)
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 })
  const [isDpadActive, setIsDpadActive] = useState(false)
  const [isActionActive, setIsActionActive] = useState(false)
  const activePointerIdRef = useRef(null)

  const onDirectionChangeRef = useRef(onDirectionChange)
  const onInteractRef = useRef(onInteract)

  useEffect(() => {
    onDirectionChangeRef.current = onDirectionChange
  }, [onDirectionChange])

  useEffect(() => {
    onInteractRef.current = onInteract
  }, [onInteract])

  // Reset virtual direction safely
  const resetDirection = useCallback(() => {
    setThumbPos({ x: 0, y: 0 })
    setIsDpadActive(false)
    activePointerIdRef.current = null
    if (onDirectionChangeRef.current) {
      onDirectionChangeRef.current({ x: 0, y: 0 })
    }
  }, [])

  // Safely release stuck pointer on window blur or unmount
  useEffect(() => {
    const handleBlur = () => resetDirection()
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('blur', handleBlur)
      resetDirection()
    }
  }, [resetDirection])

  // =========================================================================
  // D-PAD / JOYSTICK POINTER HANDLERS
  // =========================================================================

  const handleDpadPointerDown = (e) => {
    if (isPaused || isGameOver) return
    e.preventDefault()

    const base = dpadBaseRef.current
    if (!base) return

    base.setPointerCapture(e.pointerId)
    activePointerIdRef.current = e.pointerId
    setIsDpadActive(true)

    updateDpadVector(e.clientX, e.clientY)
  }

  const handleDpadPointerMove = (e) => {
    if (!isDpadActive || e.pointerId !== activePointerIdRef.current) return
    e.preventDefault()
    updateDpadVector(e.clientX, e.clientY)
  }

  const handleDpadPointerUp = (e) => {
    if (e.pointerId === activePointerIdRef.current) {
      e.preventDefault()
      resetDirection()
    }
  }

  const handleDpadPointerCancel = () => {
    resetDirection()
  }

  const updateDpadVector = (clientX, clientY) => {
    const base = dpadBaseRef.current
    if (!base) return

    const rect = base.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rawDx = clientX - centerX
    const rawDy = clientY - centerY

    const maxRadius = rect.width * 0.42 // Movement radius
    const distance = Math.hypot(rawDx, rawDy)

    let normX = 0
    let normY = 0

    if (distance > 0) {
      const clampedDist = Math.min(distance, maxRadius)
      normX = (rawDx / distance) * (clampedDist / maxRadius)
      normY = (rawDy / distance) * (clampedDist / maxRadius)

      // Visual thumb displacement in pixels
      const visualX = (rawDx / distance) * clampedDist
      const visualY = (rawDy / distance) * clampedDist
      setThumbPos({ x: visualX, y: visualY })
    } else {
      setThumbPos({ x: 0, y: 0 })
    }

    if (onDirectionChangeRef.current) {
      onDirectionChangeRef.current({ x: normX, y: normY })
    }
  }

  // =========================================================================
  // ACTION / INTERACTION BUTTON HANDLERS
  // =========================================================================

  const handleActionPointerDown = (e) => {
    if (isPaused || isGameOver) return
    e.preventDefault()
    setIsActionActive(true)

    if (onInteractRef.current) {
      onInteractRef.current()
    }
  }

  const handleActionPointerUp = (e) => {
    e.preventDefault()
    setIsActionActive(false)
  }

  const handleActionPointerCancel = () => {
    setIsActionActive(false)
  }

  // Determine dynamic action button label and styling based on context
  let actionLabel = 'COLLECT'
  let actionColor = '#B8F34A'
  let ActionIcon = Hand

  if (nearbyBin) {
    actionLabel = 'RECYCLE'
    actionColor = nearbyBin.color || '#38BDF8'
    ActionIcon = Recycle
  } else if (nearbyLitter) {
    actionLabel = isBagFull ? 'FULL' : 'COLLECT'
    actionColor = isBagFull ? '#F87171' : '#B8F34A'
    ActionIcon = isBagFull ? Package : Sparkles
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 flex justify-between items-end p-4 sm:p-6 select-none"
      style={{
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
      }}
      aria-label="Mobile Game Controls"
    >
      {/* ===================================================================
          LOWER-LEFT: VIRTUAL D-PAD / THUMB JOYSTICK
          =================================================================== */}
      <div className="pointer-events-auto touch-none select-none flex flex-col items-center">
        <div
          ref={dpadBaseRef}
          onPointerDown={handleDpadPointerDown}
          onPointerMove={handleDpadPointerMove}
          onPointerUp={handleDpadPointerUp}
          onPointerCancel={handleDpadPointerCancel}
          onLostPointerCapture={handleDpadPointerCancel}
          role="region"
          aria-label="Directional thumb pad"
          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border flex items-center justify-center transition-all ${
            isDpadActive
              ? 'bg-[#041A12]/80 border-[#B8F34A]/60 shadow-[0_0_25px_rgba(184,243,74,0.3)]'
              : 'bg-[#041A12]/50 border-[#39B86B]/30 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Directional Guides / Crosshairs */}
          <div className="absolute inset-x-0 top-2 text-center text-[10px] font-mono font-bold text-[#A4B6A8]/70 pointer-events-none">
            ▲
          </div>
          <div className="absolute inset-x-0 bottom-2 text-center text-[10px] font-mono font-bold text-[#A4B6A8]/70 pointer-events-none">
            ▼
          </div>
          <div className="absolute inset-y-0 left-2.5 flex items-center text-[10px] font-mono font-bold text-[#A4B6A8]/70 pointer-events-none">
            ◄
          </div>
          <div className="absolute inset-y-0 right-2.5 flex items-center text-[10px] font-mono font-bold text-[#A4B6A8]/70 pointer-events-none">
            ►
          </div>

          {/* Center Inner Anchor Ring */}
          <div className="w-10 h-10 rounded-full border border-[#39B86B]/20 pointer-events-none" />

          {/* Draggable Glowing Thumb Nub */}
          <div
            className={`absolute w-12 h-12 rounded-full border flex items-center justify-center pointer-events-none shadow-md transition-transform ${
              isDpadActive
                ? 'bg-[#B8F34A]/30 border-[#B8F34A] scale-105 shadow-[0_0_15px_rgba(184,243,74,0.5)]'
                : 'bg-[#08291C]/80 border-[#39B86B]/50'
            }`}
            style={{
              transform: `translate(${thumbPos.x}px, ${thumbPos.y}px)`,
              transition: isDpadActive ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <div
              className={`w-4 h-4 rounded-full transition-colors ${
                isDpadActive ? 'bg-[#B8F34A]' : 'bg-[#39B86B]'
              }`}
            />
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#A4B6A8] mt-1 tracking-wider uppercase opacity-75">
          Move Ranger
        </span>
      </div>

      {/* ===================================================================
          LOWER-RIGHT: PROMINENT INTERACTION / ACTION BUTTON
          =================================================================== */}
      <div className="pointer-events-auto touch-none select-none flex flex-col items-center">
        <button
          type="button"
          onPointerDown={handleActionPointerDown}
          onPointerUp={handleActionPointerUp}
          onPointerCancel={handleActionPointerCancel}
          aria-label={actionLabel}
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-150 active:scale-90 shadow-xl ${
            isActionActive
              ? 'scale-95 shadow-[0_0_30px_rgba(184,243,74,0.6)]'
              : 'hover:scale-105'
          }`}
          style={{
            backgroundColor: isActionActive ? `${actionColor}33` : 'rgba(4, 26, 18, 0.75)',
            borderColor: actionColor,
            boxShadow: `0 0 20px ${actionColor}40`,
          }}
        >
          <ActionIcon
            className="w-7 h-7 sm:w-8 sm:h-8 transition-transform"
            style={{ color: actionColor }}
          />

          <span
            className="text-[10px] font-mono font-black tracking-wider uppercase mt-0.5"
            style={{ color: actionColor }}
          >
            {actionLabel}
          </span>
        </button>

        <span className="text-[10px] font-mono text-[#A4B6A8] mt-1 tracking-wider uppercase opacity-75">
          [Action]
        </span>
      </div>
    </div>
  )
}
