import { useEffect, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Rocket, Tag, ArrowLeft, ArrowRight, User, Phone, GraduationCap, Check, MapPin, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLead, setLead, clearLead, type Lead } from "@/lib/leadStore";

const BATCHES = ["Online Pro", "Offline FLEX", "Offline Hybrid"] as const;
type Batch = (typeof BATCHES)[number];

const leadSchema = z.object({
  full_name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে").max(100),
  ssc_roll: z.string().trim().min(1, "SSC Roll/Year প্রয়োজন").max(50),
  school_name: z.string().trim().min(2, "School name প্রয়োজন").max(150),
  mobile_number: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,20}$/, "সঠিক মোবাইল নম্বর দিন"),
  batch: z.enum(BATCHES, { errorMap: () => ({ message: "একটি ব্যাচ নির্বাচন করুন" }) }),
  discount_code: z.string().trim().max(40).optional().or(z.literal("")),
});

interface Props {
  trigger?: React.ReactNode;
  defaultBatch?: Batch;
}

const BATCH_INFO: Record<Batch, { price: string; tag: string; discount: boolean; subtitle: string }> = {
  "Online Pro": { price: "৳2,449", tag: "Most Popular", discount: true, subtitle: "Live online classes + recordings" },
  "Offline Hybrid": { price: "৳3,989", tag: "Best Value", discount: true, subtitle: "Offline + online combo (Mukterpara)" },
  "Offline FLEX": { price: "৳6,000", tag: "৳1,000/mo", discount: false, subtitle: "Pay monthly, in-person at Netrokona" },
};

export function EnrollDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [returningLead, setReturningLead] = useState<Lead | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    mobile_number: "",
    ssc_roll: "",
    school_name: "",
    batch: "" as Batch | "",
    discount_code: "",
  });

  // Hydrate from lead store every time the dialog opens
  useEffect(() => {
    if (!open) return;
    const lead = getLead();
    setReturningLead(lead);
    setForm((f) => ({
      ...f,
      full_name: lead?.full_name ?? "",
      mobile_number: lead?.mobile_number ?? "",
      batch: "",
    }));
    // Skip Step 1 if we already have name + mobile from the gift claim
    setStep(lead?.full_name && lead?.mobile_number ? 2 : 1);
    setDirection("next");
  }, [open]);

  useEffect(() => {
    const onApplyDiscount = (e: Event) => {
      const code = (e as CustomEvent<{ code: string }>).detail?.code ?? "";
      setForm((f) => ({ ...f, discount_code: code }));
    };
    // Only the trigger-less "global" instance responds to the open-enroll event,
    // so we don't accidentally open every mounted EnrollDialog at once.
    const onOpen = () => setOpen(true);
    window.addEventListener("binary:apply-discount", onApplyDiscount);
    if (!trigger) window.addEventListener("binary:open-enroll", onOpen);
    return () => {
      window.removeEventListener("binary:apply-discount", onApplyDiscount);
      if (!trigger) window.removeEventListener("binary:open-enroll", onOpen);
    };
  }, [trigger]);

  const goNext = () => {
    if (step === 1) {
      if (form.full_name.trim().length < 2) return toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      if (!/^[0-9+\-\s]{7,20}$/.test(form.mobile_number.trim())) return toast.error("সঠিক মোবাইল নম্বর দিন");
    }
    if (step === 2) {
      if (form.ssc_roll.trim().length < 1) return toast.error("SSC Roll/Year প্রয়োজন");
      if (form.school_name.trim().length < 2) return toast.error("School name প্রয়োজন");
    }
    setDirection("next");
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => {
    setDirection("back");
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);

    const enrollmentPayload = {
      name: parsed.data.full_name,
      ssc_roll: parsed.data.ssc_roll,
      school: parsed.data.school_name,
      mobile: parsed.data.mobile_number,
      batch: parsed.data.batch,
      tier: parsed.data.batch,
      status: "New",
      notes: parsed.data.discount_code ? `Discount: ${parsed.data.discount_code}` : null,
    };

    const legacyPayload = { ...parsed.data, discount_code: parsed.data.discount_code || null };

    // Always log to legacy `leads` table (admin still references it)
    const legacyPromise = supabase.from("leads").insert(legacyPayload);

    // Upgrade existing partial enrollment if we have one, else insert fresh.
    const enrollmentPromise = returningLead?.enrollmentId
      ? (supabase.from("enrollments" as never) as any)
          .update(enrollmentPayload)
          .eq("id", returningLead.enrollmentId)
      : (supabase.from("enrollments" as never) as any).insert(enrollmentPayload);

    const [legacy, modern] = await Promise.all([legacyPromise, enrollmentPromise]);
    const error = (legacy as any).error ?? (modern as any).error;
    setLoading(false);
    if (error) {
      toast.error("সাবমিট করা যায়নি, আবার চেষ্টা করুন।");
      return;
    }
    toast.success("🎉 Enrollment received! আমরা WhatsApp-এ যোগাযোগ করব।");
    clearLead();
    setReturningLead(null);
    setForm({ full_name: "", mobile_number: "", ssc_roll: "", school_name: "", batch: "", discount_code: "" });
    setStep(1);
    setOpen(false);
  };

  // Persist Name + Mobile back to the lead store as soon as Step 1 is filled,
  // so even if the user closes the dialog after Step 1, the next open prefills.
  useEffect(() => {
    if (!open) return;
    if (step >= 2 && form.full_name.trim().length >= 2 && /^[0-9+\-\s]{7,20}$/.test(form.mobile_number.trim())) {
      setLead({ full_name: form.full_name, mobile_number: form.mobile_number });
    }
  }, [step, open, form.full_name, form.mobile_number]);

  const progress = (step / 3) * 100;
  const slideClass = direction === "next" ? "animate-[wizard-slide-in-right_0.35s_ease-out]" : "animate-[wizard-slide-in-left_0.35s_ease-out]";
  const firstName = (returningLead?.full_name ?? form.full_name).trim().split(" ")[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className="border-glow-cyan max-w-md max-h-[92vh] overflow-y-auto rounded-xl ring-1 ring-[var(--cyber-cyan)]/25 backdrop-blur-md"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, color-mix(in oklab, var(--cyber-cyan) 10%, transparent) 0%, transparent 60%), linear-gradient(to bottom, color-mix(in oklab, var(--card) 96%, white 4%), var(--background))",
          boxShadow:
            "0 25px 60px -20px rgba(0,0,0,0.85), 0 0 40px -10px var(--cyber-cyan)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient-cyber flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[var(--cyber-cyan)]" /> Enroll — SSC '26 Batch
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Mukterpara, Netrokona — seat confirm করতে WhatsApp-এ যোগাযোগ করব।
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[var(--cyber-cyan)]">STEP {step} OF 3</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "h-6 w-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all",
                    n < step && "bg-[var(--cyber-green)] border-[var(--cyber-green)] text-black",
                    n === step && "border-[var(--cyber-cyan)] text-[var(--cyber-cyan)] shadow-[0_0_12px_var(--cyber-cyan)]",
                    n > step && "border-border text-muted-foreground",
                  )}
                >
                  {n < step ? <Check className="h-3 w-3" /> : n}
                </div>
              ))}
            </div>
          </div>
          <div className="h-1.5 w-full bg-input rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 12px var(--cyber-cyan), 0 0 24px var(--cyber-cyan)",
              }}
            />
          </div>
        </div>

        <form onSubmit={submit} className="mt-4 overflow-hidden">
          <div key={step} className={slideClass}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--cyber-cyan)] uppercase">
                  <User className="h-3.5 w-3.5" /> Personal Info
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    autoFocus
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="তোমার পুরো নাম"
                    className="h-12 bg-input border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    inputMode="tel"
                    value={form.mobile_number}
                    onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="h-12 bg-input border-border focus:border-primary"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {returningLead?.full_name && (
                  <div className="rounded-md border border-[var(--cyber-green)]/40 bg-[var(--cyber-green)]/10 px-3 py-2.5 text-xs">
                    <p className="flex items-center gap-1.5 font-semibold text-[var(--cyber-green)]">
                      <Sparkles className="h-3.5 w-3.5" /> Welcome back, {firstName}!
                    </p>
                    <p className="text-muted-foreground mt-0.5">
                      Just a few more details to secure your SSC '26 spot.
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs font-mono text-[var(--cyber-cyan)] uppercase">
                  <GraduationCap className="h-3.5 w-3.5" /> Academic Info
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roll">SSC Roll / Year</Label>
                  <Input
                    id="roll"
                    autoFocus
                    type="tel"
                    inputMode="numeric"
                    value={form.ssc_roll}
                    onChange={(e) => setForm({ ...form, ssc_roll: e.target.value })}
                    placeholder="123456 / 2026"
                    className="h-12 bg-input border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School / College</Label>
                  <Input
                    id="school"
                    value={form.school_name}
                    onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                    placeholder="তোমার school বা college"
                    className="h-12 bg-input border-border focus:border-primary"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--cyber-cyan)] uppercase flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5" /> Select Your Batch
                  </span>
                  <span className="text-[var(--cyber-amber)] flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Mukterpara, Netrokona
                  </span>
                </div>

                {!form.batch && (
                  <p className="rounded-md border border-[var(--cyber-amber)]/35 bg-[var(--cyber-amber)]/10 px-3 py-2 text-xs font-mono text-[var(--cyber-amber)]">
                    No batch selected yet — choose one below.
                  </p>
                )}

                <div className="space-y-2.5">
                  {BATCHES.map((b) => {
                    const info = BATCH_INFO[b];
                    const selected = form.batch === b;
                    return (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setForm({ ...form, batch: b })}
                        aria-pressed={selected}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border-2 transition-all relative overflow-hidden focus:outline-none focus-visible:outline-none focus-visible:ring-0",
                          selected
                            ? "border-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/5 shadow-[0_0_16px_var(--cyber-cyan)]"
                            : "border-border/60 bg-input/60 hover:border-[var(--cyber-cyan)]/50",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{b}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--cyber-amber)]/20 text-[var(--cyber-amber)]">
                                {info.tag}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{info.subtitle}</p>
                            {info.discount && (
                              <p className="text-[11px] font-mono text-[var(--cyber-green)] mt-1 flex items-center gap-1">
                                <Tag className="h-3 w-3" /> ৳1,000 OFF — first 10 students
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-[var(--cyber-cyan)] font-bold font-mono">{info.price}</div>
                            {selected && <Check className="h-4 w-4 text-[var(--cyber-green)] ml-auto mt-1" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-1">
                  <Label htmlFor="discount" className="flex items-center gap-1.5 text-xs">
                    <Tag className="h-3 w-3 text-[var(--cyber-amber)]" />
                    Discount Code <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="discount"
                    value={form.discount_code}
                    onChange={(e) => setForm({ ...form, discount_code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BINARY1000"
                    className={cn(
                      "h-10 bg-input border-border focus:border-primary font-mono tracking-wider text-sm",
                      form.discount_code === "BINARY1000" && "border-[var(--cyber-amber)] text-[var(--cyber-amber)]",
                    )}
                  />
                  {form.discount_code === "BINARY1000" && (
                    <p className="text-xs text-[var(--cyber-amber)] font-mono">✓ ৳1,000 OFF applied</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-2 mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="h-12 flex-1 border-[var(--cyber-cyan)]/40 hover:border-[var(--cyber-cyan)] hover:bg-[var(--cyber-cyan)]/10"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={goNext}
                className="h-12 flex-1 bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] text-black font-bold hover:opacity-90"
              >
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || !form.batch}
                className="h-12 flex-1 bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] text-black font-bold hover:opacity-90 animate-pulse-glow disabled:opacity-50 disabled:animate-none"
                style={!form.batch ? { background: "var(--input)", color: "var(--muted-foreground)", border: "1px solid var(--border)" } : undefined}
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Rocket className="mr-2 h-4 w-4" /> {form.batch ? "Confirm Enrollment" : "Select a Batch"}</>}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
