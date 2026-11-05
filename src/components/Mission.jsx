import { motion } from 'framer-motion'
import {
  Compass,
  Sparkles,
  Shield,
  Zap,
  Layers,
  Users,
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Globe2,
} from 'lucide-react'

export default function Mission() {
  const commitments = [
    {
      index: '01',
      title: 'PROTECT BIODIVERSITY',
      tagline: 'Preserve ecosystems and respect the natural balance of life.',
      description:
        'From primary rainforest canopy monitoring to marine reef restoration, we support initiatives that defend ecological habitats against degradation and preserve the evolutionary heritage of our planet.',
      icon: Shield,
      accent: 'from-[#39B86B] to-[#B8F34A]',
    },
    {
      index: '02',
      title: 'ACCELERATE CLEAN ENERGY',
      tagline: 'Support renewable energy and reduce dependence on fossil fuels.',
      description:
        'By championing next-generation solar, distributed wind networks, and long-duration storage technologies, we help decarbonize critical infrastructure and power human advancement sustainably.',
      icon: Zap,
      accent: 'from-[#B8F34A] to-[#39B86B]',
    },
    {
      index: '03',
      title: 'BUILD RESPONSIBLY',
      tagline: 'Encourage sustainable materials, circular systems and conscious consumption.',
      description:
        'We advocate for regenerative architectures, zero-waste industrial loops, and non-toxic bio-materials that keep precious resources cycling indefinitely rather than ending in landfills.',
      icon: Layers,
      accent: 'from-[#39B86B] to-[#B8F34A]',
    },
    {
      index: '04',
      title: 'INSPIRE COLLECTIVE ACTION',
      tagline: 'Make environmental responsibility part of everyday life.',
      description:
        'True ecological transformation happens when individuals, communities, and global organizations unite with shared intention. We create platforms and tools that turn empathy into measurable planetary impact.',
      icon: Users,
      accent: 'from-[#B8F34A] to-[#39B86B]',
    },
  ]

  return (
    <section
      id="mission"
      className="scroll-mt-20 py-28 sm:py-36 relative bg-[#041A12] border-t border-[#39B86B]/15 overflow-hidden"
    >
      {/* Ambient Atmospheric Lighting Blobs */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-48 w-[600px] h-[600px] bg-[#39B86B]/10 rounded-full blur-[180px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-2/3 -left-48 w-[650px] h-[650px] bg-[#B8F34A]/8 rounded-full blur-[190px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 space-y-24 sm:space-y-36">
        {/* ===================================================================
            PART A: MISSION HERO
            =================================================================== */}
        <div className="relative">
          {/* Eyebrow and Headline Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl text-left mb-12 sm:mb-16"
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <Compass className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>WHY ECOVERSE EXISTS</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#F3F7EF] leading-[1.08] mb-6">
              A BETTER PLANET IS NOT A DREAM.{' '}
              <span className="text-gradient-accent block sm:inline">
                IT'S OUR RESPONSIBILITY.
              </span>
            </h2>

            {/* Narrative Description */}
            <p className="text-base sm:text-xl text-[#F3F7EF]/90 font-normal leading-relaxed max-w-3xl">
              Every generation inherits a planet shaped by the choices before it. We believe the
              next chapter should be written through innovation, responsibility and collective
              action.
            </p>
          </motion.div>

          {/* Cinematic Environmental Photograph Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative rounded-3xl overflow-hidden border border-[#39B86B]/25 shadow-[0_25px_60px_rgba(0,0,0,0.65)] group"
          >
            {/* Aspect container with cinematic height */}
            <div className="relative h-[340px] sm:h-[460px] md:h-[540px] w-full overflow-hidden">
              <img
                src="/assets/mission/mission-hero.jpg"
                alt="Breathtaking mist-veiled emerald forest canopy illustrating the enduring majesty and fragility of Earth's ecosystems"
                className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                loading="lazy"
              />

              {/* Sophisticated Multi-layer Gradient Dark Overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#041A12] via-[#041A12]/45 to-transparent pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#041A12]/60 via-transparent to-[#041A12]/40 pointer-events-none"
              />

              {/* Lower Overlay Content Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#041A12]/80 backdrop-blur-md border border-[#B8F34A]/25 text-[11px] font-medium text-[#B8F34A] tracking-wider uppercase mb-2">
                    <Leaf className="w-3 h-3" />
                    <span>BIOSPHERE STEWARDSHIP</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#F3F7EF] font-heading font-medium">
                    The biosphere is an interconnected living web. Protecting its equilibrium requires
                    both ecological reverence and bold technological creativity.
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#08291C]/75 backdrop-blur-md border border-[#39B86B]/25">
                  <Globe2 className="w-4 h-4 text-[#B8F34A]" />
                  <span className="text-xs text-[#A4B6A8] font-mono tracking-wider">
                    PLANETARY REGENERATION PROTOCOL
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===================================================================
            PART B: OUR VISION (Editorial Asymmetric Layout)
            =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Storytelling Asset */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-5 relative order-2 lg:order-1"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Subtle ambient backglow */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#39B86B]/20 via-[#B8F34A]/15 to-transparent blur-2xl opacity-75 pointer-events-none"
              />

              <div className="relative rounded-3xl overflow-hidden border border-[#39B86B]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
                <img
                  src="/assets/mission/vision-nature-tech.jpg"
                  alt="Modern biophilic architecture integrating flourishing botanical gardens into clean glass and steel structures"
                  className="w-full h-[400px] sm:h-[480px] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Subtle vignette scrim */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#041A12] via-[#041A12]/30 to-transparent pointer-events-none"
                />

                {/* Floating caption card */}
                <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 p-3.5 sm:p-4 rounded-2xl bg-[#041A12]/85 backdrop-blur-md border border-[#B8F34A]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#B8F34A]" />
                    <span className="text-xs font-semibold text-[#F3F7EF] font-heading">
                      Biophilic Integration
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A4B6A8] leading-relaxed">
                    Engineering human habitats that act as living extensions of natural biomes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative & Vision Statement */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="lg:col-span-7 flex flex-col text-left order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-5 w-fit shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>OUR VISION</span>
            </div>

            <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F7EF] leading-[1.15] mb-6">
              A FUTURE WHERE NATURE AND TECHNOLOGY{' '}
              <span className="text-gradient-accent">THRIVE TOGETHER.</span>
            </h3>

            {/* Core Prompt Description */}
            <div className="border-l-2 border-[#B8F34A] pl-5 sm:pl-6 my-2 mb-6">
              <p className="text-base sm:text-lg text-[#F3F7EF] font-normal leading-relaxed italic">
                "Imagine cities that breathe, energy that renews itself, and communities that grow
                without exhausting the planet. This is the future we believe is possible."
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#A4B6A8] leading-relaxed mb-8">
              We reject the false dichotomy that human progress must come at the expense of ecological
              collapse. By aligning synthetic biology, smart renewable power grids, and cyclical
              manufacturing with nature's time-tested patterns, we can forge a civilization that
              regenerates Earth with every step it takes forward.
            </p>

            {/* Vision Metrics / Horizon Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#08291C]/50 border border-[#39B86B]/20">
                <span className="text-xs uppercase tracking-wider text-[#B8F34A] font-semibold block mb-1">
                  System Architecture
                </span>
                <p className="text-xs sm:text-sm text-[#F3F7EF] font-heading font-medium">
                  Closed-loop circular flows designed to eliminate landfill waste permanently.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#08291C]/50 border border-[#39B86B]/20">
                <span className="text-xs uppercase tracking-wider text-[#B8F34A] font-semibold block mb-1">
                  Decarbonized Horizon
                </span>
                <p className="text-xs sm:text-sm text-[#F3F7EF] font-heading font-medium">
                  100% ambient renewable electrification across industrial and urban centers.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===================================================================
            PART C: OUR COMMITMENT (Editorial Manifesto Ledger)
            =================================================================== */}
        <div>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 text-left"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
                <Shield className="w-3.5 h-3.5 text-[#B8F34A]" />
                <span>CORE DIRECTIVES</span>
              </div>

              <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F7EF] leading-tight">
                OUR COMMITMENTS <br className="hidden sm:inline" />
                <span className="text-gradient-accent">TO A LIVING PLANET.</span>
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[#A4B6A8] max-w-md leading-relaxed">
              These four pillars serve as the operational manifesto guiding every research initiative,
              sustainable technology partnership, and community engagement we spearhead.
            </p>
          </motion.div>

          {/* Distinct Editorial Ledger Layout (Non-Generic Cards) */}
          <div className="space-y-4">
            {commitments.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                  className="group relative p-4 sm:p-8 rounded-2xl bg-[#08291C]/40 hover:bg-[#08291C]/75 border border-[#39B86B]/20 hover:border-[#B8F34A]/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                    {/* Index & Title Section */}
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-6 lg:w-5/12">
                      <span className="font-mono text-lg sm:text-2xl font-bold text-[#B8F34A] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0">
                        {item.index}
                      </span>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-[#0D3524] text-[#B8F34A] border border-[#B8F34A]/25 shrink-0 group-hover:shadow-[0_0_20px_rgba(184,243,74,0.3)] transition-all duration-300">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      <div>
                        <h4 className="font-heading text-base sm:text-xl font-bold text-[#F3F7EF] group-hover:text-white transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#B8F34A] font-medium mt-0.5">
                          {item.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Extended Insight & Narrative */}
                    <div className="lg:w-6/12 pl-0 sm:pl-16 lg:pl-0 mt-1 sm:mt-0">
                      <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed group-hover:text-[#F3F7EF]/90 transition-colors">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Accent Indicator */}
                    <div className="hidden lg:flex lg:w-1/12 justify-end">
                      <div className="w-9 h-9 rounded-full bg-[#0D3524] border border-[#39B86B]/30 flex items-center justify-center text-[#A4B6A8] group-hover:text-[#B8F34A] group-hover:border-[#B8F34A]/50 group-hover:scale-110 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ===================================================================
            PART D: CLOSING STATEMENT
            =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-3xl p-6 sm:p-14 lg:p-16 overflow-hidden bg-gradient-to-br from-[#08291C] via-[#041A12] to-[#08291C] border border-[#B8F34A]/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center"
        >
          {/* Subtle Ambient Radial Lighting in Center */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8F34A]/10 rounded-full blur-[140px] pointer-events-none"
          />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Sparkle Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D3524] border border-[#B8F34A]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>THE CALL TO ACTION</span>
            </div>

            {/* Closing Heading */}
            <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-[#F3F7EF] tracking-tight leading-[1.15] mb-5">
              THE FUTURE ISN'T SOMETHING WE WAIT FOR.{' '}
              <span className="text-gradient-accent block mt-1">IT'S SOMETHING WE BUILD.</span>
            </h3>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#A4B6A8] leading-relaxed mb-8 max-w-2xl">
              Every thoughtful choice moves us closer to a greener tomorrow. The journey begins with
              us.
            </p>

            {/* Dual CTA Navigation Links */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#solutions"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#B8F34A] text-[#041A12] px-7 py-3.5 rounded-full font-heading font-semibold text-sm hover:bg-[#39B86B] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(184,243,74,0.3)] hover:shadow-[0_0_28px_rgba(184,243,74,0.55)] hover:scale-105 active:scale-95"
              >
                <span>Explore Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#innovations"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#08291C] text-[#F3F7EF] border border-[#39B86B]/40 px-7 py-3.5 rounded-full font-heading font-semibold text-sm hover:border-[#B8F34A] hover:text-[#B8F34A] transition-all duration-300"
              >
                <span>View Green Innovations</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
