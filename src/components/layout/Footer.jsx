import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { CONTACT } from '../../data/contactData'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="bg-[#1B1B2F] pt-24 pb-8 border-t-[6px] border-[#F7D117]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 mb-6 group inline-flex">
              <img 
                src="/aarambh_logo.webp" 
                alt="Aarambh Logo" 
                className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-display font-extrabold text-4xl text-white tracking-tight">
                Aarambh<span className="text-[#F28C28]">.</span>
              </span>
            </Link>
            <p className="text-[#FFFDF6]/80 font-body font-bold max-w-sm leading-relaxed">
              Nurturing young minds in a safe, creative, and caring environment. The perfect beginning for your child's educational journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-extrabold text-2xl text-white mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-base text-[#FFFDF6]/80 font-body font-bold">
              <li><a href="/#philosophy" className="hover:text-[#F7D117] transition-colors inline-block hover:translate-x-1 duration-200">Our Philosophy</a></li>
              <li><a href="/#programs" className="hover:text-[#F7D117] transition-colors inline-block hover:translate-x-1 duration-200">Programs</a></li>
              <li><Link to="/gallery" className="hover:text-[#F7D117] transition-colors inline-block hover:translate-x-1 duration-200">Photo Gallery</Link></li>
              <li><a href="/#contact" className="hover:text-[#F7D117] transition-colors inline-block hover:translate-x-1 duration-200">Admissions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-extrabold text-2xl text-white mb-6">Get in Touch</h4>
            <ul className="flex flex-col gap-4 text-sm text-[#FFFDF6]/80 font-body font-bold">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
                {/* FIX: Wired to Google Maps URL */}
                <a 
                  href="https://www.google.co.in/maps/place/Aarambh+Play+School/@23.3890486,85.2922676,17z/data=!3m1!4b1!4m6!3m5!1s0x39f4e12ef07e220d:0x4344edc5383f370b!8m2!3d23.3890486!4d85.2948425!16s%2Fg%2F11lcd031bs?entry=ttu&g_ep=EgoyMDI2MTAyMC4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#F7D117] transition-colors"
                >
                  {CONTACT.addressLines[0]}<br/>{CONTACT.addressLines[1]}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F7D117] shrink-0" />
                <a href={`tel:${CONTACT.phoneTel}`} className="hover:text-[#F7D117]">{CONTACT.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#2E8B3A] shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-[#2E8B3A]">{CONTACT.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with PixBrew Branding */}
        <div className="border-t-[2px] border-dashed border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-body font-bold text-[#FFFDF6]/50">
          <div className="flex gap-6 items-center">
            <p>© {new Date().getFullYear()} Aarambh Play School.</p>
            <Link to="/privacy" className="hover:text-white underline underline-offset-2">Privacy Policy</Link>
          </div>
          <p className="flex items-center gap-2">
            Engineered by 
            {/* FIX: Wired to PixBrew Email */}
            <a href="mailto:pixbrewgroup.official@gmail.com" className="font-display font-extrabold text-[#FFFDF6]/80 tracking-wide hover:text-white transition-colors border-[2px] border-[#FFFDF6]/30 px-3 py-1 rounded-full text-xs">
              PixBrew Groups
            </a>
          </p>
        </div>
        
      </div>
    </footer>
  )
}