export async function submitInquiry(values) {
  const mountTime = Number(sessionStorage.getItem('inquiry_mount_time') || 0);
  if (Date.now() - mountTime < 3000) throw new Error("Please wait a moment before submitting.");
  
  const lastSuccess = Number(sessionStorage.getItem('inquiry_last_success') || 0);
  if (Date.now() - lastSuccess < 30000) throw new Error("You recently sent an inquiry. Please wait 30 seconds.");

  if (values.botcheck) return { success: true }; // Silently reject honeypot

  const apiKey = import.meta.env.VITE_WEB3FORMS_KEY;
  if (!apiKey) throw new Error("Form service is not configured. Please use WhatsApp.");

  const payload = {
    access_key: apiKey,
    subject: "New tour request - Aarambh Play School",
    from_name: "Aarambh Website",
    name: values.name,
    phone: `+91${values.phone.replace(/\D/g, '')}`,
    child_class: values.childClass,
    tour_date: values.date || "Not specified",
    message: values.message || "No message provided",
    source: values.source || "Direct Form",
    page_url: window.location.href,
  };

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok && data.success) {
    sessionStorage.setItem('inquiry_last_success', Date.now().toString());
    return data;
  }
  
  throw new Error(data.message || "Failed to send message.");
}

/* 
// ALTERNATIVE: Vercel Serverless / Google Sheets 
export async function submitInquiry(values) {
  const res = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values)
  });
  if (!res.ok) throw new Error("Server error");
  return await res.json();
}
*/