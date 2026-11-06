import { useState, useEffect } from 'react'
import { Leaf, Menu, X, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Our Mission', href: '#mission' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Innovations', href: '#innovations' },
    { name: 'Eco Journey', href: '#eco-journey' },
  ]

  const handleNavClick = (e, href) => {
    e.preventDefault()

    // Close the mobile drawer immediately
    setMobileMenuOpen(false)

    // Unfocus any active element to prevent mobile browser tap/focus conflict
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur()
    }

    if (href === '#' || href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname)
      }
      return
    }

    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      // Calculate target position with fixed header offset (~80px)
      const headerOffset = 80
      const rect = targetElement.getBoundingClientRect()
      const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
      const targetPosition = Math.max(0, rect.top + currentScroll - headerOffset)

      // 60ms delay allows mobile touch gesture to conclude and drawer collapse animation to start smoothly
      setTimeout(() => {
        // Primary coordinate-based smooth scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        })

        // Secondary native scrollIntoView fallback
        try {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } catch {
          // Fallback handled by window.scrollTo
        }
      }, 60)

      window.history.pushState(null, '', href)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#041A12]/85 backdrop-blur-xl border-b border-[#B8F34A]/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0"
            aria-label="ECOVERSE Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#B8F34A] to-[#39B86B] flex items-center justify-center text-[#041A12] shadow-[0_0_20px_rgba(184,243,74,0.35)] group-hover:shadow-[0_0_25px_rgba(184,243,74,0.6)] group-hover:scale-105 transition-all duration-300 shrink-0">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider text-[#F3F7EF] group-hover:text-white transition-colors truncate">
                ECOVERSE
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-[#B8F34A] font-medium uppercase -mt-0.5 sm:-mt-1 whitespace-nowrap">
                The Future is Green
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#08291C]/60 backdrop-blur-md px-3.5 xl:px-5 py-2 rounded-full border border-[#39B86B]/20">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 xl:px-4 py-1.5 text-xs xl:text-sm font-medium text-[#A4B6A8] hover:text-[#B8F34A] hover:bg-[#0D3524]/50 rounded-full transition-all duration-200 whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#take-action"
              onClick={(e) => handleNavClick(e, '#take-action')}
              className="inline-flex items-center gap-2 bg-[#B8F34A] text-[#041A12] px-5 py-2.5 rounded-full font-heading font-semibold text-sm hover:bg-[#39B86B] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(184,243,74,0.3)] hover:shadow-[0_0_28px_rgba(184,243,74,0.55)] hover:scale-105 active:scale-95"
            >
              <span>Take Action</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg text-[#F3F7EF] hover:text-[#B8F34A] hover:bg-[#0D3524] transition-colors focus:outline-none shrink-0"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-[#08291C]/95 backdrop-blur-2xl border-b border-[#B8F34A]/20"
          >
            <div className="px-4 pt-3 pb-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-2.5 rounded-xl text-base font-medium text-[#F3F7EF] hover:text-[#B8F34A] hover:bg-[#0D3524] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="#take-action"
                  onClick={(e) => handleNavClick(e, '#take-action')}
                  className="w-full flex items-center justify-center gap-2 bg-[#B8F34A] text-[#041A12] px-5 py-3 rounded-full font-heading font-bold text-sm shadow-[0_0_20px_rgba(184,243,74,0.3)]"
                >
                  <span>Take Action</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
