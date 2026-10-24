"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn, createRandom, round } from "@/lib/utils";

interface MagicParticlesProps {
  count?: number;
  seed?: number;
  className?: string;
}

/** Golden embers drifting upward, like sparks off a wand tip. */
export function MagicParticles({ count = 36, seed = 7, className }: MagicParticlesProps) {
  const particles = useMemo(() => {
    const rand = createRandom(seed);
    return Array.from({ length: count }, (_, id) => ({
      id,
      left: round(rand() * 100),
      bottom: round(rand() * 35 - 5),
      size: round(1.5 + rand() * 3.5),
      rise: round(160 + rand() * 440),
      drift: round((rand() - 0.5) * 90),
      duration: round(7 + rand() * 9),
      delay: round(rand() * 8),
      ember: rand() > 0.8,
    }));
  }, [count, seed]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={cn(
            "absolute rounded-full",
            p.ember
              ? "bg-orange-300 shadow-[0_0_8px_2px_rgba(251,146,60,0.7)]"
              : "bg-gold-200 shadow-[0_0_10px_2px_rgba(245,217,139,0.75)]",
          )}
          style={{ left: `${p.left}%`, bottom: `${p.bottom}%`, width: p.size, height: p.size }}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -p.rise],
            x: [0, p.drift * 0.6, p.drift],
            opacity: [0, 1, 0.85, 0],
            scale: [0.6, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
