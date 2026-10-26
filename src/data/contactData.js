export const CONTACT = {
  schoolName: "Aarambh Play School",
  addressLines: [
    "Durgenu Bhawan, West side of Joda Mandir", 
    "Near Ojha Market, Hesal, Ratu Road, Ranchi 834005"
  ],
  landmark: "Landmark: Joda Mandir", 
  
  // Now fetching from Vercel/Local .env, with safe fallbacks
  phoneDisplay: import.meta.env.VITE_CONTACT_PHONE_DISPLAY, 
  phoneTel: import.meta.env.VITE_CONTACT_PHONE_TEL,
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP,
  email: import.meta.env.VITE_CONTACT_EMAIL,
  
  hours: [
    { label: "Summer timings", value: "7:45 AM - 11:30 AM" },
    { label: "Winter timings", value: "8:45 AM - 12:30 PM" }, 
    { label: "Office & tours", value: "8:30 AM - 1:00 PM" }
  ],
  
  // Map URLs moved to env
  mapsUrl: import.meta.env.VITE_MAPS_URL,
  mapEmbedUrl: import.meta.env.VITE_MAPS_EMBED_URL,
  mapsDestination: "Aarambh Play School, Ranchi",
  
  social: { 
    instagram: import.meta.env.VITE_INSTAGRAM_URL, 
    facebook: import.meta.env.VITE_FACEBOOK_URL , 
    youtube: import.meta.env.VITE_YOUTUBE_URL  
  }
};

export const STAGES = [
  { value: "pre-nursery", label: "Pre-Nursery (2.5-3 yrs)" },
  { value: "nursery", label: "Nursery (3-4 yrs)" },
  { value: "lkg", label: "LKG (4-5 yrs)" },
  { value: "ukg", label: "UKG (5-6 yrs)" },
  { value: "class-1", label: "Class 1 (6+ yrs)" },
  { value: "not-sure", label: "Not sure yet" }
];