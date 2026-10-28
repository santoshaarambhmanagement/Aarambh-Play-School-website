import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  MessageCircle,
  CalendarCheck,
  Check,
  X,
} from "lucide-react";
import { useInquiry } from '../../context/InquiryContext';
import { CONTACT } from "../../data/contactData";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const INK = "#1E2028"; 
const PAPER = "#F7F1E3";
// FIX: Removed the curly braces and used standard dot notation.
// Added a fallback to phoneTel just in case the whatsapp variable is empty.
const WHATSAPP_NUMBER = CONTACT.whatsapp || CONTACT.phoneTel; 
const EASE = [0.22, 1, 0.36, 1];

const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const extrudeEm = (color) => {
  let s = "";
  for (let i = 1; i <= 8; i++)
    s += `${i * 0.011}em ${i * 0.011}em 0 ${color}, `;
  return s + "0.12em 0.12em 0.16em rgba(0,0,0,0.25)";
};

const STAGES = [
  {
    slug: "pre-nursery",
    number: "1",
    name: "The Warm Nest",
    tagline: "Pre-Nursery",
    ages: "2.5 - 3 Years",
    color: "#F28C28",
    shade: "#C76B17",
    bullets: [
      "Gentle Separation & Social Comfort",
      "Sensory Play & Storytelling",
      "Building trust and first friendships",
    ],
    timing: "",
    photo: "/programs/pre-nursery.jpeg",
    photoAlt: "Toddlers engaging in sensory play",
    illustration: "/programs/pre-nursery.jpeg",
  },
  {
    slug: "nursery",
    number: "2",
    name: "The Curiosity Spark",
    tagline: "Nursery",
    ages: "3 - 4 Years",
    color: "#F7D117",
    shade: "#C2A20A",
    bullets: [
      "Phonics sounds & Shape sorting",
      "Motor-skill activities & Art",
      "Expressing feelings verbally",
    ],
    timing: "",
    photo: "/programs/nursery.jpeg",
    photoAlt: "Children doing shape sorting activities",
    illustration: "/programs/nursery.jpeg",
  },
  {
    slug: "lkg",
    number: "3",
    name: "The Early Explorer",
    tagline: "LKG",
    ages: "4 - 5 Years",
    color: "#2E8B3A",
    shade: "#1F6027",
    bullets: [
      "Forming words & Language mastery",
      "Basic math through interactive games",
      "Team games, sharing & patience",
    ],
    timing: "",
    photo: "/programs/lkg.jpeg",
    photoAlt: "Kids doing team games and early math",
    illustration: "/programs/lkg.jpeg",
  },
  {
    slug: "ukg",
    number: "4",
    name: "The Confident Achiever",
    tagline: "UKG",
    ages: "5 - 6 Years",
    color: "#1F4FB5",
    shade: "#143682",
    bullets: [
      "Reading short sentences fluently",
      "Mental math & Independent ideas",
      "Show-and-tell & Study habits",
    ],
    timing: "",
    photo: "/programs/ukg.jpeg",
    photoAlt: "Child doing a show and tell presentation",
    illustration: "/programs/ukg.jpeg",
  },
  {
    slug: "class-1",
    number: "5",
    name: "The Launchpad",
    tagline: "Class 1",
    ages: "6+ Years",
    color: "#B01E2E",
    shade: "#821420",
    bullets: [
      "Formal primary schooling transition",
      "English, Math & Environmental Studies",
      "Strong academic & social foundations",
    ],
    timing: "",
    photo: "/programs/class-1.jpeg",
    photoAlt: "Students learning structured subjects",
    illustration: "/programs/class-1-.jpeg",
  },
].map((s, i) => ({
  ...s,
  litShadow: extrudeEm(s.shade),
  dimShadow: extrudeEm("#D9CCAA"),
  sizeM: `${2.75 + i * 0.125}rem`,
  sizeD: `clamp(${4 + i * 0.25}rem, 7vw, ${5.5 + i * 0.6}rem)`,
}));

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function WashiTape({ color }) {
  return (
    <div
      aria-hidden="true"
      className="absolute -top-3 -right-3 w-16 h-6 z-10 rotate-12 shadow-sm"
      style={{
        background: `repeating-linear-gradient(45deg, ${hexA(color, 0.85)}, ${hexA(color, 0.85)} 4px, ${hexA(color, 0.7)} 4px, ${hexA(color, 0.7)} 8px)`,
      }}
    />
  );
}

function StagePhoto({ stage, className = "" }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-xl border-[3px] border-[#1E2028] ${className}`}
      style={{ backgroundColor: hexA(stage.color, 0.25) }}
    >
      {failed ? (
        <span className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-5xl text-[#1E2028]/60">
          {stage.number}
        </span>
      ) : (
        <img
          src={stage.photo}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
    </div>
  );
}

function StopMarker({ stage, lit, reduce, onOpen }) {
  return (
    <motion.div
      initial={reduce ? false : { y: -40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: "spring", stiffness: 260, damping: 15 }}
    >
      <motion.div
        aria-hidden="true"
        onClick={() => onOpen(stage)}
        animate={lit && !reduce ? { scale: [1, 1.16, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        whileHover={reduce ? undefined : { rotate: -6, scale: 1.06 }}
        className="flex items-center justify-center w-[1em] h-[1em] text-[length:var(--s-m)] lg:text-[length:var(--s-d)] rounded-[22%] border-[3px] cursor-pointer select-none font-display font-extrabold leading-none"
        style={{
          "--s-m": stage.sizeM,
          "--s-d": stage.sizeD,
          backgroundColor: lit ? stage.color : "#EFE6CF",
          borderColor: lit ? INK : "rgba(30,32,40,0.3)",
          boxShadow: lit ? stage.litShadow : stage.dimShadow,
          color: lit
            ? stage.color === "#F7D117"
              ? INK
              : "#FFFFFF"
            : "rgba(30,32,40,0.4)",
          transition:
            "background-color .4s, border-color .4s, box-shadow .4s, color .4s",
        }}
      >
        <span className="text-[0.5em]">{stage.number}</span>
      </motion.div>
    </motion.div>
  );
}

function StageCard({ stage, reduce, onOpen }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <motion.article
        layoutId={`card-${stage.slug}`}
        onClick={() => onOpen(stage)}
        whileHover={
          reduce ? undefined : { y: -4, boxShadow: `10px 10px 0 ${INK}` }
        }
        whileTap={reduce ? undefined : { y: 2, boxShadow: `3px 3px 0 ${INK}` }}
        style={{ borderRadius: 16, boxShadow: `6px 6px 0 ${INK}` }}
        className="group relative cursor-pointer bg-[#FFFDF6] border-[3px] border-[#1E2028] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5"
      >
        <WashiTape color={stage.color} />

        <StagePhoto
          stage={stage}
          className="w-full aspect-[16/9] sm:w-36 sm:aspect-square sm:shrink-0 sm:-rotate-2 sm:group-hover:rotate-0 transition-transform duration-500"
        />

        <div className="flex flex-col items-start min-w-0">
          <span
            className="font-display font-bold text-xs sm:text-sm text-[#1E2028] border-2 border-[#1E2028] rounded-full px-3 py-1 mb-3"
            style={{ backgroundColor: hexA(stage.color, 0.22) }}
          >
            {stage.ages}
          </span>

          <motion.h3
            layoutId={`title-${stage.slug}`}
            className="font-display font-extrabold text-xl lg:text-2xl text-[#1E2028] leading-tight"
          >
            <span className="sr-only">Stage {stage.number}: </span>
            {stage.tagline}
          </motion.h3>
          <p className="font-body font-bold text-[#1E2028]/80 text-base lg:text-lg mt-1">
            {stage.name}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(stage);
            }}
            className="mt-4 inline-flex items-center gap-2 font-display font-bold text-sm text-[#1E2028] rounded-md outline-none focus-visible:ring-4 focus-visible:ring-[#1F4FB5]/50"
          >
            See what happens here
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </motion.article>
    </motion.div>
  );
}

function StopRow({ stage, index, lit, reduce, onOpen, slotRef }) {
  const cardRight = index % 2 === 0;
  return (
    <li className="relative flex items-start lg:items-center gap-3 sm:gap-4">
      <div
        ref={slotRef}
        className={`relative z-20 shrink-0 w-14 flex justify-center pt-1 lg:pt-0 lg:w-auto lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 ${
          cardRight ? "lg:left-[36%]" : "lg:left-[64%]"
        }`}
      >
        <StopMarker stage={stage} lit={lit} reduce={reduce} onOpen={onOpen} />
      </div>

      <div
        className={`relative z-10 min-w-0 flex-1 lg:flex-none lg:w-[calc(50%-2rem)] ${
          cardRight ? "lg:ml-auto" : "lg:mr-auto"
        }`}
      >
        <StageCard stage={stage} reduce={reduce} onOpen={onOpen} />
      </div>
    </li>
  );
}

function Walker({ wx, wy, wr }) {
  const [failed, setFailed] = useState(false);
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute left-0 top-0 z-30 pointer-events-none w-12 h-12 lg:w-16 lg:h-16 ${
        failed
          ? "-ml-6 -mt-6 lg:-ml-8 lg:-mt-8"
          : "-ml-6 -mt-12 lg:-ml-8 lg:-mt-16"
      }`}
      style={{ x: wx, y: wy, rotate: wr }}
    >
      {failed ? (
        <div className="w-full h-full rounded-full bg-[#F7D117] border-[3px] border-[#1E2028]" />
      ) : (
        <img
          src="/walker.png"
          alt=""
          className="w-full h-full drop-shadow-md"
          onError={() => setFailed(true)}
        />
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Journey: rows + the painted road                                    */
/* ------------------------------------------------------------------ */

function Journey({ reduce, onOpen }) {
  const uid = useId().replace(/:/g, "");
  const containerRef = useRef(null);
  const slotsRef = useRef([]);
  const measureRef = useRef(null);
  const geomRef = useRef(null);

  const [geom, setGeom] = useState(null);
  const [reached, setReached] = useState(0);
  geomRef.current = geom;

  const paint = useMotionValue(reduce ? 1 : 0);
  const tipY = useMotionValue(0);
  const wx = useMotionValue(0);
  const wy = useMotionValue(0);
  const wr = useMotionValue(0);
  const roadOpacity = useTransform(paint, [0, 0.004], [0, 1]);

  const measure = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    const pts = slotsRef.current.map((el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.left + r.width / 2 - cr.left),
        y: Math.round(r.top + r.height / 2 - cr.top),
      };
    });
    if (pts.length !== STAGES.length || pts.some((p) => !p)) return;
    const next = { w: Math.round(cr.width), h: Math.round(cr.height), pts };
    setGeom((prev) =>
      prev &&
      prev.w === next.w &&
      prev.h === next.h &&
      prev.pts.every((p, i) => p.x === pts[i].x && p.y === pts[i].y)
        ? prev
        : next,
    );
  }, []);

  useEffect(() => {
    measure();
    const c = containerRef.current;
    const ro = new ResizeObserver(measure);
    if (c) ro.observe(c);
    document.fonts?.ready?.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const d = useMemo(() => {
    if (!geom) return "";
    const { pts } = geom;
    let s = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const k = (b.y - a.y) * 0.5;
      s += ` C ${a.x} ${a.y + k}, ${b.x} ${b.y - k}, ${b.x} ${b.y}`;
    }
    return s;
  }, [geom]);

  const { scrollY } = useScroll();
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 100, damping: 30, mass: 0.5 });

  const recompute = useCallback(() => {
    const c = containerRef.current;
    const g = geomRef.current;
    if (!c || !g) return;
    const V = window.innerHeight;
    const top = c.getBoundingClientRect().top;
    const y0 = top + g.pts[0].y;
    const yN = top + g.pts[g.pts.length - 1].y;
    const startLine = 0.62 * V;
    const endLine = 0.52 * V;
    const p = (startLine - y0) / (startLine - endLine + (yN - y0));
    raw.set(Math.min(1, Math.max(0, p)));
  }, [raw]);

  useMotionValueEvent(scrollY, "change", () => {
    if (!reduce) recompute();
  });

  useEffect(() => {
    if (reduce) return;
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [geom, reduce, recompute]);

  const update = useCallback(
    (p) => {
      const path = measureRef.current;
      const g = geomRef.current;
      if (!path || !g) return;
      const len = path.getTotalLength();
      if (!len) return;
      const y0 = g.pts[0].y;
      const yN = g.pts[g.pts.length - 1].y;
      const targetY = y0 + Math.min(1, Math.max(0, p)) * (yN - y0);

      let lo = 0;
      let hi = len;
      for (let k = 0; k < 14; k++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < targetY) lo = mid;
        else hi = mid;
      }
      const L = (lo + hi) / 2;
      const pt = path.getPointAtLength(L);

      paint.set(L / len);
      tipY.set(pt.y);
      wx.set(pt.x);
      wy.set(pt.y + Math.sin(L / 16) * 3);
      wr.set(Math.cos(L / 16) * 5);

      const count = g.pts.reduce((n, m) => n + (m.y <= targetY + 1 ? 1 : 0), 0);
      setReached((prev) => (prev === count ? prev : count));
    },
    [paint, tipY, wx, wy, wr],
  );

  useMotionValueEvent(progress, "change", (v) => {
    if (!reduce) update(v);
  });

  useEffect(() => {
    if (!reduce && geom) update(progress.get());
  }, [geom, reduce, update, progress]);

  const y0 = geom ? geom.pts[0].y : 0;
  const yN = geom ? geom.pts[geom.pts.length - 1].y : 0;

  return (
    <div ref={containerRef} className="relative">
      {geom && (
        <svg
          aria-hidden="true"
          width={geom.w}
          height={geom.h}
          viewBox={`0 0 ${geom.w} ${geom.h}`}
          className="absolute inset-0 z-0 pointer-events-none overflow-visible"
        >
          <defs>
            <linearGradient
              id={`${uid}-paint`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y0}
              y2={yN}
            >
              {STAGES.map((s, i) => (
                <stop
                  key={s.slug}
                  offset={i / (STAGES.length - 1)}
                  stopColor={s.color}
                />
              ))}
            </linearGradient>
            <clipPath id={`${uid}-reveal`}>
              <motion.rect
                x="0"
                y="0"
                width={geom.w}
                height={reduce ? geom.h : tipY}
              />
            </clipPath>
          </defs>

          <path
            d={d}
            fill="none"
            stroke="#E8DCC0"
            strokeLinecap="round"
            className="[stroke-width:14px] lg:[stroke-width:36px]"
          />

          <motion.path
            d={d}
            fill="none"
            stroke={`url(#${uid}-paint)`}
            strokeLinecap="round"
            className="[stroke-width:10px] lg:[stroke-width:30px]"
            style={{ pathLength: paint, opacity: roadOpacity }}
          />

          <path
            d={d}
            fill="none"
            stroke={PAPER}
            strokeLinecap="round"
            strokeDasharray="6 20"
            clipPath={`url(#${uid}-reveal)`}
            className="[stroke-width:2px] lg:[stroke-width:4px]"
          />

          <path ref={measureRef} d={d} fill="none" stroke="none" />
        </svg>
      )}

      {!reduce && geom && <Walker wx={wx} wy={wy} wr={wr} />}

      <ol className="relative z-10 flex flex-col gap-12 lg:gap-16">
        {STAGES.map((stage, i) => (
          <StopRow
            key={stage.slug}
            stage={stage}
            index={i}
            lit={reduce || i < reached}
            reduce={reduce}
            onOpen={onOpen}
            slotRef={(el) => {
              slotsRef.current[i] = el;
            }}
          />
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dialog                                                              */
/* ------------------------------------------------------------------ */

function ExpandedModal({ stage, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const { openInquiry } = useInquiry();

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = dialogRef.current.querySelectorAll("a[href], button");
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onKeyDown={handleKeyDown}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1E2028]/55 backdrop-blur-sm"
      />

      <motion.div
        ref={dialogRef}
        layoutId={`card-${stage.slug}`}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        style={{ borderRadius: 24, boxShadow: `12px 12px 0 ${INK}` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dialog-title-${stage.slug}`}
        className="relative z-10 w-full max-w-2xl bg-[#FFFDF6] border-[3px] border-[#1E2028] overflow-hidden flex flex-col max-h-[90dvh]"
      >
        <div
          aria-hidden="true"
          className="h-3 shrink-0 border-b-[3px] border-[#1E2028]"
          style={{ backgroundColor: stage.color }}
        />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-4 z-20 bg-white border-[3px] border-[#1E2028] p-2 rounded-full shadow-[2px_2px_0px_#1E2028] hover:bg-[#F7F1E3] active:translate-y-0.5 active:shadow-none outline-none focus-visible:ring-4 focus-visible:ring-[#1F4FB5]/50"
        >
          <X className="w-6 h-6 text-[#1E2028]" />
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="overflow-y-auto p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start mb-8 border-b-2 border-[#1E2028]/10 pb-8">
            <div className="w-32 h-32 shrink-0 bg-white border-[3px] border-[#1E2028] p-2 rounded-sm shadow-md rotate-3 mx-auto md:mx-0">
              <img
                src={stage.photo}
                alt={stage.photoAlt}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
            <div className="md:pr-12">
              <span
                className="font-display font-bold text-sm text-[#1E2028] border-2 border-[#1E2028] rounded-full px-3 py-1 inline-block mb-3"
                style={{ backgroundColor: hexA(stage.color, 0.22) }}
              >
                Ages: {stage.ages}
              </span>
              <motion.h2
                layoutId={`title-${stage.slug}`}
                id={`dialog-title-${stage.slug}`}
                className="font-display font-extrabold text-3xl md:text-4xl text-[#1E2028] mb-2"
              >
                {stage.tagline}
              </motion.h2>
              <p className="font-body font-bold text-xl text-[#1E2028]/75">
                {stage.name}
              </p>
            </div>
          </div>

          <h3 className="font-display font-bold text-xl text-[#1E2028] mb-4">
            What your child does:
          </h3>
          <ul className="space-y-4 mb-8">
            {stage.bullets.map((bullet, i) => (
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                key={bullet}
                className="flex items-start gap-3"
              >
                <div
                  className="shrink-0 mt-1 border-2 border-[#1E2028] rounded-full p-1"
                  style={{ backgroundColor: hexA(stage.color, 0.35) }}
                >
                  <Check className="w-4 h-4 text-[#1E2028]" strokeWidth={3} />
                </div>
                <span className="font-body font-bold text-lg text-[#1E2028]/90 leading-snug">
                  {bullet}
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-[#1E2028]/10">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I'd like to know more about the ${stage.tagline} program.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#25D366] text-[#1E2028] border-[3px] border-[#1E2028] shadow-[4px_4px_0px_#1E2028] py-3 px-4 rounded-xl font-display font-bold text-center active:translate-y-1 active:shadow-none transition-all flex justify-center items-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-[#1F4FB5]/50"
            >
              <MessageCircle className="w-5 h-5" /> Enquire on WhatsApp
            </a>
            
            <button
              type="button"
              onClick={() => {
                onClose();
                openInquiry({ source: `Programs Section - ${stage.tagline}` });
              }}
              className="flex-1 bg-white text-[#1E2028] border-[3px] border-[#1E2028] shadow-[4px_4px_0px_#1E2028] py-3 px-4 rounded-xl font-display font-bold text-center active:translate-y-1 active:shadow-none transition-all flex justify-center items-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-[#1F4FB5]/50"
            >
              <CalendarCheck className="w-5 h-5" /> Book a Tour
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Programs() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  const triggerRef = useRef(null);
  const { openInquiry } = useInquiry();

  const [activeStage, setActiveStage] = useState(null);

  const inSection = useInView(sectionRef, { margin: "-100px" });
  const ctaInView = useInView(ctaRef, { amount: 0.3 });

  const openStage = useCallback((stage) => {
    triggerRef.current = document.activeElement;
    setActiveStage(stage);
  }, []);

  const closeStage = useCallback(() => {
    setActiveStage(null);
    requestAnimationFrame(() => triggerRef.current?.focus?.());
  }, []);

  useEffect(() => {
    if (!activeStage) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") closeStage();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeStage, closeStage]);

  const showBar = inSection && !ctaInView && !activeStage;

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="relative w-full pb-32 lg:pb-28 scroll-mt-24 overflow-x-clip bg-[#F7F1E3]"
      aria-labelledby="programs-heading"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[-99%] drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)]"
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[clamp(40px,6vw,90px)] block"
          style={{ transform: "rotate(180deg)" }}
        >
          <path
            d="M0,0 V46.29 C100,70 200,30 400,50 C600,20 800,60 1000,30 C1200,50 1200,0 1200,0 Z"
            fill={PAPER}
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14 md:pt-24 text-center flex flex-col items-center">
        <motion.div
          initial={reduce ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="bg-[#F7D117] border-4 border-[#1E2028] shadow-[6px_6px_0px_#1E2028] px-8 py-3 rounded-3xl -rotate-2 inline-block mb-5"
        >
          <h2
            id="programs-heading"
            className="font-display font-extrabold text-4xl md:text-5xl text-[#1E2028]"
          >
            Our Programs
          </h2>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-body font-bold text-lg md:text-xl text-[#1E2028]/80"
        >
          Five steps from first day to Class 1.
        </motion.p>
      </div>

      <div className="relative z-10 mt-14 md:mt-20 max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6">
        <Journey reduce={reduce} onOpen={openStage} />
      </div>

      <motion.div
        ref={ctaRef}
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="relative z-10 mt-20 lg:mt-24 flex flex-col items-center text-center px-6"
      >
        <div className="bg-[#FFFDF6] border-[3px] border-[#1E2028] shadow-[8px_8px_0px_#1E2028] p-8 rounded-3xl max-w-2xl w-full flex flex-col items-center">
          <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#1E2028] mb-6">
            Ready for your child's Aarambh?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              type="button"
              onClick={() => openInquiry({ source: "Programs End of Road" })}
              className="bg-[#F28C28] text-[#1E2028] border-[3px] border-[#1E2028] shadow-[4px_4px_0px_#1E2028] px-8 py-3 rounded-xl font-display font-bold text-lg hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1E2028] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-[#1F4FB5]/50"
            >
              <CalendarCheck className="w-5 h-5" /> Book a Tour
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="bg-transparent text-[#1E2028] border-[3px] border-[#1E2028] shadow-[4px_4px_0px_#1E2028] px-8 py-3 rounded-xl font-display font-bold text-lg hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1E2028] hover:bg-white active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-[#1F4FB5]/50"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {activeStage && (
          <ExpandedModal stage={activeStage} onClose={closeStage} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFDF6] border-t-[3px] border-[#1E2028] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex justify-between items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
          >
            <button
              type="button"
              onClick={() => openInquiry({ source: "Programs Mobile Bar" })}
              className="flex-1 bg-[#F28C28] text-[#1E2028] border-[3px] border-[#1E2028] shadow-[4px_4px_0px_#1E2028] py-3 rounded-xl font-display font-bold text-center active:translate-y-1 active:shadow-none transition-all"
            >
              Book Tour
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              className="bg-[#25D366] text-[#1E2028] border-[3px] border-[#1E2028] shadow-[4px_4px_0px_#1E2028] p-3 rounded-xl active:translate-y-1 active:shadow-none transition-all"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}