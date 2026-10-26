import { useEffect } from "react";
import { motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../data/galleryData";

export default function Lightbox({ item, index, total, onClose, onNext, onPrev }) {
  useEffect(() => {
    const prevFlow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevFlow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true" aria-labelledby="lb-caption">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-[#0B0B18]/88 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        layoutId={`gallery-card-${item.id}`} // Animates beautifully from the thumbnail
        className="relative z-10 w-full max-w-5xl max-h-[85dvh] bg-card border-[3px] border-ink shadow-[12px_12px_0_0_#000] rounded-xl flex flex-col items-center justify-center p-4 md:p-6"
      >
        <button onClick={onClose} className="absolute -top-4 -right-4 z-20 bg-white border-[3px] border-ink shadow-hard-sm p-2 rounded-full active:translate-y-1 active:shadow-none hover:bg-gray-100 transition-all">
          <X className="w-6 h-6 text-ink" />
        </button>

        <motion.img 
          key={item.id}
          src={getImageUrl(item, 1200)} 
          alt={item.alt}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -80) onNext();
            else if (offset.x > 80) onPrev();
          }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="max-w-full max-h-[70dvh] object-contain border-[3px] border-ink shadow-md cursor-grab active:cursor-grabbing bg-gray-900"
        />
        
        <div className="mt-4 flex flex-col items-center text-center w-full">
          <p id="lb-caption" className="font-hand text-3xl md:text-4xl text-ink tracking-wide truncate w-full">
            {item.caption}
          </p>
          <span className="font-display font-bold text-sm text-ink/70">
            {index + 1} / {total}
          </span>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full flex justify-between pointer-events-none px-2 md:-mx-8">
          <button onClick={onPrev} className="pointer-events-auto bg-white border-[3px] border-ink shadow-hard-sm p-3 rounded-full active:translate-y-1 active:shadow-none hover:bg-gray-100 transition-all">
            <ChevronLeft className="w-6 h-6 text-ink" />
          </button>
          <button onClick={onNext} className="pointer-events-auto bg-white border-[3px] border-ink shadow-hard-sm p-3 rounded-full active:translate-y-1 active:shadow-none hover:bg-gray-100 transition-all">
            <ChevronRight className="w-6 h-6 text-ink" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}