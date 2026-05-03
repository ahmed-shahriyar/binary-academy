import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Rocket } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GiftSentDialog({ open, onOpenChange }: Props) {
  const handleEnroll = () => {
    onOpenChange(false);
    // Defer so this dialog closes cleanly before the next one opens
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("binary:open-enroll"));
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-2 border-[var(--cyber-green)] shadow-[0_0_40px_oklch(0.86_0.24_142_/_0.4)] max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cyber-green)]/15 border-2 border-[var(--cyber-green)] animate-pulse-glow">
            <CheckCircle2 className="h-9 w-9 text-[var(--cyber-green)]" />
          </div>
          <DialogTitle className="text-2xl text-center text-[var(--cyber-green)]">
            🎁 Gifts Sent!
          </DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground pt-2">
            Check your <span className="text-[var(--cyber-green)] font-semibold">WhatsApp</span> for the{" "}
            <span className="text-foreground font-semibold">Logic Gates PDF</span> and your{" "}
            <span className="text-foreground font-semibold">Free Demo Class</span> link.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-lg border border-[var(--cyber-cyan)]/30 bg-[var(--cyber-cyan)]/5 p-4">
          <p className="text-xs font-mono text-[var(--cyber-cyan)] uppercase tracking-wider text-center mb-3">
            Next Step → Lock Your Seat
          </p>
          <Button
            onClick={handleEnroll}
            className="w-full h-14 text-base font-bold bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] text-black hover:opacity-90 animate-pulse-glow"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Join the SSC '26 Batch Now
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
