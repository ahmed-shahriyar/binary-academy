import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/8801580611996?text=Hi%20Binary%20Academy!%20I%20want%20to%20enroll."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      // Mobile: 20px above the sticky CTA bar (~72px tall) → bottom-[92px]
      // Desktop: standard bottom-6
      className="fixed right-4 bottom-[92px] md:bottom-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_25px_rgba(37,211,102,0.6)] hover:scale-110 transition-transform animate-whatsapp-pulse"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
