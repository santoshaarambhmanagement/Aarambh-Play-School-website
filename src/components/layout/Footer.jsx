import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { CONTACT } from '../../data/contactData'

// --- Custom SVG Brand Icons ---
const YoutubeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="bg-[#1B1B2F] pt-24 pb-8 border-t-[6px] border-[#F7D117]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
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
          
           {/* Social Links (Dynamic via ENV) */}
           <div>
            <h4 className="font-display font-extrabold text-2xl text-white mb-6">Follow Us</h4>
            <ul className="flex flex-col gap-4 text-sm text-[#FFFDF6]/80 font-body font-bold">
              {CONTACT.social.youtube && (
                <li className="flex items-center gap-3 group">
                  <YoutubeIcon className="w-5 h-5 text-white/50 group-hover:text-[#FF0000] transition-colors shrink-0" />
                  <a href={CONTACT.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#F7D117] transition-colors">YouTube</a>
                </li>
              )}
              {CONTACT.social.instagram && (
                <li className="flex items-center gap-3 group">
                  <InstagramIcon className="w-5 h-5 text-white/50 group-hover:text-[#E1306C] transition-colors shrink-0" />
                   <a href={CONTACT.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#F7D117] transition-colors">Instagram</a>
                </li>
              )}
              {CONTACT.social.facebook && (
                <li className="flex items-center gap-3 group">
                  <FacebookIcon className="w-5 h-5 text-white/50 group-hover:text-[#1877F2] transition-colors shrink-0" />
                   <a href={CONTACT.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#F7D117] transition-colors">Facebook</a>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-extrabold text-2xl text-white mb-6">Get in Touch</h4>
            <ul className="flex flex-col gap-4 text-sm text-[#FFFDF6]/80 font-body font-bold">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
                <a 
                  href={CONTACT.mapsUrl} 
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
            <a href="mailto:pixbrewgroup.official@gmail.com" className="font-display font-extrabold text-[#FFFDF6]/80 tracking-wide hover:text-white transition-colors border-[2px] border-[#FFFDF6]/30 px-3 py-1 rounded-full text-xs">
              PixBrew Groups
            </a>
          </p>
        </div>
        
      </div>
    </footer>
  )
}