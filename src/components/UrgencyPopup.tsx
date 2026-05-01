import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const STORAGE_KEY = "binary_urgency_popup_seen";
const TIME_TRIGGER_MS = 20_000;
const SCROLL_TRIGGER_PCT = 0.7;

export function UrgencyPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (scrolled >= SCROLL_TRIGGER_PCT) trigger();
    };

    const timer = setTimeout(trigger, TIME_TRIGGER_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const claim = () => {
    setOpen(false);
    // Signal the EnrollDialog to prefill the discount code
    window.dispatchEvent(
      new CustomEvent("binary:apply-discount", { detail: { code: "BINARY1000" } }),
    );
    // Scroll to enrollment / pricing section
    const target =
      document.getElementById("enroll") ||
      document.getElementById("pricing") ||
      document.querySelector("[data-enroll-section]");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Slight delay to let scroll settle, then auto-open the enroll dialog
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("binary:open-enroll"));
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-md p-0 border-0 bg-transparent shadow-none animate-urgency-shake"
        aria-describedby="urgency-desc"
      >
        <div
          className="relative rounded-2xl p-7 text-center backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(140deg, rgba(120, 10, 20, 0.85), rgba(40, 0, 5, 0.9))",
            border: "2px solid #FF6A00",
            boxShadow:
              "0 0 0 1px rgba(255, 106, 0, 0.4), 0 0 40px rgba(255, 106, 0, 0.65), 0 0 90px rgba(255, 40, 40, 0.35)",
          }}
        >
          <div className="mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6A00]/20 border-2 border-[#FF6A00] animate-urgency-flash">
            <AlertTriangle className="h-9 w-9 text-[#FF6A00]" strokeWidth={2.5} />
          </div>

          <DialogTitle className="text-2xl md:text-3xl font-bold font-mono text-white tracking-wide">
            ⚠️ LIMITED SCHOLARSHIP ALERT
          </DialogTitle>

          <DialogDescription id="urgency-desc" className="mt-3 text-base text-white/90">
            The first <span className="font-bold text-[#FFB347]">10 students</span> to enroll get{" "}
            <span className="font-bold text-[#FFD700]">৳1,000 OFF</span>!
          </DialogDescription>

          <div className="mt-5 rounded-xl border border-[#FF6A00]/60 bg-black/40 px-4 py-3">
            <p className="text-sm text-white/80 font-mono">
              Current Status:{" "}
              <span className="text-white font-bold">7/10 Seats Taken</span>
            </p>
            <p className="mt-1 text-lg font-bold text-[#FF6A00] font-mono animate-pulse">
              Only 3 Left!
            </p>
          </div>

          <Button
            onClick={claim}
            className="mt-6 w-full h-12 bg-gradient-to-r from-[#FF3B30] to-[#FF6A00] text-white font-bold text-base hover:opacity-95 animate-urgency-pulse"
          >
            CLAIM MY ৳1,000 OFF NOW
          </Button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-4 text-xs text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
          >
            No thanks, I'll pay full price later.
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
