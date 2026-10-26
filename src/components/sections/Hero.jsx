import { useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { CalendarCheck, ArrowRight } from 'lucide-react'
import { useInquiry } from '../../context/InquiryContext'

/* ------------------------------------------------------------------ */
/* Timeline (seconds). The old sequence sat empty for 2.5s before the  */
/* first letter moved; this one starts almost immediately.             */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1]
const LETTER_DELAY = 0.45
const LETTER_STAGGER = 0.11
const TAGLINE_DELAY = 1.5
const CTA_DELAY = 2.1
const CUE_DELAY = 2.9

// Extrusion is built in `em`, so the chunky 3D depth scales with the letter size on every screen.
const extrude = (color) => {
  let s = ''
  for (let i = 1; i <= 12; i++) s += `${i * 0.006}em ${i * 0.006}em 0 ${color}, `
  return s + '0.1em 0.1em 0.14em rgba(0,0,0,0.4)'
}

const LETTERS = [
  { char: 'A', color: '#B01E2E', shadow: '#7A1520' },
  { char: 'A', color: '#F28C28', shadow: '#B36014' },
  { char: 'R', color: '#B5412A', shadow: '#7D2A19' },
  { char: 'A', color: '#1F4FB5', shadow: '#13357D' },
  { char: 'M', color: '#F7D117', shadow: '#B3960E' },
  { char: 'B', color: '#2E8B3A', shadow: '#1D5C25' },
  { char: 'H', color: '#2E8B3A', shadow: '#1D5C25' },
].map((l) => ({ ...l, textShadow: extrude(l.shadow) }))

// Fixed values. The old version called Math.random() in render, so the tilt re-rolled on every re-render.
const DROP_ROTATE = [-12, 9, -7, 14, -10, 6, -14]
const HOVER_ROTATE = [-6, 5, -5, 6, -6, 5, -4]

/* A real drop: accelerate, hit the floor, squash, bounce twice, settle. All y values share the vh unit so they interpolate. */
const LETTER_VARIANTS = {
  hidden: (i) => ({ y: '-120vh', rotate: DROP_ROTATE[i], scaleX: 1, scaleY: 1 }),
  visible: {
    y: ['-120vh', '0vh', '-9vh', '0vh', '-3vh', '0vh'],
    scaleY: [1, 1, 0.8, 1.05, 0.97, 1],
    scaleX: [1, 1, 1.14, 0.97, 1.02, 1],
    rotate: 0,
    transition: {
      y: { duration: 1.25, times: [0, 0.5, 0.68, 0.82, 0.92, 1], ease: ['easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn'] },
      scaleY: { duration: 1.25, times: [0, 0.5, 0.57, 0.7, 0.85, 1], ease: 'easeOut' },
      scaleX: { duration: 1.25, times: [0, 0.5, 0.57, 0.7, 0.85, 1], ease: 'easeOut' },
      rotate: { duration: 0.9, ease: 'easeOut' },
    },
  },
  // One wave along the word once everything has landed. It also shows people the letters are touchable.
  wave: (i) => ({
    y: ['0vh', '-4.5vh', '0vh'],
    rotate: [0, HOVER_ROTATE[i] * 0.7, 0],
    transition: { duration: 0.6, delay: i * 0.07, ease: ['easeOut', 'easeIn'] },
  }),
}

const LETTER_VARIANTS_REDUCED = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
  wave: {},
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const [landed, setLanded] = useState(false)
  const { openInquiry } = useInquiry()

  // Pointer position (-0.5 to 0.5), smoothed. Drives the word's tilt and the backdrop's depth shift. Mouse only.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.6 })
  const spy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.6 })
  const tiltY = useTransform(spx, [-0.5, 0.5], [-5, 5])
  const tiltX = useTransform(spy, [-0.5, 0.5], [4, -4])
  const bgX = useTransform(spx, [-0.5, 0.5], [14, -14])
  const bgPY = useTransform(spy, [-0.5, 0.5], [10, -10])

  // As the hero scrolls away: backdrop lags, content eases off and fades.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  const handlePointerMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    px.set(e.clientX / window.innerWidth - 0.5)
    py.set(e.clientY / window.innerHeight - 0.5)
  }
  const handlePointerLeave = () => {
    px.set(0)
    py.set(0)
  }

  const scrollToNext = () =>
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })

  const letterVariants = reduce ? LETTER_VARIANTS_REDUCED : LETTER_VARIANTS
  const interactive = landed && !reduce

  const pop = {
    hidden: reduce ? { opacity: 0 } : { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
  }

  const ctaItem = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  }

  return (
    <>
      <section
        ref={sectionRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full min-h-[100svh] overflow-hidden bg-black flex flex-col justify-center pt-24 pb-28"
      >
        <h1 className="sr-only">Aarambh Play School: the beginning</h1>

        {/* Backdrop: scroll lag (outer) > intro settle > pointer depth shift (inner) */}
        <motion.div className="absolute inset-0 z-0" style={{ y: reduce ? 0 : bgScrollY }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.18 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.6, ease: EASE }}
          >
            <motion.div className="absolute -inset-4" style={reduce ? undefined : { x: bgX, y: bgPY }}>
              <img src="/bg-clean.png" alt="" aria-hidden="true" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>

        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-start justify-center"
          style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        >
          {/* Stacked below 1024px, side by side above. Sizes are fitted so the word never overflows a narrow phone. */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-8 w-full" aria-hidden="true">
            {/* The word. Perspective lives on the wrapper so the pointer tilt reads as depth. */}
            <div className="shrink-0" style={{ perspective: 1200 }}>
              <motion.div
                className="flex font-display font-extrabold leading-none tracking-tighter select-none pb-[0.12em] pr-[0.1em] text-[length:clamp(3rem,calc((100vw_-_3rem)/5.4),9rem)] lg:text-[length:clamp(5rem,9vw,9rem)]"
                style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY }}
                initial="hidden"
                animate={landed && !reduce ? 'wave' : 'visible'}
                variants={{
                  hidden: {},
                  visible: { transition: { delayChildren: LETTER_DELAY, staggerChildren: LETTER_STAGGER } },
                  wave: {},
                }}
              >
                {LETTERS.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    whileHover={
                      interactive
                        ? { y: '-4.5vh', rotate: HOVER_ROTATE[i], transition: { type: 'spring', stiffness: 420, damping: 14 } }
                        : undefined
                    }
                    whileTap={interactive ? { y: '-6vh', scaleY: 1.06 } : undefined}
                    onAnimationComplete={() => {
                      if (i === LETTERS.length - 1 && !landed) setLanded(true)
                    }}
                    className="inline-block"
                    style={{ color: letter.color, textShadow: letter.textShadow, transformOrigin: '50% 100%' }}
                  >
                    {letter.char}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Tagline */}
            <motion.div
              className="flex flex-col lg:pb-6 whitespace-nowrap"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { delayChildren: TAGLINE_DELAY, staggerChildren: 0.15 } } }}
            >
              <motion.span
                className="text-[#F7F1E3] font-display font-extrabold leading-none tracking-tight drop-shadow-md text-[length:clamp(2rem,8vw,3.5rem)] lg:text-[length:clamp(2.25rem,3.6vw,3.5rem)]"
                style={{ transformOrigin: '0% 100%' }}
                variants={pop}
              >
                PLAY SCHOOL
              </motion.span>
              <motion.span
                className="text-[#F7F1E3]/90 font-body font-bold mt-2 tracking-wide text-[length:clamp(1.125rem,4.5vw,1.75rem)] lg:text-[length:clamp(1.25rem,2.2vw,1.875rem)]"
                style={{ transformOrigin: '0% 100%' }}
                variants={pop}
              >
                the beginning
                {/* The ellipsis arrives one dot at a time */}
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="inline-block"
                    variants={{
                      hidden: { opacity: 0, y: reduce ? 0 : 8 },
                      visible: { opacity: 1, y: 0, transition: { delay: 0.5 + d * 0.28, duration: 0.3 } },
                    }}
                  >
                    .
                  </motion.span>
                ))}
              </motion.span>
            </motion.div>
          </div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-10 sm:mt-12 w-full sm:w-auto"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { delayChildren: CTA_DELAY, staggerChildren: 0.12 } } }}
          >
            <motion.div variants={ctaItem} className="w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openInquiry({ source: "Hero Button" })}
                className="group relative flex items-center justify-center gap-2 bg-[#F28C28] text-white px-6 sm:px-8 py-3.5 rounded-full font-display font-bold text-lg border-[3px] border-[#1B1B2F] shadow-[6px_6px_0_0_#1B1B2F] hover:-translate-y-1 hover:shadow-[9px_9px_0_0_#1B1B2F] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1B1B2F] transition-all w-full sm:w-auto outline-none focus-visible:ring-4 focus-visible:ring-[#F7D117]/80"
              >
                <CalendarCheck className="relative w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
                <span className="relative">Book a Tour</span>
              </button>
            </motion.div>

            <motion.div variants={ctaItem} className="w-full sm:w-auto">
              <a
                href="#programs"
                className="group relative flex items-center justify-center gap-2 bg-[#FFFDF6] text-[#1B1B2F] px-6 sm:px-8 py-3.5 rounded-full font-display font-bold text-lg border-[3px] border-[#1B1B2F] shadow-[6px_6px_0_0_#1B1B2F] hover:-translate-y-1 hover:shadow-[9px_9px_0_0_#1B1B2F] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1B1B2F] transition-all w-full sm:w-auto outline-none focus-visible:ring-4 focus-visible:ring-white/80"
              >
                <span className="relative">Explore Programs</span>
                <ArrowRight className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 [@media(max-height:560px)]:hidden"
          style={reduce ? undefined : { opacity: cueOpacity }}
        >
          <motion.button
            type="button"
            aria-label="Scroll to the next section"
            onClick={scrollToNext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: CUE_DELAY, duration: 0.8 }}
            className="flex justify-center w-8 h-12 pt-2 rounded-full border-[3px] border-white/80 bg-[#1B1B2F]/30 backdrop-blur-sm outline-none shadow-sm"
          >
            <motion.span
              aria-hidden="true"
              className="block w-1.5 h-3 rounded-full bg-white"
              animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.button>
        </motion.div>
      </section>

      {/* 
        ======================================================== 
        The Transition Scene (Moved from Philosophy.jsx)
        ======================================================== 
      */}
      <div className="relative bg-[#87CEEB]">
        <img
          src="/cartoon-school-bg.png"
          alt="Aarambh Play School entrance with the Aarambh signboard and a balloon arch"
          className="block w-full h-auto"
          style={{ aspectRatio: "auto 16 / 9" }}
        />

        {/* Brush-stroke edge */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-[60px] md:h-[120px] block"
          >
            <defs>
              <pattern
                id="brushPattern"
                patternUnits="userSpaceOnUse"
                width="1200"
                height="800"
              >
                <image
                  href="/bg-clean.png"
                  x="0"
                  y="0"
                  width="1200"
                  height="800"
                  preserveAspectRatio="none"
                />
              </pattern>
            </defs>
            <path
              d="M0,0 L1200,0 L1200,40 C900,120 700,10 400,60 C200,90 100,50 0,40 Z"
              fill="url(#brushPattern)"
            ></path>
          </svg>
          <div className="absolute top-0 left-0 w-full h-[30px] bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>
    </>
  )
}