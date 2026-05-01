import { Check, MapPin, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollDialog } from "@/components/EnrollDialog";

type Tier = {
  name: string;
  batch: "Online" | "Offline" | "Complete";
  price: string;
  perks: string[];
  variant: "cyan" | "green" | "gradient";
  badge?: string;
  location?: boolean;
};

const tiers: Tier[] = [
  {
    name: "ONLINE",
    batch: "Online",
    price: "১,৯৯৯",
    perks: [
      "YouTube Live + Facebook Live",
      "Recorded Class Access",
      "PDF Notes & MCQ Bank",
      "Weekly Live Q&A",
      "Free AI Session (Bonus)",
    ],
    variant: "cyan",
  },
  {
    name: "OFFLINE",
    batch: "Offline",
    price: "৩,৯৯৯",
    perks: [
      "Direct Classroom (Madaripur)",
      "Printed Lecture Sheets",
      "SMS Parent Alerts",
      "Board Mock + Feedback",
      "Personal Mentorship",
    ],
    variant: "green",
    badge: "RECOMMENDED",
    location: true,
  },
  {
    name: "COMPLETE",
    batch: "Complete",
    price: "৪,৯৯৯",
    perks: [
      "Everything in Online + Offline",
      "Priority WhatsApp Support",
      "1-on-1 Doubt Sessions",
      "Exclusive Resource Vault",
      "VIP Result Tracking",
    ],
    variant: "gradient",
    badge: "BEST VALUE",
  },
];

const styles = {
  cyan: {
    border: "border-glow-cyan",
    accent: "var(--cyber-cyan)",
    btn: "linear-gradient(135deg, var(--cyber-cyan), oklch(0.7 0.16 196))",
    badgeBg: "var(--cyber-cyan)",
  },
  green: {
    border: "border-glow-green",
    accent: "var(--cyber-green)",
    btn: "linear-gradient(135deg, var(--cyber-green), oklch(0.7 0.22 142))",
    badgeBg: "var(--cyber-green)",
  },
  gradient: {
    border: "",
    accent: "#FF3DAB",
    btn: "linear-gradient(135deg, #FF3DAB, var(--cyber-cyan))",
    badgeBg: "linear-gradient(135deg, #FF3DAB, var(--cyber-cyan))",
  },
} as const;

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">SECTION 04 · ভর্তি চলছে!!</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">
            <span className="text-gradient-cyber">Pricing</span> — Choose your path
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => {
            const s = styles[t.variant];
            const isGradient = t.variant === "gradient";
            return (
              <div
                key={t.name}
                className={`relative rounded-2xl bg-card/70 backdrop-blur p-7 md:p-8 ${s.border} transition-transform hover:-translate-y-1`}
                style={
                  isGradient
                    ? {
                        border: "1px solid transparent",
                        backgroundImage:
                          "linear-gradient(var(--card), var(--card)), linear-gradient(135deg, #FF3DAB, #00FFFF)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        boxShadow: "0 0 28px rgba(255,61,171,0.35), 0 0 60px rgba(0,255,255,0.18)",
                      }
                    : undefined
                }
              >
                {t.badge && (
                  <div
                    className="absolute -top-3 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full text-black text-xs font-bold"
                    style={{ background: s.badgeBg }}
                  >
                    {isGradient ? <Crown className="h-3 w-3" /> : <Star className="h-3 w-3 fill-black" />} {t.badge}
                  </div>
                )}

                <h3
                  className="font-mono text-2xl tracking-widest"
                  style={
                    isGradient
                      ? {
                          background: "linear-gradient(135deg, #FF3DAB, #00FFFF)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }
                      : { color: s.accent }
                  }
                >
                  {t.name}
                </h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-bold font-mono">৳{t.price}</span>
                  <span className="text-muted-foreground">/-</span>
                </div>
                {t.location && (
                  <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> মাদারীপুর, নেছারাবাদ
                  </p>
                )}

                <ul className="mt-6 space-y-2.5">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: s.accent }} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <EnrollDialog
                  defaultBatch={t.batch}
                  trigger={
                    <Button
                      className="mt-7 w-full h-12 font-bold"
                      style={{ background: s.btn, color: isGradient ? "white" : "black" }}
                    >
                      Enroll Now ({t.name})
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
