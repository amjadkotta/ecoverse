import { motion } from 'framer-motion'
import { Globe, Zap, Trees, Recycle, Sparkles, TrendingUp } from 'lucide-react'

export default function ImpactStats() {
  const stats = [
    {
      id: 'climate-action',
      category: 'Climate Action',
      icon: Globe,
      accentColor: '#B8F34A',
      value: '-45%',
      label: 'Carbon Reduction Target',
      description:
        'Illustrative 2035 milestone for planetary decarbonization pathways across transport and industry.',
      tag: 'Target Milestone',
    },
    {
      id: 'clean-energy',
      category: 'Clean Energy',
      icon: Zap,
      accentColor: '#39B86B',
      value: '82%',
      label: 'Renewable Grid Share',
      description:
        'Target simulation model powered by distributed solar, microgrids, and kinetic storage integration.',
      tag: 'Ecosystem Standard',
    },
    {
      id: 'forest-conservation',
      category: 'Forest Conservation',
      icon: Trees,
      accentColor: '#B8F34A',
      value: '1.2B',
      unit: 'ha',
      label: 'Canopy Restoration Goal',
      description:
        'Illustrative global target for rewilding native biomes and securing critical biodiversity corridors.',
      tag: 'Conservation Target',
    },
    {
      id: 'sustainable-living',
      category: 'Sustainable Living',
      icon: Recycle,
      accentColor: '#39B86B',
      value: '95%',
      label: 'Circular Material Lifecycle',
      description:
        'Simulated metropolitan blueprint for closed-loop resource recovery and zero-landfill consumption.',
      tag: 'Circularity Index',
    },
  ]

  return (
    <section id="stats" className="py-24 relative bg-[#041A12] border-t border-[#39B86B]/15 overflow-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#08291C] rounded-full blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-96 h-96 bg-[#B8F34A]/5 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
            <span>Illustrative Impact Benchmarks</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F3F7EF] mb-4">
            MEASURING OUR PATH TO REGENERATION
          </h2>

          <p className="text-base sm:text-lg text-[#A4B6A8] leading-relaxed">
            Data-backed vision for Earth’s recovery. The indicators below illustrate target
            benchmarks and strategic milestones guiding sustainable transformation.
          </p>
        </div>

        {/* 4 Impact Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="group relative rounded-2xl bg-[#08291C]/70 hover:bg-[#0D3524]/90 p-6 sm:p-7 border border-[#39B86B]/20 hover:border-[#B8F34A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(184,243,74,0.15)] flex flex-col justify-between"
              >
                {/* Top Row: Icon and Tag */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner"
                      style={{
                        backgroundColor:
                          stat.accentColor === '#B8F34A'
                            ? 'rgba(184, 243, 74, 0.12)'
                            : 'rgba(57, 184, 107, 0.15)',
                        color: stat.accentColor,
                        border: `1px solid ${
                          stat.accentColor === '#B8F34A'
                            ? 'rgba(184, 243, 74, 0.3)'
                            : 'rgba(57, 184, 107, 0.3)'
                        }`,
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#041A12] border border-[#39B86B]/25 text-[#A4B6A8]">
                      {stat.tag}
                    </span>
                  </div>

                  {/* Category Title */}
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#39B86B] block mb-1">
                    {stat.category}
                  </span>

                  {/* Figure / Value */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-gradient-accent">
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="font-heading text-xl font-bold text-[#A4B6A8]">
                        {stat.unit}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <h3 className="font-heading text-base font-semibold text-[#F3F7EF] mb-3">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Bottom Status line */}
                <div className="mt-6 pt-4 border-t border-[#39B86B]/15 flex items-center justify-between text-[11px] text-[#A4B6A8]">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#B8F34A]" />
                    <span>Modeling Target</span>
                  </span>
                  <span className="text-[#B8F34A] font-medium">Active Roadmap</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Ethical Illustrative Notice */}
        <div className="mt-12 text-center">
          <p className="text-xs text-[#A4B6A8]/80 max-w-3xl mx-auto italic">
            * <strong className="text-[#A4B6A8]">Illustrative Benchmark Notice:</strong> The
            figures above represent illustrative planetary modeling benchmarks and strategic
            targets created for the TerraCode sustainability initiative; they are not presented
            as verified empirical historical totals.
          </p>
        </div>
      </div>
    </section>
  )
}
