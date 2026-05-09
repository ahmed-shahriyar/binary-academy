import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FaqGroup = {
  title: string;
  items: { q: string; a: string }[];
};

const groups: FaqGroup[] = [
  {
    title: "ভর্তি ও কোর্স সম্পর্কে",
    items: [
      {
        q: "প্রশ্ন ১: এই কোর্সটা কাদের জন্য?",
        a: "এই কোর্সটা সম্পূর্ণভাবে SSC 2026 batch-এর জন্য তৈরি করা হয়েছে — যারা HSC-তে উঠবে এবং ICT-তে A+ পেতে চায়। আগে থেকে ICT সম্পর্কে কোনো জ্ঞান না থাকলেও সমস্যা নেই, একদম শুরু থেকে শেখানো হবে।",
      },
      {
        q: "প্রশ্ন ২: অনলাইন আর অফলাইন — দুটোর মধ্যে পার্থক্য কী?",
        a: "অফলাইন batch-এ সরাসরি ক্লাস হয় মেকারপাড়া, নেত্রকোণায়। সেখানে স্যারের সাথে সরাসরি কথা বলা যায়, হাতে-কলমে প্র্যাকটিস করা যায়। অনলাইন batch-এ YouTube Live এবং Facebook-এ ক্লাস হয়। দেশের যেকোনো জায়গা থেকে join করা যাবে। দুই batch-এর syllabus এবং মান একই — শুধু delivery method আলাদা।",
      },
      {
        q: "প্রশ্ন ৩: কোর্সে মোট কতগুলো chapter cover করা হবে?",
        a: "HSC ICT-এর সম্পূর্ণ ৬টি chapter cover করা হবে — Chapter 1: তথ্য ও যোগাযোগ প্রযুক্তি, Chapter 2: Communication System ও Networking, Chapter 3: Number System ও Logic Gates, Chapter 4: Web Design ও HTML, Chapter 5: C Programming, Chapter 6: Database Management। মোট ৫৪টি lecture — বোর্ড পরীক্ষার সম্পূর্ণ প্রস্তুতির জন্য।",
      },
      {
        q: "প্রশ্ন ৪: Free কোর্স আর Paid কোর্সের মধ্যে পার্থক্য কী?",
        a: "Free-তে পাবে Chapter 1-এর সম্পূর্ণ class, PDF notes, এবং MCQ practice sheet। এটা দিয়ে তুমি বুঝতে পারবে আমাদের teaching style কেমন। Paid কোর্সে পাবে বাকি সব ৫টি chapter, ৫০০+ MCQ bank, weekly ও monthly পরীক্ষা, exam analysis report, Auto SMS result, এবং সার্বক্ষণিক Q&A সাপোর্ট।",
      },
      {
        q: "প্রশ্ন ৫: কোর্সের মেয়াদ কতদিন?",
        a: "কোর্সটি Phase 0 থেকে Phase 4 পর্যন্ত চলবে — মে ২০২৬ থেকে HSC পরীক্ষার আগ পর্যন্ত। মোট প্রায় ৬-৭ মাস। HSC পরীক্ষার আগ পর্যন্ত সম্পূর্ণ সাপোর্ট দেওয়া হবে।",
      },
    ],
  },
  {
    title: "পড়াশোনা ও পদ্ধতি সম্পর্কে",
    items: [
      {
        q: "প্রশ্ন ৬: C Programming বা Logic Gates একদম বুঝি না — তাও কি পারবো?",
        a: "হ্যাঁ, অবশ্যই পারবে। এই কোর্সটা এমনভাবে design করা হয়েছে যেন যে student আগে কখনো programming দেখেনি সেও বুঝতে পারে। একদম শুরু থেকে, বাংলায়, ধীরে ধীরে শেখানো হবে। আমাদের আগের batch-এর অনেক student প্রথমে এই দুটো topic-কে ভয় পেত — HSC পরীক্ষায় তারাই সবচেয়ে ভালো করেছে।",
      },
      {
        q: "প্রশ্ন ৭: ক্লাস কি recorded থাকবে? Miss হলে কী করবো?",
        a: "অনলাইন batch-এর ক্লাস recorded থাকবে এবং পরে দেখা যাবে। অফলাইন batch-এর ক্লাসও গুরুত্বপূর্ণ অংশ record করা হবে। তবে live class-এ থাকলে সবচেয়ে বেশি সুবিধা পাবে — সরাসরি প্রশ্ন করার সুযোগ থাকে।",
      },
      {
        q: "প্রশ্ন ৮: Weekly test কি mandatory? না দিলে কী হবে?",
        a: "Weekly test mandatory নয়, তবে strongly recommended। এই test-গুলো বোর্ড প্রশ্নের pattern-এ তৈরি — এখানে ভালো করলে real exam-এ ভালো করার confidence আসে। প্রতিটি test-এর পর analysis report দেওয়া হয় যেখানে তোমার weak point ধরা পড়বে। Test না দিলে নিজের progress track করা কঠিন হয়ে যায়।",
      },
      {
        q: "প্রশ্ন ৯: Q&A সাপোর্ট কীভাবে পাবো? রাতে doubt হলে কী করবো?",
        a: "WhatsApp group এবং Facebook group — দুই জায়গায় সার্বক্ষণিক Q&A সাপোর্ট দেওয়া হয়। রাতে doubt হলে group-এ post করো — ২৪ ঘণ্টার মধ্যে উত্তর পাবে। জরুরি হলে সরাসরি WhatsApp-এও message করতে পারবে।",
      },
      {
        q: "প্রশ্ন ১০: Exam analysis report মানে কী? এটা কীভাবে কাজ করে?",
        a: "প্রতিটি weekly বা monthly পরীক্ষার পর তোমাকে একটি detailed report দেওয়া হবে যেখানে থাকবে — কোন chapter-এ কত পেয়েছ, কোথায় ভুল হয়েছে এবং কেন হয়েছে, এবং পরের বার কোথায় focus করতে হবে। এই report দেখে তুমি নিজেই বুঝতে পারবে কোথায় আরো সময় দিতে হবে।",
      },
    ],
  },
  {
    title: "ফি ও পেমেন্ট সম্পর্কে",
    items: [
      {
        q: "প্রশ্ন ১১: কোর্স ফি কত?",
        a: "অনলাইন কোর্স: মাত্র ৳১,৯৯৯। অফলাইন কোর্স (মেকারপাড়া, নেত্রকোণা): ৳৩,৯৯৯। Early Bird offer: July ১৫ তারিখের মধ্যে ভর্তি হলে ৩০% ছাড় পাবে। এই ফি-তে কোর্সের শুরু থেকে HSC পরীক্ষার আগ পর্যন্ত সম্পূর্ণ সাপোর্ট পাবে।",
      },
      {
        q: "প্রশ্ন ১২: একসাথে পুরো টাকা দিতে হবে?",
        a: "না। কিস্তিতে পেমেন্টের সুবিধা আছে। ভর্তির সময় অর্ধেক এবং বাকি অর্ধেক পরের মাসে দেওয়া যাবে। বিস্তারিত জানতে সরাসরি WhatsApp-এ যোগাযোগ করো।",
      },
      {
        q: "প্রশ্ন ১৩: কোন কোন মাধ্যমে পেমেন্ট করা যাবে?",
        a: "bKash, Nagad, Rocket — যেকোনো মাধ্যমে পেমেন্ট করা যাবে। অফলাইন batch-এর জন্য সরাসরি ক্যাশও দেওয়া যাবে।",
      },
      {
        q: "প্রশ্ন ১৪: ভর্তি হওয়ার পর যদি মনে না হয় — টাকা ফেরত পাবো?",
        a: "Free Chapter 1 দেখার পর তুমি নিজেই বুঝতে পারবে কোর্সটা তোমার জন্য কিনা — তারপর paid-এ ভর্তি হও। তাই refund-এর প্রয়োজন সাধারণত হয় না। তবে ভর্তির ৭ দিনের মধ্যে কোনো class না করে থাকলে সেক্ষেত্রে যোগাযোগ করো — আমরা বিবেচনা করবো।",
      },
    ],
  },
  {
    title: "Result ও ভবিষ্যৎ সম্পর্কে",
    items: [
      {
        q: "প্রশ্ন ১৫: আগের batch-এর result কেমন ছিল?",
        a: "আমাদের আগের সব batch ছিল অফলাইন। HSC 2023, 2024 এবং 2025 batch-এর বেশিরভাগ student ICT-তে A+ পেয়েছে — এমনকি যে বছরগুলোতে board প্রশ্ন তুলনামূলক কঠিন ছিল সেই বছরেও। এটা সম্ভব হয়েছে কারণ আমরা মুখস্থ না, concept বুঝিয়ে শেখাই।",
      },
      {
        q: "প্রশ্ন ১৬: শুধু A+ না পেলেও কি কোর্সটা কাজে আসবে?",
        a: "অবশ্যই। ICT শুধু HSC exam-এর জন্য না — university-তে CSE, EEE বা IT নিয়ে পড়তে গেলে এই concept-গুলো সরাসরি কাজে লাগবে। C programming, database, networking — এগুলো real-world skill। তুমি যদি সত্যিকার অর্থে বুঝে শেখো, এটা তোমার পুরো career-এ কাজে লাগবে।",
      },
      {
        q: "প্রশ্ন ১৭: এই কোর্স করলে কি HSC admission-এও সাহায্য হবে?",
        a: "হ্যাঁ। Phase 4-এ আলাদাভাবে admission preparation module আছে। HSC admission-এর ICT অংশের জন্য আলাদা class এবং practice করানো হবে।",
      },
      {
        q: "প্রশ্ন ১৮: AI session মানে কী? এটা কি HSC syllabus-এর বাইরে?",
        a: "হ্যাঁ, এটা syllabus-এর বাইরে — কিন্তু তোমার পড়াশোনার জন্য অনেক কাজের। এই session-এ শেখানো হবে ChatGPT, Gemini এবং অন্যান্য AI tool ব্যবহার করে কীভাবে study faster করা যায়, notes তৈরি করা যায়, এবং practice করা যায়। এটা সম্পূর্ণ বিনামূল্যে — সব enrolled student পাবে।",
      },
    ],
  },
  {
    title: "যোগাযোগ ও অন্যান্য",
    items: [
      {
        q: "প্রশ্ন ১৯: ভর্তি হতে চাইলে কী করতে হবে?",
        a: "মাত্র ২টি step — Step 1: QR code scan করো অথবা উপরের 'Enroll Now' button-এ ক্লিক করো। Step 2: Form fill করো — নাম, নম্বর, এবং online বা offline preference দাও। এরপর আমরা WhatsApp-এ যোগাযোগ করবো এবং বাকি প্রক্রিয়া জানিয়ে দেবো।",
      },
      {
        q: "প্রশ্ন ২০: আমার অভিভাবক কি কোর্স সম্পর্কে জানতে চান?",
        a: "অবশ্যই। অভিভাবকদের জন্য আলাদা meeting-এর ব্যবস্থা আছে। এছাড়া প্রতিটি পরীক্ষার result Auto SMS-এর মাধ্যমে সরাসরি তোমার অভিভাবকের কাছে পাঠানো হবে — তারা সবসময় তোমার progress জানতে পারবেন।",
      },
      {
        q: "প্রশ্ন ২১: আরো কোনো প্রশ্ন থাকলে কোথায় যোগাযোগ করবো?",
        a: "WhatsApp: 01580611996। Facebook Page: fb.com/BinaryAcademyBD। Facebook Group: 'HSC ICT — SSC 26 Batch Official'। যেকোনো প্রশ্ন, যেকোনো সময় — আমরা আছি।",
      },
    ],
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">FAQ</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold">
            Common <span className="text-gradient-cyber">Questions</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground font-mono">
            Binary Academy — HSC ICT Course — SSC 2026 Batch
          </p>
        </div>

        <div className="space-y-8">
          {groups.map((group, gi) => (
            <div key={gi}>
              <h2 className="mb-4 text-lg md:text-xl font-bold font-mono text-[var(--cyber-amber)] tracking-wide">
                {group.title}
              </h2>
              <Accordion
                type="single"
                collapsible
                className="rounded-2xl bg-card/60 backdrop-blur border border-[var(--cyber-cyan)]/20 px-5"
              >
                {group.items.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`g${gi}-item-${i}`}
                    className="border-b border-[var(--cyber-cyan)]/10 last:border-b-0"
                  >
                    <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          <p className="text-center text-sm font-mono text-[var(--cyber-cyan)] pt-4">
            Binary Academy — শিক্ষা যেখানে আনন্দ, সাফল্য যেখানে লক্ষ্য।
          </p>
        </div>
      </div>
    </section>
  );
}
