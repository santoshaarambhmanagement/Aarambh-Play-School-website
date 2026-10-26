import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowLeft, ChevronDown, PackageOpen } from "lucide-react";
import { CATEGORIES } from "../data/galleryData";
import { useGalleryData } from "../hooks/useGalleryData";
import { useMasonry } from "../hooks/useMasonry";
import FilterShelf from "../components/gallery/FilterShelf";
import PolaroidCard from "../components/gallery/PolaroidCard";
import Lightbox from "../components/gallery/Lightbox";

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reduce = useReducedMotion();
  const { items, status, retry } = useGalleryData();
  
  const rawCat = searchParams.get("cat") || "all";
  const activeCat = CATEGORIES.some(c => c.id === rawCat) ? rawCat : "all";
  
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxData, setLightboxData] = useState(null); // { item, index }

  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(0);

  // Set Page Title
  useEffect(() => {
    document.title = "Gallery | Aarambh Play School";
    return () => { document.title = "Aarambh Play School"; };
  }, []);

  // Filter & Compute counts
  const { filteredItems, counts } = useMemo(() => {
    const counts = { all: items.length };
    CATEGORIES.forEach(c => {
      if (c.id !== "all") counts[c.id] = items.filter(i => i.category === c.id).length;
    });
    const filtered = activeCat === "all" ? items : items.filter(i => i.category === activeCat);
    return { filteredItems: filtered, counts };
  }, [items, activeCat]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  
  // Track width for JS Masonry
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { positions, totalHeight } = useMasonry(visibleItems, containerW);

  // Handlers
  const handleSetCat = (id) => {
    setVisibleCount(12); // Reset count on filter change
    setSearchParams({ cat: id }, { replace: true });
  };

  const handleShowMore = () => setVisibleCount(prev => prev + 12);

  const openLightbox = (item) => {
    const idx = filteredItems.findIndex(i => i.id === item.id);
    setLightboxData({ item, index: idx });
  };

  const isDesktop = containerW >= 768;

  return (
    <div className="min-h-screen bg-paper paper-grain overflow-x-clip pt-[calc(var(--nav-h)+40px)] pb-24">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ROW 1: Back Link & Live Count */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 bg-card border-[3px] border-ink shadow-hard-sm px-4 py-2 rounded-[4px_6px_4px_8px] -rotate-1 hover:-translate-y-1 active:translate-y-0 transition-transform font-display font-bold text-ink">
            <ArrowLeft className="w-5 h-5" /> Back home
          </Link>
          <div className="hidden sm:block font-body font-bold text-ink/70">
            Showing {visibleItems.length} of {filteredItems.length} photos
          </div>
        </div>

        {/* ROW 2: Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <motion.div initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="bg-[#F7D117] border-[3px] border-ink shadow-hard px-8 py-3 rounded-2xl -rotate-2 mb-4">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink">Our Gallery</h1>
          </motion.div>
          <p className="font-body font-bold text-lg md:text-xl text-ink/80">Little moments from our days at Aarambh.</p>
        </div>

        {/* Accessibility Announcement */}
        <div aria-live="polite" className="sr-only">
          Showing {visibleItems.length} of {filteredItems.length} photos in {CATEGORIES.find(c => c.id === activeCat)?.label}
        </div>

        <FilterShelf categories={CATEGORIES} activeCat={activeCat} setActiveCat={handleSetCat} counts={counts} />

        {/* MASONRY DESK */}
        <div className="mt-16 w-full relative" ref={containerRef} style={{ height: totalHeight + 24 }}>
          <AnimatePresence mode="popLayout">
            {containerW > 0 && visibleItems.map((item, index) => {
              const pos = positions.get(item.id);
              if (!pos) return null;
              const catColor = CATEGORIES.find(c => c.id === item.category)?.color || "#1B1B2F";
              return (
                <PolaroidCard 
                  key={item.id} 
                  item={item} 
                  pos={pos} 
                  catColor={catColor}
                  index={index}
                  isDesktop={isDesktop}
                  onOpen={() => openLightbox(item)} 
                />
              );
            })}
          </AnimatePresence>

          {/* Empty State */}
          {status === "ready" && filteredItems.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-12">
               <PackageOpen className="w-16 h-16 text-ink/20 mb-4" />
               <p className="font-body font-bold text-xl text-ink/60 mb-6">No photos here yet. Check back soon!</p>
               <button onClick={() => handleSetCat("all")} className="bg-white border-[3px] border-ink px-6 py-2 rounded-full font-display font-bold shadow-hard-sm hover:-translate-y-1 active:translate-y-0 transition-transform">See all photos</button>
             </div>
          )}
        </div>

        {/* SHOW MORE */}
        {visibleItems.length < filteredItems.length && (
          <div className="mt-16 flex flex-col items-center">
             <button onClick={handleShowMore} className="flex items-center gap-2 bg-[#F28C28] text-white border-[3px] border-ink shadow-hard min-h-[56px] px-8 rounded-full font-display font-bold text-lg hover:-translate-y-[3px] hover:shadow-[9px_9px_0_0_#1B1B2F] active:translate-y-1 active:shadow-hard-pressed transition-all">
                Show more photos <ChevronDown className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxData && (
          <Lightbox 
            item={lightboxData.item} 
            index={lightboxData.index}
            total={filteredItems.length}
            onClose={() => setLightboxData(null)}
            onNext={() => setLightboxData({ item: filteredItems[(lightboxData.index + 1) % filteredItems.length], index: (lightboxData.index + 1) % filteredItems.length })}
            onPrev={() => setLightboxData({ item: filteredItems[(lightboxData.index - 1 + filteredItems.length) % filteredItems.length], index: (lightboxData.index - 1 + filteredItems.length) % filteredItems.length })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}