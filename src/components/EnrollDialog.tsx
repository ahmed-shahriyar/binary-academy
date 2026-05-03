import { useEffect, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Rocket, Tag } from "lucide-react";

const BATCHES = ["Online", "Offline", "Complete"] as const;
type Batch = (typeof BATCHES)[number];

const leadSchema = z.object({
  full_name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে").max(100),
  ssc_roll: z.string().trim().min(1, "SSC Roll/Year প্রয়োজন").max(50),
  school_name: z.string().trim().min(2, "School name প্রয়োজন").max(150),
  mobile_number: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,20}$/, "সঠিক মোবাইল নম্বর দিন"),
  batch: z.enum(BATCHES),
  discount_code: z.string().trim().max(40).optional().or(z.literal("")),
});

interface Props {
  trigger?: React.ReactNode;
  defaultBatch?: Batch;
}

export function EnrollDialog({ trigger, defaultBatch = "Online" }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    ssc_roll: "",
    school_name: "",
    mobile_number: "",
    batch: defaultBatch as Batch,
    discount_code: "",
  });

  useEffect(() => {
    if (open) setForm((f) => ({ ...f, batch: defaultBatch }));
  }, [open, defaultBatch]);

  // Listen for global events from the urgency popup
  useEffect(() => {
    const onApplyDiscount = (e: Event) => {
      const code = (e as CustomEvent<{ code: string }>).detail?.code ?? "";
      setForm((f) => ({ ...f, discount_code: code }));
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("binary:apply-discount", onApplyDiscount);
    window.addEventListener("binary:open-enroll", onOpen);
    return () => {
      window.removeEventListener("binary:apply-discount", onApplyDiscount);
      window.removeEventListener("binary:open-enroll", onOpen);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const payload = {
      ...parsed.data,
      discount_code: parsed.data.discount_code || null,
    };
    const { error } = await supabase.from("leads").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("সাবমিট করা যায়নি, আবার চেষ্টা করুন।");
      return;
    }
    toast.success("🎉 Enrollment received! আমরা WhatsApp-এ যোগাযোগ করব।");
    setForm({ full_name: "", ssc_roll: "", school_name: "", mobile_number: "", batch: defaultBatch, discount_code: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="bg-card border-glow-cyan max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient-cyber flex items-center gap-2">
            <Rocket className="h-5 w-5 text-[var(--cyber-cyan)]" /> Enroll — SSC '26 Batch
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            নিচের তথ্য পূরণ করো — seat confirm করতে আমরা WhatsApp-এ যোগাযোগ করব। Payment instructions popup-এর পর দেখানো হবে।
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="তোমার পুরো নাম"
              className="h-12 bg-input border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roll">SSC Roll / Year</Label>
            <Input
              id="roll"
              type="tel"
              inputMode="numeric"
              required
              value={form.ssc_roll}
              onChange={(e) => setForm({ ...form, ssc_roll: e.target.value })}
              placeholder="123456 / 2024"
              className="h-12 bg-input border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">School / College</Label>
            <Input
              id="school"
              required
              value={form.school_name}
              onChange={(e) => setForm({ ...form, school_name: e.target.value })}
              placeholder="তোমার school বা college-এর নাম"
              className="h-12 bg-input border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              inputMode="tel"
              required
              value={form.mobile_number}
              onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="h-12 bg-input border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch">Batch</Label>
            <Select
              value={form.batch}
              onValueChange={(v) => setForm({ ...form, batch: v as Batch })}
            >
              <SelectTrigger id="batch" className="h-12 bg-input border-border">
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online — ৳1,999</SelectItem>
                <SelectItem value="Offline">Offline — ৳3,999 (Madaripur)</SelectItem>
                <SelectItem value="Complete">Complete — ৳4,999 (Best Value)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount" className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[var(--cyber-amber)]" />
              Discount Code <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="discount"
              value={form.discount_code}
              onChange={(e) => setForm({ ...form, discount_code: e.target.value.toUpperCase() })}
              placeholder="e.g. BINARY1000"
              className={`h-12 bg-input border-border focus:border-primary font-mono tracking-wider ${
                form.discount_code === "BINARY1000"
                  ? "border-[var(--cyber-amber)] text-[var(--cyber-amber)]"
                  : ""
              }`}
            />
            {form.discount_code === "BINARY1000" ? (
              <p className="text-xs text-[var(--cyber-amber)] font-mono">
                ✓ ৳1,000 OFF applied — verified at checkout
              </p>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] text-black font-bold hover:opacity-90 animate-pulse-glow"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Rocket className="mr-2 h-4 w-4" /> Confirm Enrollment</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
