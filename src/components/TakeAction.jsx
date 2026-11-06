import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useEcoJourney from '../hooks/useEcoJourney'
import {
  Sparkles,
  TreePine,
  Zap,
  Recycle,
  Users,
  CheckCircle2,
  Check,
  Copy,
  Edit3,
  RotateCcw,
  HeartHandshake,
  ArrowRight,
  ArrowDown,
  Leaf,
  ShieldCheck,
  Download,
  AlertCircle,
} from 'lucide-react'

/**
 * Generates a high-quality 1200x800 PNG pledge certificate on an offscreen HTML5 canvas.
 * Designed as a premium futuristic environmental certificate featuring a cinematic 3D Earth globe.
 */
async function generatePledgeCertificateCanvas(selectedPledges, pledgeDate) {
  // Await font rendering readiness if document.fonts is supported
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready
    } catch {
      // Graceful fallback to default system fonts
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  // Helper for cross-browser rounded rectangles
  const drawRoundedRect = (x, y, w, h, r) => {
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

  // 1. Deep forest green gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 1200, 800)
  bgGradient.addColorStop(0, '#041A12')
  bgGradient.addColorStop(0.45, '#07281C')
  bgGradient.addColorStop(1, '#03140E')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, 1200, 800)

  // 2. Ambient Lighting
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

  // 3. Framing & Borders
  drawRoundedRect(36, 36, 1128, 728, 24)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.35)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  drawRoundedRect(48, 48, 1104, 704, 18)
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.15)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Neon-lime corner bracket accents
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

  // 4. Header: Branding & Recorded Date
  drawRoundedRect(76, 74, 48, 48, 12)
  ctx.fillStyle = '#08291C'
  ctx.fill()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.45)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Stylized leaf emblem
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

  // Brand Name & Tagline
  ctx.fillStyle = '#F3F7EF'
  ctx.font = "bold 26px 'Space Grotesk', system-ui, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('ECOVERSE', 136, 90)

  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 10px 'Space Grotesk', monospace, sans-serif"
  ctx.fillText('THE FUTURE IS GREEN', 136, 111)

  // Date Badge
  const dateStr =
    pledgeDate ||
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  drawRoundedRect(864, 76, 260, 42, 21)
  ctx.fillStyle = 'rgba(8, 41, 28, 0.9)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.35)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 11px monospace, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`RECORDED: ${dateStr.toUpperCase()}`, 994, 97)

  // Header separator
  ctx.beginPath()
  ctx.moveTo(76, 146)
  ctx.lineTo(1124, 146)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.25)'
  ctx.lineWidth = 1
  ctx.stroke()

  // 5. Title & Sustainability Promise
  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 12px monospace, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('PERSONAL ENVIRONMENTAL COMMITMENT', 76, 172)

  ctx.fillStyle = '#F3F7EF'
  ctx.font = "800 40px 'Space Grotesk', system-ui, sans-serif"
  ctx.fillText('MY GREEN PLEDGE', 76, 196)

  ctx.fillStyle = 'rgba(243, 247, 239, 0.85)'
  ctx.font = "400 15px 'Inter', system-ui, sans-serif"
  ctx.fillText(
    'A personal commitment to mindful choices, environmental stewardship, and sustainable action for our living planet.',
    76,
    252
  )

  // 6. Selected Commitments Grid (Left Column Showcase)
  const count = selectedPledges.length
  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 11px monospace, sans-serif"
  ctx.fillText(`ACTIVE PLEDGES (${count})`, 76, 308)

  const cardW = 540
  const cardH = count <= 3 ? 56 : count <= 4 ? 52 : 46
  const gapY = count <= 3 ? 14 : count <= 4 ? 10 : 8
  const startY = 334

  selectedPledges.forEach((pledge, index) => {
    const cardX = 76
    const cardY = startY + index * (cardH + gapY)

    drawRoundedRect(cardX, cardY, cardW, cardH, 12)
    ctx.fillStyle = 'rgba(13, 53, 36, 0.85)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(57, 184, 107, 0.4)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    // Check indicator
    const circleCenterX = cardX + 24
    const circleCenterY = cardY + cardH / 2
    ctx.beginPath()
    ctx.arc(circleCenterX, circleCenterY, 11, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(184, 243, 74, 0.15)'
    ctx.fill()
    ctx.strokeStyle = '#B8F34A'
    ctx.lineWidth = 1.4
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(circleCenterX - 4, circleCenterY)
    ctx.lineTo(circleCenterX - 1, circleCenterY + 3.5)
    ctx.lineTo(circleCenterX + 4, circleCenterY - 3.5)
    ctx.strokeStyle = '#B8F34A'
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Category tag
    ctx.fillStyle = '#B8F34A'
    ctx.font = "700 9.5px monospace, sans-serif"
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(
      (pledge.category || 'COMMITMENT').toUpperCase(),
      cardX + 46,
      cardY + (cardH <= 48 ? 10 : 13)
    )

    // Commitment text with maxWidth safety
    ctx.fillStyle = '#F3F7EF'
    ctx.font = "600 " + (cardH <= 48 ? "13.5px" : "14.5px") + " 'Inter', system-ui, sans-serif"
    ctx.fillText(pledge.text, cardX + 46, cardY + (cardH <= 48 ? 26 : 30), cardW - 54)
  })

  // =========================================================================
  // 7. CINEMATIC 3D EARTH GLOBE ILLUSTRATION (Right Showcase Area)
  // =========================================================================
  // Compact, strictly bounded dimensions: completely within safe content area
  const cx = 880
  const cy = 485
  const R = 145

  // A. Atmospheric Nebula Aura behind Globe (bounded to avoid borders)
  const auraGrad = ctx.createRadialGradient(
    cx - R * 0.25,
    cy - R * 0.25,
    R * 0.2,
    cx,
    cy,
    R * 1.65
  )
  auraGrad.addColorStop(0, 'rgba(184, 243, 74, 0.16)')
  auraGrad.addColorStop(0.35, 'rgba(57, 184, 107, 0.12)')
  auraGrad.addColorStop(0.70, 'rgba(8, 41, 28, 0.05)')
  auraGrad.addColorStop(1, 'rgba(4, 26, 18, 0)')
  ctx.fillStyle = auraGrad
  ctx.beginPath()
  ctx.arc(cx, cy, R * 1.65, 0, Math.PI * 2)
  ctx.fill()

  // B. Background Half of Orbital Telemetry Rings (tilted -20 degrees, strictly bounded)
  // Inner ring: R * 1.26 = 183px | Outer ring: R * 1.45 = 210px (max x = 1090px, safely inside border 1152px)
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

  // Ocean Base: Rich Natural Deep-Blue Spherical Gradient with Daylight Illumination
  // Sunlight originates from upper-left (cx - R * 0.35, cy - R * 0.35)
  const oceanGrad = ctx.createRadialGradient(
    cx - R * 0.35,
    cy - R * 0.35,
    R * 0.08,
    cx,
    cy,
    R
  )
  oceanGrad.addColorStop(0, '#1E7BB8')    // Sunlit Caribbean / Atlantic azure blue
  oceanGrad.addColorStop(0.30, '#145C8E') // Vibrant sapphire ocean
  oceanGrad.addColorStop(0.60, '#0E4369') // Deep royal ocean blue
  oceanGrad.addColorStop(0.85, '#082C48') // Abyssal blue
  oceanGrad.addColorStop(1, '#04192D')    // Deep navy limb
  ctx.fillStyle = oceanGrad
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2)

  // D. 3D Spherical Latitude & Longitude Geodesics (Subtle Coordinate Grid)
  ctx.save()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.22)'
  ctx.lineWidth = 0.8
  ctx.setLineDash([3, 5])

  // Latitudes
  ;[-0.6, -0.3, 0, 0.3, 0.6].forEach((latSin) => {
    const cosLat = Math.sqrt(1 - latSin * latSin)
    const py = cy + latSin * R * 0.95
    const rx = R * cosLat * 0.98
    const ry = rx * 0.28
    ctx.beginPath()
    ctx.ellipse(cx, py, rx, ry, (-12 * Math.PI) / 180, 0, Math.PI * 2)
    ctx.stroke()
  })

  // Longitudes
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

  // E. Vibrant Emerald & Green Continents (Africa / Europe / Eurasia Perspective)
  ctx.save()
  ctx.translate(cx, cy)

  const drawContinents = () => {
    // 1. Africa
    ctx.beginPath()
    ctx.moveTo(-0.30 * R, -0.32 * R)
    ctx.bezierCurveTo(-0.24 * R, -0.36 * R, -0.14 * R, -0.35 * R, -0.04 * R, -0.30 * R)
    ctx.bezierCurveTo(0.04 * R, -0.32 * R, 0.11 * R, -0.30 * R, 0.15 * R, -0.25 * R)
    ctx.bezierCurveTo(0.18 * R, -0.19 * R, 0.23 * R, -0.14 * R, 0.34 * R, -0.04 * R) // Horn of Africa
    ctx.bezierCurveTo(0.30 * R, 0.06 * R, 0.24 * R, 0.18 * R, 0.20 * R, 0.31 * R)
    ctx.bezierCurveTo(0.16 * R, 0.42 * R, 0.11 * R, 0.50 * R, 0.04 * R, 0.56 * R) // Cape of Good Hope
    ctx.bezierCurveTo(-0.02 * R, 0.50 * R, -0.07 * R, 0.38 * R, -0.08 * R, 0.25 * R)
    ctx.bezierCurveTo(-0.09 * R, 0.15 * R, -0.14 * R, 0.09 * R, -0.22 * R, 0.05 * R) // Gulf of Guinea
    ctx.bezierCurveTo(-0.33 * R, 0.04 * R, -0.42 * R, -0.02 * R, -0.44 * R, -0.11 * R) // West Africa bulge
    ctx.bezierCurveTo(-0.41 * R, -0.19 * R, -0.36 * R, -0.25 * R, -0.30 * R, -0.32 * R)
    ctx.closePath()

    // 2. Madagascar
    ctx.moveTo(0.29 * R, 0.18 * R)
    ctx.bezierCurveTo(0.34 * R, 0.22 * R, 0.35 * R, 0.32 * R, 0.31 * R, 0.42 * R)
    ctx.bezierCurveTo(0.27 * R, 0.36 * R, 0.26 * R, 0.26 * R, 0.29 * R, 0.18 * R)
    ctx.closePath()

    // 3. Europe & Mediterranean Basin
    ctx.moveTo(-0.32 * R, -0.40 * R) // Iberia
    ctx.lineTo(-0.23 * R, -0.39 * R)
    ctx.bezierCurveTo(-0.19 * R, -0.45 * R, -0.14 * R, -0.42 * R, -0.07 * R, -0.36 * R) // Italy
    ctx.lineTo(-0.05 * R, -0.42 * R)
    ctx.bezierCurveTo(-0.01 * R, -0.44 * R, 0.04 * R, -0.40 * R, 0.08 * R, -0.36 * R) // Greece
    ctx.bezierCurveTo(0.10 * R, -0.46 * R, 0.02 * R, -0.54 * R, -0.07 * R, -0.54 * R) // Central Europe
    ctx.bezierCurveTo(-0.05 * R, -0.64 * R, 0.06 * R, -0.60 * R, 0.02 * R, -0.52 * R) // Scandinavia
    ctx.bezierCurveTo(-0.15 * R, -0.60 * R, -0.25 * R, -0.54 * R, -0.32 * R, -0.40 * R)
    ctx.closePath()

    // 4. British Isles
    ctx.moveTo(-0.28 * R, -0.54 * R)
    ctx.bezierCurveTo(-0.25 * R, -0.51 * R, -0.23 * R, -0.58 * R, -0.27 * R, -0.61 * R)
    ctx.closePath()

    // 5. Arabian Peninsula
    ctx.moveTo(0.17 * R, -0.24 * R)
    ctx.bezierCurveTo(0.23 * R, -0.19 * R, 0.28 * R, -0.13 * R, 0.36 * R, -0.10 * R)
    ctx.bezierCurveTo(0.34 * R, -0.18 * R, 0.28 * R, -0.22 * R, 0.21 * R, -0.26 * R)
    ctx.closePath()

    // 6. Western & Central Asia
    ctx.moveTo(0.11 * R, -0.38 * R)
    ctx.bezierCurveTo(0.24 * R, -0.42 * R, 0.38 * R, -0.39 * R, 0.52 * R, -0.32 * R)
    ctx.bezierCurveTo(0.60 * R, -0.24 * R, 0.54 * R, -0.12 * R, 0.43 * R, -0.10 * R)
    ctx.bezierCurveTo(0.38 * R, -0.20 * R, 0.28 * R, -0.30 * R, 0.11 * R, -0.38 * R)
    ctx.closePath()

    // 7. Eastern Americas Horizon
    ctx.moveTo(-0.62 * R, 0.08 * R)
    ctx.bezierCurveTo(-0.50 * R, 0.20 * R, -0.53 * R, 0.35 * R, -0.66 * R, 0.38 * R)
    ctx.closePath()
  }

  // Land fill with radiant, vibrant daylight emerald gradient
  const landGrad = ctx.createLinearGradient(-R * 0.4, -R * 0.4, R * 0.5, R * 0.5)
  landGrad.addColorStop(0, '#42E28E')    // Sunlit bright emerald highlands
  landGrad.addColorStop(0.35, '#2EBA6D') // Rich lush tropical green
  landGrad.addColorStop(0.70, '#1E8B4C') // Deep forest biome
  landGrad.addColorStop(1, '#136334')    // Shaded evergreen terrain
  ctx.fillStyle = landGrad
  drawContinents()
  ctx.fill()

  // Distinct Neon-Lime Coastal Shelf Glowing Stroke
  ctx.strokeStyle = '#B8F34A'
  ctx.lineWidth = 1.6
  ctx.lineJoin = 'round'
  ctx.stroke()

  // Interior mountain ridges & elevation accents (crisp daylight visibility)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.lineWidth = 0.9
  ctx.beginPath()
  ctx.moveTo(-0.02 * R, 0.02 * R)
  ctx.lineTo(0.08 * R, 0.18 * R)
  ctx.lineTo(0.04 * R, 0.32 * R)
  ctx.moveTo(0.18 * R, -0.36 * R)
  ctx.lineTo(0.32 * R, -0.38 * R)
  ctx.stroke()

  ctx.restore()

  // F. Atmospheric Clouds: Luminous Swirling White/Cyan Bands
  ctx.save()
  ctx.translate(cx, cy)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)'

  // Tropical convergence cloud swirl across equator
  ctx.beginPath()
  ctx.moveTo(-0.48 * R, -0.04 * R)
  ctx.bezierCurveTo(-0.24 * R, -0.07 * R, -0.04 * R, 0.03 * R, 0.16 * R, -0.01 * R)
  ctx.bezierCurveTo(0.32 * R, -0.05 * R, 0.44 * R, 0.05 * R, 0.56 * R, 0.03 * R)
  ctx.bezierCurveTo(0.44 * R, 0.09 * R, 0.20 * R, 0.07 * R, -0.04 * R, 0.09 * R)
  ctx.bezierCurveTo(-0.26 * R, 0.13 * R, -0.40 * R, 0.05 * R, -0.48 * R, -0.04 * R)
  ctx.fill()

  // North Atlantic storm vortex
  ctx.fillStyle = 'rgba(235, 255, 245, 0.38)'
  ctx.beginPath()
  ctx.moveTo(-0.34 * R, -0.48 * R)
  ctx.bezierCurveTo(-0.27 * R, -0.56 * R, -0.14 * R, -0.52 * R, -0.09 * R, -0.46 * R)
  ctx.bezierCurveTo(-0.15 * R, -0.42 * R, -0.25 * R, -0.43 * R, -0.34 * R, -0.48 * R)
  ctx.fill()

  // Southern ocean cloud swirl
  ctx.beginPath()
  ctx.moveTo(-0.28 * R, 0.50 * R)
  ctx.bezierCurveTo(-0.08 * R, 0.46 * R, 0.16 * R, 0.54 * R, 0.36 * R, 0.48 * R)
  ctx.bezierCurveTo(0.22 * R, 0.60 * R, -0.04 * R, 0.58 * R, -0.28 * R, 0.50 * R)
  ctx.fill()
  ctx.restore()

  // G. Natural 3D Spherical Shading (Daylight-favored: 70% daylight, soft twilight terminator)
  // Keeps surface details clearly visible without blacking out the globe
  const shadowGrad = ctx.createRadialGradient(
    cx - R * 0.35,
    cy - R * 0.35,
    R * 0.50,
    cx + R * 0.35,
    cy + R * 0.35,
    R * 1.15
  )
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
  shadowGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0)')         // 65% fully illuminated
  shadowGrad.addColorStop(0.82, 'rgba(2, 12, 22, 0.25)')     // Soft twilight transition
  shadowGrad.addColorStop(0.94, 'rgba(2, 12, 22, 0.52)')     // Gentle night shadow
  shadowGrad.addColorStop(1, 'rgba(2, 12, 22, 0.70)')        // Subtle dark limb, non-opaque
  ctx.fillStyle = shadowGrad
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2)

  // Specular Sun Glint (Vibrant daylight ocean reflection)
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

  ctx.restore() // Unclip sphere

  // H. Multi-layered Atmospheric Rim Glow (Outside the sphere)
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

  ctx.beginPath()
  ctx.arc(cx, cy, R + 11, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.10)'
  ctx.lineWidth = 10
  ctx.stroke()

  // Intense Sunlit Atmospheric Limb Crescent (Top-Left)
  ctx.beginPath()
  ctx.arc(cx, cy, R + 1.2, Math.PI * 0.72, Math.PI * 1.76)
  ctx.strokeStyle = '#B8F34A'
  ctx.lineWidth = 2.8
  ctx.stroke()

  // I. Foreground Half of Orbital Telemetry Rings (tilted -20 degrees, strictly bounded)
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((-20 * Math.PI) / 180)
  ctx.scale(1, 0.36)

  // Foreground solid glowing ring
  ctx.beginPath()
  ctx.arc(0, 0, R * 1.26, 0, Math.PI)
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.80)'
  ctx.lineWidth = 1.8
  ctx.stroke()

  // Foreground dashed telemetry ring
  ctx.beginPath()
  ctx.arc(0, 0, R * 1.45, 0, Math.PI)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.55)'
  ctx.lineWidth = 1.2
  ctx.setLineDash([5, 8])
  ctx.stroke()
  ctx.setLineDash([])
  ctx.restore()

  // Orbital Satellite Node on Foreground Ring (angle 0.62 rad: lower-right, strictly inside safe area)
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

  // J. Floating Stardust & Environmental Micro-Accents (within safe content bounds)
  const particles = [
    { x: 700, y: 360, r: 1.6, o: 0.65 },
    { x: 725, y: 330, r: 2.2, o: 0.8 },
    { x: 720, y: 610, r: 1.8, o: 0.7 },
    { x: 760, y: 640, r: 1.4, o: 0.5 },
    { x: 1040, y: 340, r: 2.0, o: 0.75 },
    { x: 1070, y: 440, r: 1.5, o: 0.6 },
    { x: 1060, y: 590, r: 2.4, o: 0.85 },
    { x: 1025, y: 635, r: 1.6, o: 0.55 },
  ]

  particles.forEach((p) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(184, 243, 74, ' + p.o + ')'
    ctx.fill()
  })

  // Cross-sparkle micro stars (strictly inside bounds)
  const drawSparkle = (sx, sy, size) => {
    ctx.strokeStyle = 'rgba(184, 243, 74, 0.85)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(sx - size, sy)
    ctx.lineTo(sx + size, sy)
    ctx.moveTo(sx, sy - size)
    ctx.lineTo(sx, sy + size)
    ctx.stroke()
  }
  drawSparkle(725, 330, 5)
  drawSparkle(1040, 340, 5)
  drawSparkle(1060, 590, 6)

  // Futuristic Biosphere Telemetry Badge (positioned safely above footer)
  drawRoundedRect(802, 638, 156, 25, 12.5)
  ctx.fillStyle = 'rgba(8, 41, 28, 0.88)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(184, 243, 74, 0.4)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(816, 650.5, 3.5, 0, Math.PI * 2)
  ctx.fillStyle = '#B8F34A'
  ctx.fill()

  ctx.fillStyle = '#B8F34A'
  ctx.font = "700 9px monospace, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('BIOSPHERE // OPTIMAL', 826, 650.5)

  // 8. Footer Section
  ctx.beginPath()
  ctx.moveTo(76, 680)
  ctx.lineTo(1124, 680)
  ctx.strokeStyle = 'rgba(57, 184, 107, 0.25)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Closing Message
  ctx.fillStyle = '#B8F34A'
  ctx.font = "800 20px 'Space Grotesk', system-ui, sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('“Small Actions. Greener Tomorrow.”', 76, 718)

  // Footer Right: ECOVERSE Branding
  ctx.fillStyle = '#A4B6A8'
  ctx.font = "600 12px monospace, sans-serif"
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('ECOVERSE  •  PLANETARY RESTORATION', 1124, 718)

  return canvas
}

export default function TakeAction() {
  // Action pathways content
  const pathways = [
    {
      index: '01',
      title: 'PLANT A GREENER FUTURE',
      description:
        'Support tree planting, restore natural habitats and help protect biodiversity.',
      icon: TreePine,
      actions: [
        'Plant native trees.',
        'Support habitat restoration.',
        'Protect local green spaces.',
      ],
      tag: 'Restoration & Biomes',
    },
    {
      index: '02',
      title: 'CHOOSE CLEAN ENERGY',
      description:
        'Make energy-conscious decisions and support the transition to renewable power.',
      icon: Zap,
      actions: [
        'Explore renewable energy options.',
        'Reduce unnecessary electricity consumption.',
        'Choose energy-efficient appliances.',
      ],
      tag: 'Decarbonized Living',
    },
    {
      index: '03',
      title: 'LIVE MORE SUSTAINABLY',
      description:
        'Make everyday choices that reduce waste and protect natural resources.',
      icon: Recycle,
      actions: [
        'Reduce single-use plastics.',
        'Reuse and recycle responsibly.',
        'Choose sustainable products.',
      ],
      tag: 'Circular Habits',
    },
    {
      index: '04',
      title: 'JOIN THE MOVEMENT',
      description:
        'Create change together through community participation and environmental awareness.',
      icon: Users,
      actions: [
        'Participate in local clean-up events.',
        'Share environmental awareness.',
        'Encourage friends and family to take action.',
      ],
      tag: 'Collective Impact',
    },
  ]

  // Pledge commitments list
  const pledgeOptions = [
    {
      id: 'waste',
      text: 'I will reduce unnecessary waste.',
      category: 'Conservation',
    },
    {
      id: 'water-energy',
      text: 'I will save water and electricity.',
      category: 'Efficiency',
    },
    {
      id: 'plastics',
      text: 'I will avoid single-use plastics.',
      category: 'Circularity',
    },
    {
      id: 'communities',
      text: 'I will support greener communities.',
      category: 'Community',
    },
    {
      id: 'biodiversity',
      text: 'I will protect plants and biodiversity.',
      category: 'Ecology',
    },
    {
      id: 'conscious-choices',
      text: 'I will make more environmentally conscious choices.',
      category: 'Lifestyle',
    },
  ]

  // Client-side interactive pledge state
  const [selectedCommitments, setSelectedCommitments] = useState([
    'waste',
    'water-energy',
    'plastics',
  ])
  const [isPledged, setIsPledged] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pledgeTimestamp, setPledgeTimestamp] = useState(null)
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false)
  const [certificateDownloaded, setCertificateDownloaded] = useState(false)
  const [certificateError, setCertificateError] = useState(null)

  // Eco Journey integration: record pledge and unlock Pledge Pioneer badge
  const { recordGreenPledge, hasTakenGreenPledge } = useEcoJourney()

  // Toggle selection
  const toggleCommitment = (id) => {
    setSelectedCommitments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Keyboard accessibility for selection cards
  const handleKeyDownToggle = (e, id) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      toggleCommitment(id)
    }
  }

  // Submit pledge
  const handleMakePledge = (e) => {
    e.preventDefault()
    if (selectedCommitments.length === 0) return
    const formattedDate = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    setPledgeTimestamp(formattedDate)
    setIsPledged(true)

    // Safely and idempotently award +50 Eco Points and unlock Pledge Pioneer badge in Eco Journey
    try {
      if (typeof recordGreenPledge === 'function') {
        recordGreenPledge()
      }
    } catch {
      // Graceful fallback if storage is restricted
    }
  }

  // Edit / update pledge
  const handleEditPledge = () => {
    setIsPledged(false)
  }

  // Reset pledge selections
  const handleResetPledge = () => {
    setSelectedCommitments([])
    setIsPledged(false)
  }

  // Copy pledge certificate text
  const handleCopyPledge = async () => {
    const selectedTexts = pledgeOptions
      .filter((opt) => selectedCommitments.includes(opt.id))
      .map((opt, i) => `${i + 1}. ${opt.text}`)
      .join('\n')

    const message = `🌿 MY ECOVERSE GREEN PLEDGE (${pledgeTimestamp || 'Today'}):\n\n${selectedTexts}\n\n"Small actions. A greener tomorrow."\nJoin me at ECOVERSE — The Future is Green.`

    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback if clipboard API unavailable
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Trigger data URL fallback download
  const triggerDataUrlDownload = (canvas, fileName) => {
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = dataUrl
      downloadLink.download = fileName
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      setCertificateDownloaded(true)
      setTimeout(() => setCertificateDownloaded(false), 3000)
    } catch {
      setCertificateError('Unable to download certificate. Please try again.')
      setTimeout(() => setCertificateError(null), 4000)
    } finally {
      setIsGeneratingCertificate(false)
    }
  }

  // Generate and download pledge PNG certificate
  const handleDownloadCertificate = async () => {
    setIsGeneratingCertificate(true)
    setCertificateError(null)

    try {
      const activeCommitments = pledgeOptions.filter((opt) =>
        selectedCommitments.includes(opt.id)
      )

      if (activeCommitments.length === 0) {
        throw new Error('No commitments selected')
      }

      const canvas = await generatePledgeCertificateCanvas(activeCommitments, pledgeTimestamp)
      const fileName = 'ECOVERSE-Green-Pledge.png'

      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob((blob) => {
          if (!blob) {
            triggerDataUrlDownload(canvas, fileName)
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
          setCertificateDownloaded(true)
          setTimeout(() => setCertificateDownloaded(false), 3000)
          setIsGeneratingCertificate(false)
        }, 'image/png')
      } else {
        triggerDataUrlDownload(canvas, fileName)
      }
    } catch {
      setCertificateError('Unable to generate certificate. Please try again.')
      setTimeout(() => setCertificateError(null), 4000)
      setIsGeneratingCertificate(false)
    }
  }

  // Smooth scroll helper to pledge area
  const scrollToPledge = () => {
    const element = document.getElementById('pledge-area')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="take-action"
      className="scroll-mt-20 py-28 sm:py-36 relative bg-[#041A12] border-t border-[#39B86B]/15 overflow-hidden text-[#F3F7EF]"
    >
      {/* Background Ambient Lighting Blobs */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-48 w-[600px] h-[600px] bg-[#39B86B]/10 rounded-full blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -right-48 w-[650px] h-[650px] bg-[#B8F34A]/8 rounded-full blur-[190px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-24 sm:space-y-36">
        {/* ===================================================================
            PART A: SECTION HERO
            =================================================================== */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl text-left mb-12 sm:mb-16"
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>YOUR ACTION. OUR FUTURE.</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#F3F7EF] leading-[1.08] mb-6">
              SMALL ACTIONS.{' '}
              <span className="text-gradient-accent block sm:inline">
                A GREENER TOMORROW.
              </span>
            </h2>

            {/* Narrative Description */}
            <p className="text-base sm:text-xl text-[#F3F7EF]/90 font-normal leading-relaxed max-w-3xl">
              Change doesn't happen overnight. It begins with everyday decisions, shared
              responsibility and people willing to make a difference. Your next step matters.
            </p>
          </motion.div>

          {/* Environmental Background Photo Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative rounded-3xl overflow-hidden border border-[#39B86B]/25 shadow-[0_25px_60px_rgba(0,0,0,0.65)] group"
          >
            <div className="relative h-[320px] sm:h-[440px] md:h-[500px] w-full overflow-hidden">
              <img
                src="/assets/take-action/action-hero.jpg"
                alt="Human hands nurturing a young green sapling in fertile earth, symbolizing individual commitment to environmental restoration"
                className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />

              {/* Sophisticated Dark Gradient Overlays */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#041A12] via-[#041A12]/50 to-transparent pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#041A12]/60 via-transparent to-[#041A12]/40 pointer-events-none"
              />

              {/* Lower Overlay Badge & Direct Anchor to Pledge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#041A12]/85 backdrop-blur-md border border-[#B8F34A]/25 text-[10px] sm:text-[11px] font-medium text-[#B8F34A] tracking-wider uppercase mb-2">
                    <Leaf className="w-3 h-3" />
                    <span>EMPOWERED INDIVIDUALS // COLLECTIVE STRENGTH</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#F3F7EF] font-heading font-medium">
                    Every seed planted, watt saved, and conscious choice ripples across the global
                    biosphere.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={scrollToPledge}
                  className="inline-flex items-center gap-2 bg-[#B8F34A] text-[#041A12] px-5 py-2.5 rounded-full font-heading font-semibold text-xs sm:text-sm hover:bg-[#39B86B] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(184,243,74,0.3)] hover:scale-105 shrink-0"
                >
                  <span>Pledge Your Commitment</span>
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===================================================================
            PART B: FOUR ACTION PATHWAYS (Editorial Distinct Layout)
            =================================================================== */}
        <div>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 text-left"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
                <HeartHandshake className="w-3.5 h-3.5 text-[#B8F34A]" />
                <span>PRACTICAL PATHWAYS</span>
              </div>

              <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F7EF] leading-tight">
                FOUR WAYS TO <br className="hidden sm:inline" />
                <span className="text-gradient-accent">CREATE MEASURABLE CHANGE.</span>
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[#A4B6A8] max-w-md leading-relaxed">
              Tangible environmental progress starts with accessible daily habits. Explore four
              action areas where your lifestyle directly shapes planetary balance.
            </p>
          </motion.div>

          {/* Asymmetric 2-Column Editorial Showcase (Non-Generic Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {pathways.map((pathway, index) => {
              const Icon = pathway.icon
              return (
                <motion.div
                  key={pathway.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                  className="group relative p-5 sm:p-9 rounded-3xl bg-[#08291C]/50 hover:bg-[#08291C]/80 border border-[#39B86B]/20 hover:border-[#B8F34A]/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Monospace Index + Category Tag + Icon */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl sm:text-2xl font-bold text-[#B8F34A] opacity-80 group-hover:opacity-100 transition-opacity">
                          {pathway.index}
                        </span>
                        <span className="text-[11px] font-semibold text-[#A4B6A8] tracking-widest uppercase px-3 py-1 rounded-full bg-[#0D3524] border border-[#39B86B]/30">
                          {pathway.tag}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#0D3524] text-[#B8F34A] border border-[#B8F34A]/25 shrink-0 group-hover:shadow-[0_0_20px_rgba(184,243,74,0.3)] group-hover:scale-105 transition-all duration-300">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    {/* Pathway Title */}
                    <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#F3F7EF] group-hover:text-white transition-colors mb-3">
                      {pathway.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-[#A4B6A8] leading-relaxed mb-6">
                      {pathway.description}
                    </p>
                  </div>

                  {/* Practical Actions List */}
                  <div className="pt-6 border-t border-[#39B86B]/20">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#B8F34A] block mb-3">
                      Recommended Practical Steps:
                    </span>
                    <ul className="space-y-2.5">
                      {pathway.actions.map((act) => (
                        <li key={act} className="flex items-center gap-3 text-xs sm:text-sm text-[#F3F7EF]/90">
                          <CheckCircle2 className="w-4 h-4 text-[#B8F34A] shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ===================================================================
            PART C: INTERACTIVE MY GREEN PLEDGE
            =================================================================== */}
        <div id="pledge-area" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative rounded-3xl p-4 sm:p-12 lg:p-14 overflow-hidden bg-gradient-to-br from-[#08291C]/90 via-[#041A12] to-[#08291C]/90 border border-[#B8F34A]/30 shadow-[0_25px_60px_rgba(0,0,0,0.65)]"
          >
            {/* Subtle radial lighting */}
            <div
              aria-hidden="true"
              className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-[#B8F34A]/10 rounded-full blur-[160px] pointer-events-none"
            />

            <div className="relative z-10 max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {!isPledged ? (
                  /* =========================================================
                     STATE 1: COMMITMENT SELECTION FORM
                     ========================================================= */
                  <motion.div
                    key="pledge-form"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col text-left"
                  >
                    {/* Eyebrow & Headline */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D3524] border border-[#B8F34A]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
                          <Leaf className="w-3.5 h-3.5 text-[#B8F34A]" />
                          <span>INTERACTIVE COMMITMENT</span>
                        </div>

                        <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-[#F3F7EF] tracking-tight">
                          MAKE YOUR PROMISE{' '}
                          <span className="text-gradient-accent">TO THE PLANET.</span>
                        </h3>
                      </div>

                      {/* Dynamic Selection Counter Pill */}
                      <div
                        aria-live="polite"
                        aria-atomic="true"
                        className="px-4 py-2.5 rounded-2xl bg-[#041A12]/80 border border-[#39B86B]/30 flex items-center gap-3 shrink-0 self-start sm:self-center"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#B8F34A] animate-pulse" aria-hidden="true" />
                        <span className="font-mono text-xs font-medium text-[#F3F7EF]">
                          <strong className="text-[#B8F34A] text-sm font-bold">
                            {selectedCommitments.length}
                          </strong>{' '}
                          of {pledgeOptions.length} actions selected
                        </span>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-[#A4B6A8] leading-relaxed mb-8">
                      A better future begins with a commitment. Choose the actions you want to take.
                    </p>

                    {/* Selectable Commitments Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-9">
                      {pledgeOptions.map((opt) => {
                        const isSelected = selectedCommitments.includes(opt.id)
                        return (
                          <div
                            key={opt.id}
                            role="checkbox"
                            tabIndex={0}
                            aria-checked={isSelected}
                            onClick={() => toggleCommitment(opt.id)}
                            onKeyDown={(e) => handleKeyDownToggle(e, opt.id)}
                            className={`p-3.5 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center gap-3.5 sm:gap-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8F34A] ${
                              isSelected
                                ? 'bg-[#0D3524] border-[#B8F34A] shadow-[0_0_20px_rgba(184,243,74,0.2)]'
                                : 'bg-[#041A12]/60 border-[#39B86B]/25 hover:border-[#B8F34A]/50 hover:bg-[#08291C]/60'
                            }`}
                          >
                            {/* Checkbox indicator */}
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                                isSelected
                                  ? 'bg-[#B8F34A] text-[#041A12] border-[#B8F34A]'
                                  : 'border-[#39B86B]/40 bg-[#041A12]'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                            </div>

                            <div className="flex-1">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-[#A4B6A8] block">
                                {opt.category}
                              </span>
                              <span
                                className={`text-sm sm:text-base font-medium leading-snug transition-colors ${
                                  isSelected ? 'text-[#F3F7EF] font-semibold' : 'text-[#A4B6A8]'
                                }`}
                              >
                                {opt.text}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#39B86B]/20">
                      <p className="text-xs text-[#A4B6A8] order-2 sm:order-1 text-center sm:text-left">
                        Transparent client-side pledge. No personal data collected or stored.
                      </p>

                      <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                        {selectedCommitments.length > 0 && (
                          <button
                            type="button"
                            onClick={handleResetPledge}
                            className="px-4 py-3 rounded-full text-xs font-semibold text-[#A4B6A8] hover:text-[#F3F7EF] hover:bg-[#0D3524] transition-colors"
                          >
                            Clear All
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleMakePledge}
                          disabled={selectedCommitments.length === 0}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-heading font-bold text-sm transition-all duration-300 shadow-lg ${
                            selectedCommitments.length > 0
                              ? 'bg-[#B8F34A] text-[#041A12] hover:bg-[#39B86B] hover:text-white shadow-[0_0_25px_rgba(184,243,74,0.35)] hover:scale-105 active:scale-95 cursor-pointer'
                              : 'bg-[#0D3524] text-[#A4B6A8] border border-[#39B86B]/20 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <span>Make My Pledge</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* =========================================================
                     STATE 2: PLEDGE CONFIRMATION EXPERIENCE
                     ========================================================= */
                  <motion.div
                    key="pledge-confirmation"
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45 }}
                    className="text-left"
                  >
                    {/* Header with celebration banner */}
                    <div className="p-6 sm:p-8 rounded-2xl bg-[#0D3524]/90 border border-[#B8F34A]/40 shadow-[0_0_30px_rgba(184,243,74,0.2)] mb-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#B8F34A] text-[#041A12] flex items-center justify-center shadow-[0_0_20px_rgba(184,243,74,0.5)] shrink-0">
                            <ShieldCheck className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-[11px] font-mono tracking-widest text-[#B8F34A] uppercase font-semibold">
                              OFFICIAL GREEN COMMITMENT
                            </span>
                            <h4 className="font-heading text-xl sm:text-2xl font-black text-[#F3F7EF]">
                              PLEDGE CONFIRMED
                            </h4>
                          </div>
                        </div>

                        <div className="text-xs font-mono text-[#A4B6A8] bg-[#041A12]/70 px-3.5 py-1.5 rounded-full border border-[#39B86B]/30 self-start sm:self-center">
                          Recorded: {pledgeTimestamp}
                        </div>
                      </div>

                      <p className="text-sm text-[#F3F7EF]/90 leading-relaxed mb-4">
                        Thank you for stepping forward. Your commitments have been verified in your
                        personal browser session. Every small action builds our shared tomorrow.
                      </p>

                      {/* Eco Journey Gamification Recognition Badge */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8F34A]/15 border border-[#B8F34A]/40 text-xs font-mono font-bold text-[#B8F34A] shadow-[0_0_15px_rgba(184,243,74,0.2)]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {hasTakenGreenPledge
                            ? '+50 Eco Points & Pledge Pioneer Badge Recorded in Eco Journey!'
                            : '+50 Eco Points & Pledge Pioneer Badge Unlocked!'}
                        </span>
                      </div>
                    </div>

                    {/* Active Selected Commitments List */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs text-[#B8F34A] tracking-wider uppercase font-semibold">
                          Your Active Pledges ({selectedCommitments.length})
                        </span>
                        <span className="text-xs text-[#A4B6A8]">
                          Client-side active pledge
                        </span>
                      </div>

                      <div className="space-y-3">
                        {pledgeOptions
                          .filter((opt) => selectedCommitments.includes(opt.id))
                          .map((opt) => (
                            <div
                              key={opt.id}
                              className="p-4 rounded-xl bg-[#041A12]/70 border border-[#39B86B]/30 flex items-center gap-3.5"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#B8F34A]/20 text-[#B8F34A] flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              <span className="text-sm sm:text-base text-[#F3F7EF] font-medium">
                                {opt.text}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Confirmation Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#39B86B]/20">
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleDownloadCertificate}
                          disabled={isGeneratingCertificate}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#B8F34A] text-[#041A12] text-xs sm:text-sm font-semibold hover:bg-[#39B86B] hover:text-white transition-all shadow-[0_0_20px_rgba(184,243,74,0.3)] hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {certificateDownloaded ? (
                            <>
                              <Check className="w-4 h-4 text-[#041A12]" />
                              <span>Certificate Downloaded!</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>
                                {isGeneratingCertificate
                                  ? 'Generating Certificate...'
                                  : 'Download My Pledge Certificate'}
                              </span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyPledge}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#08291C] border border-[#B8F34A]/30 text-xs sm:text-sm font-semibold text-[#F3F7EF] hover:text-[#B8F34A] hover:border-[#B8F34A] transition-all cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-[#B8F34A]" />
                              <span>Pledge Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#B8F34A]" />
                              <span>Copy My Pledge</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleEditPledge}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs sm:text-sm font-semibold text-[#A4B6A8] hover:text-white transition-all cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Commitments</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetPledge}
                        className="inline-flex items-center gap-1.5 text-xs text-[#A4B6A8] hover:text-[#F3F7EF] transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Start Over</span>
                      </button>
                    </div>

                    {certificateError && (
                      <p className="mt-3 text-xs text-[#FF6B6B] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{certificateError}</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ===================================================================
            PART D: FINAL CALL TO ACTION
            =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-3xl p-8 sm:p-14 lg:p-16 overflow-hidden bg-gradient-to-br from-[#08291C] via-[#041A12] to-[#08291C] border border-[#B8F34A]/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8F34A]/10 rounded-full blur-[140px] pointer-events-none"
          />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Sparkle Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D3524] border border-[#B8F34A]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>THE LIVING PLANET CALL</span>
            </div>

            {/* Closing Heading */}
            <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-[#F3F7EF] tracking-tight leading-[1.15] mb-5">
              THE PLANET DOESN'T NEED PERFECT PEOPLE.{' '}
              <span className="text-gradient-accent block mt-1">IT NEEDS PEOPLE WHO CARE.</span>
            </h3>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#A4B6A8] leading-relaxed mb-8 max-w-2xl">
              Your actions today help shape the world we share tomorrow.
            </p>

            {/* Action CTA Button scrolling to pledge */}
            <button
              type="button"
              onClick={scrollToPledge}
              className="inline-flex items-center justify-center gap-2 bg-[#B8F34A] text-[#041A12] px-8 py-4 rounded-full font-heading font-bold text-sm hover:bg-[#39B86B] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(184,243,74,0.3)] hover:shadow-[0_0_28px_rgba(184,243,74,0.55)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Take Your Green Pledge</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
