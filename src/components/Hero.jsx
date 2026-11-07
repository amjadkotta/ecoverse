import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronDown, Leaf, Activity } from 'lucide-react'

// Dynamically code-split Earth3D to decouple Three.js from the initial entry bundle
const Earth3D = lazy(() => import('./Earth3D'))

function EarthLoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#041A12]">
      <div className="w-full h-full rounded-full border border-[#B8F34A]/30 bg-[#08291C] flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(57,184,107,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#39B86B]/25 via-[#B8F34A]/15 to-[#041A12]/90 animate-pulse" />
        <span className="text-xs font-mono text-[#B8F34A] tracking-widest uppercase animate-pulse z-10 px-4 text-center">
          Loading 3D Biosphere...
        </span>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between pt-32 pb-12 overflow-hidden gradient-mesh">
      {/* Background Atmospheric Glow Halos */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[450px] bg-gradient-to-br from-[#39B86B]/15 via-[#B8F34A]/10 to-transparent blur-[140px] pointer-events-none rounded-full"
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-96 h-96 bg-[#39B86B]/10 blur-[120px] pointer-events-none rounded-full"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-10 w-80 h-80 bg-[#B8F34A]/10 blur-[120px] pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 w-full my-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0D3524]/80 border border-[#B8F34A]/30 text-xs sm:text-sm font-medium text-[#F3F7EF] mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(184,243,74,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#B8F34A] animate-ping" />
              <span className="text-[#B8F34A] font-semibold tracking-wide uppercase">
                GREEN TOMORROW
              </span>
              <span className="text-[#A4B6A8]">•</span>
              <span className="text-[#F3F7EF] font-medium tracking-wide">
                A SUSTAINABLE FUTURE
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl min-[360px]:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.05] text-[#F3F7EF] mb-6">
              THE FUTURE <br />
              <span className="text-gradient-accent">IS GREEN.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-xl text-[#A4B6A8] max-w-xl font-normal leading-relaxed mb-8">
              A sustainable tomorrow starts with the choices we make today. ECOVERSE
              pioneers ecological intelligence, resilient clean energy, and planetary
              restoration.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <a
                href="#mission"
                className="inline-flex items-center justify-center gap-3 bg-[#B8F34A] text-[#041A12] px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-heading font-bold text-base hover:bg-[#39B86B] hover:text-white transition-all duration-300 shadow-[0_0_25px_rgba(184,243,74,0.35)] hover:shadow-[0_0_35px_rgba(184,243,74,0.6)] group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Our Mission</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#take-action"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-[#0D3524]/60 hover:bg-[#0D3524] text-[#F3F7EF] border border-[#39B86B]/30 hover:border-[#B8F34A]/60 font-heading font-semibold text-base transition-all duration-300 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-[#B8F34A]" />
                <span>Take Action</span>
              </a>
            </div>

            {/* Small Quick Metric Highlight */}
            <div className="mt-10 pt-6 border-t border-[#39B86B]/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#A4B6A8]">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#B8F34A]" />
                <span>Zero Carbon Objective</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#39B86B] hidden min-[360px]:block" />
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#39B86B]" />
                <span>Live Biosphere Analytics</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Cinematic Earth / Planet Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex items-center justify-center relative"
          >
            <div className="relative w-[300px] h-[300px] max-w-[calc(100vw-2rem)] aspect-square sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] flex items-center justify-center">
              {/* Outer Atmospheric Aura */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#39B86B]/25 via-[#B8F34A]/20 to-transparent blur-3xl animate-pulse" />

              {/* Orbital Ring 1 */}
              <div className="absolute inset-[-18px] rounded-full border border-[#B8F34A]/25 border-dashed pointer-events-none animate-[spin_60s_linear_infinite]" />

              {/* Orbital Ring 2 (Tilted) */}
              <div className="absolute inset-[-36px] rounded-full border border-[#39B86B]/20 pointer-events-none [transform:rotateX(65deg)]" />

              {/* Interactive 3D Earth Globe Body */}
              <div className="relative w-full h-full rounded-full overflow-hidden border border-[#B8F34A]/30 shadow-[0_0_60px_rgba(57,184,107,0.35),0_0_100px_rgba(184,243,74,0.2)] bg-[#041A12]">
                <Suspense fallback={<EarthLoadingFallback />}>
                  <Earth3D />
                </Suspense>
              </div>

              {/* Floating Stat Badge 1 - Top Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute -top-3 left-1 min-[375px]:-left-1 min-[390px]:-left-3 sm:-left-8 glass-card px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-20 border border-[#B8F34A]/30"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#B8F34A]/20 flex items-center justify-center text-[#B8F34A] shrink-0">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] sm:text-[10px] uppercase font-semibold text-[#A4B6A8] tracking-wider whitespace-nowrap">
                    Biosphere Index
                  </div>
                  <div className="text-xs sm:text-sm font-heading font-bold text-[#F3F7EF] flex items-center gap-1.5 whitespace-nowrap">
                    <span>98.4%</span>
                    <span className="text-[9px] sm:text-[10px] text-[#B8F34A] font-normal">Optimal</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Stat Badge 2 - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="absolute -bottom-3 right-1 min-[375px]:-right-1 min-[390px]:-right-3 sm:-right-8 glass-card px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-20 border border-[#39B86B]/30"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#39B86B]/20 flex items-center justify-center text-[#39B86B] shrink-0">
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] sm:text-[10px] uppercase font-semibold text-[#A4B6A8] tracking-wider whitespace-nowrap">
                    Carbon Offset
                  </div>
                  <div className="text-xs sm:text-sm font-heading font-bold text-[#F3F7EF] flex items-center gap-1.5 whitespace-nowrap">
                    <span>Net-Zero Active</span>
                  </div>
                </div>
              </motion.div>
              {/* Interactive Cue Badge */}
              <div className="absolute -bottom-7 sm:-bottom-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#08291C]/90 border border-[#39B86B]/30 text-[9px] sm:text-[10px] text-[#A4B6A8] tracking-wider uppercase backdrop-blur-md pointer-events-none shadow-md whitespace-nowrap z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8F34A] animate-pulse" />
                <span>Drag to rotate 3D Earth</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sustainability-Themed Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="w-full flex justify-center items-center pt-8 z-10"
      >
        <a
          href="#stats"
          className="group flex flex-col items-center gap-2 text-xs font-medium text-[#A4B6A8] hover:text-[#B8F34A] transition-colors focus:outline-none"
          aria-label="Scroll down to Impact Statistics"
        >
          <span className="tracking-widest uppercase text-[10px] text-[#A4B6A8] group-hover:text-[#B8F34A] transition-colors flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-[#B8F34A]" />
            Scroll to explore
          </span>
          <div className="w-6 h-10 rounded-full border border-[#39B86B]/40 flex items-start justify-center p-1 group-hover:border-[#B8F34A] transition-colors">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-[#B8F34A] shadow-[0_0_8px_#B8F34A]"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-[#A4B6A8] group-hover:text-[#B8F34A] -mt-1 group-hover:translate-y-0.5 transition-all" />
        </a>
      </motion.div>
    </section>
  )
}
