import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CONTACT } from "../data/contactData";

export default function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | Aarambh Play School";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-paper paper-grain pt-[calc(var(--nav-h)+40px)] pb-24">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6">
        
        <Link to="/" className="inline-flex items-center gap-2 bg-white border-[3px] border-ink shadow-hard-sm px-4 py-2 rounded-md font-display font-bold text-ink mb-12 hover:-translate-y-1 transition-transform">
          <ArrowLeft className="w-5 h-5" /> Back home
        </Link>

        <div className="bg-white border-[3px] border-ink shadow-[8px_8px_0_0_#1B1B2F] p-8 md:p-12 rounded-lg">
          <div className="bg-padYellow border-[3px] border-ink p-3 rotate-1 mb-8 inline-block shadow-sm">
             <span className="font-hand text-xl text-ink font-bold">DRAFT - To be reviewed by school</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl text-ink mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg prose-headings:font-display prose-headings:font-bold prose-headings:text-ink prose-p:font-body prose-p:text-ink/80">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h3>What we collect</h3>
            <p>When you fill out our inquiry form to book a tour, we ask for: your name, your phone number, the class you are interested in for your child, a preferred date, and an optional message. <strong>We do not ask for your child's name or photograph on the website.</strong></p>

            <h3>Why we collect it</h3>
            <p>We use this information strictly to contact you regarding your inquiry, answer your questions, and schedule a visit to the school. We do not use this data for third-party marketing.</p>

            <h3>Who handles your data</h3>
            <p>Your form submission is securely processed by our form provider (Web3Forms) and delivered directly to the school's official email inbox. Only authorized school staff read and respond to these emails.</p>

            <h3>Your choices</h3>
            <p>You can ask us to correct or delete your inquiry details at any time by contacting us directly at <strong>{CONTACT.email}</strong> or calling us at <strong>{CONTACT.phoneDisplay}</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}