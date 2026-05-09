import { useEffect, useState } from "react";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let raf = 0;
    let start = performance.now();
    let done = false;

    const tick = (now: number) => {
      const elapsed = now - start;
      // Simulated load curve up to 90%
      const target = Math.min(90, (elapsed / 1800) * 90);
      setProgress((p) => (p < target ? target : p));
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setProgress(100);
      setTimeout(() => setFadeOut(true), 250);
      setTimeout(() => setHidden(true), 850);
    };

    if (document.readyState === "complete") {
      setTimeout(finish, 400);
    } else {
      window.addEventListener("load", finish, { once: true });
      // Safety timeout
      setTimeout(finish, 6000);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="binary-glitch font-mono text-xl md:text-3xl font-bold tracking-widest" data-text="BINARY ACADEMY">
          <span aria-hidden="true" className="binary-glitch__binary binary-glitch__binary--top">01000010 01001001 01001110</span>
          <span className="binary-glitch__text text-gradient-cyber">BINARY ACADEMY</span>
          <span aria-hidden="true" className="binary-glitch__layer binary-glitch__layer--1">BINARY ACADEMY</span>
          <span aria-hidden="true" className="binary-glitch__layer binary-glitch__layer--2">BINARY ACADEMY</span>
          <span aria-hidden="true" className="binary-glitch__binary binary-glitch__binary--bottom">01000001 01000011 01000001 01000100</span>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1.5 w-64 md:w-80 overflow-hidden rounded-full bg-[oklch(0.18_0.02_240)] border border-[var(--cyber-cyan)]/30">
          <div
            className="h-full bg-gradient-to-r from-[var(--cyber-cyan)] to-[var(--cyber-green)] transition-[width] duration-200 ease-out"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 14px var(--cyber-cyan)",
            }}
          />
        </div>

        <div className="mt-4 font-mono text-[11px] md:text-xs text-[var(--cyber-cyan)]/80 tracking-[0.2em]">
          [ INITIALIZING SYSTEM... {Math.floor(progress)}% ]
        </div>
      </div>
    </div>
  );
}
