import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send } from "lucide-react";

const leadSchema = z.object({
  full_name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে").max(100),
  ssc_roll: z.string().trim().min(1, "SSC Roll/Year প্রয়োজন").max(50),
  mobile_number: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,20}$/, "সঠিক মোবাইল নম্বর দিন"),
});

interface Props {
  trigger: React.ReactNode;
}

export function EnrollDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", ssc_roll: "", mobile_number: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert(parsed.data);
    setLoading(false);
    if (error) {
      toast.error("সাবমিট করা যায়নি, আবার চেষ্টা করুন।");
      return;
    }
    toast.success("🎉 ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করব।");
    setForm({ full_name: "", ssc_roll: "", mobile_number: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-card border-glow-cyan max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient-cyber">Claim Free Gift & Enroll</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            ফ্রি গিফট পেতে নিচের তথ্য পূরণ করুন। আমরা WhatsApp-এ যোগাযোগ করব।
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] text-black font-bold hover:opacity-90 animate-pulse-glow"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Submit & Get Free Gift</>}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
