import { useId } from 'react'

/**
 * ECOVERSE Distinctive Brand Symbol
 *
 * Combines core environmental symbolism into a unified geometric mark:
 * - Planetary Sphere (Earth, cosmic scale, global biosphere)
 * - Botanical Leaf Blade (nature, biodiversity, ecological regeneration)
 * - Dynamic Orbital Ring (planetary intelligence, renewable energy, circular horizon)
 * - Central Upward Sprout (growth, vitality, forward momentum)
 */
export function EcoverseSymbol({ className = 'w-6 h-6', idPrefix }) {
  const reactId = useId().replace(/:/g, '')
  const prefix = idPrefix || `eco_${reactId}`

  const leafGradId = `${prefix}_leaf`
  const orbitGradId = `${prefix}_orbit`
  const globeGradId = `${prefix}_globe`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Organic Leaf Gradient (Emerald to Neon-Lime) */}
        <linearGradient id={leafGradId} x1="15%" y1="100%" x2="85%" y2="0%">
          <stop offset="0%" stopColor="#1B6A45" />
          <stop offset="45%" stopColor="#39B86B" />
          <stop offset="100%" stopColor="#B8F34A" />
        </linearGradient>

        {/* Dynamic Planetary Orbit Gradient */}
        <linearGradient id={orbitGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B8F34A" />
          <stop offset="60%" stopColor="#39B86B" />
          <stop offset="100%" stopColor="#155D3A" />
        </linearGradient>

        {/* Spherical Biosphere Depth Gradient */}
        <radialGradient id={globeGradId} cx="42%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#0F442E" />
          <stop offset="70%" stopColor="#08291C" />
          <stop offset="100%" stopColor="#041A12" />
        </radialGradient>
      </defs>

      {/* Orbital Ring: Back Arc (tucked behind the planet) */}
      <path
        d="M 20,38 C 28,22 62,16 80,30"
        stroke={`url(#${orbitGradId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Planet Sphere Core (Deep Emerald Biosphere) */}
      <circle
        cx="50"
        cy="50"
        r="27"
        fill={`url(#${globeGradId})`}
        stroke="#39B86B"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Primary Botanical Leaf (Left Hemisphere rising into Apex Sprout) */}
      <path
        d="M 50,17 
           C 36.5,26.5 23,37 23,50 
           C 23,64.9 35.1,77 50,77 
           C 41,67 37.5,54.5 41.5,43 
           C 44,34 47,24.5 50,17 Z"
        fill={`url(#${leafGradId})`}
      />

      {/* Secondary Growth Crescent (Right Hemisphere) */}
      <path
        d="M 50,25 
           C 55.5,33.5 56.5,43.5 53.5,53.5 
           C 51,63.5 54,69.5 61,73.5 
           C 70,68.5 77,59.8 77,50 
           C 77,37 65.5,25 50,25 Z"
        fill="#39B86B"
        fillOpacity="0.85"
      />

      {/* Central Growth Sprout Stem (Neon-Lime Trajectory) */}
      <path
        d="M 50,75 Q 46.5,48 50,19"
        stroke="#B8F34A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Orbital Ring: Front Arc (swooping across the front of the sphere) */}
      <path
        d="M 80,30 C 94,46 86,72 60,80 C 38,88 16,74 20,52"
        stroke={`url(#${orbitGradId})`}
        strokeWidth="4.2"
        strokeLinecap="round"
      />

      {/* Orbital Satellite Node / Clean Energy Beacon */}
      <circle cx="80" cy="30" r="4.5" fill="#B8F34A" />
      <circle cx="80" cy="30" r="1.8" fill="#041A12" />
    </svg>
  )
}

/**
 * Unified Reusable ECOVERSE Brand Logo Component
 *
 * Renders the brand mark emblem along with the official wordmark
 * and "THE FUTURE IS GREEN" tagline.
 */
export default function EcoverseLogo({
  showWordmark = true,
  showTagline = true,
  className = '',
  taglineText = 'The Future is Green',
}) {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0 ${className}`}>
      {/* Brand Icon Emblem */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#08291C] to-[#041A12] border border-[#B8F34A]/35 flex items-center justify-center p-1 shadow-[0_0_20px_rgba(184,243,74,0.25)] group-hover:shadow-[0_0_25px_rgba(184,243,74,0.5)] group-hover:border-[#B8F34A]/60 group-hover:scale-105 transition-all duration-300 shrink-0">
        <EcoverseSymbol className="w-full h-full" />
      </div>

      {/* Wordmark and Tagline */}
      {showWordmark && (
        <div className="flex flex-col min-w-0">
          <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider text-[#F3F7EF] group-hover:text-white transition-colors truncate">
            ECOVERSE
          </span>
          {showTagline && (
            <span className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-[#B8F34A] font-medium uppercase -mt-0.5 sm:-mt-1 whitespace-nowrap">
              {taglineText}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
