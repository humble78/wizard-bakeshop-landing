"use client";

import { motion } from "framer-motion";

interface OwlProps {
  className?: string;
  /** Seconds per wing beat. */
  flap?: number;
  /** Whether the owl carries a sealed letter. */
  letter?: boolean;
}

const SPECKLES = [
  [52, 56],
  [66, 60],
  [57, 68],
  [64, 74],
  [50, 76],
  [70, 50],
] as const;

export function Owl({ className, flap = 0.5, letter = true }: OwlProps) {
  const wing = {
    duration: flap,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
  };

  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <motion.path
        d="M58 46C40 30 18 26 2 34c12 6 20 12 28 18-8 0-16 4-22 10 16 0 34-2 48-6Z"
        fill="#ece6da"
        stroke="#b9b0a0"
        strokeWidth="1"
        initial={{ rotate: -22 }}
        animate={{ rotate: 24 }}
        transition={wing}
        style={{ originX: 1, originY: 0.4 }}
      />
      <motion.path
        d="M62 46c18-16 40-20 56-12-12 6-20 12-28 18 8 0 16 4 22 10-16 0-34-2-48-6Z"
        fill="#ece6da"
        stroke="#b9b0a0"
        strokeWidth="1"
        initial={{ rotate: 22 }}
        animate={{ rotate: -24 }}
        transition={wing}
        style={{ originX: 0, originY: 0.4 }}
      />

      <path
        d="M60 30c12 0 18 12 18 26 0 16-8 28-18 28s-18-12-18-28c0-14 6-26 18-26Z"
        fill="#f7f3ea"
      />
      {SPECKLES.map(([cx, cy]) => (
        <path
          key={`${cx}-${cy}`}
          d={`M${cx - 2} ${cy}q2 1.6 4 0`}
          stroke="#8f8676"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      ))}

      <ellipse cx="60" cy="32" rx="15" ry="13" fill="#f7f3ea" />
      <circle cx="54" cy="31" r="4.2" fill="#e8c15a" />
      <circle cx="66" cy="31" r="4.2" fill="#e8c15a" />
      <circle cx="54" cy="31" r="2" fill="#120b05" />
      <circle cx="66" cy="31" r="2" fill="#120b05" />
      <path d="M58.4 35.5h3.2L60 40l-1.6-4.5Z" fill="#3a2a16" />

      {letter && (
        <g>
          <path d="M60 82v4" stroke="#8f8676" strokeWidth="1.5" />
          <rect x="51" y="85" width="18" height="12" rx="1.2" fill="#ead8ae" />
          <path d="m51 86 9 6 9-6" stroke="#8a6a3a" strokeWidth="1" fill="none" />
          <circle cx="60" cy="92" r="2.4" fill="#a11d21" />
        </g>
      )}
    </svg>
  );
}
