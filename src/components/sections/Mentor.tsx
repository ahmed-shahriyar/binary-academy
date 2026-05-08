import { Facebook, Youtube } from "lucide-react";
import mentorPhoto from "@/assets/mentor.png";

export function Mentor() {
  return (
    <section id="mentor" className="relative py-20 md:py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">SECTION 02 · MENTOR</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">
            Meet Your <span className="text-gradient-cyber">Mentor</span>
          </h2>
        </div>

        <div
          className="mx-auto rounded-2xl p-8 md:p-10 text-center backdrop-blur border-glow-cyan"
          style={{ maxWidth: 600, background: "#0A0F1A" }}
        >
          <div
            className="mx-auto rounded-full overflow-hidden bg-background"
            style={{
              width: 160,
              height: 160,
              border: "3px solid #00FFFF",
              boxShadow: "0 0 28px #00FFFF, 0 0 56px rgba(0,255,255,0.45)",
            }}
          >
            <img
              src={mentorPhoto}
              alt="Ahmed Shahriyar — Mentor at Binary Academy"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="mt-5 text-2xl font-bold">Ahmed Shahriyar</h3>
          <p className="mt-1 font-mono text-sm text-[var(--cyber-green)]">
            HSC ICT Expert &amp; Founder, Binary Academy
          </p>

          <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed">
            "Helping HSC students master C-Programming and Web Design with logic-first
            teaching — not memorization. Every student can code. You just need the right guide."
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="https://www.facebook.com/ahmed.shahariyar.12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-11 h-11 rounded-full flex items-center justify-center border border-[var(--cyber-cyan)]/40 text-[var(--cyber-cyan)] hover:bg-[var(--cyber-cyan)]/10 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/@binaryAcademyICT"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-11 h-11 rounded-full flex items-center justify-center border border-[var(--cyber-green)]/40 text-[var(--cyber-green)] hover:bg-[var(--cyber-green)]/10 transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
