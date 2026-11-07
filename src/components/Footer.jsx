import { ArrowUp } from 'lucide-react'
import EcoverseLogo from './EcoverseLogo'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#041A12] border-t border-[#39B86B]/20 py-12 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#39B86B]/15">
          {/* Brand */}
          <EcoverseLogo />

          {/* Tagline / Subtitle */}
          <div className="text-center md:text-right">
            <p className="text-xs text-[#A4B6A8]">
              Theme: <span className="text-[#F3F7EF] font-medium">Green Tomorrow – Building a Sustainable Future</span>
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A4B6A8]">
          <p>© {new Date().getFullYear()} ECOVERSE. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs text-[#A4B6A8] hover:text-[#B8F34A] transition-colors focus:outline-none"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <div className="w-6 h-6 rounded-full bg-[#08291C] border border-[#39B86B]/30 flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5 text-[#B8F34A]" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  )
}
