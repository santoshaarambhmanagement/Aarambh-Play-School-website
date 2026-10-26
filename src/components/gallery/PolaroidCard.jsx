import { motion } from "motion/react";
import { getImageUrl, tiltFor } from "../../data/galleryData";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

const TAPE_COLORS = ["#F28C28", "#F7D117", "#2E8B3A", "#1F4FB5", "#B01E2E"];

function WashiTape({ id }) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const color = TAPE_COLORS[Math.abs(hash) % TAPE_COLORS.length];
  
  return (
    <div
      className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-[56px] h-[18px] z-10 rotate-2 shadow-sm"
      style={{
        background: `repeating-linear-gradient(45deg, ${color}D9, ${color}D9 4px, ${color}B3 4px, ${color}B3 8px)`
      }}
    />
  );
}

export default function PolaroidCard({ item, pos, catColor, onOpen, isDesktop, index }) {
  const [error, setError] = useState(false);
  const tilt = tiltFor(item.id);
  const p = isDesktop ? 10 : 6;
  const h = isDesktop ? 44 : 36;

  return (
    <motion.button
      layoutId={`gallery-card-${item.id}`} // Shared layoutId for Lightbox expansion
      initial={{ opacity: 0, y: pos.y - 500, rotate: tilt * 4 }}
      animate={{ opacity: 1, x: pos.x, y: pos.y, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: pos.y + 120, rotate: tilt * 6, transition: { duration: 0.28 } }}
      transition={{ type: "spring", stiffness: 140, damping: 16, mass: 0.8, delay: Math.min(index * 0.04, 0.6) }}
      className="absolute left-0 top-0 group outline-none"
      style={{ width: pos.w, height: pos.h }}
      aria-label={`Open photo: ${item.alt}`}
      onClick={onOpen}
    >
      <div 
        className="w-full h-full bg-card border-[3px] border-ink shadow-hard group-hover:shadow-hard group-active:shadow-hard-pressed focus-visible:shadow-hard focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#F28C28] rounded-[6px_8px_6px_10px] flex flex-col transition-all duration-200 group-hover:-translate-y-1.5 focus-visible:-translate-y-1.5"
        style={{ padding: p, rotate: `${tilt}deg` }}
      >
        <WashiTape id={item.id} />
        
        <div className="w-full flex-1 bg-gray-200 border-[3px] border-ink overflow-hidden relative">
          {error ? (
            <div className="absolute inset-0 bg-paperDark flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-ink/40" />
            </div>
          ) : (
            <img 
              src={getImageUrl(item, 600)} 
              alt={item.alt}
              loading={index < 6 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              onError={() => setError(true)}
              className="w-full h-full object-cover"
              style={item.lqip ? { backgroundImage: `url(${item.lqip})`, backgroundSize: 'cover' } : {}}
            />
          )}
          
          {/* Category Sticker */}
          <div 
            className="absolute bottom-2 right-2 border-[2px] border-ink rounded-md px-2 py-0.5 shadow-sm rotate-6"
            style={{ backgroundColor: catColor }}
          >
            <span className="font-display font-bold text-[11px] text-white uppercase tracking-wider leading-none drop-shadow-sm">{item.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-center px-1" style={{ height: h }}>
          <p className={`font-hand ${isDesktop ? 'text-2xl' : 'text-[16px]'} text-ink leading-none truncate w-full text-center`}>
            {item.caption}
          </p>
        </div>
      </div>
    </motion.button>
  );
}