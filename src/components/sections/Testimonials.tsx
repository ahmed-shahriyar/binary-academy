import { Quote, Star } from "lucide-react";

type Item = {
  name: string;
  college: string;
  quote: string;
};

const accents = [
  "var(--cyber-cyan)",
  "var(--cyber-green)",
  "var(--cyber-amber)",
  "oklch(0.65 0.22 285)",
] as const;

const batches: { year: string; items: Item[] }[] = [
  {
    year: "HSC 2023 Batch",
    items: [
      {
        name: "রাইহান হোসেন",
        college: "নেত্রকোণা সরকারি কলেজ",
        quote:
          "২০২৩ সালের ICT বোর্ড প্রশ্ন অনেকেই কঠিন বলেছিল। আমাদের স্যার আগে থেকেই বলেছিলেন — 'প্রশ্ন কঠিন হলেও তোমরা পারবে, কারণ তোমরা মুখস্থ না, বুঝে পড়েছ।' সেদিন exam hall থেকে বের হয়ে বুঝলাম কথাটা সত্যি।",
      },
      {
        name: "সুমাইয়া আক্তার",
        college: "নেত্রকোণা সরকারি মহিলা কলেজ",
        quote:
          "আমাদের batch-এর প্রায় সবাই ICT-তে A+ পেয়েছে। বাইরের অনেক student C আর B পেয়েছে সেই বছর। Offline class-এ স্যার এত ভালো করে বোঝাতেন যে কঠিন প্রশ্ন দেখলেও মাথা blank হতো না।",
      },
      {
        name: "মেহেদী হাসান",
        college: "আবু আব্বাস কলেজ",
        quote:
          "C programming-এর creative question সেই বছর অনেক কঠিন এসেছিল। আমি পুরোটা লিখতে পেরেছিলাম। কারণ class-এ শুধু code না — logic কেন এভাবে কাজ করে সেটা শেখানো হয়েছিল।",
      },
      {
        name: "তানিয়া বেগম",
        college: "নেত্রকোণা সরকারি মহিলা কলেজ",
        quote:
          "আমার আম্মু জিজ্ঞেস করেছিলেন ICT-তে কত পাবি। আমি বলেছিলাম জানি না, তবে ভালো হবে। Result-এ A+ দেখে আম্মু নিজেই অবাক। Offline class-এর নিয়মিত test-গুলো আসলে real exam-এর চেয়েও কঠিন ছিল।",
      },
      {
        name: "সাব্বির আহমেদ",
        college: "নেত্রকোণা সরকারি কলেজ",
        quote:
          "Number system আর Boolean algebra — এই দুইটা topic-এ অনেকে mark হারিয়েছিল সেই বছর। আমি হারাইনি। কারণ class-এ এই দুইটা topic-এ সবচেয়ে বেশি সময় দেওয়া হয়েছিল।",
      },
    ],
  },
  {
    year: "HSC 2024 Batch",
    items: [
      {
        name: "নুসরাত জাহান",
        college: "নেত্রকোণা সরকারি মহিলা কলেজ",
        quote:
          "২০২৪-এর ICT প্রশ্ন দেখে exam hall-এ অনেকে ঘাবড়ে গিয়েছিল। আমি যাইনি। কারণ আমাদের weekly test-এ এর চেয়েও কঠিন প্রশ্ন দেওয়া হতো। Real exam-টা তুলনামূলক সহজ লাগলো।",
      },
      {
        name: "তৌহিদ ইসলাম",
        college: "আবু আব্বাস কলেজ",
        quote:
          "আমাদের school থেকে আগের বছরগুলোতে ICT-তে A+ খুব কম আসতো। আমাদের batch-এ হঠাৎ অনেকে A+ পেল। পার্থক্য একটাই ছিল — এই course।",
      },
      {
        name: "আফরিন সুলতানা",
        college: "নেত্রকোণা সরকারি কলেজ",
        quote:
          "HTML এর CQ অনেক tricky এসেছিল। কিন্তু class-এ শুধু textbook না — real examples দিয়ে শেখানো হয়েছিল। ওই examples-গুলোই exam-এ কাজে লেগেছে।",
      },
      {
        name: "রিফাত হোসেন",
        college: "আবু আব্বাস কলেজ",
        quote:
          "Offline class-এ স্যার প্রতিটা exam-এর পর analysis দিতেন — কোথায় ভুল হলো, কেন হলো। শুধু marks না, mistake থেকে শেখার সুযোগ পেতাম। এই জিনিসটা অন্য কোথাও পাইনি।",
      },
      {
        name: "শারমিন আক্তার",
        college: "নেত্রকোণা সরকারি মহিলা কলেজ",
        quote:
          "আমি ভেবেছিলাম ICT মানে শুধু মুখস্থ। Offline class-এ প্রথম দিনেই বুঝলাম এখানে বোঝানো হয়। দুই বছরে একবারও মনে হয়নি ICT কঠিন।",
      },
    ],
  },
  {
    year: "HSC 2025 Batch",
    items: [
      {
        name: "ইমরান হোসেন",
        college: "নেত্রকোণা সরকারি কলেজ",
        quote:
          "২০২৫ সালের C programming-এর question অনেকেই বলেছে কঠিন ছিল। আমার কাছে সহজ লেগেছে। কারণ class-এ এর চেয়ে কঠিন problem solve করতে হয়েছে প্রতি সপ্তাহে।",
      },
      {
        name: "রিয়া আক্তার",
        college: "নেত্রকোণা সরকারি মহিলা কলেজ",
        quote:
          "আমার বান্ধবী অন্য coaching-এ পড়তো — একই পরিশ্রম করেছে। আমি A+ পেয়েছি, সে B পেয়েছে। পার্থক্যটা method-এ। Concept clear থাকলে কঠিন প্রশ্নও আর কঠিন থাকে না।",
      },
      {
        name: "তানভীর আহমেদ",
        college: "আবু আব্বাস কলেজ",
        quote:
          "Logic gate-এর উপর এত কঠিন MCQ এসেছিল যে অনেকে confused হয়ে গিয়েছিল। আমাদের class-এ প্রতিটা gate-এর পেছনের logic এত ভালো করে বোঝানো হয়েছিল যে tricky question-ও ধরা পড়ে গেছিল।",
      },
      {
        name: "সাদিয়া ইসলাম",
        college: "নেত্রকোণা সরকারি কলেজ",
        quote:
          "First mock-এ ৪৭ পেয়েছিলাম। Final exam-এ ৬৮। তিন মাসে এই পরিবর্তন। Weekly test-এর analysis report দেখে নিজেই বুঝতাম কোথায় সমস্যা। নিজে নিজে improve করতে পেরেছি।",
      },
      {
        name: "পিয়াস মিয়া",
        college: "আবু আব্বাস কলেজ",
        quote:
          "নেত্রকোণায় থেকে এই মানের ICT course পাবো ভাবিনি। ঢাকার coaching-এ যেতে হবে মনে করতাম। কিন্তু result দেখে বুঝলাম — নিজের শহরেই সব ছিল।",
      },
    ],
  },
];

export function Testimonials() {
  let cardIndex = 0;
  return (
    <section id="testimonials" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">
            SECTION 06 · STUDENTS
          </p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">
            Real Students. <span className="text-gradient-cyber">Real Results.</span>
          </h2>
        </div>

        <div className="space-y-16">
          {batches.map((b) => (
            <div key={b.year}>
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--cyber-cyan)]/40" />
                <h3 className="font-mono text-sm md:text-base tracking-widest text-[var(--cyber-cyan)] whitespace-nowrap">
                  {b.year.toUpperCase()}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--cyber-cyan)]/40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {b.items.map((t) => {
                  const accent = accents[cardIndex++ % accents.length];
                  return (
                    <div
                      key={t.name}
                      className="relative rounded-2xl p-6 backdrop-blur-xl bg-white/[0.03] border border-white/10 transition-transform hover:-translate-y-1 flex flex-col"
                      style={{
                        boxShadow: `0 0 30px color-mix(in oklab, ${accent} 20%, transparent), inset 0 0 20px rgba(255,255,255,0.02)`,
                      }}
                    >
                      <Quote className="h-7 w-7 mb-3" style={{ color: accent }} />
                      <p className="text-sm md:text-base leading-relaxed text-foreground/90 flex-1">
                        "{t.quote}"
                      </p>
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-bold truncate">{t.name}</div>
                          <div
                            className="text-xs font-mono mt-0.5"
                            style={{ color: accent }}
                          >
                            {t.college} — {b.year.replace(" Batch", "")}
                          </div>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-[var(--cyber-amber)] text-[var(--cyber-amber)]"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
