import { createContext, useContext, useState } from "react";

const InquiryContext = createContext();

export function InquiryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({ classId: "", source: "" });
  const [bounceTrigger, setBounceTrigger] = useState(0);

  const openInquiry = ({ classId = "", source = "Website Button" } = {}) => {
    // Check if the inline form is visible in the viewport
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        setBounceTrigger(prev => prev + 1);
        document.getElementById("inquiry-name")?.focus();
        return;
      }
    }
    
    setModalData({ classId, source });
    setIsOpen(true);
  };

  const closeInquiry = () => setIsOpen(false);

  return (
    <InquiryContext.Provider value={{ isOpen, openInquiry, closeInquiry, modalData, bounceTrigger }}>
      {children}
    </InquiryContext.Provider>
  );
}

export const useInquiry = () => useContext(InquiryContext);