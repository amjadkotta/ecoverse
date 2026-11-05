import { motion } from 'framer-motion'
import { CheckCircle2, ShieldCheck, Cpu, Compass, ArrowRight } from 'lucide-react'

export default function Introduction() {
  const pillars = [
    {
      title: 'Biomimetic Systems',
      description:
        'Emulating millions of years of natural evolution where waste does not exist and resources flow in perpetual regenerative cycles.',
      icon: Compass,
    },
    {
      title: 'Clean Technological Abundance',
      description:
        'Replacing depleting carbon-based energy with smart, decentralized microgrids powered by sun, wind, and kinetic renewal.',
      icon: Cpu,
    },
    {
      title: 'Planetary Biosphere Stewardship',
      description:
        'Deploying real-time ecological sensing to protect primary biomes, rewild damaged land, and ensure biodiversity continuity.',
      icon: ShieldCheck,
    },
  ]

  return (
    <section id="introduction" className="py-28 relative bg-[#08291C]/60 overflow-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-[#39B86B]/10 rounded-full blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-[#B8F34A]/8 rounded-full blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col text-left"
          >
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D3524] border border-[#B8F34A]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-6 w-fit shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <span>Why Sustainability Matters</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-[#F3F7EF] leading-[1.1] mb-6">
              OUR PLANET NEEDS <br />
              <span className="text-gradient-accent">A NEW PERSPECTIVE.</span>
            </h2>

            {/* Lead Narrative */}
            <p className="text-base sm:text-lg text-[#F3F7EF] font-normal leading-relaxed mb-6">
              For generations, humanity engineered systems under the illusion that our biosphere’s
              resources were infinite. The global ecological threshold we now face is not just an
              environmental warning—it is our greatest creative call to action.
            </p>

            <p className="text-sm sm:text-base text-[#A4B6A8] leading-relaxed mb-8">
              At ECOVERSE, we understand that true sustainability is not about compromise or
              austerity. It is about leapfrogging antiquated industrial models through intelligent
              design, clean energy, and respectful coexistence with the natural world.
            </p>

            {/* Three Key Strategic Pillars */}
            <div className="space-y-4 mb-8">
              {pillars.map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.title}
                    className="p-4 rounded-xl bg-[#041A12]/60 border border-[#39B86B]/20 hover:border-[#B8F34A]/40 transition-colors flex items-start gap-4"
                  >
                    <div className="p-2.5 rounded-lg bg-[#08291C] text-[#B8F34A] border border-[#B8F34A]/25 shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#F3F7EF] mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mission CTA */}
            <div className="flex items-center gap-4">
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-[#B8F34A] hover:text-white transition-colors group"
              >
                <span>Discover our sustainable solutions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Elegant Image Layout with Floating Glass Badges */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Backing Ambient Glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#39B86B]/25 via-[#B8F34A]/15 to-transparent blur-2xl opacity-75"
              />

              {/* Main Framed Environmental Image */}
              <div className="relative rounded-3xl overflow-hidden border border-[#39B86B]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <img
                  src="/assets/introduction/introduction-forest.jpg"
                  alt="Sunlight filtering through a pristine emerald forest canopy representing planetary harmony"
                  className="w-full h-[420px] sm:h-[480px] object-cover scale-105 hover:scale-100 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />

                {/* Subtle Image Gradient Vignette */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#041A12] via-[#041A12]/30 to-transparent"
                />

                {/* Overlay Caption on Image */}
                <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 p-3.5 sm:p-4 rounded-2xl bg-[#041A12]/80 backdrop-blur-md border border-[#B8F34A]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#B8F34A]" />
                    <span className="text-xs font-semibold text-[#F3F7EF] font-heading">
                      Old-Growth Forest Corridor
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A4B6A8]">
                    Natural biodiversity zones absorb over 30% of global emissions annually.
                  </p>
                </div>
              </div>

              {/* Top Floating Glass Badge */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-5 right-2 sm:-right-6 glass-card px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border border-[#B8F34A]/30 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#B8F34A] animate-ping" />
                  <div>
                    <div className="text-[10px] text-[#A4B6A8] uppercase tracking-wider font-semibold">
                      Biodiversity Health
                    </div>
                    <div className="text-sm font-heading font-bold text-[#F3F7EF]">
                      99.2% Stable
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
