import { EnrollDialog } from "@/components/EnrollDialog";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export function StickyCTA() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-background/85 backdrop-blur border-t border-[var(--cyber-cyan)]/30">
      <EnrollDialog
        trigger={
          <Button className="w-full h-12 font-bold bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] text-black animate-pulse-glow">
            <Rocket className="mr-2 h-5 w-5" /> Enroll Now — SSC '26
          </Button>
        }
      />
    </div>
  );
}
