import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion, useInView } from "motion/react";
import { MessageCircle, Share2, Tag } from "lucide-react";
import { useUniformData } from "../../hooks/useUniformData";
import MeasuringTape from "./MeasuringTape";
import WoodenToggle from "./WoodenToggle";
import CatalogCard from "./CatalogCard";
import ItemChecklist from "./ItemChecklist";
import ZoomViewer from "./ZoomViewer";

export default function UniformShowcase() {
  const reduce = useReducedMotion();
  const { uniforms, info } = useUniformData();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL State Syncing
  const rawQuery = searchParams.get("uniform") || "boys-regular";
  const activeKey = uniforms[rawQuery] ? rawQuery : "boys-regular";
  const current = uniforms[activeKey];

  const [lastAction, setLastAction] = useState("season"); // Used for transition direction
  const [activePin, setActivePin] = useState(null);
  const [showZoom, setShowZoom] = useState(false);
  const [copied, setCopied] = useState(false);

  // Preload alternate images for instant swapping
  useEffect(() => {
    Object.values(uniforms).forEach(u => {
      if (u.key !== activeKey) {
        const img = new Image();
        img.src = u.src;
      }
    });
  }, [uniforms, activeKey]);

  // Handlers
  const handleToggle = (type, value) => {
    const newGender = type === "gender" ? value : current.gender;
    const newSeason = type === "season" ? value : current.season;
    setLastAction(type);
    setActivePin(null);
    setSearchParams({ uniform: `${newGender}-${newSeason}` }, { replace: true });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Aarambh Uniforms", url: window.location.href }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const waMessage = encodeURIComponent(`Hi, I'd like to know about the ${current.gender} ${current.season} uniform.`);

  return (
    <section id="uniform" aria-labelledby="uniform-title" className="relative w-full overflow-x-clip pt-12 pb-[clamp(56px,9vw,128px)] bg-paper paper-grain scroll-mt-24">
      
      <MeasuringTape reduce={reduce} />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <motion.div initial={reduce ? false : { scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="bg-[#F7D117] border-[3px] border-ink shadow-hard px-8 py-3 rounded-2xl -rotate-2 mb-4">
            <h2 id="uniform-title" className="font-display font-extrabold text-4xl md:text-5xl text-ink">Our Uniform</h2>
          </motion.div>
          <p className="font-body font-bold text-lg md:text-xl text-ink/80">See what your little one wears, season by season.</p>
        </div>

        {/* SR Live Announcement */}
        <div aria-live="polite" className="sr-only">Showing {current.gender} {current.season} uniform, {current.items.length} items.</div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT/TOP: Toggles (Mobile only here, Desktop on right) */}
          <div className="flex flex-col gap-4 lg:hidden">
            <WoodenToggle label="Gender" options={[{label:"Boys", value:"boys"}, {label:"Girls", value:"girls"}]} selected={current.gender} onChange={(v) => handleToggle("gender", v)} />
            <WoodenToggle label="Season" options={[{label:"Regular", value:"regular", icon:true}, {label:"Winter", value:"winter", icon:true}]} selected={current.season} onChange={(v) => handleToggle("season", v)} />
          </div>

          {/* LEFT: Catalog Card */}
          <div className="lg:col-span-7 flex justify-center h-full min-h-[500px]">
             <CatalogCard data={current} direction={lastAction} reduce={reduce} activePin={activePin} setActivePin={setActivePin} onZoomClick={() => setShowZoom(true)} />
          </div>

          {/* RIGHT: Details Panel */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Toggles (Desktop) */}
            <div className="hidden lg:flex flex-col xl:flex-row gap-4 xl:gap-8">
              <WoodenToggle label="Gender" options={[{label:"Boys", value:"boys"}, {label:"Girls", value:"girls"}]} selected={current.gender} onChange={(v) => handleToggle("gender", v)} />
              <WoodenToggle label="Season" options={[{label:"Regular", value:"regular", icon:true}, {label:"Winter", value:"winter", icon:true}]} selected={current.season} onChange={(v) => handleToggle("season", v)} />
            </div>

            {/* Checklist */}
            <ItemChecklist uniformKey={current.key} items={current.items} activePin={activePin} setActivePin={setActivePin} reduce={reduce} />

            {/* Price Tag Info Card */}
            {(info.whereToBuy || info.priceNote || info.sizeNote) && (
              <div className="relative bg-[#FFFDF6] border-[3px] border-[#1B1B2F] p-4 shadow-[4px_4px_0_0_#1B1B2F] rounded-[4px_12px_4px_12px] rotate-1 origin-top flex gap-3">
                <Tag className="w-5 h-5 text-[#B01E2E] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  {info.whereToBuy && <p className="font-display font-bold text-[#1B1B2F]">{info.whereToBuy}</p>}
                  {info.sizeNote && <p className="font-body text-sm text-[#1B1B2F]/70">{info.sizeNote}</p>}
                  {info.priceNote && <p className="font-hand text-xl text-[#F28C28] mt-1">{info.priceNote}</p>}
                </div>
                {/* String tie detail */}
                <div className="absolute -top-3 left-4 w-4 h-4 rounded-full border-[2px] border-[#1B1B2F] bg-white"></div>
                <div className="absolute -top-10 left-5 w-0.5 h-8 bg-gray-400 rotate-12 -z-10"></div>
              </div>
            )}

            {/* CTA & Share */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a 
                href={`https://wa.me/${info.whatsappNumber}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex justify-center items-center gap-2 bg-[#F28C28] text-white border-[3px] border-[#1B1B2F] shadow-[6px_6px_0_0_#1B1B2F] min-h-[56px] px-6 rounded-full font-display font-bold text-lg hover:-translate-y-1 hover:shadow-[9px_9px_0_0_#1B1B2F] active:translate-y-1 active:shadow-[2px_2px_0_0_#1B1B2F] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#F7D117] transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Ask about uniform
              </a>
              <button 
                onClick={handleShare}
                className="relative flex justify-center items-center gap-2 bg-[#FFFDF6] text-[#1B1B2F] border-[3px] border-[#1B1B2F] shadow-[6px_6px_0_0_#1B1B2F] min-h-[56px] px-6 rounded-full font-display font-bold text-lg hover:-translate-y-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#1B1B2F] transition-all"
              >
                <Share2 className="w-5 h-5" /> Share
                {copied && (
                  <span aria-live="polite" className="absolute -top-12 right-0 bg-[#FFFDF6] border-[2px] border-[#1B1B2F] shadow-sm px-3 py-1 text-sm rounded-md whitespace-nowrap rotate-2 pointer-events-none">
                    Link copied!
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
      
      <ZoomViewer isOpen={showZoom} onClose={() => setShowZoom(false)} src={current.src} alt={current.alt} />
    </section>
  );
}