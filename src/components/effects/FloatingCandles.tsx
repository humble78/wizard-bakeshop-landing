"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { cn, createRandom, round } from "@/lib/utils";

interface FloatingCandlesProps {
  count?: number;
  seed?: number;
  className?: string;
}

/** The Great Hall's enchanted candles, drifting at different depths. */
export function FloatingCandles({ count = 14, seed = 31, className }: FloatingCandlesProps) {
  const candles = useMemo(() => {
    const rand = createRandom(seed);
    return Array.from({ length: count }, (_, id) => {
      const depth = round(0.45 + rand() * 0.65);
      return {
        id,
        // Spread evenly across the width, jittered so it never looks like a grid.
        left: round(((id + 0.5) / count) * 100 + (rand() - 0.5) * 6),
        top: round(4 + rand() * 46),
        depth,
        height: Math.round(44 + rand() * 50),
        bob: round(10 + depth * 14),
        duration: round(4.5 + rand() * 4),
        delay: round(rand() * 3),
        flicker: round(rand() * 2),
      };
    });
  }, [count, seed]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {candles.map((c) => (
        <motion.div
          key={c.id}
          // Half the candles on phones, so the hall stays airy around the text.
          className={cn("absolute", c.id % 2 === 1 && "max-sm:hidden")}
          style={{ left: `${c.left}%`, top: `${c.top}%`, zIndex: Math.round(c.depth * 10) }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: [0, -c.bob, 0], rotate: [-1.5, 1.5, -1.5] }}
          transition={{
            opacity: { duration: 1.6, delay: 0.3 + c.delay * 0.4 },
            y: { duration: c.duration, delay: c.delay, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: c.duration * 1.3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div
            className="relative flex flex-col items-center"
            style={{
              transform: `scale(${c.depth})`,
              opacity: round(0.45 + c.depth * 0.5),
              filter: c.depth < 0.62 ? "blur(1.5px)" : undefined,
            }}
          >
            <span className="absolute -top-12 size-28 rounded-full bg-gold-400/20 blur-2xl" />
            <span
              className="relative h-5 w-2.5 origin-bottom animate-flicker rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-linear-to-t from-orange-500 via-gold-300 to-white shadow-[0_0_16px_5px_rgba(245,190,90,0.65)]"
              style={{ animationDelay: `${c.flicker}s` }}
            />
            <span className="h-1.5 w-px bg-ink-600" />
            <span
              className="relative w-4 rounded-t-[3px] bg-linear-to-r from-parchment-400 via-parchment-50 to-parchment-300 shadow-[0_0_24px_rgba(245,217,139,0.25)]"
              style={{ height: c.height }}
            >
              <span className="absolute left-0.5 top-0 h-3 w-1 rounded-b-full bg-parchment-50" />
              <span className="absolute right-1 top-0 h-5 w-[3px] rounded-b-full bg-parchment-100" />
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
