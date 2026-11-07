/**
 * ECOVERSE ECO ARCADE — PROCEDURAL RANGER RENDERER
 *
 * Unified Canvas 2D rendering pipeline for the controllable Eco Ranger character.
 * Shared across:
 * - Active 2D Game Engine (GameCanvas / EcoCollectorEngine)
 * - Suit Shop visual preview cards (ArcadeShopModal)
 * - Lobby current equipment inspector (ArcadeLobby)
 *
 * Ensures 100% visual consistency without external image assets or dependencies.
 */

/**
 * Draws the complete Eco Ranger character at the given coordinates with
 * suit-specific colors, helmet crests, chest armor patterns, and directional pose.
 */
export function drawRangerCharacter(ctx, options = {}) {
  const {
    x = 0,
    y = 0,
    scale = 1,
    skinId = 'ranger_forest',
    suitColor = '#39B86B',
    accentColor = '#B8F34A',
    facing = 'down',
    isMoving = false,
    idleTime = 0,
    walkCycle = 0,
    backpackCount = 0,
  } = options

  ctx.save()
  ctx.translate(x, y)
  if (scale !== 1) {
    ctx.scale(scale, scale)
  }

  // 1. Soft Dynamic Drop Shadow
  ctx.fillStyle = 'rgba(2, 14, 9, 0.45)'
  ctx.beginPath()
  ctx.ellipse(0, 12, 14, 6, 0, 0, Math.PI * 2)
  ctx.fill()

  // 2. Character Bobbing & Breathing Offsets
  const bobY = isMoving
    ? Math.abs(Math.sin(walkCycle * 2)) * -2.5
    : Math.sin(idleTime) * -1
  const legSwing = isMoving ? Math.sin(walkCycle) * 5 : 0

  // 3. Directional Character Composition
  switch (facing) {
    case 'down':
      drawFacingDown(ctx, skinId, suitColor, accentColor, bobY, legSwing, backpackCount)
      break
    case 'up':
      drawFacingUp(ctx, skinId, suitColor, accentColor, bobY, legSwing, backpackCount)
      break
    case 'left':
      drawFacingSide(ctx, skinId, suitColor, accentColor, bobY, legSwing, -1, backpackCount)
      break
    case 'right':
      drawFacingSide(ctx, skinId, suitColor, accentColor, bobY, legSwing, 1, backpackCount)
      break
    default:
      drawFacingDown(ctx, skinId, suitColor, accentColor, bobY, legSwing, backpackCount)
  }

  ctx.restore()
}

/**
 * Character Facing Forward / Downward
 */
function drawFacingDown(ctx, skinId, suitColor, accentColor, bobY, legSwing, backpackCount) {
  // Legs & Boots
  ctx.fillStyle = getBootColor(skinId)
  // Left Boot
  ctx.beginPath()
  ctx.roundRect(-8, 6 + legSwing, 6, 9, 3)
  ctx.fill()
  // Right Boot
  ctx.beginPath()
  ctx.roundRect(2, 6 - legSwing, 6, 9, 3)
  ctx.fill()

  // Boot Accent Trims
  drawBootAccents(ctx, skinId, accentColor, legSwing)

  // Torso / Bio-Suit Vest
  ctx.save()
  ctx.translate(0, bobY)

  // Main Vest Body
  ctx.fillStyle = suitColor
  ctx.beginPath()
  ctx.roundRect(-10, -10, 20, 18, 5)
  ctx.fill()

  // Suit Specific Chest Pattern & Armor Details
  drawChestDetails(ctx, skinId)

  // Utility Harness & Belt
  ctx.fillStyle = getBeltColor(skinId)
  ctx.fillRect(-10, 2, 20, 4) // Belt strap
  ctx.fillStyle = accentColor
  ctx.fillRect(-3, 2, 6, 4) // Belt buckle

  // Visible Eco-Collector Bag Sides
  const bagColor =
    backpackCount >= 5 ? '#F87171' : backpackCount > 0 ? '#39B86B' : '#041A12'
  ctx.fillStyle = bagColor
  ctx.beginPath()
  ctx.roundRect(-13, -7, 4, 12, 2)
  ctx.roundRect(9, -7, 4, 12, 2)
  ctx.fill()

  // Ranger Head & Face
  ctx.fillStyle = '#E8B688' // Skin tone peek
  ctx.beginPath()
  ctx.arc(0, -12, 7, 0, Math.PI * 2)
  ctx.fill()

  // High-Tech Visor with Suit-Specific Tint
  ctx.fillStyle = getVisorColor(skinId)
  ctx.beginPath()
  ctx.roundRect(-6, -14, 12, 4, 2)
  ctx.fill()

  // Cap Brim
  ctx.fillStyle = getBrimColor(skinId)
  ctx.beginPath()
  ctx.ellipse(0, -15, 12, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Cap / Helmet Crown
  ctx.fillStyle = suitColor
  ctx.beginPath()
  ctx.arc(0, -17, 8, Math.PI, 0)
  ctx.fill()

  // Suit Specific Crest / Leaf / Antenna Emblem
  drawHelmetEmblem(ctx, skinId, accentColor)

  ctx.restore()
}

/**
 * Character Facing Upward (Back View)
 */
function drawFacingUp(ctx, skinId, suitColor, accentColor, bobY, legSwing, backpackCount) {
  // Legs & Boots
  ctx.fillStyle = getBootColor(skinId)
  ctx.beginPath()
  ctx.roundRect(-8, 6 - legSwing, 6, 9, 3)
  ctx.roundRect(2, 6 + legSwing, 6, 9, 3)
  ctx.fill()

  ctx.save()
  ctx.translate(0, bobY)

  // Ranger Torso (Back)
  ctx.fillStyle = suitColor
  ctx.beginPath()
  ctx.roundRect(-10, -10, 20, 18, 5)
  ctx.fill()

  // Prominent Eco-Collector Backpack
  ctx.fillStyle = '#08291C'
  ctx.beginPath()
  ctx.roundRect(-11, -9, 22, 16, 4)
  ctx.fill()

  // Backpack Accent Border
  ctx.strokeStyle =
    backpackCount >= 5 ? '#F87171' : accentColor
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Solar Cell / Bag Fill Gauge (illuminates with items)
  const fillGauge = Math.min(1, backpackCount / 5)
  ctx.fillStyle =
    backpackCount >= 5
      ? '#F87171'
      : fillGauge > 0
        ? '#39B86B'
        : '#0D3524'
  ctx.beginPath()
  ctx.roundRect(-6, -6, 12, 8, 2)
  ctx.fill()

  // Ranger Cap Crown (Back view)
  ctx.fillStyle = getBrimColor(skinId)
  ctx.beginPath()
  ctx.ellipse(0, -15, 12, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = suitColor
  ctx.beginPath()
  ctx.arc(0, -16, 9, 0, Math.PI * 2)
  ctx.fill()

  // Helmet Back Vent / Accent
  ctx.fillStyle = accentColor
  ctx.fillRect(-3, -19, 6, 2)

  ctx.restore()
}

/**
 * Character Facing Side (Profile View)
 */
function drawFacingSide(ctx, skinId, suitColor, accentColor, bobY, legSwing, dir, backpackCount) {
  // dir: 1 = right, -1 = left
  ctx.scale(dir, 1)

  // Boots (Stepping motion)
  ctx.fillStyle = getBootColor(skinId)
  ctx.beginPath()
  ctx.roundRect(-3 + legSwing, 6, 7, 9, 3)
  ctx.roundRect(-3 - legSwing, 6, 7, 9, 3)
  ctx.fill()

  ctx.save()
  ctx.translate(0, bobY)

  // Backpack hanging on rear side
  ctx.fillStyle = '#08291C'
  ctx.beginPath()
  ctx.roundRect(-13, -8, 8, 15, 3)
  ctx.fill()
  ctx.fillStyle = backpackCount >= 5 ? '#F87171' : accentColor
  ctx.fillRect(-13, -2, 8, 2) // Reflective band

  // Torso Profile
  ctx.fillStyle = suitColor
  ctx.beginPath()
  ctx.roundRect(-6, -10, 14, 18, 4)
  ctx.fill()

  // Side Chest Accent Strip
  ctx.fillStyle = accentColor
  ctx.fillRect(-1, -7, 2, 8)

  // Belt
  ctx.fillStyle = getBeltColor(skinId)
  ctx.fillRect(-6, 2, 14, 4)
  ctx.fillStyle = accentColor
  ctx.fillRect(4, 2, 3, 4)

  // Head & Visor Profile
  ctx.fillStyle = '#E8B688'
  ctx.beginPath()
  ctx.arc(1, -12, 7, 0, Math.PI * 2)
  ctx.fill()

  // Visor profile
  ctx.fillStyle = getVisorColor(skinId)
  ctx.beginPath()
  ctx.roundRect(1, -14, 8, 4, 2)
  ctx.fill()

  // Cap Brim
  ctx.fillStyle = getBrimColor(skinId)
  ctx.beginPath()
  ctx.roundRect(-5, -16, 15, 4, 2)
  ctx.fill()

  // Cap Crown Profile
  ctx.fillStyle = suitColor
  ctx.beginPath()
  ctx.arc(1, -17, 8, Math.PI * 0.9, 0.1)
  ctx.fill()

  ctx.restore()
}

// ===========================================================================
// SUIT THEME STYLING HELPERS
// ===========================================================================

function getBootColor(skinId) {
  switch (skinId) {
    case 'ranger_solar':
      return '#261F0D'
    case 'ranger_river':
      return '#0B2238'
    case 'ranger_neon':
      return '#0A1A10'
    case 'ranger_cyber_botanist':
      return '#102A26'
    case 'ranger_forest':
    default:
      return '#112218'
  }
}

function drawBootAccents(ctx, skinId, accentColor, legSwing) {
  ctx.fillStyle = accentColor
  if (skinId === 'ranger_solar') {
    ctx.fillRect(-7, 13 + legSwing, 4, 2)
    ctx.fillRect(3, 13 - legSwing, 4, 2)
  } else if (skinId === 'ranger_neon') {
    ctx.fillRect(-8, 14 + legSwing, 6, 1.5)
    ctx.fillRect(2, 14 - legSwing, 6, 1.5)
  } else if (skinId === 'ranger_cyber_botanist') {
    ctx.fillRect(-6, 12 + legSwing, 2, 2)
    ctx.fillRect(4, 12 - legSwing, 2, 2)
  }
}

function getBeltColor(skinId) {
  switch (skinId) {
    case 'ranger_solar':
      return '#422006'
    case 'ranger_river':
      return '#082F49'
    case 'ranger_neon':
      return '#041A12'
    case 'ranger_cyber_botanist':
      return '#042F2E'
    case 'ranger_forest':
    default:
      return '#08291C'
  }
}

function getBrimColor(skinId) {
  switch (skinId) {
    case 'ranger_solar':
      return '#854D0E'
    case 'ranger_river':
      return '#1E3A8A'
    case 'ranger_neon':
      return '#064E3B'
    case 'ranger_cyber_botanist':
      return '#134E4A'
    case 'ranger_forest':
    default:
      return '#0D3524'
  }
}

function getVisorColor(skinId) {
  switch (skinId) {
    case 'ranger_solar':
      return '#22C55E' // Bright green solar visor
    case 'ranger_river':
      return '#38BDF8' // Hydro-cyan aquatic visor
    case 'ranger_neon':
      return '#B8F34A' // Electric lime radiant visor
    case 'ranger_cyber_botanist':
      return '#A7F3D0' // Mint holographic botanical HUD
    case 'ranger_forest':
    default:
      return '#B8F34A' // Classic neon lime
  }
}

function drawChestDetails(ctx, skinId) {
  ctx.save()
  if (skinId === 'ranger_forest') {
    // Classic dual utility straps
    ctx.fillStyle = 'rgba(4, 26, 18, 0.4)'
    ctx.fillRect(-7, -10, 4, 12)
    ctx.fillRect(3, -10, 4, 12)
  } else if (skinId === 'ranger_solar') {
    // Dual photovoltaic solar cells
    ctx.fillStyle = '#22C55E'
    ctx.fillRect(-6, -9, 3, 10)
    ctx.fillRect(3, -9, 3, 10)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fillRect(-5, -8, 1, 8)
    ctx.fillRect(4, -8, 1, 8)
  } else if (skinId === 'ranger_river') {
    // Deep blue hydrodynamic chest chevron
    ctx.fillStyle = '#1E40AF'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-7, -8)
    ctx.lineTo(7, -8)
    ctx.closePath()
    ctx.fill()
  } else if (skinId === 'ranger_neon') {
    // High-visibility neon chevron bands
    ctx.fillStyle = '#10B981'
    ctx.fillRect(-8, -8, 16, 2)
    ctx.fillRect(-6, -4, 12, 2)
  } else if (skinId === 'ranger_cyber_botanist') {
    // Angular cybernetic leaf matrix
    ctx.fillStyle = '#A7F3D0'
    ctx.beginPath()
    ctx.arc(0, -5, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#042F2E'
    ctx.fillRect(-1, -9, 2, 4)
  }
  ctx.restore()
}

function drawHelmetEmblem(ctx, skinId, accentColor) {
  ctx.fillStyle = accentColor
  ctx.beginPath()
  if (skinId === 'ranger_solar') {
    // Sunburst / Solar Node
    ctx.arc(0, -18, 2.5, 0, Math.PI * 2)
    ctx.fill()
  } else if (skinId === 'ranger_river') {
    // Droplet crest
    ctx.arc(0, -18, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(-1, -21, 2, 3)
  } else if (skinId === 'ranger_neon') {
    // Radiant chevron
    ctx.fillRect(-3, -19, 6, 2)
  } else if (skinId === 'ranger_cyber_botanist') {
    // Sprout antenna node
    ctx.arc(0, -19, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(-0.5, -22, 1, 3)
  } else {
    // Classic Forest Leaf Emblem
    ctx.arc(0, -18, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}
