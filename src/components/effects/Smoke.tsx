"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PLUMES = [
  { className: "left-[-20%] w-[70vw] bg-[radial-gradient(closest-side,rgba(232,212,162,0.16),transparent)]", x: ["-6%", "8%", "-6%"], duration: 22 },
  { className: "left-[25%] w-[60vw] bg-[radial-gradient(closest-side,rgba(161,29,33,0.18),transparent)]", x: ["6%", "-10%", "6%"], duration: 26 },
  { className: "right-[-25%] w-[75vw] bg-[radial-gradient(closest-side,rgba(42,98,61,0.2),transparent)]", x: ["-4%", "10%", "-4%"], duration: 30 },
  { className: "left-[10%] w-[90vw] bg-[radial-gradient(closest-side,rgba(243,230,196,0.1),transparent)]", x: ["4%", "-6%", "4%"], duration: 34 },
];

/** Slow, layered mist curling along the bottom of a section. */
export function Smoke({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-[55vh]", className)}>
      {PLUMES.map((plume, i) => (
        <motion.div
          key={i}
          className={cn("absolute bottom-[-12vh] h-[45vh] rounded-full blur-3xl", plume.className)}
          animate={{ x: plume.x, opacity: [0.55, 1, 0.55], scale: [1, 1.12, 1] }}
          transition={{ duration: plume.duration, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}
    </div>
  );
}
