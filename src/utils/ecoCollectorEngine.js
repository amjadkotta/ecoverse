/**
 * ECOVERSE ECO COLLECTOR — 2D CANVAS GAME ENGINE (PHASE 4)
 *
 * High-performance HTML5 Canvas 2D engine managing:
 * - Delta-time physics loop with requestAnimationFrame
 * - 8-directional smooth ranger movement with diagonal normalization
 * - Continuous circle & AABB obstacle collision resolution
 * - Y-sorted 2D rendering pipeline (ground -> obstacles, bins, litter & character -> atmosphere -> prompts & HUD text)
 * - Procedural forest glade environment (no external images)
 * - Safe procedural litter spawning with collision avoidance
 * - Responsive collection mechanics (5-item backpack capacity, bag-full detection)
 * - 3 dedicated recycling station bins (Plastic, Metal, Paper) with interaction prompts
 * - Floating score & feedback text particles with zero per-frame garbage collection
 * - Ambient firefly particle system
 * - Device Pixel Ratio (DPR) awareness & responsive viewport tracking
 * - Safe lifecycle management (pause, resume, resize, destroy, cleanup)
 */

import { LITTER_ITEMS, DEFAULT_SKIN_ID } from '../data/ecoArcadeData.js'
import { drawRangerCharacter } from './rangerRenderer.js'

export const WORLD_WIDTH = 1200
export const WORLD_HEIGHT = 800

// Player physics constants
const PLAYER_RADIUS = 15
const BASE_SPEED = 230
const ACCELERATION = 1600
const FRICTION = 14

// World boundaries (margin from canvas edge where dense tree line stands)
const BOUNDS = {
  minX: 70,
  maxX: 1130,
  minY: 80,
  maxY: 730,
}

export class EcoCollectorEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: false })
    this.options = options

    // Callback hooks
    this.onStateChange = options.onStateChange || null
    this.onItemCollected = options.onItemCollected || null
    this.onOpenRecycling = options.onOpenRecycling || null
    this.onBagFull = options.onBagFull || null

    // Viewport & DPR
    this.viewportWidth = 800
    this.viewportHeight = 600
    this.dpr = 1

    // Camera
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      zoom: 1,
    }

    // Engine State
    this.isRunning = false
    this.isPaused = false
    this.isSuspended = false // For off-screen IntersectionObserver
    this.rafId = null
    this.lastTime = 0
    this.replenishTimeout = null

    // Player Entity
    this.player = {
      x: 360,
      y: 420,
      vx: 0,
      vy: 0,
      radius: PLAYER_RADIUS,
      sortY: 420,
      facing: 'down', // 'down' | 'up' | 'left' | 'right'
      facingAngle: Math.PI / 2,
      isMoving: false,
      walkCycle: 0,
      idleTime: 0,
      skinColor: options.skinColor || '#39B86B',
      accentColor: options.accentColor || '#B8F34A',
      suitName: options.suitName || 'Forest Ranger',
      skinId: options.skinId || DEFAULT_SKIN_ID,
    }

    // Backpack & Gameplay State
    this.maxBackpack = 5
    this.backpack = []
    this.activeLitterTarget = 8
    this.litterItems = []
    this.floatingTexts = []
    this.collectionRipples = []
    this.nearbyLitter = null
    this.nearbyBin = null

    // Input States
    this.keysDown = new Set()
    this.virtualInput = { x: 0, y: 0 } // For touch D-pad in mobile mode

    // Environment & Obstacles
    this.obstacles = this.initObstacles()
    this.recyclingBins = this.initRecyclingBins()
    this.groundClutter = this.initGroundClutter()
    this.dirtPaths = this.initDirtPaths()
    this.fireflies = this.initFireflies(30)

    // Spawn initial litter items in safe glade clearings
    this.initLitter()

    // Preallocated render entity array for Y-sorting (prevents garbage collection)
    this.renderEntities = []

    // Bound listeners for clean removal
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleWindowBlur = this.handleWindowBlur.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    this.loop = this.loop.bind(this)

    this.attachEventListeners()
  }

  // =========================================================================
  // ENVIRONMENT GENERATION & COLLIDERS
  // =========================================================================

  initObstacles() {
    return [
      // 1. Central Ancient Grand Oak
      {
        id: 'ancient_oak',
        type: 'tree',
        x: 600,
        y: 280,
        radius: 28, // Trunk collision radius
        canopyRadius: 85,
        trunkHeight: 45,
        canopyColor: '#17482D',
        highlightColor: '#286E45',
        sortY: 280,
      },

      // 2. Northern Twin Pines
      {
        id: 'pine_nw',
        type: 'pine',
        x: 280,
        y: 220,
        radius: 20,
        canopyRadius: 52,
        height: 80,
        sortY: 220,
      },
      {
        id: 'pine_ne',
        type: 'pine',
        x: 920,
        y: 210,
        radius: 20,
        canopyRadius: 54,
        height: 82,
        sortY: 210,
      },

      // 3. Southern Canopy Trees
      {
        id: 'oak_sw',
        type: 'tree',
        x: 240,
        y: 600,
        radius: 24,
        canopyRadius: 65,
        trunkHeight: 38,
        canopyColor: '#1A4D32',
        highlightColor: '#2C764E',
        sortY: 600,
      },
      {
        id: 'oak_se',
        type: 'tree',
        x: 960,
        y: 590,
        radius: 24,
        canopyRadius: 68,
        trunkHeight: 40,
        canopyColor: '#1A4D32',
        highlightColor: '#2C764E',
        sortY: 590,
      },

      // 4. Large Mossy Granite Boulders
      {
        id: 'boulder_w',
        type: 'boulder',
        x: 190,
        y: 440,
        radius: 25,
        color: '#34453A',
        mossColor: '#39B86B',
        sortY: 440,
      },
      {
        id: 'boulder_e',
        type: 'boulder',
        x: 820,
        y: 430,
        radius: 26,
        color: '#34453A',
        mossColor: '#39B86B',
        sortY: 430,
      },
      {
        id: 'rock_cluster_s',
        type: 'boulder',
        x: 520,
        y: 650,
        radius: 19,
        color: '#2B3B31',
        mossColor: '#286E45',
        sortY: 650,
      },

      // 5. Fallen Weathered Mossy Log (Rectangular Capsule Collider)
      {
        id: 'fallen_log',
        type: 'log',
        x: 410,
        y: 350,
        width: 85,
        height: 24,
        color: '#281E15',
        mossColor: '#39B86B',
        sortY: 362,
      },

      // 6. Dense Woodland Berry Shrubs
      {
        id: 'shrub_nw',
        type: 'shrub',
        x: 440,
        y: 190,
        radius: 22,
        color: '#1E5236',
        sortY: 190,
      },
      {
        id: 'shrub_c',
        type: 'shrub',
        x: 750,
        y: 320,
        radius: 23,
        color: '#1E5236',
        sortY: 320,
      },
      {
        id: 'shrub_se',
        type: 'shrub',
        x: 720,
        y: 620,
        radius: 22,
        color: '#1E5236',
        sortY: 620,
      },
    ]
  }

  initRecyclingBins() {
    // 3 Dedicated Recycling Stream Stations alongside the central dirt trail hub
    const bins = [
      {
        id: 'bin_plastic',
        type: 'bin',
        acceptedCategory: 'plastic',
        name: 'Plastic Bin',
        label: 'PLASTIC',
        color: '#38BDF8', // Cyan
        x: 540,
        y: 520,
        width: 32,
        height: 38,
        radius: 16,
        sortY: 520,
      },
      {
        id: 'bin_metal',
        type: 'bin',
        acceptedCategory: 'metal',
        name: 'Metal & Can Bin',
        label: 'METALS',
        color: '#FACC15', // Amber
        x: 600,
        y: 520,
        width: 32,
        height: 38,
        radius: 16,
        sortY: 520,
      },
      {
        id: 'bin_paper',
        type: 'bin',
        acceptedCategory: 'paper',
        name: 'Paper Bin',
        label: 'PAPER',
        color: '#4ADE80', // Green
        x: 660,
        y: 520,
        width: 32,
        height: 38,
        radius: 16,
        sortY: 520,
      },
    ]

    // Register bins as solid obstacles so player cannot walk through them
    for (let i = 0; i < bins.length; i++) {
      const b = bins[i]
      this.obstacles.push({
        id: `obs_${b.id}`,
        type: 'bin',
        x: b.x,
        y: b.y,
        radius: b.radius,
        sortY: b.sortY,
      })
    }

    return bins
  }

  initDirtPaths() {
    // Natural meandering dirt trail connecting the glade
    return [
      {
        startX: 60,
        startY: 420,
        cp1X: 320,
        cp1Y: 430,
        cp2X: 480,
        cp2Y: 470,
        endX: 620,
        endY: 460,
        width: 48,
      },
      {
        startX: 620,
        startY: 460,
        cp1X: 740,
        cp1Y: 450,
        cp2X: 920,
        cp2Y: 380,
        endX: 1140,
        endY: 360,
        width: 44,
      },
      {
        startX: 620,
        startY: 460,
        cp1X: 640,
        cp1Y: 560,
        cp2X: 610,
        cp2Y: 640,
        endX: 630,
        endY: 740,
        width: 38,
      },
    ]
  }

  initGroundClutter() {
    // Deterministic procedural clutter (flowers, grass tufts, pebbles)
    const clutter = []
    let seed = 42
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    // Grass tufts
    for (let i = 0; i < 70; i++) {
      clutter.push({
        type: 'grass_tuft',
        x: 90 + random() * (WORLD_WIDTH - 180),
        y: 100 + random() * (WORLD_HEIGHT - 200),
        size: 5 + random() * 4,
        angle: random() * 0.4 - 0.2,
        color: random() > 0.4 ? '#39B86B' : '#B8F34A',
      })
    }

    // Forest flowers
    const flowerColors = ['#F3F7EF', '#FEF08A', '#7DD3FC', '#F472B6']
    for (let i = 0; i < 45; i++) {
      clutter.push({
        type: 'flower',
        x: 90 + random() * (WORLD_WIDTH - 180),
        y: 100 + random() * (WORLD_HEIGHT - 200),
        color: flowerColors[Math.floor(random() * flowerColors.length)],
        size: 3 + random() * 2,
      })
    }

    // Pebbles / small stones
    for (let i = 0; i < 35; i++) {
      clutter.push({
        type: 'pebble',
        x: 80 + random() * (WORLD_WIDTH - 160),
        y: 90 + random() * (WORLD_HEIGHT - 180),
        radius: 2 + random() * 3,
        color: '#243328',
      })
    }

    return clutter
  }

  initFireflies(count) {
    const fireflies = []
    for (let i = 0; i < count; i++) {
      fireflies.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        size: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 1.5 + Math.random() * 2,
        color: Math.random() > 0.3 ? '#B8F34A' : '#FEF08A',
      })
    }
    return fireflies
  }

  // =========================================================================
  // LITTER GENERATION & REPLENISHMENT
  // =========================================================================

  initLitter() {
    this.litterItems = []
    for (let i = 0; i < this.activeLitterTarget; i++) {
      this.spawnSafeLitterItem()
    }
  }

  spawnSafeLitterItem() {
    const candidateDefs = LITTER_ITEMS
    if (!candidateDefs || candidateDefs.length === 0) return null

    // Pick a random litter definition from the 9 catalogue items
    const def = candidateDefs[Math.floor(Math.random() * candidateDefs.length)]

    // Find a collision-free glade position (up to 40 candidate attempts)
    for (let attempts = 0; attempts < 40; attempts++) {
      const x = BOUNDS.minX + 40 + Math.random() * (BOUNDS.maxX - BOUNDS.minX - 80)
      const y = BOUNDS.minY + 40 + Math.random() * (BOUNDS.maxY - BOUNDS.minY - 80)

      let isSafe = true

      // 1. Must not spawn inside any obstacle collider (with generous 35px buffer)
      for (let i = 0; i < this.obstacles.length; i++) {
        const obs = this.obstacles[i]
        const safeRadius = (obs.radius || 24) + 32
        if (Math.hypot(x - obs.x, y - obs.y) < safeRadius) {
          isSafe = false
          break
        }
      }

      // 2. Must not spawn on top of the player
      if (isSafe && Math.hypot(x - this.player.x, y - this.player.y) < 70) {
        isSafe = false
      }

      // 3. Must not spawn too close to already existing litter items
      if (isSafe) {
        for (let i = 0; i < this.litterItems.length; i++) {
          if (Math.hypot(x - this.litterItems[i].x, y - this.litterItems[i].y) < 55) {
            isSafe = false
            break
          }
        }
      }

      if (isSafe) {
        const newItem = {
          id: `litter_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          type: 'litter',
          litterDefId: def.id,
          name: def.name,
          category: def.category,
          baseScore: def.baseScore,
          sortBonusScore: def.sortBonusScore,
          coinReward: def.coinReward,
          description: def.description,
          symbol: def.symbol,
          x,
          y,
          radius: 14,
          sortY: y,
          phase: Math.random() * Math.PI * 2,
        }
        this.litterItems.push(newItem)
        return newItem
      }
    }

    return null
  }

  scheduleLitterReplenish() {
    if (this.replenishTimeout) return

    this.replenishTimeout = setTimeout(() => {
      this.replenishTimeout = null
      if (this.isRunning && this.litterItems.length < this.activeLitterTarget) {
        this.spawnSafeLitterItem()
        this.notifyState()
      }
    }, 2200)
  }

  // =========================================================================
  // INTERACTION SYSTEM & BACKPACK MANAGEMENT
  // =========================================================================

  checkInteractions() {
    const px = this.player.x
    const py = this.player.y

    // 1. Check nearby litter (collection range: 38px)
    let closestLitter = null
    let minLitterDist = 38

    for (let i = 0; i < this.litterItems.length; i++) {
      const item = this.litterItems[i]
      const dist = Math.hypot(px - item.x, py - item.y)
      if (dist < minLitterDist) {
        minLitterDist = dist
        closestLitter = item
      }
    }
    this.nearbyLitter = closestLitter

    // 2. Check nearby bin (interaction range: 48px)
    let closestBin = null
    let minBinDist = 48

    for (let i = 0; i < this.recyclingBins.length; i++) {
      const bin = this.recyclingBins[i]
      const dist = Math.hypot(px - bin.x, py - bin.y)
      if (dist < minBinDist) {
        minBinDist = dist
        closestBin = bin
      }
    }
    this.nearbyBin = closestBin
  }

  interact() {
    if (!this.isRunning || this.isPaused || this.isSuspended) return

    // Priority 1: Collect nearby litter
    if (this.nearbyLitter) {
      if (this.backpack.length < this.maxBackpack) {
        const item = this.nearbyLitter
        // Remove from ground
        this.litterItems = this.litterItems.filter((l) => l.id !== item.id)
        this.nearbyLitter = null

        // Add to ranger backpack
        this.backpack.push({ ...item, collectedTimestamp: Date.now() })

        // Spawn visual score feedback particle & collection ripple
        this.addFloatingText(`+${item.baseScore} ${item.name}`, item.x, item.y - 12, '#B8F34A')
        const catColor =
          item.category === 'plastic' ? '#38BDF8' : item.category === 'metal' ? '#FACC15' : '#4ADE80'
        this.addCollectionRipple(item.x, item.y, catColor)

        if (typeof this.onItemCollected === 'function') {
          this.onItemCollected(item)
        }

        // Replenish a new litter item after delay
        this.scheduleLitterReplenish()
        this.notifyState()
      } else {
        // Backpack capacity reached (5/5)
        this.addFloatingText('BAG FULL! (5/5)', this.player.x, this.player.y - 24, '#F87171')
        if (typeof this.onBagFull === 'function') {
          this.onBagFull()
        }
      }
      return
    }

    // Priority 2: Open nearby recycling station
    if (this.nearbyBin) {
      if (typeof this.onOpenRecycling === 'function') {
        this.onOpenRecycling(this.nearbyBin)
      }
    }
  }

  removeItemFromBackpack(itemId) {
    this.backpack = this.backpack.filter((item) => item.id !== itemId)
    this.notifyState()
  }

  clearBackpack() {
    this.backpack = []
    this.notifyState()
  }

  resetGameState() {
    this.backpack = []
    this.player.x = 360
    this.player.y = 420
    this.player.vx = 0
    this.player.vy = 0
    this.player.sortY = 420
    this.player.facing = 'down'
    this.player.isMoving = false
    this.nearbyLitter = null
    this.nearbyBin = null
    this.floatingTexts = []
    this.initLitter()
    this.notifyState()
  }

  // =========================================================================
  // FLOATING TEXT PARTICLES (Zero allocation in loop)
  // =========================================================================

  addFloatingText(text, x, y, color = '#B8F34A') {
    this.floatingTexts.push({
      text,
      x,
      y,
      vy: -32,
      alpha: 1.0,
      life: 0.9,
      color,
    })
  }

  updateFloatingTexts(dt) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i]
      ft.y += ft.vy * dt
      ft.life -= dt
      ft.alpha = Math.max(0, ft.life / 0.9)
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1)
      }
    }
  }

  addCollectionRipple(x, y, color = '#B8F34A') {
    this.collectionRipples.push({
      x,
      y,
      radius: 12,
      maxRadius: 36,
      alpha: 0.85,
      color,
      life: 0.32,
      maxLife: 0.32,
    })
  }

  updateCollectionRipples(dt) {
    for (let i = this.collectionRipples.length - 1; i >= 0; i--) {
      const r = this.collectionRipples[i]
      r.life -= dt
      const progress = 1 - Math.max(0, r.life / r.maxLife)
      r.radius = 12 + (r.maxRadius - 12) * progress
      r.alpha = Math.max(0, 1 - progress)
      if (r.life <= 0) {
        this.collectionRipples.splice(i, 1)
      }
    }
  }

  renderCollectionRipples(ctx) {
    for (let i = 0; i < this.collectionRipples.length; i++) {
      const r = this.collectionRipples[i]
      ctx.save()
      ctx.globalAlpha = r.alpha
      ctx.strokeStyle = r.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.55, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  }

  // =========================================================================
  // LIFECYCLE & INPUT HANDLERS
  // =========================================================================

  attachEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('blur', this.handleWindowBlur)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  detachEventListeners() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('blur', this.handleWindowBlur)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  handleKeyDown(e) {
    // If active element is an input, textarea, select, or outside button, don't intercept keys
    const activeEl = document.activeElement
    if (
      activeEl &&
      (activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.tagName === 'SELECT' ||
        (activeEl.tagName === 'BUTTON' && activeEl !== this.canvas))
    ) {
      return
    }

    // Toggle pause with 'p', 'P', or 'Escape'
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      if (this.isPaused) {
        this.resume()
      } else {
        this.pause()
      }
      return
    }

    // Interaction key registration: 'KeyE' or 'Space'
    if (e.code === 'KeyE' || e.code === 'Space') {
      // Prevent browser page scrolling when pressing space
      e.preventDefault()
      this.interact()
      return
    }

    // Movement key registration
    const code = e.code
    if (
      code === 'KeyW' ||
      code === 'KeyS' ||
      code === 'KeyA' ||
      code === 'KeyD' ||
      code === 'ArrowUp' ||
      code === 'ArrowDown' ||
      code === 'ArrowLeft' ||
      code === 'ArrowRight'
    ) {
      // Prevent browser viewport scrolling when operating arrow keys
      e.preventDefault()
      this.keysDown.add(code)
    }
  }

  handleKeyUp(e) {
    this.keysDown.delete(e.code)
  }

  handleWindowBlur() {
    // Clear pressed keys when window loses focus to prevent stuck movement
    this.keysDown.clear()
    this.virtualInput.x = 0
    this.virtualInput.y = 0
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.pause()
    }
  }

  setVirtualInput(x, y) {
    // Normalizes touch joystick / D-pad inputs
    const length = Math.hypot(x, y)
    if (length > 1) {
      this.virtualInput.x = x / length
      this.virtualInput.y = y / length
    } else {
      this.virtualInput.x = x
      this.virtualInput.y = y
    }
  }

  setVirtualDirection(dir) {
    if (dir && typeof dir === 'object') {
      this.setVirtualInput(dir.x || 0, dir.y || 0)
    } else {
      this.setVirtualInput(0, 0)
    }
  }

  triggerInteraction() {
    this.interact()
  }

  setSkin(color, name, accentColor, id) {
    if (color) this.player.skinColor = color
    if (name) this.player.suitName = name
    if (accentColor) this.player.accentColor = accentColor
    if (id) this.player.skinId = id
  }

  resize(width, height) {
    if (!width || !height || width <= 0 || height <= 0) return

    this.viewportWidth = width
    this.viewportHeight = height

    // Cap DPR to 2 for crisp display without GPU fill-rate exhaustion
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)

    this.canvas.width = Math.floor(width * this.dpr)
    this.canvas.height = Math.floor(height * this.dpr)

    // Ensure initial camera centers immediately on resize
    this.updateCamera(0, true)
  }

  start() {
    if (this.isRunning) return
    this.isRunning = true
    this.isPaused = false
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.loop)
    this.notifyState()
  }

  pause() {
    if (!this.isRunning || this.isPaused) return
    this.isPaused = true
    this.keysDown.clear()
    this.notifyState()
  }

  resume() {
    if (!this.isRunning || !this.isPaused) return
    this.isPaused = false
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.loop)
    this.notifyState()
  }

  suspend() {
    // Called when game moves off-screen via IntersectionObserver
    this.isSuspended = true
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  unsuspend() {
    // Called when game re-enters viewport
    if (!this.isSuspended) return
    this.isSuspended = false
    if (this.isRunning && !this.isPaused) {
      this.lastTime = performance.now()
      this.rafId = requestAnimationFrame(this.loop)
    }
  }

  destroy() {
    this.isRunning = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.replenishTimeout) {
      clearTimeout(this.replenishTimeout)
      this.replenishTimeout = null
    }
    this.detachEventListeners()
    this.keysDown.clear()
  }

  notifyState() {
    if (typeof this.onStateChange === 'function') {
      this.onStateChange({
        isRunning: this.isRunning,
        isPaused: this.isPaused,
        playerPos: { x: Math.round(this.player.x), y: Math.round(this.player.y) },
        facing: this.player.facing,
        isMoving: this.player.isMoving,
        backpack: [...this.backpack],
        nearbyLitter: this.nearbyLitter,
        nearbyBin: this.nearbyBin,
        isBagFull: this.backpack.length >= this.maxBackpack,
      })
    }
  }

  // =========================================================================
  // MAIN GAME LOOP & SIMULATION
  // =========================================================================

  loop(currentTime) {
    if (!this.isRunning || this.isPaused || this.isSuspended) {
      return
    }

    // Delta time in seconds, clamped to 0.1s to prevent huge jumps after tabs/hiccups
    let dt = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime
    if (dt > 0.1) dt = 0.1

    this.update(dt)
    this.render()

    this.rafId = requestAnimationFrame(this.loop)
  }

  update(dt) {
    this.updatePlayerMovement(dt)
    this.resolveCollisions()
    this.checkInteractions()
    this.updateLitter(dt)
    this.updateCollectionRipples(dt)
    this.updateFloatingTexts(dt)
    this.updateCamera(dt)
    this.updateFireflies(dt)
  }

  updatePlayerMovement(dt) {
    const p = this.player

    // 1. Calculate raw keyboard input direction
    let rawX = 0
    let rawY = 0

    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) rawX -= 1
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) rawX += 1
    if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) rawY -= 1
    if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) rawY += 1

    // Combine keyboard with virtual touch inputs
    let inputX = rawX + this.virtualInput.x
    let inputY = rawY + this.virtualInput.y

    // 2. Normalize 8-directional vector (prevent diagonal speed boost)
    const inputMag = Math.hypot(inputX, inputY)
    if (inputMag > 1) {
      inputX /= inputMag
      inputY /= inputMag
    }

    // 3. Acceleration & velocity update
    if (inputMag > 0.05) {
      p.vx += inputX * ACCELERATION * dt
      p.vy += inputY * ACCELERATION * dt

      // Clamp to max speed
      const currentSpeed = Math.hypot(p.vx, p.vy)
      if (currentSpeed > BASE_SPEED) {
        p.vx = (p.vx / currentSpeed) * BASE_SPEED
        p.vy = (p.vy / currentSpeed) * BASE_SPEED
      }

      p.isMoving = true
      p.walkCycle += dt * 11
      p.facingAngle = Math.atan2(p.vy, p.vx)

      // Cardinal facing direction
      if (Math.abs(p.vx) > Math.abs(p.vy)) {
        p.facing = p.vx > 0 ? 'right' : 'left'
      } else {
        p.facing = p.vy > 0 ? 'down' : 'up'
      }
    } else {
      // Exponential decay friction when no input
      const decay = Math.exp(-FRICTION * dt)
      p.vx *= decay
      p.vy *= decay

      if (Math.hypot(p.vx, p.vy) < 4) {
        p.vx = 0
        p.vy = 0
        p.isMoving = false
      }
      p.idleTime += dt * 3
    }

    // Advance position
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.sortY = p.y
  }

  resolveCollisions() {
    const p = this.player

    // 1. Solid Obstacle & Recycling Bin Collisions
    for (let i = 0; i < this.obstacles.length; i++) {
      const obs = this.obstacles[i]

      if (
        obs.type === 'tree' ||
        obs.type === 'pine' ||
        obs.type === 'boulder' ||
        obs.type === 'shrub' ||
        obs.type === 'bin'
      ) {
        // Circle-Circle Collision with sliding response
        const dx = p.x - obs.x
        const dy = p.y - obs.y
        const dist = Math.hypot(dx, dy)
        const minDist = p.radius + obs.radius

        if (dist < minDist) {
          if (dist > 0.0001) {
            const overlap = minDist - dist
            const nx = dx / dist
            const ny = dy / dist
            p.x += nx * overlap
            p.y += ny * overlap
          } else {
            // Push outward if directly centered
            p.y += minDist
          }
        }
      } else if (obs.type === 'log') {
        // Circle-AABB Capsule Collision
        const nearestX = Math.max(obs.x, Math.min(p.x, obs.x + obs.width))
        const nearestY = Math.max(obs.y, Math.min(p.y, obs.y + obs.height))
        const dx = p.x - nearestX
        const dy = p.y - nearestY
        const dist = Math.hypot(dx, dy)

        if (dist < p.radius) {
          if (dist > 0.0001) {
            const overlap = p.radius - dist
            const nx = dx / dist
            const ny = dy / dist
            p.x += nx * overlap
            p.y += ny * overlap
          } else {
            p.y += p.radius
          }
        }
      }
    }

    // 2. World Bounds Clamping (keeps player inside clearing glade)
    if (p.x < BOUNDS.minX) p.x = BOUNDS.minX
    if (p.x > BOUNDS.maxX) p.x = BOUNDS.maxX
    if (p.y < BOUNDS.minY) p.y = BOUNDS.minY
    if (p.y > BOUNDS.maxY) p.y = BOUNDS.maxY

    p.sortY = p.y
  }

  updateLitter(dt) {
    for (let i = 0; i < this.litterItems.length; i++) {
      this.litterItems[i].phase += dt * 3
    }
  }

  updateCamera(dt, snap = false) {
    const cam = this.camera

    // Calculate camera target centered on player
    let targetX = pClamped(this.player.x - this.viewportWidth / 2, 0, Math.max(0, WORLD_WIDTH - this.viewportWidth))
    let targetY = pClamped(this.player.y - this.viewportHeight / 2, 0, Math.max(0, WORLD_HEIGHT - this.viewportHeight))

    // If viewport is larger than world, center the entire world in view
    if (this.viewportWidth >= WORLD_WIDTH) {
      targetX = -(this.viewportWidth - WORLD_WIDTH) / 2
    }
    if (this.viewportHeight >= WORLD_HEIGHT) {
      targetY = -(this.viewportHeight - WORLD_HEIGHT) / 2
    }

    if (snap || dt === 0) {
      cam.x = targetX
      cam.y = targetY
    } else {
      // Smooth exponential camera lerp
      const lerpFactor = 1 - Math.exp(-8 * dt)
      cam.x += (targetX - cam.x) * lerpFactor
      cam.y += (targetY - cam.y) * lerpFactor
    }
  }

  updateFireflies(dt) {
    for (let i = 0; i < this.fireflies.length; i++) {
      const f = this.fireflies[i]
      f.x += f.vx * dt
      f.y += f.vy * dt
      f.phase += dt * f.pulseSpeed

      // Screen edge wrapping
      if (f.x < 0) f.x += WORLD_WIDTH
      if (f.x > WORLD_WIDTH) f.x -= WORLD_WIDTH
      if (f.y < 0) f.y += WORLD_HEIGHT
      if (f.y > WORLD_HEIGHT) f.y -= WORLD_HEIGHT
    }
  }

  // =========================================================================
  // RENDERING PIPELINE
  // =========================================================================

  render() {
    const ctx = this.ctx
    const dpr = this.dpr

    ctx.save()

    // Scale context by DPR
    ctx.scale(dpr, dpr)

    // Clear viewport with deep forest base
    ctx.fillStyle = '#041A12'
    ctx.fillRect(0, 0, this.viewportWidth, this.viewportHeight)

    // Translate by camera offset
    ctx.save()
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y))

    // 1. Render Ground Terrain (Grass, Paths, Clutter)
    this.renderGround(ctx)

    // 2. Render Collection Pickup Ripples
    this.renderCollectionRipples(ctx)

    // 3. Render Y-Sorted Entities (Obstacles, Bins, Litter, Character)
    this.renderYSortedEntities(ctx)

    // 3. Render Interaction Prompts
    this.renderInteractionPrompts(ctx)

    // 4. Render Floating Feedback Texts
    this.renderFloatingTexts(ctx)

    // 5. Render Atmospheric Overlay (Perimeter Tree Canopy, Vignette, Fireflies)
    this.renderAtmosphere(ctx)

    ctx.restore() // End camera transform
    ctx.restore() // End DPR scale
  }

  renderGround(ctx) {
    // Glade Grass Base
    ctx.fillStyle = '#08291C'
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

    // Subtle Grass Tile Tone Variation
    ctx.fillStyle = '#0A3323'
    for (let x = 0; x < WORLD_WIDTH; x += 120) {
      for (let y = 0; y < WORLD_HEIGHT; y += 120) {
        if ((x + y) % 240 === 0) {
          ctx.beginPath()
          ctx.rect(x, y, 120, 120)
          ctx.fill()
        }
      }
    }

    // Dirt Paths
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (let i = 0; i < this.dirtPaths.length; i++) {
      const path = this.dirtPaths[i]

      // Outer path edge (soil blending)
      ctx.beginPath()
      ctx.moveTo(path.startX, path.startY)
      ctx.bezierCurveTo(path.cp1X, path.cp1Y, path.cp2X, path.cp2Y, path.endX, path.endY)
      ctx.lineWidth = path.width + 12
      ctx.strokeStyle = '#0F3C28'
      ctx.stroke()

      // Inner dirt path
      ctx.beginPath()
      ctx.moveTo(path.startX, path.startY)
      ctx.bezierCurveTo(path.cp1X, path.cp1Y, path.cp2X, path.cp2Y, path.endX, path.endY)
      ctx.lineWidth = path.width
      ctx.strokeStyle = '#1A4D32'
      ctx.stroke()

      // Path core wear
      ctx.beginPath()
      ctx.moveTo(path.startX, path.startY)
      ctx.bezierCurveTo(path.cp1X, path.cp1Y, path.cp2X, path.cp2Y, path.endX, path.endY)
      ctx.lineWidth = path.width * 0.45
      ctx.strokeStyle = '#235D3D'
      ctx.stroke()
    }

    // Ground Clutter (Grass tufts, flowers, pebbles)
    for (let i = 0; i < this.groundClutter.length; i++) {
      const c = this.groundClutter[i]
      if (c.type === 'grass_tuft') {
        ctx.strokeStyle = c.color
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(c.x, c.y)
        ctx.lineTo(c.x - c.size * 0.7, c.y - c.size)
        ctx.moveTo(c.x, c.y)
        ctx.lineTo(c.x, c.y - c.size * 1.2)
        ctx.moveTo(c.x, c.y)
        ctx.lineTo(c.x + c.size * 0.7, c.y - c.size)
        ctx.stroke()
      } else if (c.type === 'flower') {
        ctx.fillStyle = c.color
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#FEF08A'
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      } else if (c.type === 'pebble') {
        ctx.fillStyle = c.color
        ctx.beginPath()
        ctx.ellipse(c.x, c.y, c.radius, c.radius * 0.6, 0.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  renderYSortedEntities(ctx) {
    // Prepare entities list for depth sorting
    this.renderEntities.length = 0

    // 1. Add environmental obstacles (trees, boulders, pines, shrubs, logs)
    for (let i = 0; i < this.obstacles.length; i++) {
      if (this.obstacles[i].type !== 'bin') {
        this.renderEntities.push(this.obstacles[i])
      }
    }

    // 2. Add recycling bins
    for (let i = 0; i < this.recyclingBins.length; i++) {
      this.renderEntities.push(this.recyclingBins[i])
    }

    // 3. Add active litter items
    for (let i = 0; i < this.litterItems.length; i++) {
      this.renderEntities.push(this.litterItems[i])
    }

    // 4. Add player
    this.renderEntities.push(this.player)

    // Sort all entities by Y coordinate of feet/base
    this.renderEntities.sort((a, b) => a.sortY - b.sortY)

    // Draw sorted entities
    for (let i = 0; i < this.renderEntities.length; i++) {
      const ent = this.renderEntities[i]
      if (ent === this.player) {
        this.renderPlayer(ctx)
      } else if (ent.type === 'bin') {
        this.renderRecyclingBin(ctx, ent)
      } else if (ent.type === 'litter') {
        this.renderLitterItem(ctx, ent)
      } else if (ent.type === 'tree') {
        this.renderDeciduousTree(ctx, ent)
      } else if (ent.type === 'pine') {
        this.renderPineTree(ctx, ent)
      } else if (ent.type === 'boulder') {
        this.renderBoulder(ctx, ent)
      } else if (ent.type === 'log') {
        this.renderFallenLog(ctx, ent)
      } else if (ent.type === 'shrub') {
        this.renderShrub(ctx, ent)
      }
    }
  }

  // =========================================================================
  // RECYCLING BINS RENDERING
  // =========================================================================

  renderRecyclingBin(ctx, bin) {
    const x = bin.x
    const y = bin.y
    const isNearby = this.nearbyBin === bin

    ctx.save()
    ctx.translate(x, y)

    // 1. Ground Drop Shadow
    ctx.fillStyle = 'rgba(2, 14, 9, 0.55)'
    ctx.beginPath()
    ctx.ellipse(0, 14, 18, 7, 0, 0, Math.PI * 2)
    ctx.fill()

    // 2. Proximity Glow Ring & Ground Spotlight when ranger is in sorting range
    if (isNearby) {
      const aura = ctx.createRadialGradient(0, 14, 4, 0, 14, 32)
      aura.addColorStop(0, `${bin.color}45`)
      aura.addColorStop(0.7, `${bin.color}15`)
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = aura
      ctx.beginPath()
      ctx.ellipse(0, 14, 32, 16, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = bin.color
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.ellipse(0, 14, 26, 12, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 3. Bin Body Base
    ctx.fillStyle = '#08291C'
    ctx.beginPath()
    ctx.roundRect(-14, -20, 28, 32, [4, 4, 3, 3])
    ctx.fill()
    ctx.strokeStyle = bin.color
    ctx.lineWidth = 1.2
    ctx.stroke()

    // 4. Colored Front Panel
    ctx.fillStyle = `${bin.color}25`
    ctx.beginPath()
    ctx.roundRect(-11, -12, 22, 20, 3)
    ctx.fill()

    // 5. Universal Recycling Loop Emblem (3-arrow triangle)
    ctx.fillStyle = bin.color
    ctx.beginPath()
    ctx.arc(0, -2, 4.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#08291C'
    ctx.beginPath()
    ctx.arc(0, -2, 2.5, 0, Math.PI * 2)
    ctx.fill()

    // 6. Bin Lid with Waste Slot
    ctx.fillStyle = bin.color
    ctx.beginPath()
    ctx.roundRect(-16, -26, 32, 8, [4, 4, 1, 1])
    ctx.fill()

    // Slot Opening
    ctx.fillStyle = '#041A12'
    ctx.beginPath()
    ctx.roundRect(-8, -24, 16, 3, 1)
    ctx.fill()

    // 7. Small Category Text Label
    ctx.font = 'bold 8px monospace'
    ctx.fillStyle = bin.color
    ctx.textAlign = 'center'
    ctx.fillText(bin.label, 0, 13)

    ctx.restore()
  }

  // =========================================================================
  // LITTER OBJECTS RENDERING (9 Procedural Vector Items)
  // =========================================================================

  renderLitterItem(ctx, item) {
    const x = item.x
    const y = item.y
    const isNearby = this.nearbyLitter === item
    const bobOffset = Math.sin(item.phase) * 2.5

    ctx.save()
    ctx.translate(x, y + bobOffset)

    // 1. Soft Dynamic Drop Shadow
    ctx.fillStyle = 'rgba(2, 14, 9, 0.4)'
    ctx.beginPath()
    ctx.ellipse(0, 10 - bobOffset * 0.5, 11, 4.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // 2. Collection Glow Ring if Ranger is in range
    if (isNearby) {
      const catColor = item.category === 'plastic' ? '#38BDF8' : item.category === 'metal' ? '#FACC15' : '#4ADE80'
      ctx.strokeStyle = catColor
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.ellipse(0, 4, 18, 10, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 3. Draw Category Specific Vector Illustration
    switch (item.litterDefId) {
      // --- PLASTIC ITEMS ---
      case 'plastic_bottle':
        // Bottle body
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)'
        ctx.beginPath()
        ctx.roundRect(-4, -8, 8, 14, 3)
        ctx.fill()
        // Neck & cap
        ctx.fillStyle = 'rgba(186, 230, 253, 0.9)'
        ctx.fillRect(-2, -12, 4, 4)
        ctx.fillStyle = '#38BDF8'
        ctx.fillRect(-2.5, -14, 5, 2)
        // Reflection
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(-2, -6, 1.5, 8)
        break

      case 'plastic_bag':
        // Crinkled polybag
        ctx.fillStyle = 'rgba(186, 230, 253, 0.65)'
        ctx.beginPath()
        ctx.moveTo(-7, 4)
        ctx.lineTo(-6, -6)
        ctx.lineTo(-2, -10)
        ctx.lineTo(2, -6)
        ctx.lineTo(6, -10)
        ctx.lineTo(7, -4)
        ctx.lineTo(6, 4)
        ctx.closePath()
        ctx.fill()
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)'
        ctx.lineWidth = 1
        ctx.stroke()
        break

      case 'plastic_cup':
        // Takeaway iced cup
        ctx.fillStyle = 'rgba(224, 242, 254, 0.75)'
        ctx.beginPath()
        ctx.moveTo(-5, -6)
        ctx.lineTo(-3.5, 6)
        ctx.lineTo(3.5, 6)
        ctx.lineTo(5, -6)
        ctx.closePath()
        ctx.fill()
        // Cup lid
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)'
        ctx.beginPath()
        ctx.roundRect(-6, -8, 12, 3, 1)
        ctx.fill()
        // Straw
        ctx.strokeStyle = '#38BDF8'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(1, -7)
        ctx.lineTo(4, -13)
        ctx.stroke()
        break

      // --- METAL ITEMS ---
      case 'soda_can':
        // Aluminum can cylinder
        ctx.fillStyle = '#E11D48' // Red soda can
        ctx.beginPath()
        ctx.roundRect(-4.5, -7, 9, 13, 2.5)
        ctx.fill()
        // Silver rim top & bottom
        ctx.fillStyle = '#E2E8F0'
        ctx.fillRect(-4.5, -8, 9, 2)
        ctx.fillRect(-4.5, 5, 9, 2)
        // Pull tab
        ctx.fillStyle = '#FACC15'
        ctx.beginPath()
        ctx.arc(0, -7.5, 1.5, 0, Math.PI * 2)
        ctx.fill()
        break

      case 'tin_can':
        // Steel food tin with ridges
        ctx.fillStyle = '#CBD5E1'
        ctx.beginPath()
        ctx.roundRect(-5, -6, 10, 12, 2)
        ctx.fill()
        // Ribbed grooves
        ctx.strokeStyle = '#94A3B8'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(-5, -2)
        ctx.lineTo(5, -2)
        ctx.moveTo(-5, 2)
        ctx.lineTo(5, 2)
        ctx.stroke()
        // Amber rim
        ctx.strokeStyle = '#FACC15'
        ctx.strokeRect(-5, -6, 10, 12)
        break

      case 'foil_wrapper':
        // Crinkled shiny snack foil
        ctx.fillStyle = '#FACC15'
        ctx.beginPath()
        ctx.moveTo(0, -9)
        ctx.lineTo(8, -1)
        ctx.lineTo(1, 7)
        ctx.lineTo(-7, 0)
        ctx.closePath()
        ctx.fill()
        // Silver fold
        ctx.fillStyle = '#E2E8F0'
        ctx.beginPath()
        ctx.moveTo(0, -9)
        ctx.lineTo(3, -2)
        ctx.lineTo(-4, 0)
        ctx.closePath()
        ctx.fill()
        break

      // --- PAPER ITEMS ---
      case 'newspaper':
        // Folded newspaper
        ctx.fillStyle = '#F1F5F9'
        ctx.beginPath()
        ctx.roundRect(-7, -6, 14, 11, 1.5)
        ctx.fill()
        // Text headline lines
        ctx.fillStyle = '#4ADE80'
        ctx.fillRect(-5, -4, 10, 2)
        ctx.fillStyle = '#64748B'
        ctx.fillRect(-5, -0.5, 10, 1)
        ctx.fillRect(-5, 1.5, 10, 1)
        break

      case 'cardboard_box':
        // Small flattened/open cardboard box
        ctx.fillStyle = '#B45309'
        ctx.beginPath()
        ctx.roundRect(-6, -5, 12, 11, 2)
        ctx.fill()
        // Inner depth
        ctx.fillStyle = '#78350F'
        ctx.fillRect(-4, -3, 8, 4)
        // Tape strip
        ctx.fillStyle = '#4ADE80'
        ctx.fillRect(-1.5, -5, 3, 11)
        break

      case 'coffee_sleeve':
        // Corrugated paper cup sleeve
        ctx.fillStyle = '#D97706'
        ctx.beginPath()
        ctx.roundRect(-6, -4, 12, 8, 2)
        ctx.fill()
        // Texture lines
        ctx.strokeStyle = '#92400E'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(-3, -4)
        ctx.lineTo(-3, 4)
        ctx.moveTo(0, -4)
        ctx.lineTo(0, 4)
        ctx.moveTo(3, -4)
        ctx.lineTo(3, 4)
        ctx.stroke()
        break

      default:
        // Generic fallback item
        ctx.fillStyle = '#B8F34A'
        ctx.beginPath()
        ctx.arc(0, 0, 5, 0, Math.PI * 2)
        ctx.fill()
    }

    ctx.restore()
  }

  // =========================================================================
  // INTERACTION PROMPTS & HUD TEXTS
  // =========================================================================

  renderInteractionPrompts(ctx) {
    if (this.nearbyLitter) {
      const it = this.nearbyLitter
      const promptY = it.y - 20
      const isFull = this.backpack.length >= this.maxBackpack
      const text = isFull ? '[Bag Full • Visit Bin]' : `[E] Collect ${it.name}`

      ctx.save()
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'center'
      const textWidth = ctx.measureText(text).width
      const pad = 8

      // Background Pill
      ctx.fillStyle = 'rgba(4, 26, 18, 0.92)'
      ctx.strokeStyle = isFull ? '#F87171' : '#B8F34A'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.roundRect(it.x - textWidth / 2 - pad, promptY - 11, textWidth + pad * 2, 20, 6)
      ctx.fill()
      ctx.stroke()

      // Prompt Text
      ctx.fillStyle = isFull ? '#F87171' : '#B8F34A'
      ctx.fillText(text, it.x, promptY + 3)
      ctx.restore()
    } else if (this.nearbyBin) {
      const bin = this.nearbyBin
      const promptY = bin.y - 34
      const text = `[E] Recycle • ${bin.label} Station`

      ctx.save()
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'center'
      const textWidth = ctx.measureText(text).width
      const pad = 8

      // Background Pill
      ctx.fillStyle = 'rgba(4, 26, 18, 0.92)'
      ctx.strokeStyle = bin.color
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.roundRect(bin.x - textWidth / 2 - pad, promptY - 11, textWidth + pad * 2, 20, 6)
      ctx.fill()
      ctx.stroke()

      // Prompt Text
      ctx.fillStyle = bin.color
      ctx.fillText(text, bin.x, promptY + 3)
      ctx.restore()
    }
  }

  renderFloatingTexts(ctx) {
    if (this.floatingTexts.length === 0) return

    ctx.save()
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'

    for (let i = 0; i < this.floatingTexts.length; i++) {
      const ft = this.floatingTexts[i]
      ctx.globalAlpha = ft.alpha
      // Shadow stroke
      ctx.fillStyle = '#041A12'
      ctx.fillText(ft.text, ft.x + 1, ft.y + 1)
      // Foreground
      ctx.fillStyle = ft.color
      ctx.fillText(ft.text, ft.x, ft.y)
    }

    ctx.restore()
  }

  // =========================================================================
  // CHARACTER RENDERING (ECO RANGER)
  // =========================================================================

  renderPlayer(ctx) {
    const p = this.player
    drawRangerCharacter(ctx, {
      x: p.x,
      y: p.y,
      scale: 1,
      skinId: p.skinId || DEFAULT_SKIN_ID,
      suitColor: p.skinColor || '#39B86B',
      accentColor: p.accentColor || '#B8F34A',
      facing: p.facing || 'down',
      isMoving: p.isMoving,
      idleTime: p.idleTime,
      walkCycle: p.walkCycle,
      backpackCount: this.backpack.length,
    })
  }

  // =========================================================================
  // ENVIRONMENT ENTITIES RENDERING (Trees, Boulders, Logs, Shrubs)
  // =========================================================================

  renderDeciduousTree(ctx, tree) {
    const x = tree.x
    const y = tree.y

    // Tree Trunk Base Shadow
    ctx.fillStyle = 'rgba(2, 14, 9, 0.5)'
    ctx.beginPath()
    ctx.ellipse(x, y + 4, tree.radius * 1.4, tree.radius * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()

    // Thick Rugged Trunk
    ctx.fillStyle = '#261C14'
    ctx.beginPath()
    ctx.moveTo(x - tree.radius * 0.8, y)
    ctx.lineTo(x - tree.radius * 0.6, y - tree.trunkHeight)
    ctx.lineTo(x + tree.radius * 0.6, y - tree.trunkHeight)
    ctx.lineTo(x + tree.radius * 0.8, y)
    ctx.closePath()
    ctx.fill()

    // Trunk Bark Details
    ctx.strokeStyle = '#18110B'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - 3, y - 4)
    ctx.lineTo(x - 2, y - tree.trunkHeight * 0.6)
    ctx.moveTo(x + 4, y - 2)
    ctx.lineTo(x + 5, y - tree.trunkHeight * 0.8)
    ctx.stroke()

    // Deep Lush Foliage Canopy (Multi-layered overlapping circles)
    const cy = y - tree.trunkHeight - 15
    const r = tree.canopyRadius

    // Dark Under-canopy Shadow
    ctx.fillStyle = 'rgba(4, 26, 18, 0.35)'
    ctx.beginPath()
    ctx.arc(x, cy + 12, r * 0.95, 0, Math.PI * 2)
    ctx.fill()

    // Primary Canopy
    ctx.fillStyle = tree.canopyColor || '#17482D'
    ctx.beginPath()
    ctx.arc(x, cy, r, 0, Math.PI * 2)
    ctx.arc(x - r * 0.45, cy - 8, r * 0.6, 0, Math.PI * 2)
    ctx.arc(x + r * 0.45, cy - 8, r * 0.6, 0, Math.PI * 2)
    ctx.arc(x, cy - r * 0.4, r * 0.65, 0, Math.PI * 2)
    ctx.fill()

    // Upper Highlight Leaf Clumps
    ctx.fillStyle = tree.highlightColor || '#286E45'
    ctx.beginPath()
    ctx.arc(x - r * 0.25, cy - r * 0.2, r * 0.45, 0, Math.PI * 2)
    ctx.arc(x + r * 0.25, cy - r * 0.25, r * 0.4, 0, Math.PI * 2)
    ctx.arc(x, cy - r * 0.5, r * 0.4, 0, Math.PI * 2)
    ctx.fill()

    // Tiny Sunlit Tips
    ctx.fillStyle = '#39B86B'
    ctx.beginPath()
    ctx.arc(x - r * 0.15, cy - r * 0.4, r * 0.2, 0, Math.PI * 2)
    ctx.arc(x + r * 0.2, cy - r * 0.45, r * 0.18, 0, Math.PI * 2)
    ctx.fill()
  }

  renderPineTree(ctx, pine) {
    const x = pine.x
    const y = pine.y
    const r = pine.canopyRadius

    // Drop Shadow
    ctx.fillStyle = 'rgba(2, 14, 9, 0.5)'
    ctx.beginPath()
    ctx.ellipse(x, y + 2, r * 0.8, r * 0.4, 0, 0, Math.PI * 2)
    ctx.fill()

    // Trunk
    ctx.fillStyle = '#261C14'
    ctx.fillRect(x - 5, y - 18, 10, 18)

    // 3 Stacked Conical Pine Layers
    const layers = [
      { yOffset: -18, width: r * 1.8, height: 32, color: '#0F3020' },
      { yOffset: -38, width: r * 1.4, height: 28, color: '#16422C' },
      { yOffset: -56, width: r * 0.9, height: 26, color: '#1E583A' },
    ]

    for (let i = 0; i < layers.length; i++) {
      const l = layers[i]
      ctx.fillStyle = l.color
      ctx.beginPath()
      ctx.moveTo(x, y + l.yOffset - l.height)
      ctx.lineTo(x + l.width * 0.5, y + l.yOffset)
      ctx.lineTo(x - l.width * 0.5, y + l.yOffset)
      ctx.closePath()
      ctx.fill()
    }
  }

  renderBoulder(ctx, boulder) {
    const x = boulder.x
    const y = boulder.y
    const r = boulder.radius

    // Shadow
    ctx.fillStyle = 'rgba(2, 14, 9, 0.45)'
    ctx.beginPath()
    ctx.ellipse(x, y + 4, r * 1.1, r * 0.6, 0.1, 0, Math.PI * 2)
    ctx.fill()

    // Rock Body
    ctx.fillStyle = boulder.color || '#34453A'
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.75, -0.1, 0, Math.PI * 2)
    ctx.fill()

    // Rock Facet Highlights
    ctx.fillStyle = '#485C50'
    ctx.beginPath()
    ctx.ellipse(x - r * 0.3, y - r * 0.25, r * 0.55, r * 0.4, -0.2, 0, Math.PI * 2)
    ctx.fill()

    // Moss Patch
    ctx.fillStyle = boulder.mossColor || '#39B86B'
    ctx.beginPath()
    ctx.arc(x + r * 0.2, y - r * 0.2, r * 0.35, 0, Math.PI * 2)
    ctx.arc(x - r * 0.1, y - r * 0.35, r * 0.25, 0, Math.PI * 2)
    ctx.fill()
  }

  renderFallenLog(ctx, log) {
    const x = log.x
    const y = log.y
    const w = log.width
    const h = log.height

    // Shadow
    ctx.fillStyle = 'rgba(2, 14, 9, 0.45)'
    ctx.beginPath()
    ctx.roundRect(x - 2, y + 2, w + 4, h + 2, 8)
    ctx.fill()

    // Log Body
    ctx.fillStyle = log.color || '#281E15'
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 6)
    ctx.fill()

    // Wood Grain Ring on End
    ctx.fillStyle = '#3E2F22'
    ctx.beginPath()
    ctx.ellipse(x + 5, y + h * 0.5, 3, h * 0.4, 0, 0, Math.PI * 2)
    ctx.fill()

    // Moss on Top Edge
    ctx.fillStyle = log.mossColor || '#39B86B'
    ctx.beginPath()
    ctx.roundRect(x + 14, y - 2, w * 0.55, 5, 2)
    ctx.fill()
  }

  renderShrub(ctx, shrub) {
    const x = shrub.x
    const y = shrub.y
    const r = shrub.radius

    // Shadow
    ctx.fillStyle = 'rgba(2, 14, 9, 0.4)'
    ctx.beginPath()
    ctx.ellipse(x, y + 2, r * 1.1, r * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Clustered Leaves
    ctx.fillStyle = shrub.color || '#1E5236'
    ctx.beginPath()
    ctx.arc(x, y - 4, r * 0.85, 0, Math.PI * 2)
    ctx.arc(x - r * 0.45, y - 2, r * 0.65, 0, Math.PI * 2)
    ctx.arc(x + r * 0.45, y - 2, r * 0.65, 0, Math.PI * 2)
    ctx.fill()

    // Shrub Highlights & Berries
    ctx.fillStyle = '#2C764E'
    ctx.beginPath()
    ctx.arc(x - r * 0.2, y - 6, r * 0.45, 0, Math.PI * 2)
    ctx.arc(x + r * 0.2, y - 5, r * 0.4, 0, Math.PI * 2)
    ctx.fill()

    // Wild Red Berries
    ctx.fillStyle = '#F43F5E'
    ctx.beginPath()
    ctx.arc(x - 5, y - 4, 2, 0, Math.PI * 2)
    ctx.arc(x + 4, y - 7, 2, 0, Math.PI * 2)
    ctx.arc(x + 6, y - 2, 1.8, 0, Math.PI * 2)
    ctx.fill()
  }

  // =========================================================================
  // ATMOSPHERIC OVERLAYS & PERIMETER CANOPY
  // =========================================================================

  renderAtmosphere(ctx) {
    // 1. Perimeter Tree Canopies (Border enclosing the glade)
    this.renderPerimeterCanopy(ctx)

    // 2. Ambient Floating Fireflies
    for (let i = 0; i < this.fireflies.length; i++) {
      const f = this.fireflies[i]
      const alpha = 0.4 + 0.5 * Math.sin(f.phase)
      if (alpha > 0.05) {
        ctx.fillStyle = f.color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
        ctx.fill()

        // Subtle soft halo
        ctx.fillStyle = f.color
        ctx.globalAlpha = alpha * 0.35
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size * 2.8, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1.0

    // 3. Central Sunlight Clearing Radial Gradient
    const sunGrad = ctx.createRadialGradient(
      WORLD_WIDTH * 0.5,
      WORLD_HEIGHT * 0.48,
      120,
      WORLD_WIDTH * 0.5,
      WORLD_HEIGHT * 0.48,
      WORLD_WIDTH * 0.65
    )
    sunGrad.addColorStop(0, 'rgba(184, 243, 74, 0.06)')
    sunGrad.addColorStop(0.6, 'rgba(57, 184, 107, 0.03)')
    sunGrad.addColorStop(1, 'rgba(4, 26, 18, 0.4)')

    ctx.fillStyle = sunGrad
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
  }

  renderPerimeterCanopy(ctx) {
    ctx.fillStyle = '#062016'

    // Top Perimeter Tree Wall
    for (let x = -40; x <= WORLD_WIDTH + 40; x += 65) {
      ctx.beginPath()
      ctx.arc(x, 20, 68, 0, Math.PI * 2)
      ctx.fill()
    }

    // Bottom Perimeter Tree Wall
    for (let x = -40; x <= WORLD_WIDTH + 40; x += 65) {
      ctx.beginPath()
      ctx.arc(x, WORLD_HEIGHT - 10, 68, 0, Math.PI * 2)
      ctx.fill()
    }

    // Left Perimeter Tree Wall
    for (let y = 0; y <= WORLD_HEIGHT; y += 60) {
      ctx.beginPath()
      ctx.arc(10, y, 65, 0, Math.PI * 2)
      ctx.fill()
    }

    // Right Perimeter Tree Wall
    for (let y = 0; y <= WORLD_HEIGHT; y += 60) {
      ctx.beginPath()
      ctx.arc(WORLD_WIDTH - 10, y, 65, 0, Math.PI * 2)
      ctx.fill()
    }

    // Secondary layer of lighter foreground foliage
    ctx.fillStyle = '#0B2C1F'
    for (let x = 0; x <= WORLD_WIDTH; x += 90) {
      ctx.beginPath()
      ctx.arc(x, 0, 48, 0, Math.PI * 2)
      ctx.arc(x + 45, WORLD_HEIGHT, 48, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

// Clamping helper
function pClamped(val, min, max) {
  return Math.max(min, Math.min(max, val))
}
