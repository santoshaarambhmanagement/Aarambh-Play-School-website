import { motion, useReducedMotion } from "motion/react";
import InquiryForm from "./InquiryForm";
import MapCard from "./MapCard";
import { Phone, Mail } from "lucide-react";
import { CONTACT } from "../../data/contactData";

function BusinessCard() {
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    // Simple visual feedback could go here
    alert(`Copied ${type}!`);
  };

  return (
    <motion.div
      initial={{ rotateX: 70, opacity: 0 }}
      whileInView={{ rotateX: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 160, damping: 14 }}
      style={{ perspective: 900 }}
      className="bg-[#FFFDF6] border-[3px] border-[#1B1B2F] p-5 md:p-8 shadow-[6px_6px_0_0_#1B1B2F] rounded-[4px] rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all mt-8 lg:mt-6 z-20 w-[90%] max-w-[400px] ml-auto lg:mr-8"
    >
      <img
        src="/logo.png"
        alt="Aarambh Logo"
        className="h-10 mb-4 object-contain"
        onError={(e) => (e.target.style.display = "none")}
      />
      <h4 className="font-display font-extrabold text-2xl text-[#1B1B2F] leading-none mb-1">
        {CONTACT.schoolName}
      </h4>
      <p className="font-body text-[#1B1B2F]/80 text-sm mb-6 leading-tight">
        {CONTACT.addressLines[0]}
        <br />
        {CONTACT.addressLines[1]}
        <br />
        {CONTACT.landmark && (
          <span className="text-[#B01E2E] italic">{CONTACT.landmark}</span>
        )}
      </p>

      <ul className="flex flex-col gap-3 font-display font-bold text-sm border-t-[2px] border-dashed border-[#E8DCC0] pt-4">
        <li className="flex justify-between items-center">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="flex items-center gap-2 hover:text-[#B01E2E]"
          >
            <Phone className="w-4 h-4" /> {CONTACT.phoneDisplay}
          </a>
          <button
            onClick={() => handleCopy(CONTACT.phoneTel, "number")}
            className="text-xs text-[#1B1B2F]/50 hover:text-[#1B1B2F] uppercase border-[2px] border-[#1B1B2F] rounded-full px-2 py-0.5"
          >
            Copy
          </button>
        </li>
        <li className="flex justify-between items-center">
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2 hover:text-[#1F4FB5]"
          >
            <Mail className="w-4 h-4" /> Email Us
          </a>
          <button
            onClick={() => handleCopy(CONTACT.email, "email")}
            className="text-xs text-[#1B1B2F]/50 hover:text-[#1B1B2F] uppercase border-[2px] border-[#1B1B2F] rounded-full px-2 py-0.5"
          >
            Copy
          </button>
        </li>
      </ul>
    </motion.div>
  );
}

function StickyNote() {
  if (!CONTACT.hours.length) return null;
  return (
    <motion.div
      initial={{ scale: 0.6, rotate: -12 }}
      whileInView={{ scale: 1, rotate: -4 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 14 }}
      className="bg-noteYellow p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] rotate-[-4deg] w-48 -mt-8 ml-4 lg:-ml-12 z-30"
      style={{
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)",
      }}
    >
      <p className="font-hand text-xl text-[#1B1B2F] leading-tight flex flex-col gap-2">
        {CONTACT.hours.map((h, i) => (
          <span key={i}>
            <span className="underline">{h.label}</span>
            <br />
            {h.value}
          </span>
        ))}
      </p>
    </motion.div>
  );
}

export default function ContactSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative w-full overflow-x-clip py-[clamp(56px,9vw,128px)] scroll-mt-24"
    >
      {/* Background (Hero Floor continuation) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg-clean.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-[#1B1B2F]/55" />
      </div>

      {/* SVG Wavy Painted Top Divider (The Flap) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-[clamp(40px,6vw,90px)] block"
        >
          <defs>
            <pattern
              id="contactBrushPattern"
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
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-20 mt-12">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <motion.div
            initial={reduce ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="bg-[#F7D117] border-[3px] border-[#1B1B2F] shadow-[6px_6px_0_0_#1B1B2F] px-8 py-3 rounded-2xl -rotate-2 mb-4"
          >
            <h2
              id="contact-title"
              className="font-display font-extrabold text-4xl md:text-5xl text-[#1B1B2F]"
            >
              Visit Aarambh
            </h2>
          </motion.div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="font-body font-bold text-lg md:text-xl text-white drop-shadow-md"
          >
            Tell us a little. We'll get back to you to plan your visit.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start justify-center max-w-xl lg:max-w-none mx-auto">
          {/* LEFT: Notepad Form */}
          <div className="lg:col-span-6 w-full">
            <InquiryForm variant="section" />
          </div>

          {/* RIGHT: Map & Cards */}
          <div className="lg:col-span-6 w-full flex flex-col pt-4 lg:pt-0">
            <MapCard />
            <BusinessCard />
            <StickyNote />
          </div>
        </div>
      </div>
    </section>
  );
}