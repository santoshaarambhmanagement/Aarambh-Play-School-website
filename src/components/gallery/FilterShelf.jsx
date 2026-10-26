import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { makeBlockShadow } from "../../lib/blockShadow";

export default function FilterShelf({ categories, activeCat, setActiveCat, counts }) {
  const shelfRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!shelfRef.current) return;
    const observer = new IntersectionObserver(
      ([e]) => setIsStuck(e.intersectionRatio < 1),
      { threshold: [1], rootMargin: "-73px 0px 0px 0px" } // Offset by --nav-h
    );
    observer.observe(shelfRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={shelfRef}
      className={`sticky top-[var(--nav-h)] z-30 pt-4 pb-6 transition-colors duration-300 ${isStuck ? 'bg-paper/95 backdrop-blur border-b-[3px] border-ink' : 'bg-transparent'}`}
    >
      <div 
        role="group" 
        aria-label="Filter photos by category"
        className="relative max-w-7xl mx-auto flex gap-4 md:gap-6 md:justify-center overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory px-4 md:px-0 -mx-4 md:mx-0"
      >
        {/* The Wooden Plank (hidden on mobile or when stuck) */}
        {!isStuck && (
          <div className="hidden md:block absolute bottom-0 left-0 right-0 h-[14px] bg-paperDark border-[3px] border-ink rounded-full z-0 translate-y-1" />
        )}

        {categories.map((cat) => {
          const isActive = activeCat === cat.id;
          const count = counts[cat.id] || 0;
          const textColor = cat.textOnColor === "ink" ? "#1B1B2F" : "#FFFFFF";
          
          return (
            <motion.button
              key={cat.id}
              id={`filter-${cat.id}`}
              aria-pressed={isActive}
              onClick={(e) => {
                setActiveCat(cat.id);
                e.currentTarget.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
              }}
              whileHover={{ y: -3 }}
              whileTap={{ y: 2, scale: 0.98 }}
              animate={{ y: isActive ? 4 : 0 }}
              className="relative z-10 flex-shrink-0 snap-center min-w-[104px] border-[3px] border-ink rounded-[6px_8px_6px_10px] px-5 flex items-center justify-center transition-shadow duration-200"
              style={{
                backgroundColor: cat.color,
                boxShadow: isActive ? '2px 2px 0 0 #1B1B2F' : makeBlockShadow(cat.shade),
                minHeight: isStuck ? '44px' : '56px'
              }}
            >
              <span className={`font-display font-bold ${isStuck ? 'text-sm' : 'text-base md:text-lg'} drop-shadow-sm`} style={{ color: textColor }}>
                {cat.label}
              </span>
              
              {/* Count Badge */}
              <div className="absolute -top-3 -right-2 bg-card border-[2px] border-ink rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                <span className="font-display font-bold text-xs text-ink">{count}</span>
              </div>

              {/* Active Paint Dash under block */}
              {isActive && !isStuck && (
                <motion.div 
                  layoutId="activeFilterDash"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="hidden md:block absolute -bottom-[10px] left-1/2 w-12 h-[6px] rounded-full z-20"
                  style={{ backgroundColor: cat.color, transform: "translateX(-50%)" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}