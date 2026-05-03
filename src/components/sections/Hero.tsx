import { BinaryRain } from "@/components/BinaryRain";
import { EnrollDialog } from "@/components/EnrollDialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Rocket } from "lucide-react";
import logo from "@/assets/binary-academy-logo.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid-bg">
      <BinaryRain />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <img
          src={logo}
          alt="Binary Academy logo"
          loading="eager"
          className="mx-auto w-40 md:w-56 drop-shadow-[0_0_30px_oklch(0.86_0.24_142_/_0.5)] animate-flicker"
        />

        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full border border-[var(--cyber-cyan)]/40 bg-card/50 backdrop-blur text-xs font-mono text-[var(--cyber-cyan)]">
          <Sparkles className="h-3.5 w-3.5" /> SSC '26 BATCH · ADMISSION OPEN
        </div>

        <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
          <span className="text-gradient-cyber">HSC ICT Complete Course</span>
          <br />
          <span className="text-foreground">SSC 2026 Batch</span>
        </h1>

        <p className="mt-5 text-lg md:text-2xl font-mono text-[var(--cyber-green)]">
          HSC ICT-er Bishwasto Saathi!
        </p>
        <p className="mt-3 max-w-xl mx-auto text-sm md:text-base text-muted-foreground">
          ০ থেকে A+ — Logic Gates থেকে C Programming পর্যন্ত পরিপূর্ণ Journey, সাথে FREE AI Education Session।
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <EnrollDialog
            trigger={
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] text-black hover:opacity-90 animate-pulse-glow"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Enroll Now
              </Button>
            }
          />
          <a href="#gift-claim">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-bold border-2 border-[var(--cyber-green)] text-[var(--cyber-green)] hover:bg-[var(--cyber-green)]/10"
            >
              <Gift className="mr-2 h-5 w-5" />
              Claim Free Gifts
            </Button>
          </a>
        </div>

        <div className="mt-12 grid grid-cols-3 max-w-lg mx-auto gap-4 text-center">
          {[
            { v: "7", l: "Phases" },
            { v: "A+", l: "Guarantee" },
            { v: "FREE", l: "AI Session" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border border-border bg-card/40 backdrop-blur py-3">
              <div className="text-xl md:text-2xl font-mono text-[var(--cyber-cyan)]">{s.v}</div>
              <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
