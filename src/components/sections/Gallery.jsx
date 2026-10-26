import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useVelocity,
  useSpring,
  useMotionValue,
  useTransform, // <-- Added for Parallax
  useAnimationFrame,
  useInView,
  useReducedMotion,
  animate
} from "motion/react";
import { Link } from "react-router-dom";
import { Images, ArrowRight, Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

// ==========================================
// SANITY.IO CONFIGURATION
// ==========================================

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const GALLERY_QUERY = `
  *[_type == "galleryImage" && featured == true] | order(orderRank asc)[0...14]{
    "id": _id,
    "url": image.asset->url,
    "lqip": image.asset->metadata.lqip,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    alt,
    caption
  }
`;

// ==========================================
// CONSTANTS & MOCK DATA
// ==========================================
const INK = "#1B1B2F";
const PAPER = "#F7F1E3";
const CARD_PAPER = "#FFFDF6";
const TAPE_COLORS = ["#F28C28", "#F7D117", "#2E8B3A", "#1F4FB5", "#B01E2E"];
const TILTS = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 2.5];

const MOCK_GALLERY = [
  { id: "g01", url: "/gallery/g01.jpeg", alt: "Kids playing with blocks", caption: "Building tall towers!" },
  { id: "g02", url: "/gallery/g02.jpeg", alt: "Painting class", caption: "Little Picassos at work" },
  { id: "g03", url: "/gallery/g03.jpeg", alt: "Outdoor playground", caption: "Sunshine and smiles" },
  { id: "g04", url: "/gallery/g04.jpeg", alt: "Reading time", caption: "Lost in a good storybook" },
  { id: "g05", url: "/gallery/g05.jpeg", alt: "Lunch break", caption: "Sharing snacks together" },
  { id: "g06", url: "/gallery/g06.jpeg", alt: "Music class", caption: "Discovering rhythm" },
  { id: "g07", url: "/gallery/g07.jpeg", alt: "Teachers helping students", caption: "Guided with love" },
  { id: "g08", url: "/gallery/g08.jpeg", alt: "School event", caption: "Our annual day concert" },
  { id: "g09", url: "/gallery/g09.jpeg", alt: "Science experiment", caption: "Curiosity sparking!" },
  { id: "g10", url: "/gallery/g10.jpeg", alt: "Nature walk", caption: "Exploring the garden" },
  { id: "g11", url: "/gallery/g11.jpeg", alt: "Clay modeling", caption: "Messy hands, happy hearts" },
  { id: "g12", url: "/gallery/g12.jpeg", alt: "Group photo", caption: "The Class of '26" }
];

// Ensure we have at least 10 items for a good loop
const getItems = (data) => {
  let arr = [...data];
  while (arr.length > 0 && arr.length < 10) arr = [...arr, ...data];
  return arr;
};

// Smart Helper: Handles both Local Mock URLs and Sanity URLs safely
const getImageUrl = (item, width) => {
  if (!item || !item.url) return "";
  if (item.url.startsWith('/')) return item.url; // Local fallback
  if (item.url.includes('sanity.io')) return `${item.url}?w=${width}&auto=format`; // Live Sanity optimized
  return item.url;
};

const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// ==========================================
// SHARED COMPONENTS
// ==========================================
function WashiTape({ color }) {
  return (
    <div
      className="absolute -top-3 left-1/2 -translate-x-1/2 w-[56px] h-[18px] z-10 rotate-2 shadow-sm"
      style={{
        background: `repeating-linear-gradient(45deg, ${hexA(color, 0.85)}, ${hexA(color, 0.85)} 4px, ${hexA(color, 0.7)} 4px, ${hexA(color, 0.7)} 8px)`
      }}
    />
  );
}

// ==========================================
// MAIN SECTION
// ==========================================
export default function GallerySection() {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const [items, setItems] = useState(getItems(MOCK_GALLERY));
  const [activeItem, setActiveItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Parallax Scroll Tracking
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  // Translates the background from -20% to 20% as you scroll past it
  const bgScrollY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  // SANITY FETCH 
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const data = await client.fetch(GALLERY_QUERY);
        if (!cancelled && data && data.length > 0) setItems(getItems(data));
      } catch (err) {
        console.error("Sanity fetch error:", err);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);
  
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setActiveItem(items[index]);
  };

  const closeLightbox = () => setActiveItem(null);

  const nextPhoto = () => setLightboxIndex((prev) => (prev + 1) % items.length);
  const prevPhoto = () => setLightboxIndex((prev) => (prev - 1 + items.length) % items.length);

  useEffect(() => {
    if (activeItem) setActiveItem(items[lightboxIndex]);
  }, [lightboxIndex, items, activeItem]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      aria-labelledby="gallery-title"
      className="relative w-full overflow-x-clip py-[clamp(64px,10vw,128px)] scroll-mt-24"
    >
      {/* Background Image & Overlay (With Parallax!) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[25%] -bottom-[25%] left-0 right-0 origin-center"
          style={{ y: reduce ? 0 : bgScrollY }}
        >
          <motion.div
            initial={reduce ? false : { scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <img src="/bg-clean.webp" alt="" aria-hidden="true" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#1B1B2F]/40" />
          </motion.div>
        </motion.div>
      </div>

      {/* SVG Wavy Top Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[clamp(40px,6vw,90px)] block">
          <path d="M0,0 L1200,0 L1200,40 C900,120 700,10 400,60 C200,90 100,50 0,40 Z" fill={PAPER} />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="bg-[#F7D117] border-[3px] border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] px-8 py-3 rounded-2xl -rotate-2 mb-4"
        >
          <h2 id="gallery-title" className="font-display font-extrabold text-3xl md:text-5xl text-[#1B1B2F]">
            Moments at Aarambh
          </h2>
        </motion.div>
        
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-body font-bold text-lg md:text-xl text-white drop-shadow-md mb-12"
        >
          A peek into our days.
        </motion.p>

        {/* 3D Wavy Garland */}
        <GarlandTrack items={items} reduce={reduce} sectionRef={sectionRef} onOpen={openLightbox} />

        {/* Call To Action */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16"
        >
          <Link
            to="/gallery"
            className="group relative inline-flex items-center gap-3 bg-[#F28C28] text-white border-[3px] border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] px-8 min-h-[56px] rounded-full font-display font-bold text-lg hover:-translate-y-[3px] hover:shadow-[9px_9px_0px_#1B1B2F] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1B1B2F] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#F7D117] transition-all"
          >
            <Images className="w-5 h-5" />
            View All Photos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <Lightbox 
            item={activeItem} 
            index={lightboxIndex}
            total={items.length}
            onClose={closeLightbox} 
            onNext={nextPhoto} 
            onPrev={prevPhoto} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ==========================================
// GARLAND MATH & RENDER LOOP
// ==========================================
function GarlandTrack({ items, reduce, sectionRef, onOpen }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const offset = useMotionValue(0);
  const intro = useMotionValue(0);
  
  // Interaction State
  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const lastInteraction = useRef(0);
  const dragStart = useRef(0);
  const panStartOffset = useRef(0);
  const velocityRef = useRef(0); // For inertia

  const isInView = useInView(containerRef, { margin: "200px" });
  
  // Scroll Coupling
  const { scrollY } = useScroll();
  const scrollVel = useVelocity(scrollY);
  const smoothScrollVel = useSpring(scrollVel, { damping: 50, stiffness: 400 });

  // Math Constants (Updated via ResizeObserver)
  const dims = useRef({ W: 1000, H: 500, cardW: 220, cardH: 319, SPACING: 189, LOOP: 0, HALF: 500, AMP: 70, DEPTH: 260, ROT_Y: 38 });
  const CURL = 1; // Flip to -1 if the bend direction looks inside-out

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const cardW = Math.max(150, Math.min(width * 0.2, 280));
        const cardH = cardW * 1.25 + 44;
        const SPACING = cardW * 0.86;
        dims.current = {
          W: width,
          H: height,
          cardW,
          cardH,
          SPACING,
          LOOP: items.length * SPACING,
          HALF: width / 2,
          AMP: Math.min(height * 0.14, 70),
          DEPTH: width < 768 ? 160 : 260,
          ROT_Y: width < 768 ? 26 : 38
        };
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [items.length]);

  // Intro Drop Animation Trigger
  useEffect(() => {
    if (isInView && intro.get() === 0 && !reduce) {
      animate(intro, 1 + items.length * 0.06, { duration: 1.6, ease: "linear" });
    }
  }, [isInView, intro, items.length, reduce]);

  // Easing function for the drop
  const easeOutBack = (x) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };

  // ONE Animation Loop
  useAnimationFrame((time, delta) => {
    if (!isInView || items.length === 0) return;

    const D = dims.current;
    if (D.LOOP === 0) return; // Not measured yet

    // Auto Drift & Inertia Logic
    const now = performance.now();
    let currentOffset = offset.get();

    if (!isDragging.current) {
      // Inertia decay
      if (Math.abs(velocityRef.current) > 0.1) {
        currentOffset += velocityRef.current * (delta / 16);
        velocityRef.current *= Math.exp(-delta * 0.004); // Friction
        lastInteraction.current = now; // Keep delaying auto-drift while inertia runs
      } 
      // Auto-drift (resume 1.5s after last interaction)
      else if (!isHovered.current && !reduce && (now - lastInteraction.current > 1500)) {
        const baseSpeed = 36 * (delta / 1000);
        const scrollBoost = Math.max(-600, Math.min(smoothScrollVel.get() * 0.15, 600)) * (delta / 1000);
        currentOffset += baseSpeed + scrollBoost;
      }
    }

    offset.set(currentOffset);
    const introVal = intro.get();

    items.forEach((_, i) => {
      const node = cardRefs.current[i];
      if (!node) return;

      const raw = i * D.SPACING - currentOffset;
      // Wrap position in [-LOOP/2, LOOP/2)
      const u = ((raw % D.LOOP) + D.LOOP * 1.5) % D.LOOP - D.LOOP / 2;
      const t = u / D.HALF;

      // Culling
      if (Math.abs(t) > 1.4) {
        node.style.visibility = "hidden";
        if (node.tabIndex !== -1) node.tabIndex = -1;
        return;
      }

      // Math
      let y = -D.AMP * Math.sin(t * Math.PI * 1.1);
      if (!reduce) y += 4 * Math.sin(time * 0.001 + i); // Idle Bob

      const slope = -D.AMP * Math.PI * 1.1 / D.HALF * Math.cos(t * Math.PI * 1.1);
      const rotZ = (Math.atan(slope) * (180 / Math.PI)) * 0.8 + TILTS[i % 8] * 0.6;
      const rotY = Math.max(-D.ROT_Y * 1.4, Math.min(-t * D.ROT_Y * CURL, D.ROT_Y * 1.4));
      const z = -(t * t) * D.DEPTH;
      const scale = 1 - 0.12 * Math.abs(t);
      const opacity = Math.abs(t) <= 1 ? 1 : Math.max(0, 1 - (Math.abs(t) - 1) * 2.5);

      // Intro Drop Physics
      let introY = 0;
      let introOpacity = opacity;
      if (!reduce && introVal < 1 + items.length * 0.06) {
        const rank = Math.abs(i - Math.floor(items.length / 2)); // Center drops first
        const p = Math.max(0, Math.min(introVal - rank * 0.06, 1));
        introY = (1 - easeOutBack(p)) * -700;
        if (p === 0) introOpacity = 0;
      }

      // Write direct to DOM
      node.style.visibility = "visible";
      node.style.opacity = introOpacity;
      node.style.transform = `translate(-50%, -50%) translate3d(${u}px, ${y + introY}px, ${z}px) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(${scale})`;
      
      const newZIndex = 1000 - Math.round(Math.abs(t) * 100);
      if (node.style.zIndex != newZIndex) node.style.zIndex = newZIndex;

      // Accessibility focus ring visibility
      const newTab = Math.abs(t) <= 0.9 ? 0 : -1;
      if (node.tabIndex !== newTab) node.tabIndex = newTab;
    });
  });

  // Pan Handlers (Drag & Swipe)
  const handlePanStart = (e, info) => {
    isDragging.current = true;
    dragStart.current = info.point.x;
    panStartOffset.current = offset.get();
    velocityRef.current = 0;
  };

  const handlePan = (e, info) => {
    offset.set(panStartOffset.current - info.offset.x);
    velocityRef.current = -info.velocity.x; // Track velocity for inertia release
  };

  const handlePanEnd = () => {
    isDragging.current = false;
    lastInteraction.current = performance.now();
  };

  // Keyboard & Button Navigation
  const shiftOffset = (direction) => {
    lastInteraction.current = performance.now();
    const target = offset.get() + (direction * dims.current.SPACING * 2);
    animate(offset, target, { type: "spring", stiffness: 120, damping: 20 });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[clamp(420px,50vw,620px)] mt-8"
      style={{ perspective: "1200px", perspectiveOrigin: "center" }}
      onMouseEnter={() => isHovered.current = true}
      onMouseLeave={() => isHovered.current = false}
    >
      <div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing outline-none"
        style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Photo gallery"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") shiftOffset(-1);
          if (e.key === "ArrowRight") shiftOffset(1);
        }}
        onPointerDown={(e) => {
          // Allow horizontal wheel scrolling
          if (e.pointerType === "mouse") return;
        }}
      >
        <motion.div 
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          {items.map((item, i) => (
            <button
              key={`${item.id}-${i}`}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute left-1/2 top-1/2 group outline-none"
              style={{ width: dims.current.cardW, height: dims.current.cardH, willChange: "transform", backfaceVisibility: "hidden" }}
              aria-label={`Open photo: ${item.alt}`}
              onClick={(e) => {
                // Only open if it was a click, not a drag release
                if (Math.abs(e.clientX - dragStart.current) < 6) onOpen(i);
              }}
            >
              <PolaroidCard item={item} index={i} width={dims.current.cardW} />
            </button>
          ))}
        </motion.div>
      </div>

      {/* Manual Navigation Controls (Desktop) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 md:-mx-12">
        <button onClick={() => shiftOffset(-1)} aria-label="Scroll Left" className="pointer-events-auto bg-[#FFFDF6] border-[3px] border-[#1B1B2F] shadow-[4px_4px_0px_#1B1B2F] p-3 rounded-full hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all">
          <ChevronLeft className="w-6 h-6 text-[#1B1B2F]" />
        </button>
        <button onClick={() => shiftOffset(1)} aria-label="Scroll Right" className="pointer-events-auto bg-[#FFFDF6] border-[3px] border-[#1B1B2F] shadow-[4px_4px_0px_#1B1B2F] p-3 rounded-full hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all">
          <ChevronRight className="w-6 h-6 text-[#1B1B2F]" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// POLAROID CARD UI
// ==========================================
function PolaroidCard({ item, index, width }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full h-full relative transition-transform duration-200 ease-out group-hover:-translate-y-1.5 focus-visible:-translate-y-1.5">
      <div className="w-full h-full bg-[#FFFDF6] border-[3px] border-[#1B1B2F] shadow-[5px_5px_0_0_#0B0B18] group-hover:shadow-[9px_9px_0_0_#0B0B18] group-active:shadow-[2px_2px_0_0_#0B0B18] focus-visible:shadow-[9px_9px_0_0_#0B0B18] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#F28C28] rounded-[6px_8px_6px_10px] p-[10px] flex flex-col transition-shadow duration-200">
        
        <WashiTape color={TAPE_COLORS[index % 5]} />
        
        <div className="w-full aspect-[4/5] bg-gray-200 border-[3px] border-[#1B1B2F] overflow-hidden mb-[10px] relative">
          {imgError ? (
            <div className="absolute inset-0 bg-[#F7F1E3] flex items-center justify-center">
               <ImageIcon className="w-8 h-8 text-[#1B1B2F]/40" />
            </div>
          ) : (
            <img 
              src={getImageUrl(item, 600)} 
              alt={item.alt} 
              loading="lazy" 
              decoding="async" 
              draggable={false}
              className="w-full h-full object-cover pointer-events-none" 
              onError={() => setImgError(true)}
            />
          )}
        </div>
        
        <div className="h-[44px] flex items-center justify-center px-2">
          {/* Using Caveat handwritten font (setup in output notes) */}
          <p className="font-['Caveat',cursive] text-2xl text-[#1B1B2F] leading-none truncate text-center w-full">
            {item.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FULLSCREEN LIGHTBOX
// ==========================================
function Lightbox({ item, index, total, onClose, onNext, onPrev }) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
    >
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-[#0B0B18]/85 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-5xl h-full max-h-[85dvh] flex flex-col items-center justify-center pointer-events-none"
      >
        <button onClick={onClose} className="absolute top-0 right-0 z-20 pointer-events-auto bg-white border-[3px] border-[#1B1B2F] shadow-[4px_4px_0_0_#1B1B2F] p-3 rounded-full active:translate-y-1 active:shadow-none transition-all">
          <X className="w-6 h-6 text-[#1B1B2F]" />
        </button>

        <div className="relative w-full h-full flex flex-col items-center justify-center mt-12 md:mt-0">
          <motion.img 
            key={item.id}
            src={getImageUrl(item, 1200)} 
            alt={item.alt}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -80) onNext();
              else if (swipe > 80) onPrev();
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-full max-h-[70dvh] object-contain border-4 border-white shadow-2xl pointer-events-auto cursor-grab active:cursor-grabbing bg-gray-900"
          />
          <div className="mt-6 flex flex-col items-center text-center">
            <p className="font-['Caveat',cursive] text-3xl md:text-5xl text-white drop-shadow-md tracking-wide mb-2">
              {item.caption}
            </p>
            <span className="font-display font-bold text-sm text-white/70 bg-[#1B1B2F]/50 px-4 py-1 rounded-full border border-white/20">
              {index + 1} / {total}
            </span>
          </div>
        </div>

        {/* Lightbox Nav */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full flex justify-between pointer-events-none px-4 md:px-0">
          <button onClick={onPrev} className="pointer-events-auto bg-white border-[3px] border-[#1B1B2F] shadow-[4px_4px_0_0_#1B1B2F] p-3 rounded-full md:-ml-6 active:translate-y-1 active:shadow-none transition-all">
            <ChevronLeft className="w-6 h-6 text-[#1B1B2F]" />
          </button>
          <button onClick={onNext} className="pointer-events-auto bg-white border-[3px] border-[#1B1B2F] shadow-[4px_4px_0_0_#1B1B2F] p-3 rounded-full md:-mr-6 active:translate-y-1 active:shadow-none transition-all">
            <ChevronRight className="w-6 h-6 text-[#1B1B2F]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}