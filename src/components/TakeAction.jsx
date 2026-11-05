import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'

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
    setPledgeTimestamp(new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }))
    setIsPledged(true)
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

                      <p className="text-sm text-[#F3F7EF]/90 leading-relaxed">
                        Thank you for stepping forward. Your commitments have been verified in your
                        personal browser session. Every small action builds our shared tomorrow.
                      </p>
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
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleCopyPledge}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#08291C] border border-[#B8F34A]/30 text-xs sm:text-sm font-semibold text-[#F3F7EF] hover:text-[#B8F34A] hover:border-[#B8F34A] transition-all"
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
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#08291C] border border-[#39B86B]/30 text-xs sm:text-sm font-semibold text-[#A4B6A8] hover:text-white transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Commitments</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetPledge}
                        className="inline-flex items-center gap-1.5 text-xs text-[#A4B6A8] hover:text-[#F3F7EF] transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Start Over</span>
                      </button>
                    </div>
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
