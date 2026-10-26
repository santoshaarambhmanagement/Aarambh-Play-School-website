import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

export default function ItemChecklist({
  uniformKey,
  items,
  activePin,
  setActivePin,
  reduce,
}) {
  // LocalStorage logic
  const storageKey = "aarambh-uniform-checklist-v1";
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const isChecked = (id) => !!checkedItems[`${uniformKey}-${id}`];

  const toggleItem = (id) => {
    setCheckedItems((prev) => {
      const next = {
        ...prev,
        [`${uniformKey}-${id}`]: !prev[`${uniformKey}-${id}`],
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const checkedCount = items.filter((i) => isChecked(i.id)).length;
  const isAllDone = checkedCount === items.length;

  return (
    <div className="bg-[#FFFDF6] border-[3px] border-[#1B1B2F] p-4 md:p-6 shadow-[6px_6px_0_0_#1B1B2F] rounded-[8px_6px_10px_6px] w-full">
      <h3 className="font-display font-extrabold text-2xl text-[#1B1B2F] mb-4">
        Uniform Checklist
      </h3>

      <ul className="flex flex-col">
        {items.map((item, index) => {
          const done = isChecked(item.id);
          const isHighlighted = activePin === item.id;

          return (
            <li
              key={item.id}
              className={`group flex items-start gap-3 py-3 border-b-[2px] border-dashed border-[#E8DCC0] last:border-0 cursor-pointer transition-colors ${isHighlighted ? "bg-[#F7D117]/20 -mx-4 px-4 rounded-md" : "hover:bg-gray-50"}`}
              onClick={() => toggleItem(item.id)}
              onMouseEnter={() => setActivePin(item.id)}
              onMouseLeave={() => setActivePin(null)}
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                (e.preventDefault(), toggleItem(item.id))
              }
            >
              <div
                className={`relative flex-shrink-0 w-8 h-8 md:w-10 md:h-10 mt-0.5 border-[3px] border-[#1B1B2F] rounded-md shadow-[2px_2px_0_0_#1B1B2F] flex items-center justify-center transition-colors ${done ? "bg-[#F7D117]" : "bg-white group-hover:bg-gray-100"}`}
              >
                <AnimatePresence>
                  {done && (
                    <motion.div
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : { scale: 1.6, opacity: 0, rotate: -12 }
                      }
                      animate={
                        reduce
                          ? { opacity: 1 }
                          : { scale: 1, opacity: 1, rotate: -6 }
                      }
                      className="absolute text-[#B01E2E]"
                    >
                      <Check className="w-6 h-6 md:w-8 md:h-8 stroke-[4px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-1">
                <p
                  className={`font-display font-bold text-base md:text-lg leading-tight transition-colors ${done ? "text-[#1B1B2F]/50 line-through" : "text-[#1B1B2F]"}`}
                >
                  <span className="text-xs align-top opacity-50 mr-1">
                    {index + 1}.
                  </span>
                  {item.name}
                </p>
                {item.note && (
                  <p className="font-body text-sm text-[#1B1B2F]/60 mt-0.5">
                    {item.note}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Progress Tape */}
      <div className="mt-6 pt-4 border-t-[3px] border-[#1B1B2F]">
        <div className="flex justify-between items-end mb-2">
          <span className="font-body font-bold text-sm text-[#1B1B2F]/70">
            Ready for school?
          </span>
          <span className="font-display font-bold text-[#1B1B2F]">
            {checkedCount} of {items.length} ready
          </span>
        </div>

        {/* Fixed Fill Bar */}
        <div className="h-4 w-full bg-[#E8DCC0] border-[2px] border-[#1B1B2F] rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 bottom-0 w-full bg-[#2E8B3A] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: checkedCount / items.length }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>

        <AnimatePresence>
          {isAllDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 bg-[#F28C28] text-white font-hand text-2xl text-center py-2 border-[2px] border-[#1B1B2F] shadow-[3px_3px_0_0_#1B1B2F] -rotate-1"
            >
              All packed and ready!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
