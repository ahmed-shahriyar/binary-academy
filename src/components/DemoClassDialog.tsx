import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnrollDialog } from "@/components/EnrollDialog";
import { Rocket, Sparkles } from "lucide-react";

interface Props {
  videoId?: string;
}

export function DemoClassDialog({ videoId = "dQw4w9WgXcQ" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base md:text-lg font-bold text-white tracking-wide animate-demo-pulse focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyber-cyan)]"
          style={{
            background: "linear-gradient(135deg, #00FFFF 0%, #0066FF 60%, #001A66 100%)",
          }}
        >
          <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ boxShadow: "0 0 40px rgba(0,255,255,0.7)" }}
          />
          <Rocket className="h-5 w-5 relative z-10" />
          <span className="relative z-10">Join Free Demo Class</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl border-[var(--cyber-cyan)]/40 bg-[#0A0F1A]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-[var(--cyber-cyan)]" />
            Free Demo Class
          </DialogTitle>
          <DialogDescription>
            Binary Academy-র teaching style সরাসরি দেখে নাও — তারপর সিদ্ধান্ত নাও।
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full overflow-hidden rounded-lg border border-[var(--cyber-cyan)]/30" style={{ aspectRatio: "16 / 9" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Binary Academy — Free Demo Class"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="pt-2">
          <EnrollDialog
            trigger={
              <Button
                size="lg"
                className="w-full text-base font-bold"
                style={{
                  background: "linear-gradient(135deg, #00FFFF 0%, #0066FF 100%)",
                  color: "#0A0F1A",
                }}
              >
                Ready to Enroll? Click Here
              </Button>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
