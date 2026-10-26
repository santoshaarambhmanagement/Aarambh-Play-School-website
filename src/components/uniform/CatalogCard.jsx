import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ZoomIn } from "lucide-react";

export default function CatalogCard({ data, direction, reduce, activePin, setActivePin, onZoomClick }) {
  const wrapperRef = useRef(null);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);
  const [isHoveringPin, setIsHoveringPin] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // To stop pulses

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const isDevMode = import.meta.env.DEV && typeof window !== 'undefined' && window.location.search.includes('pins=1');

  // Animation variants based on axis (Season = flip, Gender = slide)
  const variants = {
    initial: (dir) => {
      if (reduce) return { opacity: 0 };
      return dir === "season" ? { rotateY: 90, opacity: 0 } : { x: 60, rotate: 4, opacity: 0 };
    },
    animate: (dir) => {
      if (reduce) return { opacity: 1, rotateY: 0, x: 0, rotate: 0 };
      return dir === "season" ? { rotateY: 0, opacity: 1 } : { x: 0, rotate: 0, opacity: 1 };
    },
    exit: (dir) => {
      if (reduce) return { opacity: 0 };
      return dir === "season" ? { rotateY: -90, opacity: 0 } : { x: -60, rotate: -4, opacity: 0 };
    }
  };

  const handleMouseMove = (e) => {
    if (!wrapperRef.current || !isDesktop || isHoveringPin) return;
    const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setLensPos({ x, y });
  };

  const handleDevClick = (e) => {
    if (!isDevMode || !wrapperRef.current) return;
    const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
    const x = (((e.clientX - left) / width) * 100).toFixed(1);
    const y = (((e.clientY - top) / height) * 100).toFixed(1);
    console.log(`x: ${x}, y: ${y}`);
    try { navigator.clipboard.writeText(`x: ${x}, y: ${y}`); alert(`Copied: x: ${x}, y: ${y}`); } catch (e) {}
  };

  return (
    <div style={{ perspective: "1200px" }} className="w-full h-full flex justify-center items-center py-4">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={data.key}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 200, damping: 18 }}
          className="relative max-w-full"
          style={{ transformOrigin: "center center" }}
        >
          {/* Paper Backing Card */}
          <div className="bg-[#FFFDF6] border-[3px] border-[#1B1B2F] shadow-[8px_8px_0_0_#1B1B2F] -rotate-[1.5deg] rounded-md relative p-4 pb-8 overflow-hidden h-[min(78svh,760px)] flex justify-center items-center">
            
            {/* Top Ribbon & Dash */}
            <div className="absolute top-0 left-0 right-0 h-4 plaid border-b-[3px] border-[#1B1B2F]" />
            <div className="absolute top-0 bottom-0 left-0 right-0 border-[2px] border-dashed border-[#E8DCC0] m-1.5 pointer-events-none" />

            {/* The Print (Calculated naturally from the image size) */}
            <div 
              ref={wrapperRef}
              className="relative inline-block border-[3px] border-[#1B1B2F] bg-white p-[8px] shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] rotate-[1deg] max-h-full max-w-full"
              onMouseEnter={() => setShowLens(true)}
              onMouseLeave={() => setShowLens(false)}
              onMouseMove={handleMouseMove}
              onClick={handleDevClick}
            >
              {/* Washi Tape */}
              <div className="absolute -top-3 -left-3 w-12 h-4 bg-white/80 rotate-[-15deg] shadow-sm z-10" style={{ background: 'repeating-linear-gradient(45deg, rgba(247,209,23,0.8), rgba(247,209,23,0.8) 4px, rgba(247,209,23,0.6) 4px, rgba(247,209,23,0.6) 8px)' }} />
              <div className="absolute -top-2 -right-3 w-12 h-4 bg-white/80 rotate-[10deg] shadow-sm z-10" style={{ background: 'repeating-linear-gradient(45deg, rgba(247,209,23,0.8), rgba(247,209,23,0.8) 4px, rgba(247,209,23,0.6) 4px, rgba(247,209,23,0.6) 8px)' }} />

              <img 
                src={data.src} 
                alt={data.alt} 
                className={`max-w-full max-h-[calc(min(78svh,760px)-50px)] object-contain transition-opacity duration-300 ${isDesktop && showLens && !isHoveringPin && !isDevMode ? 'opacity-0' : 'opacity-100'}`}
                width={data.width}
                height={data.height}
                draggable="false"
              />

              {/* Fabric Lens (Desktop) */}
              {isDesktop && showLens && !isHoveringPin && !isDevMode && (
                <div 
                  className="absolute pointer-events-none rounded-full border-[3px] border-[#1B1B2F] shadow-xl z-20 overflow-hidden bg-white"
                  style={{
                    width: '150px', height: '150px',
                    left: `${lensPos.x}%`, top: `${lensPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundImage: `url(${data.src})`,
                    backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                    backgroundSize: `${data.width * 0.4}px` // ~2.5x zoom relative to screen
                  }}
                />
              )}

              {/* Touch Zoom Button (Mobile) */}
              {!isDesktop && (
                <button 
                  onClick={onZoomClick}
                  className="absolute bottom-2 right-2 bg-white/90 backdrop-blur border-[3px] border-[#1B1B2F] p-3 rounded-full shadow-[3px_3px_0_0_#1B1B2F] active:translate-y-1 active:shadow-none z-30"
                >
                  <ZoomIn className="w-5 h-5 text-[#1B1B2F]" />
                </button>
              )}

              {/* Pins */}
              {data.items.map((item, i) => {
                const isActive = activePin === item.id;
                return (
                  <motion.div 
                    key={item.id}
                    initial={reduce ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16, delay: i * 0.06 }}
                    className="absolute z-40"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    onMouseEnter={() => setIsHoveringPin(true)}
                    onMouseLeave={() => setIsHoveringPin(false)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHasInteracted(true);
                        setActivePin(isActive ? null : item.id);
                      }}
                      aria-label={`${i + 1}: ${item.name}`}
                      className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 bg-[#F7D117] border-[3px] border-[#1B1B2F] rounded-full shadow-[2px_2px_0_0_#1B1B2F] hover:bg-[#F28C28] hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-4 ring-[#F28C28]/50"
                    >
                      <span className="font-display font-bold text-xs text-[#1B1B2F]">{i + 1}</span>
                      
                      {/* Pulse Ring (Before Interaction) */}
                      {!hasInteracted && !reduce && (
                        <motion.div 
                          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
                          className="absolute inset-0 rounded-full border-2 border-[#F7D117] pointer-events-none"
                        />
                      )}
                    </button>

                    {/* Popover Note */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, rotate: 4 }}
                          animate={{ opacity: 1, y: 0, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`absolute ${item.x > 50 ? 'right-4' : 'left-4'} top-4 w-48 bg-[#FFF3B0] border-[2px] border-[#1B1B2F] p-3 shadow-[4px_4px_0_0_#1B1B2F] rotate-1 z-50 pointer-events-none`}
                        >
                          <p className="font-hand text-xl text-[#1B1B2F] leading-tight">{item.name}</p>
                          {item.note && <p className="font-body text-xs text-[#1B1B2F]/70 mt-1">{item.note}</p>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}