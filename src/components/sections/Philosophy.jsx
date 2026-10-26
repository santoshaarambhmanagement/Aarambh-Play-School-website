import { useCallback, useRef, useState } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Route,
  Star,
  Puzzle,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const INK = "#1E2028";

const philosophies = [
  {
    title: "Motherly Care",
    desc: "A warm, nurturing environment where every child feels loved.",
    icon: Heart,
    color: "#B01E2E",
    ink: "#FFFFFF",
  },
  {
    title: "Safe & Secure",
    desc: "Complete CCTV and strict protocols for your peace of mind.",
    icon: ShieldCheck,
    color: "#1F4FB5",
    ink: "#FFFFFF",
  },
  {
    title: "Daily Curiosity",
    desc: "Hands-on activities to discover, create, and learn daily.",
    icon: Sparkles,
    color: "#F7D117",
    ink: INK,
  },
  {
    title: "Seamless Bridge",
    desc: "Transitioning toddlers smoothly to structured education.",
    icon: Route,
    color: "#F28C28",
    ink: INK,
  },
  {
    title: "Holistic Growth",
    desc: "Balancing academics, arts, and social-emotional growth.",
    icon: Star,
    color: "#2E8B3A",
    ink: "#FFFFFF",
  },
  {
    title: "Play-Based",
    desc: "Fostering critical thinking through fun, interactive play.",
    icon: Puzzle,
    color: "#B5412A",
    ink: "#FFFFFF",
  },
];

const COUNT = philosophies.length;
const STEP = 360 / COUNT;
const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 70, damping: 16, mass: 1 };
const INTRO_SPRING = { type: "spring", stiffness: 38, damping: 15, mass: 1.2 };

const mod = (n, m) => ((n % m) + m) % m;

const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function TactileCard({ item, index, isActive, reduce, onSelect }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 260, damping: 22 });
  const sy = useSpring(y, { stiffness: 260, damping: 22 });

  const rotateX = useTransform(sy, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-12deg", "12deg"]);

  const lightX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const lightY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);
  const tint = hexA(item.color, 0.2);
  const light = useMotionTemplate`radial-gradient(circle at ${lightX} ${lightY}, ${tint}, rgba(255,255,255,0) 62%)`;

  const handleMouseMove = (e) => {
    if (!isActive || reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const angle = index * STEP;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        transform: `rotateY(${angle}deg) translateZ(clamp(230px, 35vw, 320px))`,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        perspective: 900,
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => !isActive && onSelect(index)}
        animate={{ scale: isActive ? 1 : 0.93 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group pointer-events-auto relative w-[240px] h-[280px] rounded-3xl border-4 border-[#1E2028] bg-[#1E2028] shadow-[8px_8px_0px_rgba(30,32,40,1)] ${
          isActive ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <div className="absolute inset-0 rounded-[20px] overflow-hidden">
          <img
            src="/bg-clean.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>

        {/* Content panel. Border only: the hard shadows on the panel and icon were stacking up. */}
        <div
          className="absolute inset-4 bg-[#F9F7F3] border-[3px] border-[#1E2028] rounded-2xl flex flex-col items-center justify-center text-center p-4"
          style={{ transform: "translateZ(28px)" }}
        >
          <motion.div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 rounded-[12px] opacity-0 transition-opacity duration-300 ${
              isActive ? "group-hover:opacity-100" : ""
            }`}
            style={{ background: light }}
          />

          <motion.div
            animate={
              isActive && !reduce
                ? { rotate: [0, -10, 7, 0], scale: [1, 1.14, 1] }
                : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.6, ease: EASE }}
            className="relative mb-3"
          >
            <div
              className="p-3 rounded-xl border-[3px] border-[#1E2028] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6"
              style={{ backgroundColor: item.color, color: item.ink }}
            >
              <item.icon className="w-8 h-8" strokeWidth={2.25} />
            </div>
          </motion.div>

          <h3 className="relative font-display font-extrabold text-lg text-[#1E2028] mb-1 leading-tight">
            {item.title}
          </h3>
          <p className="relative font-body text-[#1E2028]/90 font-bold text-sm leading-relaxed">
            {item.desc}
          </p>
        </div>

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-[20px] bg-[#1E2028] transition-opacity duration-500 ${
            isActive ? "opacity-0" : "opacity-30"
          }`}
          style={{ transform: "translateZ(34px)" }}
        />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

function NavButton({ label, onClick, children }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="bg-white text-[#1E2028] p-3 md:p-3.5 rounded-full border-4 border-[#1E2028] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1F4FB5]"
      style={{ boxShadow: "4px 4px 0px #1E2028" }}
      whileHover={{ x: 1, y: 1, boxShadow: "2px 2px 0px #1E2028" }}
      whileTap={{ x: 4, y: 4, boxShadow: "0px 0px 0px #1E2028" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Philosophy() {
  const reduce = useReducedMotion();

  const rotate = useMotionValue(reduce ? 0 : -140);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const controls = useRef(null);
  const panBase = useRef(0);
  const moved = useRef(false);

  const active = mod(step, COUNT);

  const goTo = useCallback(
    (next, transition) => {
      stepRef.current = next;
      setStep(next);
      controls.current?.stop();
      controls.current = animate(
        rotate,
        -next * STEP,
        reduce ? { duration: 0 } : (transition ?? SPRING),
      );
    },
    [rotate, reduce],
  );

  const prev = () => goTo(stepRef.current - 1);
  const next = () => goTo(stepRef.current + 1);

  const selectIndex = (i) => {
    let diff = mod(i - mod(stepRef.current, COUNT), COUNT);
    if (diff > COUNT / 2) diff -= COUNT;
    goTo(stepRef.current + diff);
  };

  const handleCardSelect = (i) => {
    if (moved.current) return;
    selectIndex(i);
  };

  const handlePanStart = () => {
    controls.current?.stop();
    panBase.current = rotate.get();
  };

  const handlePan = (_, info) => {
    if (Math.abs(info.offset.x) > 6) moved.current = true;
    rotate.set(panBase.current + info.offset.x * 0.25);
  };

  const handlePanEnd = (_, info) => {
    const projected = rotate.get() + info.velocity.x * 0.06;
    let target = -Math.round(projected / STEP);
    target = Math.max(
      stepRef.current - 2,
      Math.min(stepRef.current + 2, target),
    );
    goTo(target);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  return (
    <section
      id="philosophy"
      className="relative w-full overflow-hidden border-t-4 border-[#1E2028] bg-[#87CEEB] scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-20 md:pb-24 flex flex-col xl:flex-row xl:items-center gap-14 xl:gap-8">
        {/* LEFT: Welcome */}
        <div className="w-full xl:w-5/12 flex-shrink-0">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="bg-[#F9F7F3] border-4 border-[#1E2028] shadow-[8px_8px_0px_rgba(30,32,40,1)] rounded-3xl p-6 md:p-8 relative"
          >
            <div className="absolute -top-5 -left-5 bg-[#F7D117] border-4 border-[#1E2028] shadow-[4px_4px_0px_rgba(30,32,40,1)] p-3 rounded-full">
              <Quote className="w-6 h-6 text-[#1E2028] fill-[#1E2028]" />
            </div>

            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#1E2028] mb-4 leading-tight pt-2">
              Welcome to Aarambh.
            </h2>
            <p className="font-body text-base md:text-lg text-[#1E2028]/80 leading-relaxed font-bold">
              Where your child's educational journey begins with warmth,
              wonder, and joy. We provide the ideal foundation for
              pre-primary education, acting as a nurturing bridge that
              prepares young minds for lifelong learning.
            </p>

            {/* Principal's note */}
            <div className="mt-6 pt-6 border-t-[2px] border-[#1E2028]/15 flex flex-row items-center gap-4">
              <div className="w-16 h-16 shrink-0 rounded-full border-4 border-[#1E2028] overflow-hidden bg-white flex items-center justify-center">
                <span className="font-display font-bold text-xs">Photo</span>
              </div>
              <div>
                <p className="font-hand text-xl text-[#1E2028] mb-1 leading-snug">
                  "We believe that every grand journey begins with a meaningful step..."
                </p>
                <p className="font-display font-extrabold text-[#1F4FB5] text-xs uppercase tracking-wider">
                  — From the Principal
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Philosophy carousel */}
        <div className="w-full xl:w-7/12 flex flex-col items-center">
          <div className="bg-[#F7D117] border-4 border-[#1E2028] shadow-[6px_6px_0px_rgba(30,32,40,1)] px-8 py-3 rounded-3xl -rotate-2 mb-8 inline-block">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[#1E2028]">
              Our Philosophy
            </h2>
          </div>

          <motion.div
            role="group"
            aria-roledescription="carousel"
            aria-label="Our philosophy"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={() => {
              moved.current = false;
            }}
            onPanStart={handlePanStart}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
            onViewportEnter={() => goTo(0, INTRO_SPRING)}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-[350px] md:h-[400px] flex items-center justify-center rounded-3xl select-none outline-none focus-visible:ring-4 focus-visible:ring-[#1F4FB5]/40"
            style={{ perspective: "2000px", touchAction: "pan-y" }}
          >
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[480px] h-10 rounded-[100%] bg-[#1E2028]/25 blur-xl pointer-events-none"
            />

            <motion.div
              className="relative w-[240px] h-[280px]"
              style={{ transformStyle: "preserve-3d", rotateY: rotate }}
            >
              {philosophies.map((item, index) => (
                <TactileCard
                  key={item.title}
                  item={item}
                  index={index}
                  isActive={index === active}
                  reduce={reduce}
                  onSelect={handleCardSelect}
                />
              ))}
            </motion.div>
          </motion.div>

          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-5">
            <NavButton label="Previous card" onClick={prev}>
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </NavButton>

            <div className="flex items-center gap-2.5 bg-white border-4 border-[#1E2028] shadow-[4px_4px_0px_rgba(30,32,40,1)] rounded-full px-4 py-3">
              {philosophies.map((item, i) => (
                <motion.button
                  key={item.title}
                  type="button"
                  aria-label={`Show ${item.title}`}
                  aria-current={i === active}
                  onClick={() => selectIndex(i)}
                  animate={{ width: i === active ? 32 : 12 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="relative h-3 rounded-full border-2 border-[#1E2028] before:content-[''] before:absolute before:-inset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4FB5]"
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>

            <NavButton label="Next card" onClick={next}>
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </NavButton>
          </div>

          <p className="mt-5 font-body font-bold text-sm sm:text-base text-[#1E2028]/80 text-center">
            Drag, tap a card, or use the arrows
          </p>

          <p className="sr-only" aria-live="polite">
            {philosophies[active].title}: {philosophies[active].desc}
          </p>
        </div>
      </div>
    </section>
  );
}