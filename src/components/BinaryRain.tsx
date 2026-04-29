import { useMemo } from "react";

/**
 * Subtle CSS-based binary code rain. Lightweight (no canvas).
 * Renders ~40 columns of falling 0/1 streams.
 */
export function BinaryRain({ density = 36 }: { density?: number }) {
  const columns = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => {
      const left = (i / density) * 100 + Math.random() * (100 / density);
      const duration = 6 + Math.random() * 10;
      const delay = -Math.random() * duration;
      const fontSize = 10 + Math.random() * 6;
      const chars = Array.from({ length: 24 })
        .map(() => (Math.random() > 0.5 ? "1" : "0"))
        .join("\n");
      const isGreen = Math.random() > 0.5;
      return { left, duration, delay, fontSize, chars, isGreen, key: i };
    });
  }, [density]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.18]"
    >
      {columns.map((c) => (
        <pre
          key={c.key}
          className="absolute top-0 font-mono leading-tight whitespace-pre m-0"
          style={{
            left: `${c.left}%`,
            fontSize: `${c.fontSize}px`,
            color: c.isGreen ? "var(--cyber-green)" : "var(--cyber-cyan)",
            animation: `binary-fall ${c.duration}s linear ${c.delay}s infinite`,
            textShadow: "0 0 6px currentColor",
          }}
        >
          {c.chars}
        </pre>
      ))}
    </div>
  );
}
