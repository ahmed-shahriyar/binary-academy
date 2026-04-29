import { Check, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollDialog } from "@/components/EnrollDialog";

const tiers = [
  {
    name: "ONLINE",
    price: "১,৯৯৯",
    perks: ["YouTube Live + Facebook Live", "Recorded Class Access", "PDF Notes & MCQ Bank", "Weekly Live Q&A", "Free AI Session (Bonus)"],
    color: "cyan",
    popular: false,
  },
  {
    name: "OFFLINE",
    price: "৩,৯৯৯",
    perks: ["Direct Classroom (Madaripur)", "Printed Lecture Sheets", "Board Mock + Feedback", "All Online Benefits", "Personal Mentorship"],
    color: "green",
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">SECTION 04 · ভর্তি চলছে!!</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">
            <span className="text-gradient-cyber">Pricing</span> — Choose your path
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tiers.map((t) => {
            const glow = t.color === "cyan" ? "border-glow-cyan" : "border-glow-green";
            const accent = t.color === "cyan" ? "var(--cyber-cyan)" : "var(--cyber-green)";
            return (
              <div
                key={t.name}
                className={`relative rounded-2xl bg-card/70 backdrop-blur p-7 md:p-9 ${glow} transition-transform hover:-translate-y-1`}
              >
                {t.popular && (
                  <div className="absolute -top-3 right-6 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--cyber-green)] text-black text-xs font-bold">
                    <Star className="h-3 w-3 fill-black" /> MOST POPULAR
                  </div>
                )}
                <h3 className="font-mono text-2xl tracking-widest" style={{ color: accent }}>
                  {t.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-bold font-mono">৳{t.price}</span>
                  <span className="text-muted-foreground">/-</span>
                </div>
                {t.name === "OFFLINE" && (
                  <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> মাদারীপুর, নেছারাবাদ
                  </p>
                )}

                <ul className="mt-6 space-y-2.5">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: accent }} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <EnrollDialog
                  trigger={
                    <Button
                      className="mt-7 w-full h-12 font-bold"
                      style={{
                        background: t.color === "cyan"
                          ? "linear-gradient(135deg, var(--cyber-cyan), oklch(0.7 0.16 196))"
                          : "linear-gradient(135deg, var(--cyber-green), oklch(0.7 0.22 142))",
                        color: "black",
                      }}
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
