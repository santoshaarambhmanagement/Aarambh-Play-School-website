import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { useInquiry } from '../../context/InquiryContext'
import { CONTACT } from '../../data/contactData'

export default function Navbar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const { openInquiry } = useInquiry()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#F9F7F3] border-b-[3px] border-[#1B1B2F] py-3 shadow-[0_4px_0_0_#1B1B2F]' 
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 group">
          <img 
            src="/aarambh_logo.webp" 
            alt="Aarambh Logo" 
            className="w-11 h-11 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <span className={`font-display font-extrabold text-2xl tracking-tight transition-colors duration-300 ${isScrolled ? 'text-[#1B1B2F]' : 'text-white drop-shadow-lg'}`}>
            Aarambh<span className="text-[#F28C28]">.</span>
          </span>
        </Link>

        <nav className={`hidden md:flex items-center gap-8 font-display font-bold text-sm transition-colors duration-300 ${isScrolled ? 'text-[#1B1B2F]/80' : 'text-white drop-shadow-md'}`}>
          <a href="/#philosophy" className="hover:text-[#F28C28] hover:-translate-y-0.5 transition-transform">Our Philosophy</a>
          <a href="/#programs" className="hover:text-[#F28C28] hover:-translate-y-0.5 transition-transform">Programs</a>
          <Link to="/gallery" className="hover:text-[#F28C28] hover:-translate-y-0.5 transition-transform">Gallery</Link>
        </nav>

        <div className="flex items-center gap-5">
          <a href={`tel:${CONTACT.phoneTel}`} className={`hidden md:flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${isScrolled ? 'text-[#1B1B2F]' : 'text-white drop-shadow-md'}`}>
            <Phone className="w-4 h-4" />
            <span>Call Us</span>
          </a>
          
          <button 
            onClick={() => openInquiry({ source: "Navbar Button" })}
            className={`relative px-6 py-2.5 rounded-full font-display font-bold text-sm transition-all ${
              isScrolled
                ? 'bg-[#1F4FB5] text-white border-[3px] border-[#1B1B2F] shadow-[4px_4px_0_0_#1B1B2F] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#1B1B2F] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1B1B2F]'
                : 'bg-white text-[#1B1B2F] hover:bg-[#F7D117] hover:scale-105'
            }`}
          >
            Book a Tour
          </button>
        </div>

      </div>
    </motion.header>
  )
}