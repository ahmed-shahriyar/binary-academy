import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Rocket, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When true, automatically open the enrollment dialog after a short delay. */
  autoRedirect?: boolean;
  /** First name to greet the student. */
  name?: string;
}

export function GiftSentDialog({ open, onOpenChange, autoRedirect = true, name }: Props) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!open || !autoRedirect) return;
    setCountdown(3);
    const tick = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    const t = setTimeout(() => {
      onOpenChange(false);
      setTimeout(() => window.dispatchEvent(new CustomEvent("binary:open-enroll")), 200);
    }, 3000);
    return () => {
      clearInterval(tick);
      clearTimeout(t);
    };
  }, [open, autoRedirect, onOpenChange]);

  const handleEnroll = () => {
    onOpenChange(false);
    setTimeout(() => window.dispatchEvent(new CustomEvent("binary:open-enroll")), 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-2 border-[var(--cyber-green)] shadow-[0_0_40px_oklch(0.86_0.24_142_/_0.4)] max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cyber-green)]/15 border-2 border-[var(--cyber-green)] animate-pulse-glow">
            <CheckCircle2 className="h-9 w-9 text-[var(--cyber-green)]" />
          </div>
          <DialogTitle className="text-2xl text-center text-[var(--cyber-green)]">
            🎁 Gift Unlocked{name ? `, ${name.split(" ")[0]}!` : "!"}
          </DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground pt-2">
            Logic Gates PDF + Free Demo link → coming to your <span className="text-[var(--cyber-green)] font-semibold">WhatsApp</span> in 2 minutes.
            <br />
            <span className="block mt-2 text-foreground">
              Redirecting you to complete your profile
              {autoRedirect ? <> in <span className="font-mono text-[var(--cyber-cyan)]">{countdown}s</span>…</> : "…"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-lg border border-[var(--cyber-cyan)]/30 bg-[var(--cyber-cyan)]/5 p-4">
          <Button
            onClick={handleEnroll}
            className="w-full h-14 text-base font-bold bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] text-black hover:opacity-90 animate-pulse-glow"
          >
            {autoRedirect ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Rocket className="mr-2 h-5 w-5" />}
            Continue Now →
          </Button>
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground underline mx-auto"
        >
          Maybe later
        </button>
      </DialogContent>
    </Dialog>
  );
}
