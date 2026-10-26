import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export default function ZoomViewer({ isOpen, src, alt, onClose }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden" role="dialog" aria-modal="true">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0B0B18]/88 backdrop-blur-sm"
            onClick={onClose}
          />
          <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-white border-[3px] border-[#1B1B2F] shadow-[4px_4px_0_0_#1B1B2F] p-3 rounded-full active:translate-y-1 active:shadow-none transition-all">
            <X className="w-6 h-6 text-[#1B1B2F]" />
          </button>

          <motion.div 
            className="relative z-10 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            onDoubleClick={() => setZoomed(!zoomed)}
          >
            <motion.img 
              drag
              dragConstraints={{ top: -500, bottom: 500, left: -500, right: 500 }}
              dragElastic={0.2}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: zoomed ? 2.2 : 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              src={src}
              alt={alt}
              className="max-w-[90vw] max-h-[85vh] object-contain border-[3px] border-[#1B1B2F] shadow-2xl bg-white"
              draggable="false"
            />
            <p className="absolute bottom-8 text-white font-body bg-black/50 px-4 py-2 rounded-full pointer-events-none">
              Double-tap to zoom in/out. Drag to move.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}