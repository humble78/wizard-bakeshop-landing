"use client";

import { motion } from "framer-motion";

interface SortingHatProps {
  /** Deliberating: the hat sways and its eyes kindle. */
  thinking?: boolean;
  className?: string;
}

export function SortingHat({ thinking = false, className }: SortingHatProps) {
  return (
    <motion.svg
      viewBox="0 0 220 210"
      className={className}
      aria-hidden="true"
      animate={
        thinking
          ? { rotate: [-4, 4, -3, 3, -4], y: [0, -6, 0, -4, 0] }
          : { rotate: [-1.5, 1.5, -1.5], y: [0, -8, 0] }
      }
      transition={{
        duration: thinking ? 1.6 : 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ originX: 0.5, originY: 1 }}
    >
      <defs>
        <linearGradient id="hat-body" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#7a5634" />
          <stop offset="55%" stopColor="#4a3019" />
          <stop offset="100%" stopColor="#24160b" />
        </linearGradient>
        <linearGradient id="hat-brim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3c20" />
          <stop offset="100%" stopColor="#1f130a" />
        </linearGradient>
        <radialGradient id="hat-eye" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff6d6" />
          <stop offset="60%" stopColor="#e8c15a" />
          <stop offset="100%" stopColor="#e8c15a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Brim */}
      <path
        d="M14 178c26-18 166-20 194-3-14 20-170 24-194 3Z"
        fill="url(#hat-brim)"
        stroke="#2a1a0c"
        strokeWidth="2"
      />

      {/* Cone with a drooping tip */}
      <path
        d="M54 172c8-38 16-72 38-100 12-16 20-30 36-40 18-10 40-6 50 10-14-4-28 0-36 14-6 12-2 36 6 58s18 40 24 58c-26 8-90 8-118 0Z"
        fill="url(#hat-body)"
        stroke="#2a1a0c"
        strokeWidth="2"
      />

      {/* Creases & stitched patch */}
      <path
        d="M66 150c22-8 66-8 94 0M78 98c8-6 14-8 22-6M130 62c-6 6-8 14-6 22"
        stroke="#1d1209"
        strokeOpacity="0.55"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="m142 128 14-4 4 16-14 4-4-16Z"
        fill="#5c3d22"
        stroke="#e8c15a"
        strokeOpacity="0.5"
        strokeDasharray="2 3"
      />

      {/* Brows */}
      <path
        d="M80 112c8-10 20-10 26-2M120 108c8-10 20-10 26-2"
        stroke="#1d1209"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eyes — kindle while thinking */}
      <motion.g
        animate={{ opacity: thinking ? [0.6, 1, 0.6] : 0.25 }}
        transition={{ duration: 1.2, repeat: thinking ? Infinity : 0 }}
      >
        <ellipse cx="93" cy="119" rx="12" ry="6" fill="url(#hat-eye)" />
        <ellipse cx="133" cy="115" rx="12" ry="6" fill="url(#hat-eye)" />
      </motion.g>
      <ellipse cx="93" cy="119" rx="6" ry="2.4" fill="#120b05" />
      <ellipse cx="133" cy="115" rx="6" ry="2.4" fill="#120b05" />

      {/* Mouth — a rip in the fabric that mutters */}
      <motion.path
        d="M88 140c14-9 38-9 52-2-12 10-38 12-52 2Z"
        fill="#120b05"
        stroke="#2a1a0c"
        strokeWidth="2"
        animate={{ scaleY: thinking ? [1, 1.8, 0.8, 1.6, 1] : 1 }}
        transition={{ duration: 0.9, repeat: thinking ? Infinity : 0 }}
        style={{ originX: 0.5, originY: 0.5 }}
      />
    </motion.svg>
  );
}
