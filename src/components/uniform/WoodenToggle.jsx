import { motion } from "motion/react";
import { Sun, Snowflake } from "lucide-react";

export default function WoodenToggle({ label, options, selected, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="sr-only">{label}</span>
      <div 
        role="radiogroup" 
        aria-label={label}
        className="relative flex bg-[#E8DCC0] border-[3px] border-[#1B1B2F] shadow-[4px_4px_0_0_#1B1B2F] rounded-full p-1 w-full min-w-[240px] max-w-[320px]"
      >
        {options.map((opt) => {
          const isActive = selected === opt.value;
          const isWinter = opt.value === "winter";
          
          return (
            <label 
              key={opt.value}
              className={`relative z-10 flex-1 flex items-center justify-center min-h-[48px] px-4 cursor-pointer transition-colors duration-200 ${isActive ? (isWinter ? 'text-white' : 'text-[#1B1B2F]') : 'text-[#1B1B2F]/60 hover:text-[#1B1B2F]'}`}
            >
              <input
                type="radio"
                name={label}
                value={opt.value}
                checked={isActive}
                onChange={() => onChange(opt.value)}
                className="sr-only" 
              />
              <span className="font-display font-bold text-lg relative z-20 flex items-center gap-2 whitespace-nowrap">
                {opt.icon && (isWinter ? <Snowflake className="w-4 h-4" /> : <Sun className="w-4 h-4" />)}
                {opt.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId={`knob-${label}`}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className={`absolute inset-0 border-[3px] border-[#1B1B2F] rounded-full z-10 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${isWinter ? 'bg-[#1F4FB5]' : 'bg-[#F7D117]'}`}
                />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}