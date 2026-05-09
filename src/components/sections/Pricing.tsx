import { Check, MapPin, Crown, Zap, Calendar, Sparkles } from "lucide-react";
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

// Order: Online Pro, Offline Hybrid (middle on mobile + desktop), Offline FLEX
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
    location: "Mukterpara, Netrokona",
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
    hoverBtn: "linear-gradient(135deg, oklch(0.95 0.18 196), var(--cyber-cyan))",
    glow: "0 0 22px color-mix(in oklab, var(--cyber-cyan) 25%, transparent)",
    hoverGlow:
      "0 0 36px color-mix(in oklab, var(--cyber-cyan) 55%, transparent), 0 0 80px color-mix(in oklab, var(--cyber-cyan) 25%, transparent)",
    border: "1px solid color-mix(in oklab, var(--cyber-cyan) 45%, transparent)",
  },
  amber: {
    accent: "var(--cyber-amber)",
    btn: "linear-gradient(135deg, var(--cyber-amber), oklch(0.72 0.16 65))",
    hoverBtn: "linear-gradient(135deg, oklch(0.88 0.2 60), var(--cyber-amber))",
    glow: "0 0 22px color-mix(in oklab, var(--cyber-amber) 25%, transparent)",
    hoverGlow:
      "0 0 36px color-mix(in oklab, var(--cyber-amber) 55%, transparent), 0 0 80px color-mix(in oklab, var(--cyber-amber) 25%, transparent)",
    border: "1px solid color-mix(in oklab, var(--cyber-amber) 45%, transparent)",
  },
  hybrid: {
    accent: "var(--cyber-cyan)",
    btn: "linear-gradient(135deg, var(--cyber-cyan), oklch(0.6 0.22 280))",
    hoverBtn: "linear-gradient(135deg, oklch(0.95 0.18 196), oklch(0.65 0.24 290))",
    glow: "0 0 36px color-mix(in oklab, var(--cyber-cyan) 45%, transparent), 0 0 70px oklch(0.55 0.22 280 / 0.45)",
    hoverGlow:
      "0 0 52px color-mix(in oklab, var(--cyber-cyan) 65%, transparent), 0 0 110px oklch(0.55 0.22 280 / 0.7)",
    border: "",
  },
} as const;

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 md:py-28 px-4 overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 items-center py-6 md:py-10">
          {tiers.map((t) => {
            const s = styles[t.variant];
            const isHybrid = t.variant === "hybrid";
            return (
              <div
                key={t.name}
                className={[
                  "group relative rounded-2xl p-6 md:p-8 flex flex-col overflow-visible",
                  "backdrop-blur-xl transition-all duration-300 ease-out tilt-3d",
                  isHybrid ? "is-hybrid md:scale-[1.15] md:z-10 animate-hybrid-halo" : "hover:-translate-y-2",
                ].join(" ")}
                style={
                  isHybrid
                    ? {
                        background:
                          "linear-gradient(160deg, color-mix(in oklab, var(--card) 75%, transparent), color-mix(in oklab, var(--card) 50%, transparent))",
                        backdropFilter: "blur(24px)",
                      }
                    : {
                        background:
                          "linear-gradient(160deg, color-mix(in oklab, var(--card) 65%, transparent), color-mix(in oklab, var(--card) 40%, transparent))",
                        border: s.border,
                        boxShadow: s.glow,
                      }
                }
                onMouseEnter={(e) => {
                  if (!isHybrid) e.currentTarget.style.boxShadow = s.hoverGlow;
                }}
                onMouseLeave={(e) => {
                  if (!isHybrid) e.currentTarget.style.boxShadow = s.glow;
                }}
              >
                {/* Hybrid: animated conic neon rim */}
                {isHybrid && <div aria-hidden className="hybrid-conic-rim" />}

                {/* Hybrid: animated grid background */}
                {isHybrid && (
                  <div
                    aria-hidden
                    className="absolute inset-0 hybrid-grid-bg opacity-60 pointer-events-none rounded-2xl overflow-hidden"
                  />
                )}
                {/* Inner radial glow */}
                {isHybrid && (
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
                    style={{
                      background:
                        "radial-gradient(ellipse at top, oklch(0.55 0.22 280 / 0.28), transparent 70%)",
                    }}
                  />
                )}

                {/* BEST VALUE diagonal ribbon */}
                {isHybrid && <div className="ribbon-corner">BEST VALUE</div>}

                {/* Floating Early Bird pulsing badge */}
                {isHybrid && (
                  <div
                    className="absolute -top-4 -left-3 md:-top-5 md:-left-4 z-20 px-3 py-1.5 rounded-lg text-white text-[11px] font-extrabold font-mono tracking-wider whitespace-nowrap animate-early-bird-float"
                    style={{
                      background: "linear-gradient(135deg, #FF3B30, #FF6A00)",
                      border: "1px solid rgba(255, 200, 100, 0.7)",
                    }}
                  >
                    FIRST 10: ৳1,000 OFF
                  </div>
                )}

                <div className="relative z-10 flex flex-col flex-1">
                  {t.badge && (
                    <div
                      className="self-start mb-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-[10px] font-bold whitespace-nowrap font-mono tracking-wider animate-pulse"
                      style={{
                        background: "linear-gradient(135deg, #FF3B30, #FF6A00)",
                        boxShadow: "0 0 12px rgba(255, 106, 0, 0.6), 0 0 24px rgba(255, 59, 48, 0.4)",
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
                              "linear-gradient(135deg, var(--cyber-cyan), oklch(0.65 0.22 285))",
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
                        <span
                          className="text-4xl md:text-5xl font-extrabold font-mono tracking-tight"
                          style={{
                            color: "#FF6A00",
                            textShadow: "0 0 18px rgba(255, 106, 0, 0.45)",
                          }}
                        >
                          ৳{t.earlyBirdPrice}
                        </span>
                        <span className="text-xl font-mono text-muted-foreground line-through decoration-[#FF3B30]/70 decoration-2">
                          ৳{t.price}
                        </span>
                      </>
                    ) : t.priceNote ? (
                      <>
                        <span
                          className="text-4xl md:text-5xl font-extrabold font-mono tracking-tight"
                          style={{
                            color: s.accent,
                            textShadow: `0 0 18px color-mix(in oklab, ${s.accent} 45%, transparent)`,
                          }}
                        >
                          ৳1,000
                        </span>
                        <span className="text-base font-mono text-muted-foreground">/ month</span>
                      </>
                    ) : (
                      <>
                        <span
                          className="text-4xl md:text-5xl font-extrabold font-mono tracking-tight"
                          style={{
                            color: s.accent,
                            textShadow: `0 0 18px color-mix(in oklab, ${s.accent} 45%, transparent)`,
                          }}
                        >
                          ৳{t.price}
                        </span>
                        <span className="text-muted-foreground">/-</span>
                      </>
                    )}
                  </div>

                  {t.earlyBirdLabel && (
                    <p
                      className="mt-2 inline-flex items-center gap-1 font-mono text-sm font-bold animate-discount-glow"
                      style={{ color: "#FFB347" }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {t.earlyBirdLabel}
                    </p>
                  )}
                  {t.priceNote && (
                    <p className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> ৳{t.price} total · 6-month plan
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
                        <span
                          className="mt-0.5 inline-flex items-center justify-center h-5 w-5 rounded-full shrink-0"
                          style={{
                            background: `color-mix(in oklab, ${s.accent} 18%, transparent)`,
                            border: `1px solid color-mix(in oklab, ${s.accent} 55%, transparent)`,
                            boxShadow: `0 0 10px color-mix(in oklab, ${s.accent} 35%, transparent)`,
                          }}
                        >
                          <Check className="h-3 w-3" style={{ color: s.accent }} />
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <EnrollDialog
                    defaultBatch={t.batch}
                    trigger={
                      <Button
                        className="mt-7 w-full h-14 md:h-12 text-base font-bold gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                        style={{ background: s.btn, color: "black" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = s.hoverBtn;
                          e.currentTarget.style.boxShadow = s.hoverGlow;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = s.btn;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        onTouchStart={(e) => {
                          e.currentTarget.style.boxShadow = s.hoverGlow;
                        }}
                        onTouchEnd={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Zap className="h-4 w-4" /> Enroll Now
                      </Button>
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
