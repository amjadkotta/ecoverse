import { useEffect, useRef } from 'react'
import { EcoCollectorEngine } from '../../utils/ecoCollectorEngine'

export default function GameCanvas({
  activeSkinData,
  isPaused = false,
  onEngineReady,
  onStateChange,
  onItemCollected,
  onOpenRecycling,
  onBagFull,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const onStateChangeRef = useRef(onStateChange)
  const onEngineReadyRef = useRef(onEngineReady)
  const activeSkinDataRef = useRef(activeSkinData)
  const onItemCollectedRef = useRef(onItemCollected)
  const onOpenRecyclingRef = useRef(onOpenRecycling)
  const onBagFullRef = useRef(onBagFull)

  // Keep callback and data refs updated without triggering engine re-creation
  useEffect(() => {
    onStateChangeRef.current = onStateChange
  }, [onStateChange])

  useEffect(() => {
    onEngineReadyRef.current = onEngineReady
  }, [onEngineReady])

  useEffect(() => {
    activeSkinDataRef.current = activeSkinData
  }, [activeSkinData])

  useEffect(() => {
    onItemCollectedRef.current = onItemCollected
  }, [onItemCollected])

  useEffect(() => {
    onOpenRecyclingRef.current = onOpenRecycling
  }, [onOpenRecycling])

  useEffect(() => {
    onBagFullRef.current = onBagFull
  }, [onBagFull])

  // Initialize engine and observers once on mount
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const initialSkin = activeSkinDataRef.current
    const engine = new EcoCollectorEngine(canvas, {
      skinColor: initialSkin?.color || '#39B86B',
      accentColor: initialSkin?.accentColor || '#B8F34A',
      suitName: initialSkin?.name || 'Forest Ranger',
      skinId: initialSkin?.id || 'ranger_forest',
      onStateChange: (state) => {
        if (onStateChangeRef.current) {
          onStateChangeRef.current(state)
        }
      },
      onItemCollected: (item) => {
        if (onItemCollectedRef.current) {
          onItemCollectedRef.current(item)
        }
      },
      onOpenRecycling: (bin) => {
        if (onOpenRecyclingRef.current) {
          onOpenRecyclingRef.current(bin)
        }
      },
      onBagFull: () => {
        if (onBagFullRef.current) {
          onBagFullRef.current()
        }
      },
    })
    engineRef.current = engine

    if (onEngineReadyRef.current) {
      onEngineReadyRef.current(engine)
    }

    // Set initial size
    const rect = container.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      engine.resize(rect.width, rect.height)
    }
    engine.start()

    // 1. ResizeObserver: Dynamic device pixel ratio and container scaling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          engine.resize(width, height)
        }
      }
    })
    resizeObserver.observe(container)

    // 2. IntersectionObserver: Suspend rendering when scrolled off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            engine.unsuspend()
          } else {
            engine.suspend()
          }
        }
      },
      { threshold: 0.05 }
    )
    intersectionObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      engine.destroy()
      engineRef.current = null
    }
  }, []) // Mount once

  // Dynamic Skin Update
  useEffect(() => {
    if (engineRef.current && activeSkinData) {
      engineRef.current.setSkin(
        activeSkinData.color,
        activeSkinData.name,
        activeSkinData.accentColor,
        activeSkinData.id
      )
    }
  }, [activeSkinData])

  // External Pause State Synchronization
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return

    if (isPaused && !engine.isPaused) {
      engine.pause()
    } else if (!isPaused && engine.isPaused) {
      engine.resume()
    }
  }, [isPaused])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[480px] md:h-[560px] lg:h-[640px] max-h-[75vh] overflow-hidden select-none bg-[#041A12]"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair focus:outline-none"
        tabIndex={0}
        aria-label="Eco Collector 2D Forest Glade Game"
      />
    </div>
  )
}
