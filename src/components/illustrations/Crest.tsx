import type { House } from "@/lib/data";

/** A generic heraldic shield in house colours — deliberately not an official crest. */
export function Crest({ house, className }: { house: House; className?: string }) {
  const gradientId = `crest-${house.id}`;

  return (
    <svg viewBox="0 0 100 108" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={house.colors.primary} stopOpacity="0.85" />
          <stop offset="100%" stopColor={house.colors.primary} />
        </linearGradient>
      </defs>
      <path
        d="M50 4 92 16v32c0 27-18 45-42 54C26 93 8 75 8 48V16L50 4Z"
        fill={`url(#${gradientId})`}
        stroke={house.colors.secondary}
        strokeWidth="3"
      />
      <path
        d="M50 13 84 23v25c0 22-14 37-34 45-20-8-34-23-34-45V23l34-10Z"
        fill="none"
        stroke={house.colors.secondary}
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <path d="M16 40h68" stroke={house.colors.secondary} strokeOpacity="0.35" strokeWidth="1" />
      <text
        x="50"
        y="72"
        textAnchor="middle"
        className="font-display"
        fontSize="40"
        fontWeight="900"
        fill={house.colors.secondary}
      >
        {house.name[0]}
      </text>
      <path
        d="m50 26 1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6 1.6-4Z"
        fill={house.colors.secondary}
      />
    </svg>
  );
}
