import { Leaf, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#041A12] border-t border-[#39B86B]/20 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#39B86B]/15">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B8F34A] to-[#39B86B] flex items-center justify-center text-[#041A12] shadow-[0_0_15px_rgba(184,243,74,0.3)]">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-[#F3F7EF] tracking-wider block">
                ECOVERSE
              </span>
              <span className="text-[10px] tracking-widest text-[#B8F34A] uppercase font-semibold block -mt-1">
                The Future is Green.
              </span>
            </div>
          </div>

          {/* Tagline / Subtitle */}
          <div className="text-center md:text-right">
            <p className="text-xs text-[#A4B6A8]">
              Theme: <span className="text-[#F3F7EF] font-medium">Green Tomorrow – Building a Sustainable Future</span>
            </p>
            <p className="text-[11px] text-[#A4B6A8]/70 mt-0.5">
              Developed for the TerraCode Competition 2026
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
