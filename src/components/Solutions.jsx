import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun,
  Trees,
  Recycle,
  House,
  ArrowUpRight,
  Sparkles,
  X,
  CheckCircle2,
  Zap,
} from 'lucide-react'

export default function Solutions() {
  const [selectedSolution, setSelectedSolution] = useState(null)
  const previousFocusRef = useRef(null)
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Track the element that had focus prior to opening the modal
  useEffect(() => {
    if (selectedSolution) {
      previousFocusRef.current = document.activeElement
    }
  }, [selectedSolution])

  // Accessible keyboard trap, Escape dismissal, and focus restoration
  useEffect(() => {
    if (!selectedSolution) return

    document.body.style.overflow = 'hidden'

    // Move initial focus to the close button within the dialog
    const focusTimer = requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedSolution(null)
        return
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const visibleFocusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        )

        if (visibleFocusable.length === 0) {
          e.preventDefault()
          return
        }

        const firstElement = visibleFocusable[0]
        const lastElement = visibleFocusable[visibleFocusable.length - 1]

        if (e.shiftKey) {
          // Shift + Tab: if on first element, wrap to last
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(focusTimer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'

      // Restore focus to the element that triggered the modal
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [selectedSolution])

  const solutions = [
    {
      id: 'renewable-energy',
      category: 'Clean Energy Grid',
      title: 'Renewable Energy',
      description:
        'Accelerating the transition to cleaner energy through solar, wind and innovative renewable technologies.',
      icon: Sun,
      image: '/assets/solutions/renewable-energy.jpg',
      imageAlt:
        'Modern wind turbines generating clean energy over green rolling hills during sunset',
      metric: 'Zero-Carbon Power',
      detailedExplanation:
        'The transition to clean renewable energy is the single most urgent lever in stabilizing planetary climate systems. By coupling advanced photovoltaic materials, next-generation wind turbine aerodynamics, and geothermal exploration, renewable infrastructure replaces fossil fuel combustion with inexhaustible ambient fluxes. Modern smart grids dynamically coordinate distributed community generation with AI-driven battery storage, ensuring reliable, continuous clean power without carbon emissions.',
      benefits: [
        {
          title: 'Deep Decarbonization',
          description:
            'Permanently eliminates greenhouse gas and particulate emissions from electricity generation.',
        },
        {
          title: 'Resource Perpetuity',
          description:
            'Harnesses infinite solar, wind, and geothermal flows without extracting finite Earth reserves.',
        },
        {
          title: 'Air & Water Protection',
          description:
            'Eliminates toxic combustion smog and ends water-intensive cooling cycles common to fossil plants.',
        },
        {
          title: 'Decentralized Grid Resilience',
          description:
            'Localized clean microgrids safeguard community power continuity during extreme weather events.',
        },
      ],
      realWorldExamples: [
        {
          name: 'Offshore Floating Wind Hubs',
          detail:
            'Deep-water turbine arrays anchored in high-velocity open ocean currents, generating gigawatt-scale clean energy.',
        },
        {
          name: 'Agrivoltaic Solar Farming',
          detail:
            'Elevated solar canopies that generate clean power while shading crops, cutting agricultural water evaporation by 30%.',
        },
        {
          name: 'Grid-Scale Solid-State Storage',
          detail:
            'Safe, high-capacity community battery banks storing surplus midday solar for zero-emission nighttime distribution.',
        },
      ],
    },
    {
      id: 'forest-conservation',
      category: 'Biosphere Protection',
      title: 'Forest Conservation',
      description:
        'Protecting natural ecosystems, restoring forests and preserving biodiversity for future generations.',
      icon: Trees,
      image: '/assets/solutions/forest-conservation.jpg',
      imageAlt:
        'Sunlight streaming through deep emerald ancient forest trees and pristine canopy',
      metric: 'Canopy Recovery',
      detailedExplanation:
        'Old-growth forests, temperate woodlands, and tropical rainforests serve as Earth’s primary biological lungs. Together, they act as massive terrestrial carbon reservoirs and harbor over 80% of land-based biodiversity. Conserving intact ecosystems is far more effective and permanent than mechanical carbon sequestration. ECOVERSE champions satellite canopy monitoring, legal habitat corridor preservation, and autonomous drone-assisted reforestation to safeguard biomes from fragmentation.',
      benefits: [
        {
          title: 'Massive Carbon Sequestration',
          description:
            'Mature forest biomes capture and lock away gigatons of carbon within living wood, roots, and rich soil layers.',
        },
        {
          title: 'Biodiversity Sanctuaries',
          description:
            'Protects keystone animal and plant species, maintaining healthy genetic diversity and food web resilience.',
        },
        {
          title: 'Hydrological Stabilization',
          description:
            'Tree canopies generate regional rainfall patterns, prevent severe topsoil erosion, and recharge aquifers.',
        },
        {
          title: 'Microclimate Cooling',
          description:
            'Dense natural canopies lower ground surface temperatures by up to 8°C, countering desertification and heatwaves.',
        },
      ],
      realWorldExamples: [
        {
          name: 'Bio-Acoustic Rainforest Protection',
          detail:
            'Solar-powered acoustic sensors deployed across remote rainforests to detect illegal chainsaws and alert rangers in real time.',
        },
        {
          name: 'Drone Swarm Reforestation',
          detail:
            'Precision aerial drones firing nutrient-encapsulated native seed pods to replant up to 100,000 trees per day on deforested land.',
        },
        {
          name: 'Indigenous Land Titling Corridors',
          detail:
            'Empowering indigenous land guardians with high-resolution satellite telemetry to establish legally inviolable conservation zones.',
        },
      ],
    },
    {
      id: 'circular-economy',
      category: 'Resource Architecture',
      title: 'Circular Economy',
      description:
        'Redesigning how resources are produced, reused and recovered to minimize waste and environmental impact.',
      icon: Recycle,
      image: '/assets/solutions/circular-economy.jpg',
      imageAlt:
        'Hands gently cupping a thriving young green sprout symbolizing closed-loop ecological renewal',
      metric: 'Closed-Loop Systems',
      detailedExplanation:
        'The outdated industrial linear model of “take, make, and dispose” has pushed planetary resource limits to the brink. The circular economy re-architects industrial manufacturing so that waste ceases to exist as a concept. Products are designed from the molecular stage for perpetual disassembly, non-toxic bio-degradation, or continuous industrial reuse, ensuring that every harvested material circulates indefinitely.',
      benefits: [
        {
          title: 'Zero Landfill Waste',
          description:
            'Retains technical minerals and biological nutrients in closed cycles, ending leachate contamination in landfills.',
        },
        {
          title: 'Raw Extraction Avoidance',
          description:
            'Reduces the need for ecologically destructive virgin mineral mining, oil drilling, and habitat loss.',
        },
        {
          title: 'Embodied Energy Conservation',
          description:
            'Recycling and remanufacturing technical metals uses up to 90% less energy than refining virgin ores.',
        },
        {
          title: 'Pollution & Plastic Elimination',
          description:
            'Replaces toxic synthetic packaging with marine-degradable bio-materials that dissolve harmlessly in soil.',
        },
      ],
      realWorldExamples: [
        {
          name: 'Modular Magnetic Electronics',
          detail:
            'Smartphones and computing hardware built with solderless magnetic modules, allowing easy repair and infinite component upgrades.',
        },
        {
          name: 'Mycelium Organic Packaging',
          detail:
            'Agricultural mushroom root structures grown into custom shock-absorbent packaging that fully composts in 30 days.',
        },
        {
          name: 'Enzymatic Textile Recycling',
          detail:
            'Biological enzymes that break down blended polyester-cotton garments into virgin-grade fibers without quality degradation.',
        },
      ],
    },
    {
      id: 'sustainable-living',
      category: 'Ecological Communities',
      title: 'Sustainable Living',
      description:
        'Encouraging smarter communities, responsible consumption and everyday choices that support a sustainable future.',
      icon: House,
      image: '/assets/solutions/sustainable-living.jpg',
      imageAlt:
        'Modern sustainable biophilic house integrated harmoniously into natural forest surroundings',
      metric: 'Biophilic Living',
      detailedExplanation:
        'Sustainable living bridges personal habits with regenerative community design. When homes are constructed with passive heating and cross-ventilation, food is grown locally through urban vertical farming, and streets prioritize people over combustion vehicles, quality of life rises while environmental footprints shrink. ECOVERSE showcases actionable pathways for households and municipalities to flourish in balance with nature.',
      benefits: [
        {
          title: 'Household Energy Efficiency',
          description:
            'Smart insulation, heat pumps, and solar integration cut residential operational energy demand by up to 70%.',
        },
        {
          title: 'Urban Heat Island Reduction',
          description:
            'Living green roofs and reflective pavements naturally lower metropolitan summer temperatures by 3°C to 5°C.',
        },
        {
          title: 'Localized Food Security',
          description:
            'Neighborhood hydroponics and community gardens reduce long-distance food transport miles and supply-chain spoilage.',
        },
        {
          title: 'Zero-Emission Mobility',
          description:
            'Designing walkable 15-minute neighborhoods encourages cycling and micro-transit over single-passenger car trips.',
        },
      ],
      realWorldExamples: [
        {
          name: 'Passivhaus Eco-Districts',
          detail:
            'Net-positive neighborhoods built with cross-laminated timber, triple-glazed windows, and rooftop biodiversity gardens.',
        },
        {
          name: 'Closed-Loop Urban Hydroponics',
          detail:
            'Automated vertical farms inside city centers producing fresh pesticide-free produce using 95% less water than open fields.',
        },
        {
          name: 'Community Circular Refill Networks',
          detail:
            'Neighborhood logistics networks providing standard reusable packaging for groceries and home goods, eliminating single-use plastic.',
        },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section
      id="solutions"
      className="py-28 sm:py-32 relative bg-[#041A12] border-t border-[#39B86B]/15 overflow-hidden"
    >
      {/* Decorative Atmospheric Lighting Elements */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-48 w-[550px] h-[550px] bg-[#39B86B]/10 rounded-full blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -right-48 w-[600px] h-[600px] bg-[#B8F34A]/8 rounded-full blur-[170px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl text-left"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>OUR PLANET. OUR RESPONSIBILITY.</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F3F7EF] leading-[1.08]">
              SOLUTIONS FOR A <br />
              <span className="text-gradient-accent">GREENER TOMORROW.</span>
            </h2>
          </motion.div>

          {/* Supporting Description */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="max-w-md text-left md:text-right"
          >
            <p className="text-base sm:text-lg text-[#A4B6A8] leading-relaxed">
              Real change begins with intelligent solutions. Discover how innovation,
              conservation and responsible living can create a healthier planet for
              generations to come.
            </p>
          </motion.div>
        </div>

        {/* Four Featured Solution Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {solutions.map((item) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.id}
                variants={cardVariants}
                className="group relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex flex-col justify-between p-6 sm:p-10 border border-[#39B86B]/25 hover:border-[#B8F34A]/60 transition-all duration-500 shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(184,243,74,0.16)]"
              >
                {/* Background Environmental Image with Zoom on Hover */}
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.78] contrast-[1.05]"
                  loading="lazy"
                />

                {/* Dark Gradient Overlays for High Legibility */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#041A12] via-[#041A12]/75 to-[#041A12]/30"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-tr from-[#39B86B]/20 via-transparent to-[#B8F34A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Top Row: Category Label and Icon Badge */}
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#041A12]/85 backdrop-blur-md border border-[#39B86B]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase shadow-md">
                    <span>{item.category}</span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-[#08291C]/90 backdrop-blur-md border border-[#B8F34A]/30 flex items-center justify-center text-[#B8F34A] group-hover:bg-[#B8F34A] group-hover:text-[#041A12] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(184,243,74,0.5)] transition-all duration-300 shadow-[0_0_15px_rgba(184,243,74,0.2)]">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Bottom Content: Title, Description & Action */}
                <div className="relative z-10 mt-auto pt-16">
                  {/* Metric Sub-badge */}
                  <span className="text-[11px] font-mono tracking-widest text-[#A4B6A8] uppercase mb-2 block">
                    Focus • {item.metric}
                  </span>

                  {/* Heading */}
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#F3F7EF] mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-[#A4B6A8] leading-relaxed mb-6 group-hover:text-[#F3F7EF]/90 transition-colors">
                    {item.description}
                  </p>

                  {/* Explore More Button: Opens the details modal */}
                  <button
                    type="button"
                    onClick={() => setSelectedSolution(item)}
                    className="inline-flex items-center gap-2 font-heading font-semibold text-sm text-[#B8F34A] group/btn hover:text-white transition-colors focus:outline-none focus-visible:underline cursor-pointer"
                    aria-label={`Explore more details about ${item.title}`}
                  >
                    <span>Explore More</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200" />
                  </button>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>

      {/* Premium Solution Details Modal */}
      <AnimatePresence>
        {selectedSolution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-[#041A12]/85 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedSolution(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl my-auto rounded-3xl bg-[#08291C] border border-[#39B86B]/30 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(184,243,74,0.18)] overflow-hidden max-h-[90vh] flex flex-col text-left"
            >
              {/* Modal Top Banner with Image and Floating Controls */}
              <div className="relative h-52 sm:h-64 w-full shrink-0 overflow-hidden">
                <img
                  src={selectedSolution.image}
                  alt={selectedSolution.imageAlt}
                  className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#08291C] via-[#08291C]/60 to-transparent"
                />

                {/* Top Bar inside image */}
                <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-10">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#041A12]/80 backdrop-blur-md border border-[#39B86B]/30 text-[11px] sm:text-xs font-semibold text-[#B8F34A] tracking-wider uppercase">
                    <span>{selectedSolution.category}</span>
                  </div>

                  {/* Close Button */}
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setSelectedSolution(null)}
                    className="w-10 h-10 rounded-full bg-[#041A12]/80 hover:bg-[#0D3524] border border-[#B8F34A]/30 hover:border-[#B8F34A] text-[#F3F7EF] hover:text-[#B8F34A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8F34A] shrink-0"
                    aria-label="Close solution details modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Title badge overlay at bottom of image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 z-10 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#041A12]/90 backdrop-blur-md border border-[#B8F34A]/40 flex items-center justify-center text-[#B8F34A] shadow-md shrink-0">
                    {(() => {
                      const IconComponent = selectedSolution.icon
                      return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    })()}
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#B8F34A] uppercase block">
                      Solution Blueprint • {selectedSolution.metric}
                    </span>
                    <h3
                      id="modal-title"
                      className="font-heading text-xl sm:text-3xl font-extrabold text-[#F3F7EF] tracking-tight"
                    >
                      {selectedSolution.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 flex-grow custom-scrollbar">
                {/* Detailed Explanation */}
                <div>
                  <h4 className="font-heading text-xs font-semibold text-[#B8F34A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Executive Overview</span>
                  </h4>
                  <p className="text-sm sm:text-base text-[#F3F7EF]/90 leading-relaxed">
                    {selectedSolution.detailedExplanation}
                  </p>
                </div>

                {/* Key Environmental Benefits */}
                <div>
                  <h4 className="font-heading text-xs font-semibold text-[#B8F34A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Environmental Benefits</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedSolution.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#041A12]/60 border border-[#39B86B]/20 hover:border-[#B8F34A]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F34A]" />
                          <span className="font-heading font-bold text-xs sm:text-sm text-[#F3F7EF]">
                            {benefit.title}
                          </span>
                        </div>
                        <p className="text-xs text-[#A4B6A8] leading-relaxed pl-3.5">
                          {benefit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Real-World Examples */}
                <div>
                  <h4 className="font-heading text-xs font-semibold text-[#B8F34A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Real-World Initiatives & Applications</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedSolution.realWorldExamples.map((example, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#041A12]/60 border border-[#39B86B]/20 flex items-start gap-3.5"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#08291C] border border-[#B8F34A]/30 text-[#B8F34A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                          0{idx + 1}
                        </div>
                        <div>
                          <span className="font-heading font-bold text-sm text-[#F3F7EF] block mb-1">
                            {example.name}
                          </span>
                          <p className="text-xs text-[#A4B6A8] leading-relaxed">
                            {example.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action / Close */}
                <div className="pt-4 border-t border-[#39B86B]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#A4B6A8]">
                    Press <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#041A12] border border-[#39B86B]/30 font-mono text-[#F3F7EF]">ESC</kbd> or click outside to close
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSolution(null)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#B8F34A] text-[#041A12] font-heading font-semibold text-xs uppercase tracking-wider hover:bg-[#39B86B] hover:text-white transition-all shadow-[0_0_15px_rgba(184,243,74,0.3)] cursor-pointer"
                  >
                    Close Overview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
