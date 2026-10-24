"use client";

import { motion } from "framer-motion";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn, round } from "@/lib/utils";

type Variant = "gold" | "ghost" | "ink";

interface BaseProps {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

type SpellButtonProps = BaseProps &
  (
    | { href: string; external?: boolean; type?: never; disabled?: never }
    | { href?: undefined; external?: never; type?: "button" | "submit"; disabled?: boolean }
  );

interface Burst {
  id: number;
  x: number;
  y: number;
}

// Sparks radiate evenly from the click point.
const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const distance = 34 + (i % 3) * 12;
  return {
    x: round(Math.cos(angle) * distance),
    y: round(Math.sin(angle) * distance),
    size: i % 2 ? 4 : 6,
  };
});

const VARIANTS: Record<Variant, string> = {
  gold: "text-ink-950 bg-linear-to-b from-gold-200 via-gold-400 to-gold-600 shadow-[inset_0_1px_0_rgba(255,246,214,0.8),0_12px_40px_-12px_rgba(232,193,90,0.8)] hover:shadow-[inset_0_1px_0_rgba(255,246,214,0.8),0_0_50px_-4px_rgba(232,193,90,0.85)]",
  ghost:
    "text-gold-200 border border-gold-400/40 bg-ink-900/40 backdrop-blur-md hover:border-gold-300/80 hover:text-gold-100 hover:shadow-[0_0_40px_-8px_rgba(232,193,90,0.6)]",
  ink: "text-parchment-50 bg-parchment-900 hover:bg-crimson-600 shadow-[0_10px_30px_-12px_rgba(47,33,14,0.9)]",
};

export function SpellButton({
  children,
  icon,
  variant = "gold",
  className,
  onClick,
  ...rest
}: SpellButtonProps) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Keyboard activation reports (0, 0) — burst from the centre instead.
    const fromPointer = event.clientX !== 0 || event.clientY !== 0;
    nextId.current += 1;
    setBursts((current) => [
      ...current,
      {
        id: nextId.current,
        x: fromPointer ? event.clientX - rect.left : rect.width / 2,
        y: fromPointer ? event.clientY - rect.top : rect.height / 2,
      },
    ]);
    onClick?.(event);
  };

  const classes = cn(
    "group relative isolate inline-flex select-none items-center justify-center gap-2.5 rounded-full px-7 py-3.5",
    "font-heading text-[0.8rem] font-bold uppercase tracking-[0.22em] transition-[color,background-color,border-color,box-shadow] duration-500",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    className,
  );

  const content = (
    <>
      {/* Light sweep */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[450%]" />
      </span>
      {icon && (
        <span className="relative transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
          {icon}
        </span>
      )}
      <span className="relative">{children}</span>

      {bursts.map((burst) => (
        <span
          key={burst.id}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: burst.x, top: burst.y }}
        >
          {SPARKS.map((spark, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-gold-200 shadow-[0_0_10px_2px_rgba(245,217,139,0.9)]"
              style={{ width: spark.size, height: spark.size, marginLeft: -spark.size / 2, marginTop: -spark.size / 2 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: spark.x, y: spark.y, opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.3, 1] }}
              onAnimationComplete={
                i === 0
                  ? () => setBursts((current) => current.filter((b) => b.id !== burst.id))
                  : undefined
              }
            />
          ))}
        </span>
      ))}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.96 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
  };

  if (rest.href !== undefined) {
    return (
      <motion.a
        href={rest.href}
        className={classes}
        onClick={handleClick}
        {...(rest.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={rest.type ?? "button"}
      disabled={rest.disabled}
      className={classes}
      onClick={handleClick}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
