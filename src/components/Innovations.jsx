import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun,
  Building2,
  Sprout,
  BatteryCharging,
  Radar,
  Building,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle2,
  Zap,
} from 'lucide-react'

export default function Innovations() {
  const [activeInnovation, setActiveInnovation] = useState(null)
  const previousFocusRef = useRef(null)
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Track the element that had focus prior to opening the modal
  useEffect(() => {
    if (activeInnovation) {
      previousFocusRef.current = document.activeElement
    }
  }, [activeInnovation])

  // Accessible keyboard trap, Escape dismissal, and focus restoration
  useEffect(() => {
    if (!activeInnovation) return

    document.body.style.overflow = 'hidden'

    // Move initial focus to the close button within the dialog
    const focusTimer = requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveInnovation(null)
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
  }, [activeInnovation])

  const innovations = [
    {
      id: 'next-gen-solar',
      index: '01',
      category: 'Clean Energy',
      title: 'Next-Generation Solar',
      description:
        'Discover advanced solar technologies making renewable energy more efficient, accessible and reliable.',
      icon: Sun,
      image: '/assets/innovations/solar.jpg',
      imageAlt:
        'Modern high-efficiency solar panel farm capturing bright sunlight across a green landscape',
      metric: '33%+ Cell Efficiency',
      detailedExplanation:
        'Next-generation solar technology is breaking through legacy silicon efficiency boundaries. By engineering multi-junction perovskite-silicon tandem cells, solar capture efficiency is surpassing 33%, converting broader spectra of sunlight—including diffuse ambient light during overcast days. Beyond traditional ground farms, transparent photovoltaic glass transforms building facades into power generators, while lightweight flexible thin-films enable solar integration on vehicles, curved surfaces, and wearable devices.',
      benefits: [
        {
          title: 'Up to 50% Higher Yield',
          description:
            'Generates significantly more kilowatt-hours per square meter than standard mono-silicon panels.',
        },
        {
          title: 'Low-Carbon Manufacturing',
          description:
            'Perovskite synthesis requires significantly lower baking temperatures than traditional silicon refinement.',
        },
        {
          title: 'Dual Land Utilization',
          description:
            'Integrates directly over water reservoirs (floatovoltaics) and glass facades without wilderness disruption.',
        },
        {
          title: 'Unprecedented Affordability',
          description:
            'Drives the levelized cost of energy (LCOE) below $0.02 per kWh, outcompeting fossil combustion.',
        },
      ],
      applications: [
        {
          name: 'Perovskite-Silicon Tandem Cells',
          detail:
            'Multi-junction layers engineered to capture high-energy blue and low-energy infrared photons simultaneously.',
        },
        {
          name: 'Building-Integrated Photovoltaics (BIPV)',
          detail:
            'Solar window coatings generating electricity while providing thermal insulation for commercial towers.',
        },
        {
          name: 'Floating Solar Arrays (Floatovoltaics)',
          detail:
            'Reservoir-based solar platforms that reduce water evaporation while natural water cooling boosts panel efficiency.',
        },
      ],
    },
    {
      id: 'smart-green-cities',
      index: '02',
      category: 'Intelligent Infrastructure',
      title: 'Smart Green Cities',
      description:
        'Explore connected urban environments designed around clean energy, efficient resources and greener communities.',
      icon: Building2,
      image: '/assets/innovations/smart-cities.jpg',
      imageAlt:
        'Futuristic sustainable city with lush green skyscrapers, vertical gardens and modern eco-architecture',
      metric: '40% Urban Emission Cut',
      detailedExplanation:
        'Smart green cities replace fragmented, wasteful metropolitan grids with interconnected digital ecosystems. Utilizing IoT sensor networks and algorithmic load balancing, urban centers optimize energy dispatch, minimize potable water loss, and eliminate traffic bottlenecks in real time. Pioneering 15-minute city models integrate micro-mobility arteries, community solar microgrids, and biophilic open spaces, ensuring that high-density living harmonizes with reduced greenhouse footprints and elevated human well-being.',
      benefits: [
        {
          title: 'Coordinated Decarbonization',
          description:
            'Automated smart building management and AI energy routing cut city-wide carbon emissions by 40%.',
        },
        {
          title: 'Potable Water Conservation',
          description:
            'Acoustic pipeline telemetry and greywater recycling preserve municipal water reservoirs.',
        },
        {
          title: 'Zero-Smog Corridors',
          description:
            'Electrified mass transit and prioritized pedestrian zones eliminate particulate pollution.',
        },
        {
          title: 'Stormwater Runoff Absorption',
          description:
            'Integrated bioswales and permeable pavements prevent toxic urban runoff from poisoning waterways.',
        },
      ],
      applications: [
        {
          name: 'Decentralized AI Microgrids',
          detail:
            'Neighborhood-scale networks dynamically routing surplus rooftop solar and battery reserves during peak hours.',
        },
        {
          name: 'Pneumatic Automated Waste Transit',
          detail:
            'Underground vacuum conduits whisking recyclables directly to regional circular sorting depots.',
        },
        {
          name: 'Predictive Acoustic Leak Detection',
          detail:
            'Acoustic sensors placed along municipal water mains pinpointing microscopic leaks before major loss.',
        },
      ],
    },
    {
      id: 'vertical-farming',
      index: '03',
      category: 'Future of Food',
      title: 'Vertical Farming',
      description:
        'Grow fresh food in controlled environments while reducing land requirements and optimizing water usage.',
      icon: Sprout,
      image: '/assets/innovations/vertical-farming.jpg',
      imageAlt:
        'Automated vertical indoor farm with rows of vibrant green produce under precision lighting',
      metric: '95% Water Conservation',
      detailedExplanation:
        'Vertical farming revolutionizes agriculture by uncoupling food production from arable land and erratic weather patterns. Inside closed-loop automated towers, crops grow stacked vertically under tailored LED photosynthetic recipes, nourished by automated aeroponic root misting. By establishing multi-story vertical farms inside urban hubs, agricultural food miles are cut to virtually zero, while agricultural chemical runoff and deforestation pressures are permanently halted.',
      benefits: [
        {
          title: 'Extreme Water Savings',
          description:
            'Closed-loop misting captures and recirculates 95% of water compared to open-field agricultural flooding.',
        },
        {
          title: 'Minimal Land Requirement',
          description:
            'A single vertical facility matches the annual agricultural output of up to 300 traditional outdoor acres.',
        },
        {
          title: 'Zero Chemical Pesticides',
          description:
            'Sterile indoor biomes eliminate the need for chemical insecticides, protecting wild pollinators and soil.',
        },
        {
          title: 'Zero Long-Haul Food Miles',
          description:
            'Hyperlocal city farming removes long-distance refrigerated trucking and supply-chain food spoilage.',
        },
      ],
      applications: [
        {
          name: 'Closed-Loop Aeroponic Misting',
          detail:
            'Suspended roots nourished by targeted nutrient mists, accelerating harvest cycles by up to 300%.',
        },
        {
          name: 'Custom Photosynthetic Spectra',
          detail:
            'Tuned LED wavelengths targeting specific chlorophyll absorption bands without wasting power.',
        },
        {
          name: 'Urban Supermarket Colocation',
          detail:
            'Modular micro-farms built directly adjacent to grocery hubs, delivering same-hour farm-to-shelf freshness.',
        },
      ],
    },
    {
      id: 'electric-mobility',
      index: '04',
      category: 'Clean Transportation',
      title: 'Electric Mobility',
      description:
        'Discover electric vehicles and intelligent charging systems helping transform modern transportation.',
      icon: BatteryCharging,
      image: '/assets/innovations/electric-mobility.jpg',
      imageAlt:
        'Modern electric vehicle connected to sleek clean-energy charging station',
      metric: 'Zero-Emission Transit',
      detailedExplanation:
        'Electric mobility is transforming global transit from combustion into an intelligent, zero-tailpipe ecosystem. Driven by solid-state battery chemistry and wide-bandgap silicon carbide inverters, modern electric transport spans consumer cars, heavy freight trucks, and electric vertical transit. Bidirectional Vehicle-to-Grid (V2G) technology transforms parked electric fleets into massive distributed energy storage systems, stabilizing municipal power grids during renewable supply fluctuations.',
      benefits: [
        {
          title: 'Zero Tailpipe Emissions',
          description:
            'Completely eradicates carbon monoxide, smog-forming nitrous oxides, and carcinogenic diesel soot.',
        },
        {
          title: 'High Drivetrain Efficiency',
          description:
            'Electric drivetrains convert over 85% of electrical energy into motion, compared to only 25% for internal combustion.',
        },
        {
          title: 'Vehicle-to-Grid Stabilization',
          description:
            'Connected electric vehicle batteries absorb daytime solar surges and discharge power during evening peaks.',
        },
        {
          title: 'Closed-Loop Battery Circularity',
          description:
            'Advanced hydrometallurgical recycling recovers over 95% of lithium, nickel, and cobalt for new batteries.',
        },
      ],
      applications: [
        {
          name: 'Solid-State Battery Architectures',
          detail:
            'High-density non-flammable solid electrolytes providing 800+ km range and ultra-fast 10-minute charging.',
        },
        {
          name: 'Bidirectional V2G Hubs',
          detail:
            'Smart charging stations that feed vehicle battery energy back into homes and public power grids.',
        },
        {
          name: 'Dynamic In-Road Inductive Charging',
          detail:
            'Electrified highway lanes that recharge heavy commercial transit trucks wirelessly while in motion.',
        },
      ],
    },
    {
      id: 'ai-monitoring',
      index: '05',
      category: 'Planetary Intelligence',
      title: 'AI Environmental Monitoring',
      description:
        'Use artificial intelligence, satellite imagery and environmental sensors to understand and protect ecosystems.',
      icon: Radar,
      image: '/assets/innovations/ai-monitoring.jpg',
      imageAlt:
        'Planetary digital telemetry and satellite network monitoring Earth biosphere',
      metric: 'Real-Time Earth Data',
      detailedExplanation:
        'AI environmental monitoring equips conservationists with a real-time digital nervous system for the biosphere. By fusing synthetic aperture radar, hyperspectral satellite scans, and terrestrial bio-acoustic sensors, machine learning models detect environmental anomalies instantaneously. From tracking illegal rainforest clearing and automated ocean plastic mapping to predictive wildfire propagation models, planetary AI transforms ecological protection from delayed reaction into proactive prevention.',
      benefits: [
        {
          title: 'Instant Threat Detection',
          description:
            'Identifies illegal logging roads and unauthorized deforestation weeks faster than manual ground patrols.',
        },
        {
          title: 'Precision Carbon Accounting',
          description:
            'Quantifies canopy biomass density down to individual tree crowns for transparent carbon verification.',
        },
        {
          title: 'Bio-Acoustic Wildlife Census',
          description:
            'Neural networks analyze rainforest soundscapes to automatically track endangered species populations.',
        },
        {
          title: 'Global Ocean Health Telemetry',
          description:
            'Monitors sea surface temperatures, algal blooms, and coral reef thermal stress worldwide in real time.',
        },
      ],
      applications: [
        {
          name: 'Satellite Forest Defense AI',
          detail:
            'Computer vision algorithms scanning multi-spectral orbital passes to flag canopy disruptions in hours.',
        },
        {
          name: 'Ocean Plastic Gyre Tracking',
          detail:
            'Orbital radar models pinpointing marine debris clusters to guide ocean cleanup vessels directly to hot spots.',
        },
        {
          name: 'Wildfire Propagation Modeling',
          detail:
            'Combining live thermal satellites and wind vectors to predict wildfire spread trajectories 6 hours ahead.',
        },
      ],
    },
    {
      id: 'sustainable-architecture',
      index: '06',
      category: 'Biophilic Design',
      title: 'Sustainable Architecture',
      description:
        'Explore energy-efficient buildings that integrate natural elements, responsible materials and intelligent design.',
      icon: Building,
      image: '/assets/innovations/sustainable-architecture.jpg',
      imageAlt:
        'Contemporary sustainable building exterior covered in living plants and vertical gardens',
      metric: 'Carbon-Negative Envelopes',
      detailedExplanation:
        'Sustainable architecture reconceives the built environment as living organisms rather than static consumers of energy. By harnessing mass timber, low-carbon geopolymer concretes, and aerodynamic passive ventilation shafts, regenerative buildings produce more clean energy than they consume. Biophilic facades integrate thousands of living plants and rainwater collection cisterns, turning concrete canyons into lush, oxygen-producing vertical forests that purify urban air and reconnect residents with nature.',
      benefits: [
        {
          title: 'Embodied Carbon Sequestration',
          description:
            'Replaces emissions-heavy steel and concrete with sustainably harvested cross-laminated mass timber.',
        },
        {
          title: '80% Lower HVAC Demand',
          description:
            'Passive solar orientation, airtight thermal envelopes, and natural wind towers minimize active heating and cooling.',
        },
        {
          title: 'Stormwater Attenuation',
          description:
            'Living green roofs absorb up to 70% of rainfall, filtering water and preventing urban flash flooding.',
        },
        {
          title: 'Biophilic Well-Being',
          description:
            'Integrating natural plants and circadian daylighting reduces occupant stress and elevates cognitive focus.',
        },
      ],
      applications: [
        {
          name: 'Mass Timber Skyscrapers',
          detail:
            'High-rise structures engineered with fire-resistant laminated timber that locks thousands of tons of carbon into buildings.',
        },
        {
          name: 'Passive Thermosiphon Shafts',
          detail:
            'Architectural cooling chimneys that naturally circulate ambient air without requiring electric air conditioning.',
        },
        {
          name: 'Living Botanical Skins',
          detail:
            'Vertical gardens irrigated with filtered residential greywater, insulating exterior walls and cooling local microclimates.',
        },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section
      id="innovations"
      className="scroll-mt-20 py-28 sm:py-32 relative bg-[#08291C]/50 border-t border-[#39B86B]/15 overflow-hidden"
    >
      {/* Decorative Atmospheric Lighting Elements */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-[#39B86B]/10 rounded-full blur-[170px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 -left-48 w-[550px] h-[550px] bg-[#B8F34A]/8 rounded-full blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D3524] border border-[#B8F34A]/30 text-xs font-semibold text-[#B8F34A] tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(184,243,74,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F34A]" />
              <span>INNOVATION MEETS SUSTAINABILITY</span>
            </div>

            {/* Main Section Heading */}
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F3F7EF] leading-[1.08] mb-6">
              TECHNOLOGY FOR A <br />
              <span className="text-gradient-accent">LIVING PLANET.</span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#A4B6A8] leading-relaxed">
              Tomorrow&apos;s sustainable world is being shaped by the innovations we create
              today. Discover the technologies transforming how we generate energy, grow
              food, build cities and protect our planet.
            </p>
          </motion.div>
        </div>

        {/* Six Innovation Cards in 3-Column Responsive Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {innovations.map((item) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.id}
                variants={cardVariants}
                className="group relative rounded-3xl bg-[#08291C]/80 hover:bg-[#0D3524]/90 p-5 sm:p-7 border border-[#39B86B]/20 hover:border-[#B8F34A]/50 transition-all duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_45px_rgba(184,243,74,0.15)] flex flex-col justify-between"
              >
                <div>
                  {/* Top Image Preview with Zoom on Hover */}
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 border border-[#39B86B]/25">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="w-full h-full object-cover scale-100 group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.82] contrast-[1.05]"
                      loading="lazy"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#041A12] via-[#041A12]/30 to-transparent"
                    />

                    {/* Top Corner Index Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-lg bg-[#041A12]/80 backdrop-blur-md border border-[#39B86B]/30 text-[10px] font-mono tracking-widest text-[#B8F34A] uppercase">
                      INNOVATION // {item.index}
                    </div>

                    {/* Metric Tag at bottom of image */}
                    <div className="absolute bottom-3 left-3.5 z-10 text-[11px] font-mono text-[#F3F7EF] bg-[#08291C]/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#B8F34A]/25">
                      {item.metric}
                    </div>
                  </div>

                  {/* Header Row: Category and Icon */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#39B86B]">
                      {item.category}
                    </span>

                    <div className="w-9 h-9 rounded-xl bg-[#041A12]/80 border border-[#B8F34A]/30 flex items-center justify-center text-[#B8F34A] group-hover:scale-110 group-hover:bg-[#B8F34A] group-hover:text-[#041A12] transition-all duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Innovation Heading */}
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F3F7EF] mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-[#A4B6A8] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Card Action Button: Discover Innovation */}
                <div className="pt-4 border-t border-[#39B86B]/15">
                  <button
                    type="button"
                    onClick={() => setActiveInnovation(item)}
                    className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-full bg-[#041A12]/60 hover:bg-[#B8F34A] border border-[#39B86B]/30 hover:border-[#B8F34A] text-[#F3F7EF] hover:text-[#041A12] font-heading font-semibold text-xs tracking-wide transition-all duration-300 group/btn cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(184,243,74,0.35)]"
                    aria-label={`Discover ${item.title}`}
                  >
                    <span>Discover Innovation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>

      {/* Innovation Details Modal */}
      <AnimatePresence>
        {activeInnovation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-[#041A12]/85 backdrop-blur-xl overflow-y-auto"
            onClick={() => setActiveInnovation(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="innovation-modal-title"
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
              {/* Modal Top Banner with Image */}
              <div className="relative h-52 sm:h-64 w-full shrink-0 overflow-hidden">
                <img
                  src={activeInnovation.image}
                  alt={activeInnovation.imageAlt}
                  className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#08291C] via-[#08291C]/60 to-transparent"
                />

                {/* Top Controls inside image */}
                <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-10 gap-2">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#041A12]/80 backdrop-blur-md border border-[#39B86B]/30 text-[10px] sm:text-xs font-semibold text-[#B8F34A] tracking-wider uppercase truncate max-w-[calc(100%-52px)]">
                    <span className="truncate">
                      INNOVATION {activeInnovation.index} • {activeInnovation.category}
                    </span>
                  </div>

                  {/* Close Button */}
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setActiveInnovation(null)}
                    className="w-10 h-10 rounded-full bg-[#041A12]/80 hover:bg-[#0D3524] border border-[#B8F34A]/30 hover:border-[#B8F34A] text-[#F3F7EF] hover:text-[#B8F34A] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8F34A] shrink-0"
                    aria-label="Close innovation details modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Title badge overlay at bottom of banner image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 z-10 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#041A12]/90 backdrop-blur-md border border-[#B8F34A]/40 flex items-center justify-center text-[#B8F34A] shadow-md shrink-0">
                    {(() => {
                      const IconComponent = activeInnovation.icon
                      return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    })()}
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#B8F34A] uppercase block">
                      Target Metric • {activeInnovation.metric}
                    </span>
                    <h3
                      id="innovation-modal-title"
                      className="font-heading text-xl sm:text-3xl font-extrabold text-[#F3F7EF] tracking-tight"
                    >
                      {activeInnovation.title}
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
                    <span>Technology Overview</span>
                  </h4>
                  <p className="text-sm sm:text-base text-[#F3F7EF]/90 leading-relaxed">
                    {activeInnovation.detailedExplanation}
                  </p>
                </div>

                {/* Environmental Benefits */}
                <div>
                  <h4 className="font-heading text-xs font-semibold text-[#B8F34A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Environmental Benefits</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeInnovation.benefits.map((benefit, idx) => (
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

                {/* Practical Applications */}
                <div>
                  <h4 className="font-heading text-xs font-semibold text-[#B8F34A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Practical Real-World Deployments</span>
                  </h4>
                  <div className="space-y-3">
                    {activeInnovation.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#041A12]/60 border border-[#39B86B]/20 flex items-start gap-3.5"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#08291C] border border-[#B8F34A]/30 text-[#B8F34A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                          0{idx + 1}
                        </div>
                        <div>
                          <span className="font-heading font-bold text-sm text-[#F3F7EF] block mb-1">
                            {app.name}
                          </span>
                          <p className="text-xs text-[#A4B6A8] leading-relaxed">
                            {app.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action / Close */}
                <div className="pt-4 border-t border-[#39B86B]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#A4B6A8]">
                    Press <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#041A12] border border-[#39B86B]/30 font-mono text-[#F3F7EF]">ESC</kbd> or click outside to dismiss
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveInnovation(null)}
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
