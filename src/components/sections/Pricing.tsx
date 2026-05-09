import { Check, MapPin, Star, Crown, Zap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollDialog } from "@/components/EnrollDialog";

type Batch = "Online Pro" | "Offline FLEX" | "Offline Hybrid";

type Tier = {
  name: string;
  batch: Batch;
  price: string;
  priceNote?: string;
  description: string;
  perks: string[];
  variant: "cyan" | "amber" | "hybrid";
  badge?: string;
  location?: string;
  earlyBirdPrice?: string;
  earlyBirdLabel?: string;
};

const tiers: Tier[] = [
  {
    name: "ONLINE PRO",
    batch: "Online Pro",
    price: "২,৪৪৯",
    earlyBirdPrice: "১,৪৪৯",
    earlyBirdLabel: "🔥 ৳1,449 for first 10 students!",
    description: "Full digital learning experience for remote students.",
    perks: [
      "Live Interactive Classes",
      "Recorded Class Archive",
      "Smart Digital Dashboard",
      "Weekly Q&A Sessions",
      "Auto-Graded Quizzes",
    ],
    variant: "cyan",
    badge: "EARLY BIRD: 10 SLOTS",
  },
  {
    name: "OFFLINE HYBRID",
    batch: "Offline Hybrid",
    price: "৩,৯৮৯",
    earlyBirdPrice: "২,৯৮৯",
    earlyBirdLabel: "🔥 ৳2,989 for first 10 students!",
    description: "Ultimate combo: in-person learning in Netrokona + full digital access.",
    perks: [
      "Includes ALL Online Pro Features",
      "Live Sessions in Mukterpara",
      "Dual-Mode Learning Support",
      "Priority 'Fast-Track' Support",
    ],
    variant: "hybrid",
    badge: "EARLY BIRD: 10 SLOTS",
  },
  {
    name: "OFFLINE FLEX",
    batch: "Offline FLEX",
    price: "৬,০০০",
    priceNote: "৳1,000 / month",
    description: "Physical classroom learning with a flexible 6-month plan.",
    perks: [
      "In-Person Mentoring",
      "Hardcopy Worksheets & Handouts",
      "Direct Teacher Access",
      "Flexible 6-Month Payment Plan",
    ],
    variant: "amber",
    location: "Mukterpara, Netrokona",
  },
];

const styles = {
  cyan: {
    accent: "var(--cyber-cyan)",
    btn: "linear-gradient(135deg, var(--cyber-cyan), oklch(0.7 0.16 220))",
    glow: "0 0 24px color-mix(in oklab, var(--cyber-cyan) 25%, transparent)",
    border: "1px solid color-mix(in oklab, var(--cyber-cyan) 35%, transparent)",
    badgeBg: "var(--cyber-cyan)",
  },
  amber: {
    accent: "var(--cyber-amber)",
    btn: "linear-gradient(135deg, var(--cyber-amber), oklch(0.72 0.16 65))",
    glow: "0 0 24px color-mix(in oklab, var(--cyber-amber) 25%, transparent)",
    border: "1px solid color-mix(in oklab, var(--cyber-amber) 35%, transparent)",
    badgeBg: "var(--cyber-amber)",
  },
  hybrid: {
    accent: "var(--cyber-cyan)",
    btn: "linear-gradient(135deg, var(--cyber-cyan), oklch(0.55 0.22 260))",
    glow: "0 0 32px color-mix(in oklab, var(--cyber-cyan) 45%, transparent), 0 0 60px oklch(0.55 0.22 260 / 0.35)",
    border: "",
    badgeBg: "linear-gradient(135deg, var(--cyber-cyan), oklch(0.6 0.22 260))",
  },
} as const;

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">
            SECTION 04 · ভর্তি চলছে!!
          </p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">
            <span className="text-gradient-cyber">Pricing</span> — Choose your path
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Three tiers · Cyberpunk learning · Built for SSC '26
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((t) => {
            const s = styles[t.variant];
            const isHybrid = t.variant === "hybrid";
            return (
              <div
                key={t.name}
                className="relative rounded-2xl backdrop-blur-xl p-7 md:p-8 transition-transform hover:-translate-y-1 flex flex-col"
                style={
                  isHybrid
                    ? {
                        background:
                          "linear-gradient(160deg, color-mix(in oklab, var(--card) 80%, transparent), color-mix(in oklab, var(--card) 60%, transparent))",
                        border: "1px solid transparent",
                        backgroundImage:
                          "linear-gradient(var(--card), var(--card)), linear-gradient(135deg, var(--cyber-cyan), oklch(0.55 0.22 260))",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        boxShadow: s.glow,
                      }
                    : {
                        background:
                          "linear-gradient(160deg, color-mix(in oklab, var(--card) 75%, transparent), color-mix(in oklab, var(--card) 55%, transparent))",
                        border: s.border,
                        boxShadow: s.glow,
                      }
                }
              >
                {t.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-[11px] font-bold whitespace-nowrap font-mono tracking-wider animate-pulse"
                    style={{
                      background: "linear-gradient(135deg, #FF3B30, #FF6A00)",
                      boxShadow:
                        "0 0 12px rgba(255, 106, 0, 0.6), 0 0 24px rgba(255, 59, 48, 0.4)",
                      border: "1px solid rgba(255, 180, 80, 0.6)",
                    }}
                  >
                    <Crown className="h-3 w-3" /> {t.badge}
                  </div>
                )}

                <h3
                  className="font-mono text-xl md:text-2xl tracking-widest"
                  style={
                    isHybrid
                      ? {
                          background:
                            "linear-gradient(135deg, var(--cyber-cyan), oklch(0.6 0.22 260))",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }
                      : { color: s.accent }
                  }
                >
                  {t.name}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground min-h-[2.5rem]">
                  {t.description}
                </p>

                <div className="mt-4 flex items-baseline gap-2 flex-wrap">
                  {t.earlyBirdPrice ? (
                    <>
                      <span className="text-4xl md:text-5xl font-bold font-mono text-[#FF6A00]">
                        ৳{t.earlyBirdPrice}
                      </span>
                      <span className="text-xl font-mono text-muted-foreground line-through decoration-[#FF3B30]/70 decoration-2">
                        ৳{t.price}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl md:text-5xl font-bold font-mono">৳{t.price}</span>
                      <span className="text-muted-foreground">/-</span>
                    </>
                  )}
                </div>
                {t.earlyBirdLabel && (
                  <p
                    className="mt-2 inline-block font-mono text-sm font-bold animate-pulse"
                    style={{
                      color: "#FFB347",
                      textShadow:
                        "0 0 8px rgba(255, 106, 0, 0.7), 0 0 16px rgba(255, 59, 48, 0.4)",
                    }}
                  >
                    {t.earlyBirdLabel}
                  </p>
                )}
                {t.priceNote && (
                  <p className="mt-1 inline-flex items-center gap-1 font-mono text-sm font-bold text-[var(--cyber-amber)]">
                    <Calendar className="h-3.5 w-3.5" /> {t.priceNote}
                  </p>
                )}
                {t.location && (
                  <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {t.location}
                  </p>
                )}

                <ul className="mt-6 space-y-2.5 flex-1">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <Check
                        className="h-4 w-4 mt-0.5 shrink-0"
                        style={{ color: s.accent }}
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <EnrollDialog
                  defaultBatch={t.batch}
                  trigger={
                    <Button
                      className="mt-7 w-full h-12 font-bold gap-2"
                      style={{ background: s.btn, color: "black" }}
                    >
                      <Zap className="h-4 w-4" /> Enroll Now
                    </Button>
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
