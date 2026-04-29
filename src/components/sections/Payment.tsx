import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";

const BKASH_NUMBER = "01580611996";

export function Payment() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      toast.success("bKash নাম্বার কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy ব্যর্থ — manually copy করো");
    }
  };

  return (
    <section className="relative py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="rounded-2xl border-glow-amber bg-card/70 backdrop-blur p-7 md:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--cyber-amber)]/15 border border-[var(--cyber-amber)]/40 text-[var(--cyber-amber)]">
            <Smartphone className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-2xl md:text-3xl font-bold font-mono">
            Pay with <span className="text-[var(--cyber-amber)]">bKash</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Send Money / Personal — তারপর form পূরণ করো</p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-background border border-border px-5 py-4">
            <span className="font-mono text-2xl md:text-3xl tracking-wider text-[var(--cyber-amber)]">
              {BKASH_NUMBER}
            </span>
          </div>

          <div className="mt-5">
            <Button
              onClick={copy}
              size="lg"
              className="h-12 px-6 bg-[var(--cyber-amber)] text-black font-bold hover:opacity-90"
            >
              {copied ? <><Check className="mr-2 h-4 w-4" /> Copied!</> : <><Copy className="mr-2 h-4 w-4" /> Copy Number</>}
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Payment-এর পর Transaction ID সহ WhatsApp করো — আমরা তোমাকে enroll করিয়ে দিব।
          </p>
        </div>
      </div>
    </section>
  );
}
