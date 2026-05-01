import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I pay?",
    a: "Send your fee via bKash to 01580611996 (Personal). Use your full name as the reference, then share the Transaction ID with us on WhatsApp to confirm enrollment.",
  },
  {
    q: "Where is the offline branch?",
    a: "Our offline classroom is in Gateupa, Delina, Madaripur. Direct classes, printed sheets, and one-on-one mentorship happen on-site.",
  },
  {
    q: "Is there a demo class?",
    a: "Yes! Click the 'Claim Free Gift & Enroll' button above and we'll arrange a free demo class on WhatsApp so you can experience the teaching style first.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-[var(--cyber-cyan)] tracking-widest">SECTION 08 · FAQ</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold">
            Common <span className="text-gradient-cyber">Questions</span>
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="rounded-2xl bg-card/60 backdrop-blur border border-[var(--cyber-cyan)]/20 px-5"
        >
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-[var(--cyber-cyan)]/10 last:border-b-0">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
