import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useInquiry } from "../../context/InquiryContext";
import InquiryForm from "./InquiryForm";

export default function InquiryModal() {
  const { isOpen, closeInquiry, modalData } = useInquiry();
  const prevFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      if (prevFocusRef.current) prevFocusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && closeInquiry();
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeInquiry]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0B0B18]/85 backdrop-blur-sm"
            onClick={closeInquiry}
          />
          
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-xl bg-padYellow border-t-[3px] sm:border-[3px] border-[#1B1B2F] sm:rounded-xl shadow-[8px_8px_0_0_#1B1B2F] max-h-[88dvh] overflow-y-auto"
          >
            <div className="sticky top-0 right-0 w-full flex justify-end p-2 bg-padYellow/90 backdrop-blur z-50 sm:hidden">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[#1B1B2F]/20 rounded-full" />
              <button onClick={closeInquiry} className="p-2 border-[2px] border-[#1B1B2F] rounded-full bg-white active:translate-y-1 transition-transform" aria-label="Close form"><X className="w-5 h-5 text-[#1B1B2F]"/></button>
            </div>
            
            <button onClick={closeInquiry} className="hidden sm:block absolute top-4 right-4 z-50 p-2 border-[2px] border-[#1B1B2F] rounded-full bg-white hover:-translate-y-1 active:translate-y-0 transition-transform shadow-[2px_2px_0_0_#1B1B2F]" aria-label="Close form"><X className="w-5 h-5 text-[#1B1B2F]"/></button>

            <div className="p-4 sm:p-8">
              <h2 id="modal-title" className="sr-only">Book a Tour</h2>
              <InquiryForm variant="modal" prefillClass={modalData.classId} source={modalData.source} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}