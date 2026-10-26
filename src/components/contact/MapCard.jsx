import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Navigation } from "lucide-react";
import { CONTACT } from "../../data/contactData";

export default function MapCard() {
  const [loaded, setLoaded] = useState(false);
  const [interactive, setInteractive] = useState(false);

  return (
    <div className="relative">
      {/* Tape */}
      <div className="absolute -top-3 -left-4 w-12 h-5 bg-[#2E8B3A]/80 rotate-[-45deg] z-20 shadow-sm" style={{ background: 'repeating-linear-gradient(45deg, rgba(46,139,58,0.8), rgba(46,139,58,0.8) 4px, rgba(46,139,58,0.6) 4px, rgba(46,139,58,0.6) 8px)' }}></div>
      <div className="absolute -bottom-3 -right-4 w-12 h-5 bg-[#2E8B3A]/80 rotate-[-45deg] z-20 shadow-sm" style={{ background: 'repeating-linear-gradient(45deg, rgba(46,139,58,0.8), rgba(46,139,58,0.8) 4px, rgba(46,139,58,0.6) 4px, rgba(46,139,58,0.6) 8px)' }}></div>

      <motion.div 
        initial={{ rotate: 0 }} whileInView={{ rotate: 1 }} viewport={{ once: true }}
        className="bg-white border-[3px] border-[#1B1B2F] shadow-[6px_6px_0_0_#1B1B2F] p-3 pb-4 rounded-[4px] relative"
      >
        <div className="w-full aspect-[4/3] border-[3px] border-[#1B1B2F] relative bg-[#E8DCC0] overflow-hidden group" onMouseLeave={() => setInteractive(false)}>
          
          {!loaded ? (
            <button onClick={() => setLoaded(true)} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#F7F1E3] hover:bg-white transition-colors z-10">
              <MapPin className="w-10 h-10 text-[#B01E2E] mb-2 animate-bounce" />
              <span className="font-display font-bold text-[#1B1B2F] bg-white border-[2px] border-[#1B1B2F] px-4 py-2 rounded-full shadow-[2px_2px_0_0_#1B1B2F]">Load live map</span>
            </button>
          ) : (
            <>
              <div className={`absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[1px] transition-opacity ${interactive ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`} onClick={() => setInteractive(true)}>
                 <span className="font-display font-bold text-[#1B1B2F] bg-white border-[2px] border-[#1B1B2F] px-4 py-2 rounded-full shadow-[2px_2px_0_0_#1B1B2F]">Tap to use map</span>
              </div>
              <iframe 
                src={CONTACT.mapEmbedUrl} width="100%" height="100%" style={{ border: 0, pointerEvents: interactive ? 'auto' : 'none' }} 
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Aarambh Play School location"
              ></iframe>
            </>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 border-[3px] border-[#1B1B2F] rounded-full py-2 font-display font-bold text-sm hover:bg-gray-50 active:translate-y-[1px] transition-all">
            <MapPin className="w-4 h-4" /> Open Map
          </a>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACT.mapsDestination)}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#1B1B2F] text-white border-[3px] border-[#1B1B2F] rounded-full py-2 font-display font-bold text-sm hover:bg-[#2c2c47] active:translate-y-[1px] transition-all">
            <Navigation className="w-4 h-4" /> Directions
          </a>
        </div>
      </motion.div>
    </div>
  );
}