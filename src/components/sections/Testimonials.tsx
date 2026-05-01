import { Quote, Star } from "lucide-react";

const items = [
  {
    name: "Raisa Akter",
    result: "GPA 5.00",
    quote: "I was scared of C-Programming. Binary Academy made it feel like a game. Got A+.",
    accent: "var(--cyber-cyan)",
  },
  {
    name: "Tariq Hasan",
    result: "Full Marks MCQ",
    quote: "Sir explains everything in Bangla, step by step. No confusion left.",
    accent: "var(--cyber-green)",
  },
  {
    name: "Nusrat Jahan",
    result: "A+ in ICT",
    quote: "The PDF notes are gold. Revised the night before and nailed it.",
    accent: "var(--cyber-amber)",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">SECTION 06 · STUDENTS</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">
            Real Students. <span className="text-gradient-cyber">Real Results.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div
              key={t.name}
              className="relative rounded-2xl p-7 backdrop-blur-xl bg-white/[0.03] border border-white/10 transition-transform hover:-translate-y-1"
              style={{ boxShadow: `0 0 30px ${t.accent}33, inset 0 0 20px rgba(255,255,255,0.02)` }}
            >
              <Quote className="h-7 w-7 mb-3" style={{ color: t.accent }} />
              <p className="text-sm md:text-base leading-relaxed text-foreground/90">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs font-mono" style={{ color: t.accent }}>{t.result}</div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[var(--cyber-amber)] text-[var(--cyber-amber)]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
