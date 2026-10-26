import { motion, useInView } from "motion/react";
import { useRef } from "react";

export default function MeasuringTape({ reduce }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative w-full z-10 flex flex-col items-center drop-shadow-md overflow-hidden">
      {/* Tape Measure */}
      <motion.div 
        initial={reduce ? false : { scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="w-[110%] h-[32px] bg-[#F7D117] border-y-[3px] border-[#1B1B2F] tape-ticks flex items-end px-4 gap-12 origin-left rotate-1"
      >
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
          <span key={n} className="font-display font-bold text-[#1B1B2F] text-xs -mb-0.5">{n}</span>
        ))}
      </motion.div>
      {/* Plaid Ribbon */}
      <motion.div 
        initial={reduce ? false : { opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4 }}
        className="w-[105%] h-[18px] plaid border-y-[3px] border-[#1B1B2F] shadow-[0_5px_10px_rgba(0,0,0,0.2)] -rotate-1 -mt-2 origin-center"
      >
        <div className="w-full h-full border-t-[2px] border-dashed border-[#FFFDF6]/60 mt-1"></div>
      </motion.div>
    </div>
  );
}