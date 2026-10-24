"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { round } from "@/lib/utils";

interface OwlProps {
  className?: string;
  /** Seconds per half wing beat (one downstroke or one upstroke). */
  flap?: number;
  /** Whether the owl carries a sealed letter. */
  letter?: boolean;
}

/** A rounded owl feather pointing along +x from its quill base at (0, 0). */
function feather(length: number, width: number) {
  const h = width / 2;
  const shoulder = round(length * 0.55);
  return `M0 ${round(-h * 0.6)}C${shoulder} ${-h} ${length} ${-h} ${length} 0C${length} ${h} ${shoulder} ${h} 0 ${round(h * 0.6)}Z`;
}

// Left wing, drawn with the shoulder joint at (0, 0) and the tip toward -x.
// The right wing is the same drawing mirrored.

// Primaries splay from the wrist like fingers.
const PRIMARIES = [
  { x: -60, y: -21, angle: 192, length: 44 },
  { x: -63, y: -18, angle: 180, length: 46 },
  { x: -66, y: -15, angle: 168, length: 44 },
  { x: -68, y: -12, angle: 156, length: 40 },
  { x: -68, y: -9, angle: 144, length: 35 },
  { x: -66, y: -6, angle: 132, length: 30 },
].map((f) => ({ ...f, d: feather(f.length, 12) }));

// Secondaries hang along the trailing edge, giving it a scalloped outline.
const SECONDARIES = Array.from({ length: 7 }, (_, i) => {
  const t = i / 6;
  const length = round(30 + t * 4);
  return {
    x: round(-62 + t * 58),
    y: round(-8 + t * 12),
    angle: round(118 - t * 26),
    d: feather(length, 13),
    length,
  };
});

// Small covert feathers along the leading edge, in two staggered rows.
const COVERTS = [0, 1].flatMap((row) =>
  Array.from({ length: 7 - row }, (_, i) => {
    const x = -10 - i * 8 - row * 4;
    const y = -12 - (x / -64) * 8 + row * 7;
    return `M${round(x)} ${round(y)}q-3 4.5-6.5 0`;
  }),
);

// Sparse chevron flecks on the breast — a snowy owl, not a barn owl.
const BREAST_MARKS = [
  [112, 86], [126, 88], [106, 98], [119, 99], [132, 97],
  [111, 110], [125, 111], [118, 121],
] as const;

// Feather tips fringing the bottom of the head, so it melts into the breast.
const RUFF = Array.from({ length: 6 }, (_, i) => {
  const x = 98 + i * 8.8;
  const y = 50 + 24 * Math.sqrt(1 - ((x - 120) / 27) ** 2) - 2.5;
  return `M${round(x - 4.4)} ${round(y)}q4.4 4.2 8.8 0`;
}).join("");

const COVERT_FLECKS = ["M-30 -6q2 1.6 4 0", "M-46 -10q2 1.6 4 0", "M-38 2q2 1.6 4 0", "M-56 -4q2 1.6 4 0"];

const CROWN_FLECKS = [
  [109, 36], [116, 33], [124, 33], [131, 36], [113, 40], [127, 40],
] as const;

export function Owl({ className, flap = 0.5, letter = true }: OwlProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = {
    plumage: `owl-plumage-${uid}`,
    head: `owl-head-${uid}`,
    feather: `owl-feather-${uid}`,
    underwing: `owl-underwing-${uid}`,
    iris: `owl-iris-${uid}`,
    envelope: `owl-envelope-${uid}`,
  };

  // One full beat: a quick, powerful downstroke and a slower recovery.
  const beat = {
    duration: flap * 2,
    repeat: Infinity,
    times: [0, 0.42, 1],
    ease: ["easeIn", "easeOut"] as ["easeIn", "easeOut"],
  };

  const wing = (
    <motion.g
      animate={{ rotate: [34, -22, 34], scaleX: [0.88, 1, 0.88] }}
      transition={beat}
    >
      {/* Invisible frame centred on the shoulder so the wing pivots there. */}
      <rect x="-160" y="-120" width="320" height="240" fill="none" />

      {SECONDARIES.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.angle})`}>
          <path d={f.d} fill={`url(#${ids.feather})`} stroke="#c9c0ae" strokeWidth="0.8" />
          <path
            d={`M${round(f.length * 0.7)} -4q2 4 0 8`}
            fill="none"
            stroke="#a89f8e"
            strokeOpacity="0.45"
            strokeWidth="0.9"
          />
        </g>
      ))}

      {/* Primaries lag behind the wing, flexing with the air. */}
      <motion.g
        animate={{ rotate: [-8, 10, -8] }}
        transition={{ ...beat, times: [0, 0.32, 1] }}
      >
        <rect x="-126" y="-74" width="120" height="120" fill="none" />
        {PRIMARIES.map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.angle})`}>
            <path d={f.d} fill={`url(#${ids.feather})`} stroke="#c9c0ae" strokeWidth="0.8" />
            <path
              d={`M${round(f.length * 0.62)} -4.5q2.2 4.5 0 9M${round(f.length * 0.8)} -4q2 4 0 8`}
              fill="none"
              stroke="#9d9382"
              strokeOpacity="0.5"
              strokeWidth="0.9"
            />
          </g>
        ))}
      </motion.g>

      {/* Coverts: the soft upper wing hiding the quill bases. */}
      <path
        d="M4 -8C-14 -20 -40 -26 -64 -24C-70 -23 -74 -19 -74 -14C-60 -2 -40 8 -18 12C-8 13 0 10 6 4Z"
        fill={`url(#${ids.underwing})`}
        stroke="#d3cbbb"
        strokeWidth="0.8"
      />
      <path d={COVERTS.join("")} fill="none" stroke="#cfc6b4" strokeWidth="0.9" strokeLinecap="round" />
      <path d={COVERT_FLECKS.join("")} fill="none" stroke="#9d9382" strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" />
    </motion.g>
  );

  return (
    <svg viewBox="-14 -24 268 192" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={ids.plumage} cx="0.42" cy="0.35" r="0.75">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1ece2" />
          <stop offset="100%" stopColor="#d4ccbc" />
        </radialGradient>
        <radialGradient id={ids.head} cx="0.5" cy="0.38" r="0.7">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f6f2ea" />
          <stop offset="100%" stopColor="#e7e0d2" />
        </radialGradient>
        <linearGradient id={ids.feather} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbf9f4" />
          <stop offset="70%" stopColor="#efeae0" />
          <stop offset="100%" stopColor="#d6cdbc" />
        </linearGradient>
        <linearGradient id={ids.underwing} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4ddcf" />
          <stop offset="45%" stopColor="#fbf9f4" />
          <stop offset="100%" stopColor="#f3eee5" />
        </linearGradient>
        <radialGradient id={ids.iris} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="#ffe9a3" />
          <stop offset="55%" stopColor="#f2b830" />
          <stop offset="100%" stopColor="#b77a0d" />
        </radialGradient>
        <linearGradient id={ids.envelope} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e6c4" />
          <stop offset="100%" stopColor="#d9bd7f" />
        </linearGradient>
      </defs>

      {/* The whole bird lifts a little on every downstroke. */}
      <motion.g animate={{ y: [0, -4, 0] }} transition={beat}>
        <g transform="translate(106 74)">{wing}</g>
        <g transform="translate(134 74) scale(-1 1)">{wing}</g>

        {/* Tail */}
        <path
          d="M107 120C108 134 113 144 120 146C127 144 132 134 133 120Z"
          fill={`url(#${ids.feather})`}
          stroke="#cfc6b4"
          strokeWidth="0.8"
        />
        <path d="M114 128l2 14M120 128v16M126 128l-2 14" stroke="#d6cebf" strokeWidth="0.8" fill="none" />

        {/* Feathered legs, tucked under the belly */}
        <path
          d="M107.5 118C106 128 107 136 109.5 140.5C111.5 142.5 115.5 142.5 117 140.5C118.5 133 118.5 125 117.5 118ZM132.5 118C134 128 133 136 130.5 140.5C128.5 142.5 124.5 142.5 123 140.5C121.5 133 121.5 125 122.5 118Z"
          fill={`url(#${ids.plumage})`}
          stroke="#d8d0c1"
          strokeWidth="0.8"
        />
        <path
          d="M108.5 136q2 2 4 0q2 2 4 0M123.5 136q2 2 4 0q2 2 4 0"
          fill="none"
          stroke="#cfc6b4"
          strokeWidth="0.8"
        />

        {/* Body */}
        <path
          d="M120 50C140 50 149 70 148 92C147 115 135 130 120 131C105 130 93 115 92 92C91 70 100 50 120 50Z"
          fill={`url(#${ids.plumage})`}
          stroke="#d8d0c1"
          strokeWidth="0.8"
        />
        {BREAST_MARKS.map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d={`M${x - 2.5} ${y}q2.5 2.2 5 0`}
            fill="none"
            stroke="#8f8676"
            strokeOpacity="0.55"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        ))}

        {letter && (
          <motion.g
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: flap * 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Frame centred on the talons so the letter swings from them. */}
            <rect x="80" y="102" width="80" height="80" fill="none" />
            <rect x="106" y="142" width="28" height="18" rx="1.5" fill={`url(#${ids.envelope})`} stroke="#8a6a3a" strokeWidth="0.8" />
            <path d="M106.5 143 120 152.5 133.5 143" fill="none" stroke="#8a6a3a" strokeWidth="0.8" />
            <circle cx="120" cy="152" r="3.8" fill="#a11d21" />
            <circle cx="120" cy="152" r="2.2" fill="none" stroke="#7f0909" strokeWidth="0.8" />
          </motion.g>
        )}

        {/* Talons hooked over the letter's edge */}
        <path
          d="M111 141q-2 2.5-.5 5.5M115.5 141.5q1 2.5 0 5M124.5 141.5q-1 2.5 0 5M129 141q2 2.5.5 5.5"
          fill="none"
          stroke="#3a3330"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Head — owls keep it steady, so it rides a touch against the bob. */}
        <motion.g animate={{ y: [0, 1.5, 0] }} transition={beat}>
          <ellipse cx="120" cy="50" rx="27" ry="24" fill={`url(#${ids.head})`} />
          <path d={RUFF} fill="none" stroke="#ddd5c6" strokeWidth="1" strokeLinecap="round" />
          {CROWN_FLECKS.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#9d9382" fillOpacity="0.6" />
          ))}

          {/* Facial disc */}
          <path
            d="M120 41C112 34 98 37 97 49C96 61 108 69 120 68C132 69 144 61 143 49C142 37 128 34 120 41Z"
            fill="#fdfcf8"
            stroke="#e0d9cb"
            strokeWidth="1"
          />
          <path
            d="M102 45Q111 40 118 47M138 45Q129 40 122 47"
            fill="none"
            stroke="#c4baa7"
            strokeWidth="1.3"
            strokeLinecap="round"
          />

          {/* Eyes, with an occasional slow blink */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 4.5, times: [0, 0.93, 0.96, 1], repeat: Infinity }}
          >
            {[110, 130].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="51" r="7" fill={`url(#${ids.iris})`} stroke="#2a1d0e" strokeWidth="1.4" />
                <circle cx={cx} cy="51" r="3.5" fill="#0b0805" />
                <circle cx={cx + 1.8} cy="49.2" r="1.4" fill="#ffffff" />
              </g>
            ))}
          </motion.g>

          {/* Beak, half-buried in bristle feathers */}
          <path
            d="M120 55C117.5 55.5 116.8 58 118 61L120 65.5L122 61C123.2 58 122.5 55.5 120 55Z"
            fill="#3a3330"
          />
          <path
            d="M115.5 56.5q3 2.5 3.5 7M124.5 56.5q-3 2.5-3.5 7"
            fill="none"
            stroke="#f6f3ec"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}
