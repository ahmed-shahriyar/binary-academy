import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, FileText, PlayCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabaseExternal as supabase } from "@/integrations/supabase/external-client";
import { GiftSentDialog } from "@/components/GiftSentDialog";

const schema = z.object({
  full_name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে").max(100),
  whatsapp_number: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,20}$/, "সঠিক WhatsApp নম্বর দিন"),
});

export function GiftClaim() {
  const [form, setForm] = useState({ full_name: "", whatsapp_number: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("gift_claims").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("সাবমিট করা যায়নি, আবার চেষ্টা করুন।");
      return;
    }
    setForm({ full_name: "", whatsapp_number: "" });
    setShowSuccess(true);
  };

  return (
    <section id="gift-claim" className="relative py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--cyber-green)]/5 to-transparent pointer-events-none" />

      <div className="relative max-w-[620px] mx-auto">
        <div
          className="rounded-2xl border-2 border-[var(--cyber-green)] bg-card/80 backdrop-blur p-6 md:p-8"
          style={{ boxShadow: "0 0 40px oklch(0.86 0.24 142 / 0.25), inset 0 0 30px oklch(0.86 0.24 142 / 0.05)" }}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cyber-green)]/40 bg-[var(--cyber-green)]/10 text-[10px] font-mono text-[var(--cyber-green)] uppercase tracking-wider">
              <Gift className="h-3 w-3" /> Free · No Payment Required
            </div>
            <h2 className="mt-4 text-2xl md:text-3xl font-bold">
              <span className="text-[var(--cyber-green)]">🎁 Claim Your Free Gifts</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Leaflet-এ promised — Name & WhatsApp দিলেই instant delivery।
            </p>
          </div>

          {/* What you get */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-start gap-2 rounded-lg border border-border bg-background/40 p-3">
              <FileText className="h-4 w-4 text-[var(--cyber-green)] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-foreground">Logic Gates PDF</div>
                <div className="text-[10px] text-muted-foreground">Chapter 3 cheat sheet</div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-border bg-background/40 p-3">
              <PlayCircle className="h-4 w-4 text-[var(--cyber-green)] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-foreground">Free Demo Class</div>
                <div className="text-[10px] text-muted-foreground">Live link via WhatsApp</div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gift-name">Your Name</Label>
              <Input
                id="gift-name"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="তোমার পুরো নাম"
                className="h-12 bg-input border-border focus:border-[var(--cyber-green)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gift-wa">WhatsApp Number</Label>
              <Input
                id="gift-wa"
                type="tel"
                inputMode="tel"
                required
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="h-12 bg-input border-border focus:border-[var(--cyber-green)]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-base font-bold bg-[var(--cyber-green)] text-black hover:bg-[var(--cyber-green)]/90 animate-pulse-glow"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Gift className="mr-2 h-5 w-5" /> Send My Gifts
                </>
              )}
            </Button>

            <p className="text-center text-[10px] text-muted-foreground font-mono">
              No spam · Gifts delivered to WhatsApp within 2 minutes
            </p>
          </form>
        </div>
      </div>

      <GiftSentDialog open={showSuccess} onOpenChange={setShowSuccess} />
    </section>
  );
}
