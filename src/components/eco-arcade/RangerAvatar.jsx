import { useEffect, useRef } from 'react'
import { drawRangerCharacter } from '../../utils/rangerRenderer'

/**
 * ECOVERSE ECO COLLECTOR — RANGER AVATAR (CANVAS 2D PREVIEW)
 *
 * Renders an animated or static preview of any Ranger Suit directly via Canvas 2D.
 * Guaranteed 1:1 visual match with in-game sprites.
 */
export default function RangerAvatar({
  skin,
  size = 96,
  scale = 2.4,
  facing = 'down',
  animate = true,
  backpackCount = 0,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(size * dpr)
    canvas.height = Math.floor(size * dpr)

    let rafId = null
    let startTime = performance.now()

    const render = (time) => {
      const elapsed = (time - startTime) / 1000
      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)

      drawRangerCharacter(ctx, {
        x: size / 2,
        y: size / 2 + 10,
        scale,
        skinId: skin?.id || 'ranger_forest',
        suitColor: skin?.color || '#39B86B',
        accentColor: skin?.accentColor || '#B8F34A',
        facing,
        isMoving: false,
        idleTime: animate ? elapsed * 2.5 : 0,
        walkCycle: 0,
        backpackCount,
      })

      ctx.restore()

      if (animate) {
        rafId = requestAnimationFrame(render)
      }
    }

    if (animate) {
      rafId = requestAnimationFrame(render)
    } else {
      render(performance.now())
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [skin, size, scale, facing, animate, backpackCount])

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block pointer-events-none select-none"
        aria-hidden="true"
      />
    </div>
  )
}
