import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Send, ChevronDown } from "lucide-react";
import { submitInquiry } from "../../lib/submitInquiry";
import { STAGES, CONTACT } from "../../data/contactData";
import { useInquiry } from "../../context/InquiryContext";

export default function InquiryForm({ variant = "section", prefillClass = "", source = "Contact Section" }) {
  const reduce = useReducedMotion();
  const { bounceTrigger } = useInquiry();
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => { sessionStorage.setItem('inquiry_mount_time', Date.now().toString()); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const phone = form.phone.value.replace(/\D/g, '');
    
    if (phone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      form.phone.focus();
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      await submitInquiry({
        name: form.name.value,
        phone,
        childClass: form.childClass.value,
        date: form.date.value,
        message: form.message.value,
        botcheck: form.botcheck.checked,
        source
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const inputClasses = "w-full bg-[#FFFDF6] border-[3px] border-[#1B1B2F] p-3 font-body shadow-[4px_4px_0_0_#1B1B2F] focus:shadow-[8px_8px_0_0_#1B1B2F] focus:-translate-y-[2px] focus:-translate-x-[2px] focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-[#F28C28] transition-all rounded-[4px]";

  if (status === "success") {
    return (
      <div className="relative w-full bg-padYellow p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <motion.div 
          initial={reduce ? { opacity: 0 } : { scale: 2.2, opacity: 0, rotate: -25 }}
          animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1, rotate: -10 }}
          transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 400, damping: 18 }}
          className="absolute border-[4px] border-[#B01E2E] text-[#B01E2E] font-display font-extrabold text-4xl p-4 rounded-md tracking-widest opacity-80"
          style={{ textShadow: "2px 2px 0px rgba(176,30,46,0.2)" }}
        >
          SENT
        </motion.div>
        
        <h3 className="font-display font-bold text-3xl text-[#1B1B2F] mb-4 mt-20 relative z-10">Thank you!</h3>
        <p className="font-body text-[#1B1B2F]/80 mb-8 relative z-10">We have received your request and will be in touch shortly.</p>
        
        <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-[#2E8B3A] text-white border-[3px] border-[#1B1B2F] px-6 py-3 rounded-full font-display font-bold shadow-[4px_4px_0_0_#1B1B2F] hover:-translate-y-1 transition-all z-10">
          Chat on WhatsApp instead
        </a>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-bold font-body text-[#1B1B2F]/60 underline hover:text-[#1B1B2F] z-10">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      animate={bounceTrigger > 0 ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
      className={`relative w-full bg-padYellow ${variant === "section" ? 'border-[3px] border-[#1B1B2F] shadow-[8px_8px_0_0_#1B1B2F] rounded-md' : ''}`}
    >
      {variant === "section" && (
        <>
          <div className="legal-pad-rings"></div>
          <div className="legal-pad-perf mx-4"></div>
        </>
      )}

      {/* Red Margin Line */}
      <div className="absolute top-0 bottom-0 left-[44px] w-[2px] bg-[#B01E2E]/60 pointer-events-none z-0"></div>

      <div className="relative z-10 p-6 md:p-8 pl-[60px] md:pl-[76px]">
        <div className="mb-8">
          <h3 className="font-display font-extrabold text-3xl md:text-4xl text-[#1B1B2F] leading-tight">Come and see<br/>Aarambh</h3>
          <p className="font-hand text-xl text-[#1B1B2F]/70 mt-1 rotate-1">(takes 30 seconds)</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="inquiry-name" className="font-display font-bold text-sm text-[#1B1B2F]">Parent's Name *</label>
            <input required type="text" id="inquiry-name" name="name" minLength="2" maxLength="60" autoComplete="name" className={inputClasses} />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="inquiry-phone" className="font-display font-bold text-sm text-[#1B1B2F]">Phone / WhatsApp *</label>
              <div className="flex relative">
                <span className="absolute left-0 top-0 bottom-0 flex items-center justify-center px-3 font-display font-bold text-[#1B1B2F] bg-[#E8DCC0] border-y-[3px] border-l-[3px] border-[#1B1B2F] rounded-l-[4px]">+91</span>
                <input required type="tel" id="inquiry-phone" name="phone" inputMode="numeric" autoComplete="tel-national" enterKeyHint="next" className={`${inputClasses} pl-14 rounded-l-none`} />
              </div>
              {errorMsg && <p role="alert" className="text-sm font-bold text-[#B01E2E] mt-1">{errorMsg}</p>}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="inquiry-class" className="font-display font-bold text-sm text-[#1B1B2F]">Child's Class *</label>
              <div className="relative">
                <select required id="inquiry-class" name="childClass" defaultValue={prefillClass} className={`${inputClasses} appearance-none cursor-pointer pr-10`}>
                  <option value="" disabled>Select a class...</option>
                  {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B1B2F] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
             <label htmlFor="inquiry-date" className="font-display font-bold text-sm text-[#1B1B2F]">Preferred Tour Date</label>
             <input type="date" id="inquiry-date" name="date" min={new Date().toISOString().split('T')[0]} className={inputClasses} />
             <p className="text-xs font-body font-bold text-[#1B1B2F]/60">Pick any day; we'll confirm the time with you.</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label htmlFor="inquiry-message" className="font-display font-bold text-sm text-[#1B1B2F]">Message</label>
              <span className="text-xs font-body font-bold text-[#1B1B2F]/50">{msgCount}/300</span>
            </div>
            <textarea id="inquiry-message" name="message" rows="3" maxLength="300" onChange={(e)=>setMsgCount(e.target.value.length)} className={`${inputClasses} resize-none ruled-lines leading-[32px]`}></textarea>
          </div>

          <div className="flex items-start gap-3 mt-2">
             <input required type="checkbox" id="inquiry-consent" name="consent" className="w-6 h-6 mt-0.5 border-[3px] border-[#1B1B2F] rounded-sm shrink-0 cursor-pointer accent-[#F28C28]" />
             <label htmlFor="inquiry-consent" className="text-sm font-body font-bold text-[#1B1B2F]/80 leading-tight">
               I agree that Aarambh Play School may contact me about my enquiry. See our <Link to="/privacy" className="underline hover:text-[#1B1B2F]">Privacy Policy</Link>.
             </label>
          </div>

          <input type="checkbox" name="botcheck" tabIndex="-1" aria-hidden="true" className="absolute -left-[9999px]" />

          <button 
            type="submit" 
            disabled={status === "sending"}
            className="group relative flex items-center justify-center gap-2 bg-[#F28C28] text-white border-[3px] border-[#1B1B2F] shadow-[6px_6px_0_0_#1B1B2F] min-h-[56px] w-full mt-4 rounded-full font-display font-bold text-lg hover:-translate-y-1 hover:shadow-[9px_9px_0_0_#1B1B2F] active:translate-y-1 active:shadow-[2px_2px_0_0_#1B1B2F] disabled:opacity-70 transition-all"
          >
            {status === "sending" ? "Sending..." : "Request a tour"}
            {status !== "sending" && !reduce && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </button>
        </form>
      </div>
    </motion.div>
  );
}