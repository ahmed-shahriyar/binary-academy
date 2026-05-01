import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { DemoClassDialog } from "@/components/DemoClassDialog";

const phases = [
  {
    id: 0,
    title: "Phase Zero — Free Enrollment",
    period: "Now – July 15, 2026",
    tag: "FREE",
    points: [
      "Chapter 1: Logic Gates (Free access)",
      "Chapter 2: Communication System",
      "Chapter 3: Number System & Digital",
      "Daily MQC practice + Live Q&A",
    ],
  },
  {
    id: 1,
    title: "Phase One — Community & Basics",
    period: "May 21 – June 15, 2026",
    tag: "FREE",
    points: [
      "Facebook Group-A Join করো",
      "QR scan Q&A Gaegls Fans fill করো",
      "Free Chapter 1 Class access পাও",
      "PDF Notes + MQC Bank unlock",
    ],
  },
  {
    id: 2,
    title: "Phase Two — Core Chapters",
    period: "June 16 – July 31, 2026",
    tag: "PAID",
    points: [
      "Chapter 4: Web Design & HTML",
      "Chapter 5: Database Management",
      "Chapter 6: Networking & Internet",
      "Mock Test 1 + Board Question Analysis",
    ],
  },
  {
    id: 3,
    title: "Phase Three — Programming Master",
    period: "August – September 2026",
    tag: "PAID",
    points: [
      "Chapter 7: C Programming (Full)",
      "Chapter 8 & 9: Advanced Topics",
      "CQ Writing Framework",
      "Mock Test 2 + Feedback",
    ],
  },
  {
    id: 4,
    title: "Phase Four — AI + Final Prep",
    period: "October 2026 – HSC Exam",
    tag: "BONUS",
    points: [
      "Chapter 10–11 Complete Coverage",
      "FREE AI in Education Session",
      "Full Mock Board Exam + Analysis",
      "Admission Preparation Module",
    ],
  },
];

function tagStyle(tag: string) {
  if (tag === "FREE") return { cls: "border-glow-cyan text-[var(--cyber-cyan)]", icon: <Sparkles className="h-3 w-3" /> };
  if (tag === "BONUS") return { cls: "border-glow-green text-[var(--cyber-green)]", icon: <Sparkles className="h-3 w-3" /> };
  return { cls: "border-glow-amber text-[var(--cyber-amber)]", icon: <Lock className="h-3 w-3" /> };
}

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">SECTION 02</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">
            Course Roadmap — <span className="text-gradient-cyber">তোমার পরিপূর্ণ Journey</span>
          </h2>
          <p className="mt-3 text-muted-foreground">Free থেকে Full Course পর্যন্ত — step by step</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--cyber-cyan)] via-[var(--cyber-green)] to-[var(--cyber-amber)]" />

          <div className="space-y-10">
            {phases.map((p, i) => {
              const t = tagStyle(p.tag);
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={p.id}
                  className={`relative md:grid md:grid-cols-2 md:gap-10 items-center ${isLeft ? "" : "md:[&>*:first-child]:order-2"}`}
                >
                  {/* dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-[var(--cyber-cyan)] animate-pulse-glow" />

                  <div className={`pl-12 md:pl-0 ${isLeft ? "md:pr-10 md:text-right" : "md:pl-10"}`}>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider ${t.cls}`}>
                      {t.icon} {p.tag} · Phase {p.id}
                    </div>
                    <h3 className="mt-2 text-xl md:text-2xl font-bold">{p.title}</h3>
                    <p className="text-xs font-mono text-muted-foreground">{p.period}</p>
                  </div>

                  <div className={`pl-12 md:pl-0 ${isLeft ? "md:pl-10" : "md:pr-10"} mt-3 md:mt-0`}>
                    <div className="rounded-xl border border-border bg-card/60 backdrop-blur p-5 hover:border-[var(--cyber-cyan)]/50 transition-colors">
                      <ul className="space-y-2">
                        {p.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[var(--cyber-green)]" />
                            <span className="text-foreground/90">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Post-roadmap CTA — isolated container with smooth glow fade above */}
        <div className="relative mt-16 mb-20">
          {/* Smooth fade-out of roadmap glow before the CTA */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-background"
          />
          <div className="relative flex flex-col items-center text-center">
            <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest mb-3">
              START YOUR JOURNEY
            </p>
            <DemoClassDialog />
            <p className="mt-3 text-xs text-muted-foreground">
              No payment required · 100% Free · Direct from Mentor
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
