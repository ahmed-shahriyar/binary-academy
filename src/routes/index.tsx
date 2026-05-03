import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { Mentor } from "@/components/sections/Mentor";
import { GiftClaim } from "@/components/sections/GiftClaim";
import { Roadmap } from "@/components/sections/Roadmap";
import { Features } from "@/components/sections/Features";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Payment } from "@/components/sections/Payment";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { StickyCTA } from "@/components/StickyCTA";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { SonnerProvider } from "@/components/SonnerProvider";
import { UrgencyPopup } from "@/components/UrgencyPopup";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Binary Academy — HSC ICT Complete Course | SSC '26 Batch" },
      {
        name: "description",
        content:
          "HSC ICT-er Bishwasto Saathi! Binary Academy SSC 2026 batch — 7-Phase Roadmap, 54 lectures, FREE AI Session, online ৳1,999 · offline ৳3,999 (Madaripur). Enroll now & claim free gift.",
      },
      { name: "keywords", content: "HSC ICT Course, Binary Academy, SSC 26 ICT, HSC ICT Bangladesh, Madaripur ICT coaching, Logic Gates, C Programming" },
      { property: "og:title", content: "Binary Academy — HSC ICT Complete Course (SSC '26)" },
      { property: "og:description", content: "7-Phase Roadmap · 54 Lectures · FREE AI Session · Online ৳1,999 · Offline ৳3,999. HSC ICT-er Bishwasto Saathi!" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Binary Academy — HSC ICT (SSC '26)" },
      { name: "twitter:description", content: "HSC ICT Complete Course · FREE AI Session · Enroll now." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SonnerProvider />
      <Hero />
      <Mentor />
      <GiftClaim />
      <Roadmap />
      <Features />
      <Pricing />
      <Testimonials />
      <Payment />
      <FAQ />
      <Footer />
      <WhatsAppFloat />
      <StickyCTA />
      <UrgencyPopup />
      {/* Bottom padding so sticky CTA doesn't cover content on mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
