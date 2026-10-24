"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * "Lumos": a soft pool of wand-light that trails the pointer.
 * Only on precise pointers and when the visitor hasn't asked for less motion.
 */
export function LumosCursor() {
  const enabled = useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const opacity = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      opacity.set(1);
    };
    const leave = () => opacity.set(0);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-90 size-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-opacity duration-500"
      style={{
        x: springX,
        y: springY,
        opacity,
        background:
          "radial-gradient(circle, rgba(245,217,139,0.13) 0%, rgba(245,217,139,0.05) 35%, transparent 65%)",
      }}
    />
  );
}
