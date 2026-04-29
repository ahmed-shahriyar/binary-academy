import { BookOpen, ClipboardCheck, MonitorPlay, Brain, Users, FileText } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Standard Lecture Sheets", desc: "মানসম্মত লেকচার শীট প্রতি ক্লাসে — বোর্ড সিলেবাস অনুযায়ী।" },
  { icon: ClipboardCheck, title: "Weekly Exams", desc: "সাপ্তাহিক ও মাসিক পরীক্ষা — তোমার প্রস্তুতির real-time analysis।" },
  { icon: MonitorPlay, title: "Digital Classroom", desc: "ডিজিটাল ক্লাসরুম + Live Q&A সেশন প্রতি সপ্তাহে।" },
  { icon: Brain, title: "Bonus AI Session (FREE)", desc: "সব student-এর জন্য AI in Education special bonus session।" },
  { icon: Users, title: "Experienced Mentors", desc: "অভিজ্ঞ শিক্ষক মণ্ডলী — board examiner ও CQ specialist।" },
  { icon: FileText, title: "Board MCQ Bank", desc: "Board MCQ 2016–2025 PDF + Logic Gates PDF Notes।" },
];

export function Features() {
  return (
    <section className="relative py-20 md:py-28 px-4 cyber-grid-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-[var(--cyber-green)] tracking-widest">SECTION 03</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">
            কেন <span className="text-gradient-cyber">Binary Academy</span>?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-xl border border-border bg-card/60 backdrop-blur p-6 hover:border-[var(--cyber-cyan)] transition-all hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--cyber-cyan)]/10 border border-[var(--cyber-cyan)]/30 text-[var(--cyber-cyan)] group-hover:animate-pulse-glow">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold font-mono">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
