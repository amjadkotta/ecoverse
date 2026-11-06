/**
 * ECOVERSE Eco Journey — Achievement Canvas Utility
 *
 * Generates high-resolution 1200x800 PNG achievement cards, level certificates,
 * and Eco Journey summary passports using the native HTML5 Canvas API.
 * Features a cinematic 3D Earth globe illustration, atmospheric glows,
 * orbital rings, and premium environmental typography.
 */

// Helper: cross-browser rounded rectangle
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
  } else {
    const radius = Math.min(r, w / 2, h / 2)
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.arcTo(x + w, y, x + w, y + radius, radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
    ctx.lineTo(x + radius, y + h)
    ctx.arcTo(x, y + h, x, y + h - radius, radius)
    ctx.lineTo(x + radius, y)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.closePath()
  }
}

// Helper: renders the premium 3D Earth globe with daylight illumination,
// emerald continents, atmospheric clouds, orbital rings, and stardust.
function drawEarthGlobe(ctx, cx, cy, R) {
  // A. Background Ambient Biosphere Glow
  const planetAtmosphere = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 2.3)
  planetAtmosphere.addColorStop(0, 'rgba(57, 184, 107, 0.22)')
  planetAtmosphere.addColorStop(0.35, 'rgba(184, 243, 74, 0.12)')
  planetAtmosphere.addColorStop(0.70, 'rgba(184, 243, 74, 0.03)')
  planetAtmosphere.addColorStop(1, 'rgba(4, 26, 18, 0)')
  ctx.fillStyle = planetAtmosphere
  ctx.beginPath()
  ctx.arc(cx, cy, R * 2.3, 0, Math.PI * 2)
  ctx.fill()

  // B. Background Half of Orbital Telemetry Rings
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((-20 * Math.PI) / 180)
  ctx.scale(1, 0.36)

  // Outer dashed telemetry ring (back half)
  ctx.beginPath()
  ctx.arc(0, 0, R * 1.45, Math.PI, Math.PI * 2)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.35)'
  ctx.lineWidth = 1.2
  ctx.setLineDash([5, 8])
  ctx.stroke()
  ctx.setLineDash([])

  // Inner solid glowing ring (back half)
  ctx.beginPath()
  ctx.arc(0, 0, R * 1.26, Math.PI, Math.PI * 2)
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.40)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.restore()

  // C. Planet Body (Clipped Sphere)
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.clip()

  // Ocean Base: Rich Natural Deep-Blue Spherical Gradient
  const oceanGrad = ctx.createRadialGradient(
    cx - R * 0.35,
    cy - R * 0.35,
    R * 0.08,
    cx,
    cy,
    R
  )
  oceanGrad.addColorStop(0, '#1E7BB8')
  oceanGrad.addColorStop(0.30, '#145C8E')
  oceanGrad.addColorStop(0.60, '#0E4369')
  oceanGrad.addColorStop(0.85, '#082C48')
  oceanGrad.addColorStop(1, '#04192D')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2)

  // D. Coordinate Grid
  ctx.save()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.22)'
  ctx.lineWidth = 0.8
  ctx.setLineDash([3, 5])

  ;[-0.6, -0.3, 0, 0.3, 0.6].forEach((latSin) => {
    const cosLat = Math.sqrt(1 - latSin * latSin)
    const py = cy + latSin * R * 0.95
    const rx = R * cosLat * 0.98
    const ry = rx * 0.28
    ctx.beginPath()
    ctx.ellipse(cx, py, rx, ry, (-12 * Math.PI) / 180, 0, Math.PI * 2)
    ctx.stroke()
  })

  ;[-0.75, -0.4, 0, 0.4, 0.75].forEach((lonSin) => {
    const rx = Math.abs(lonSin) * R * 0.98
    if (rx > 5) {
      ctx.beginPath()
      ctx.ellipse(cx + lonSin * R * 0.25, cy, rx, R * 0.98, (8 * Math.PI) / 180, 0, Math.PI * 2)
      ctx.stroke()
    }
  })
  ctx.setLineDash([])
  ctx.restore()

  // E. Continents
  ctx.save()
  ctx.translate(cx, cy)

  const drawContinents = () => {
    // Africa
    ctx.beginPath()
    ctx.moveTo(-0.30 * R, -0.32 * R)
    ctx.bezierCurveTo(-0.24 * R, -0.36 * R, -0.14 * R, -0.35 * R, -0.04 * R, -0.30 * R)
    ctx.bezierCurveTo(0.04 * R, -0.32 * R, 0.11 * R, -0.30 * R, 0.15 * R, -0.25 * R)
    ctx.bezierCurveTo(0.18 * R, -0.19 * R, 0.23 * R, -0.14 * R, 0.34 * R, -0.04 * R)
    ctx.bezierCurveTo(0.30 * R, 0.06 * R, 0.24 * R, 0.18 * R, 0.20 * R, 0.31 * R)
    ctx.bezierCurveTo(0.16 * R, 0.42 * R, 0.11 * R, 0.50 * R, 0.04 * R, 0.56 * R)
    ctx.bezierCurveTo(-0.02 * R, 0.50 * R, -0.07 * R, 0.38 * R, -0.08 * R, 0.25 * R)
    ctx.bezierCurveTo(-0.09 * R, 0.15 * R, -0.14 * R, 0.09 * R, -0.22 * R, 0.05 * R)
    ctx.bezierCurveTo(-0.33 * R, 0.04 * R, -0.42 * R, -0.02 * R, -0.44 * R, -0.11 * R)
    ctx.bezierCurveTo(-0.41 * R, -0.19 * R, -0.36 * R, -0.25 * R, -0.30 * R, -0.32 * R)
    ctx.closePath()

    // Madagascar
    ctx.moveTo(0.29 * R, 0.18 * R)
    ctx.bezierCurveTo(0.34 * R, 0.22 * R, 0.35 * R, 0.32 * R, 0.31 * R, 0.42 * R)
    ctx.bezierCurveTo(0.27 * R, 0.36 * R, 0.26 * R, 0.26 * R, 0.29 * R, 0.18 * R)
    ctx.closePath()

    // Europe
    ctx.moveTo(-0.32 * R, -0.40 * R)
    ctx.lineTo(-0.23 * R, -0.39 * R)
    ctx.bezierCurveTo(-0.19 * R, -0.45 * R, -0.14 * R, -0.42 * R, -0.07 * R, -0.36 * R)
    ctx.lineTo(-0.05 * R, -0.42 * R)
    ctx.bezierCurveTo(-0.01 * R, -0.44 * R, 0.04 * R, -0.40 * R, 0.08 * R, -0.36 * R)
    ctx.bezierCurveTo(0.10 * R, -0.46 * R, 0.02 * R, -0.54 * R, -0.07 * R, -0.54 * R)
    ctx.bezierCurveTo(-0.05 * R, -0.64 * R, 0.06 * R, -0.60 * R, 0.02 * R, -0.52 * R)
    ctx.bezierCurveTo(-0.15 * R, -0.60 * R, -0.25 * R, -0.54 * R, -0.32 * R, -0.40 * R)
    ctx.closePath()

    // British Isles
    ctx.moveTo(-0.28 * R, -0.54 * R)
    ctx.bezierCurveTo(-0.25 * R, -0.51 * R, -0.23 * R, -0.58 * R, -0.27 * R, -0.61 * R)
    ctx.closePath()

    // Arabian Peninsula
    ctx.moveTo(0.17 * R, -0.24 * R)
    ctx.bezierCurveTo(0.23 * R, -0.19 * R, 0.28 * R, -0.13 * R, 0.36 * R, -0.10 * R)
    ctx.bezierCurveTo(0.34 * R, -0.18 * R, 0.28 * R, -0.22 * R, 0.21 * R, -0.26 * R)
    ctx.closePath()

    // Asia
    ctx.moveTo(0.11 * R, -0.38 * R)
    ctx.bezierCurveTo(0.24 * R, -0.42 * R, 0.38 * R, -0.39 * R, 0.52 * R, -0.32 * R)
    ctx.bezierCurveTo(0.60 * R, -0.24 * R, 0.54 * R, -0.12 * R, 0.43 * R, -0.10 * R)
    ctx.bezierCurveTo(0.38 * R, -0.20 * R, 0.28 * R, -0.30 * R, 0.11 * R, -0.38 * R)
    ctx.closePath()
  }

  const landGrad = ctx.createLinearGradient(-R * 0.4, -R * 0.4, R * 0.5, R * 0.5)
  landGrad.addColorStop(0, '#42E28E')
  landGrad.addColorStop(0.35, '#2EBA6D')
  landGrad.addColorStop(0.70, '#1E8B4C')
  landGrad.addColorStop(1, '#136334')
  ctx.fillStyle = landGrad
  drawContinents()
  ctx.fill()

  ctx.strokeStyle = '#B8F34A'
  ctx.lineWidth = 1.6
  ctx.lineJoin = 'round'
  ctx.stroke()
  ctx.restore()

  // F. Clouds
  ctx.save()
  ctx.translate(cx, cy)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)'
  ctx.beginPath()
  ctx.moveTo(-0.48 * R, -0.04 * R)
  ctx.bezierCurveTo(-0.24 * R, -0.07 * R, -0.04 * R, 0.03 * R, 0.16 * R, -0.01 * R)
  ctx.bezierCurveTo(0.32 * R, -0.05 * R, 0.44 * R, 0.05 * R, 0.56 * R, 0.03 * R)
  ctx.bezierCurveTo(0.44 * R, 0.09 * R, 0.20 * R, 0.07 * R, -0.04 * R, 0.09 * R)
  ctx.bezierCurveTo(-0.26 * R, 0.13 * R, -0.40 * R, 0.05 * R, -0.48 * R, -0.04 * R)
  ctx.fill()
  ctx.restore()

  // G. Shading
  const shadowGrad = ctx.createRadialGradient(
    cx - R * 0.35,
    cy - R * 0.35,
    R * 0.50,
    cx + R * 0.35,
    cy + R * 0.35,
    R * 1.15
  )
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
  shadowGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0)')
  shadowGrad.addColorStop(0.82, 'rgba(2, 12, 22, 0.25)')
  shadowGrad.addColorStop(0.94, 'rgba(2, 12, 22, 0.52)')
  shadowGrad.addColorStop(1, 'rgba(2, 12, 22, 0.70)')
  ctx.fillStyle = shadowGrad
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2)

  // Sun Glint
  const glintGrad = ctx.createRadialGradient(
    cx - R * 0.38,
    cy - R * 0.38,
    0,
    cx - R * 0.38,
    cy - R * 0.38,
    R * 0.45
  )
  glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)')
  glintGrad.addColorStop(0.25, 'rgba(184, 243, 74, 0.22)')
  glintGrad.addColorStop(0.55, 'rgba(30, 123, 184, 0)')
  ctx.fillStyle = glintGrad
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2)
  ctx.restore()

  // H. Atmospheric Rim
  ctx.beginPath()
  ctx.arc(cx, cy, R + 0.8, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.95)'
  ctx.lineWidth = 2.0
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, R + 2.5, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.45)'
  ctx.lineWidth = 3.5
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, R + 6, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.25)'
  ctx.lineWidth = 7
  ctx.stroke()

  // Crescent
  ctx.beginPath()
  ctx.arc(cx, cy, R + 1.2, Math.PI * 0.72, Math.PI * 1.76)
  ctx.strokeStyle = '#B8F34A'
  ctx.lineWidth = 2.8
  ctx.stroke()

  // I. Foreground Rings
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((-20 * Math.PI) / 180)
  ctx.scale(1, 0.36)

  ctx.beginPath()
  ctx.arc(0, 0, R * 1.26, 0, Math.PI)
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.80)'
  ctx.lineWidth = 1.8
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, R * 1.45, 0, Math.PI)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.55)'
  ctx.lineWidth = 1.2
  ctx.setLineDash([5, 8])
  ctx.stroke()
  ctx.setLineDash([])
  ctx.restore()

  // Satellite Node
  const nodeAngle = 0.62
  const rot = (-20 * Math.PI) / 180
  const nodeR = R * 1.26
  const unX = Math.cos(nodeAngle) * nodeR
  const unY = Math.sin(nodeAngle) * nodeR * 0.36
  const actualNodeX = cx + (unX * Math.cos(rot) - unY * Math.sin(rot))
  const actualNodeY = cy + (unX * Math.sin(rot) + unY * Math.cos(rot))

  ctx.beginPath()
  ctx.arc(actualNodeX, actualNodeY, 3.5, 0, Math.PI * 2)
  ctx.fillStyle = '#B8F34A'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(actualNodeX, actualNodeY, 7.5, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.65)'
  ctx.lineWidth = 1.4
  ctx.stroke()

  // Stardust
  const particles = [
    { x: cx - 180, y: cy - 120, r: 1.6, o: 0.65 },
    { x: cx - 155, y: cy - 150, r: 2.2, o: 0.8 },
    { x: cx - 160, y: cy + 130, r: 1.8, o: 0.7 },
    { x: cx + 160, y: cy - 140, r: 2.0, o: 0.75 },
    { x: cx + 180, y: cy + 110, r: 2.4, o: 0.85 },
  ]
  particles.forEach((p) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(184, 243, 74, ${p.o})`
    ctx.fill()
  })
}

// Helper: draws the certificate background, borders, and corner brackets
function drawCertificateBackground(ctx) {
  // Gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 1200, 800)
  bgGradient.addColorStop(0, '#041A12')
  bgGradient.addColorStop(0.45, '#07281C')
  bgGradient.addColorStop(1, '#03140E')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, 1200, 800)

  // Ambient corner glows
  const trGlow = ctx.createRadialGradient(1080, 100, 0, 1080, 100, 480)
  trGlow.addColorStop(0, 'rgba(184, 243, 74, 0.12)')
  trGlow.addColorStop(1, 'rgba(184, 243, 74, 0)')
  ctx.fillStyle = trGlow
  ctx.fillRect(0, 0, 1200, 800)

  const blGlow = ctx.createRadialGradient(120, 720, 0, 120, 720, 520)
  blGlow.addColorStop(0, 'rgba(57, 184, 107, 0.15)')
  blGlow.addColorStop(1, 'rgba(57, 184, 107, 0)')
  ctx.fillStyle = blGlow
  ctx.fillRect(0, 0, 1200, 800)

  // Outer and inner borders
  drawRoundedRect(ctx, 36, 36, 1128, 728, 24)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.35)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  drawRoundedRect(ctx, 48, 48, 1104, 704, 18)
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.15)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Corner brackets
  ctx.strokeStyle = '#B8F34A'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'

  // Top-left
  ctx.beginPath()
  ctx.moveTo(58, 80)
  ctx.lineTo(58, 58)
  ctx.lineTo(80, 58)
  ctx.stroke()

  // Top-right
  ctx.beginPath()
  ctx.moveTo(1122, 58)
  ctx.lineTo(1142, 58)
  ctx.lineTo(1142, 80)
  ctx.stroke()

  // Bottom-left
  ctx.beginPath()
  ctx.moveTo(58, 720)
  ctx.lineTo(58, 742)
  ctx.lineTo(80, 742)
  ctx.stroke()

  // Bottom-right
  ctx.beginPath()
  ctx.moveTo(1122, 742)
  ctx.lineTo(1142, 742)
  ctx.lineTo(1142, 720)
  ctx.stroke()
}

// Helper: draws header branding and record date
function drawHeader(ctx, dateStr, rightLabel = 'RECORDED') {
  // Emblem
  drawRoundedRect(ctx, 76, 74, 48, 48, 12)
  ctx.fillStyle = '#08291C'
  ctx.fill()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.45)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Leaf icon
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(86, 110)
  ctx.bezierCurveTo(86, 88, 101, 83, 114, 85)
  ctx.bezierCurveTo(116, 102, 109, 114, 86, 110)
  ctx.fillStyle = '#B8F34A'
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(86, 110)
  ctx.quadraticCurveTo(99, 98, 112, 87)
  ctx.strokeStyle = '#041A12'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.restore()

  // Title
  ctx.fillStyle = '#F3F7EF'
  ctx.font = "bold 26px 'Space Grotesk', system-ui, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('ECOVERSE', 136, 90)

  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 10px 'Space Grotesk', monospace, sans-serif"
  ctx.fillText('ECO JOURNEY SUSTAINABILITY SYSTEM', 136, 111)

  // Date Tag
  drawRoundedRect(ctx, 840, 76, 284, 42, 21)
  ctx.fillStyle = 'rgba(8, 41, 28, 0.9)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.35)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 11px monospace, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${rightLabel}: ${dateStr.toUpperCase()}`, 982, 97)

  // Header separator
  ctx.beginPath()
  ctx.moveTo(76, 146)
  ctx.lineTo(1124, 146)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.25)'
  ctx.lineWidth = 1
  ctx.stroke()
}

// Helper: draws footer
function drawFooter(ctx, quote = '“Small Actions. Greener Tomorrow.”', footnote = 'ECOVERSE • PLANETARY RESTORATION') {
  ctx.beginPath()
  ctx.moveTo(76, 680)
  ctx.lineTo(1124, 680)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.25)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#B8F34A'
  ctx.font = "800 20px 'Space Grotesk', system-ui, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(quote, 76, 718)

  ctx.fillStyle = '#A4B6A8'
  ctx.font = "600 12px monospace, sans-serif"
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText(footnote, 1124, 718)
}

/**
 * A. GENERATE INDIVIDUAL BADGE CARD
 */
export async function generateBadgeCardCanvas({
  badge,
  userLevel = {},
  totalPoints = 0,
  unlockDate = null,
}) {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      // Font fallback
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  // Draw background & framing
  drawCertificateBackground(ctx)

  // Header
  const dateFormatted = unlockDate
    ? new Date(unlockDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  drawHeader(ctx, dateFormatted, 'UNLOCKED')

  // Title area
  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 12px monospace, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('OFFICIAL MILESTONE DISTINCTION', 76, 172)

  ctx.fillStyle = '#F3F7EF'
  ctx.font = "800 38px 'Space Grotesk', system-ui, sans-serif"
  ctx.fillText(badge.title.toUpperCase(), 76, 196)

  // Rarity Pill
  const rarityColors = {
    Legendary: '#FACC15',
    Epic: '#C084FC',
    Rare: '#38BDF8',
    Common: '#34D399',
  }
  const rColor = rarityColors[badge.rarity] || '#B8F34A'

  drawRoundedRect(ctx, 76, 252, 140, 28, 14)
  ctx.fillStyle = 'rgba(8, 41, 28, 0.9)'
  ctx.fill()
  ctx.strokeStyle = rColor
  ctx.lineWidth = 1.2
  ctx.stroke()

  ctx.fillStyle = rColor
  ctx.font = "700 11px monospace, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${badge.rarity.toUpperCase()} HONOR`, 146, 266)

  // Tagline & Description
  ctx.fillStyle = '#B8F34A'
  ctx.font = "600 16px 'Space Grotesk', system-ui, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(badge.tagline, 76, 296)

  ctx.fillStyle = 'rgba(243, 247, 239, 0.85)'
  ctx.font = "400 15px 'Inter', system-ui, sans-serif"
  ctx.fillText(badge.description, 76, 326)

  // Criteria Box
  drawRoundedRect(ctx, 76, 376, 560, 100, 16)
  ctx.fillStyle = 'rgba(13, 53, 36, 0.85)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.4)'
  ctx.lineWidth = 1.2
  ctx.stroke()

  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 11px monospace, sans-serif"
  ctx.fillText('CRITERIA SATISFIED', 100, 396)

  ctx.fillStyle = '#F3F7EF'
  ctx.font = "600 16px 'Space Grotesk', system-ui, sans-serif"
  ctx.fillText(badge.requirement, 100, 422)

  ctx.fillStyle = '#A4B6A8'
  ctx.font = "400 12px monospace, sans-serif"
  ctx.fillText(`CATEGORY: ${badge.category.toUpperCase()} • STATUS: OFFICIALLY UNLOCKED`, 100, 450)

  // User Stats Footnote Tiles
  drawRoundedRect(ctx, 76, 500, 270, 72, 14)
  ctx.fillStyle = 'rgba(8, 41, 28, 0.8)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.25)'
  ctx.stroke()

  ctx.fillStyle = '#A4B6A8'
  ctx.font = "700 10px monospace, sans-serif"
  ctx.fillText('USER RANK AT ACHIEVEMENT', 96, 516)
  ctx.fillStyle = '#F3F7EF'
  ctx.font = "bold 15px 'Space Grotesk', sans-serif"
  ctx.fillText(`Level ${userLevel.level || 1} • ${userLevel.title || 'Sprout Pioneer'}`, 96, 540)

  drawRoundedRect(ctx, 366, 500, 270, 72, 14)
  ctx.fillStyle = 'rgba(8, 41, 28, 0.8)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.25)'
  ctx.stroke()

  ctx.fillStyle = '#A4B6A8'
  ctx.font = "700 10px monospace, sans-serif"
  ctx.fillText('TOTAL ECO POINTS EARNED', 386, 516)
  ctx.fillStyle = '#B8F34A'
  ctx.font = "bold 20px 'Space Grotesk', sans-serif"
  ctx.fillText(`${totalPoints.toLocaleString()} PTS`, 386, 542)

  // Earth Globe (Lower-Right)
  drawEarthGlobe(ctx, 890, 470, 145)

  // Footer
  drawFooter(ctx, '“Small Actions. Greener Tomorrow.”', 'ECOVERSE • ACHIEVEMENT DISTINCTION')

  return canvas
}

/**
 * B. GENERATE LEVEL ACHIEVEMENT CARD
 */
export async function generateLevelCardCanvas({
  level,
  totalPoints = 0,
  streak = { current: 0, best: 0 },
  date = null,
}) {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      // Font fallback
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  // Background
  drawCertificateBackground(ctx)

  // Header
  const dateStr = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  drawHeader(ctx, dateStr, 'HONOR ATTAINED')

  // Section Title
  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 12px monospace, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('PLANETARY PROGRESSION RECOGNITION', 76, 172)

  ctx.fillStyle = '#F3F7EF'
  ctx.font = "800 40px 'Space Grotesk', system-ui, sans-serif"
  ctx.fillText(`LEVEL ${level.level}: ${level.title.toUpperCase()}`, 76, 196)

  ctx.fillStyle = '#B8F34A'
  ctx.font = "600 17px 'Space Grotesk', system-ui, sans-serif"
  ctx.fillText(level.tagline, 76, 252)

  ctx.fillStyle = 'rgba(243, 247, 239, 0.85)'
  ctx.font = "400 15px 'Inter', system-ui, sans-serif"
  ctx.fillText(level.description, 76, 282)

  // 3 Metric Boxes (Left Showcase)
  const boxes = [
    { label: 'TIER BRACKET', val: `${level.minPoints.toLocaleString()} – ${level.maxPoints === Infinity ? 'MAX' : `${level.maxPoints.toLocaleString()} PTS`}` },
    { label: 'CURRENT ECO POINTS', val: `${totalPoints.toLocaleString()} PTS` },
    { label: 'ACTIVE HABIT STREAK', val: `${streak.current} DAYS (BEST: ${streak.best}d)` },
  ]

  boxes.forEach((b, i) => {
    const by = 330 + i * 82
    drawRoundedRect(ctx, 76, by, 560, 68, 14)
    ctx.fillStyle = 'rgba(13, 53, 36, 0.85)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(57, 184, 107, 0.4)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.fillStyle = '#B8F34A'
    ctx.font = "700 10px monospace, sans-serif"
    ctx.fillText(b.label, 96, by + 14)

    ctx.fillStyle = '#F3F7EF'
    ctx.font = "bold 18px 'Space Grotesk', sans-serif"
    ctx.fillText(b.val, 96, by + 34)
  })

  // Rank Badge Pill
  drawRoundedRect(ctx, 76, 594, 560, 48, 14)
  ctx.fillStyle = 'rgba(8, 41, 28, 0.9)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.4)'
  ctx.stroke()

  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 11px monospace, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`STATUS: OFFICIAL LEVEL ${level.level} PLANETARY STEWARD`, 356, 618)

  // Earth Globe
  drawEarthGlobe(ctx, 890, 470, 145)

  // Footer
  drawFooter(ctx, '“Every habit builds shared planetary resilience.”', 'ECOVERSE • TIER ADVANCEMENT')

  return canvas
}

/**
 * C. GENERATE ECO JOURNEY SUMMARY CARD
 */
export async function generateSummaryCardCanvas({
  level = {},
  totalPoints = 0,
  streak = { current: 0, best: 0 },
  totalCompleted = 0,
  unlockedBadgesCount = 0,
  categoryTotals = {},
  date = null,
}) {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      // Font fallback
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  // Background
  drawCertificateBackground(ctx)

  // Header
  const dateStr = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  drawHeader(ctx, dateStr, 'GENERATED')

  // Section Title
  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 12px monospace, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('PERSONAL SUSTAINABILITY PASSPORT', 76, 172)

  ctx.fillStyle = '#F3F7EF'
  ctx.font = "800 40px 'Space Grotesk', system-ui, sans-serif"
  ctx.fillText('ECO JOURNEY SUMMARY', 76, 196)

  ctx.fillStyle = 'rgba(243, 247, 239, 0.85)'
  ctx.font = "400 15px 'Inter', system-ui, sans-serif"
  ctx.fillText(
    'A comprehensive record of daily and weekly environmental mindfulness across 5 sustainability pillars.',
    76,
    250
  )

  // 4 Core KPI Tiles (2x2 Grid)
  const tiles = [
    { label: 'TOTAL ECO POINTS', val: `${totalPoints.toLocaleString()} PTS`, color: '#B8F34A' },
    { label: 'CURRENT LEVEL & RANK', val: `Lvl ${level.level || 1} • ${level.title || 'Sprout Pioneer'}`, color: '#F3F7EF' },
    { label: 'ACTIONS COMPLETED', val: `${totalCompleted} Challenges Logged`, color: '#F3F7EF' },
    { label: 'HABIT STREAK', val: `${streak.current} Days (Best: ${streak.best}d)`, color: '#F3F7EF' },
  ]

  tiles.forEach((t, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const tx = 76 + col * 285
    const ty = 296 + row * 82

    drawRoundedRect(ctx, tx, ty, 270, 70, 14)
    ctx.fillStyle = 'rgba(13, 53, 36, 0.85)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(57, 184, 107, 0.4)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.fillStyle = '#B8F34A'
    ctx.font = "700 10px monospace, sans-serif"
    ctx.fillText(t.label, tx + 16, ty + 14)

    ctx.fillStyle = t.color
    ctx.font = "bold 15px 'Space Grotesk', sans-serif"
    ctx.fillText(t.val, tx + 16, ty + 36)
  })

  // Category Distribution Row (5 Pillars)
  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 11px monospace, sans-serif"
  ctx.fillText(`PILLAR IMPACT DISTRIBUTION (${unlockedBadgesCount} / 12 BADGES UNLOCKED)`, 76, 480)

  const catKeys = ['Energy', 'Conservation', 'Mobility', 'Nature', 'Advocacy']
  const catW = 104
  const gap = 10

  catKeys.forEach((cat, idx) => {
    const cxP = 76 + idx * (catW + gap)
    const cyP = 502
    const pts = categoryTotals[cat] || 0

    drawRoundedRect(ctx, cxP, cyP, catW, 58, 12)
    ctx.fillStyle = 'rgba(8, 41, 28, 0.85)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(184, 243, 74, 0.25)'
    ctx.stroke()

    ctx.fillStyle = '#A4B6A8'
    ctx.font = "700 9px monospace, sans-serif"
    ctx.textAlign = 'center'
    ctx.fillText(cat.toUpperCase(), cxP + catW / 2, cyP + 14)

    ctx.fillStyle = '#F3F7EF'
    ctx.font = "bold 13px 'Space Grotesk', sans-serif"
    ctx.fillText(`${pts} PTS`, cxP + catW / 2, cyP + 34)
  })

  // On-Device Integrity Guarantee Pill
  drawRoundedRect(ctx, 76, 586, 560, 48, 14)
  ctx.fillStyle = 'rgba(8, 41, 28, 0.9)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.4)'
  ctx.stroke()

  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 11px monospace, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('HONEST PARTICIPATION // 100% PRIVATE ON-DEVICE HABIT LOG', 356, 610)

  // Earth Globe
  drawEarthGlobe(ctx, 890, 470, 145)

  // Footer
  drawFooter(ctx, '“Small Actions. Greener Tomorrow.”', 'ECOVERSE • PASSPORT SUMMARY')

  return canvas
}

/**
 * Helper: converts canvas to PNG blob and triggers browser download
 */
export function downloadCanvasAsPng(canvas, fileName = 'ECOVERSE-Achievement.png') {
  return new Promise((resolve, reject) => {
    try {
      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob((blob) => {
          if (!blob) {
            triggerDataUrlDownload(canvas, fileName)
            resolve(true)
            return
          }
          const blobUrl = URL.createObjectURL(blob)
          const downloadLink = document.createElement('a')
          downloadLink.href = blobUrl
          downloadLink.download = fileName
          downloadLink.style.display = 'none'
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
          setTimeout(() => URL.revokeObjectURL(blobUrl), 2000)
          resolve(true)
        }, 'image/png')
      } else {
        triggerDataUrlDownload(canvas, fileName)
        resolve(true)
      }
    } catch (err) {
      reject(err)
    }
  })
}

// Fallback dataURL trigger
function triggerDataUrlDownload(canvas, fileName) {
  const dataUrl = canvas.toDataURL('image/png')
  const downloadLink = document.createElement('a')
  downloadLink.href = dataUrl
  downloadLink.download = fileName
  downloadLink.style.display = 'none'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
