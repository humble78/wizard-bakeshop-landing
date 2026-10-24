"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  /** `ink` for headings that sit on parchment. */
  tone?: "light" | "ink";
  className?: string;
  id?: string;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
  id,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className={cn("flex flex-col gap-5", centered && "items-center text-center", className)}
    >
      <motion.div variants={rise} className="flex items-center gap-3">
        <motion.span
          className={cn("h-px w-10 origin-right", tone === "ink" ? "bg-parchment-700" : "bg-gold-400/70")}
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, delay: 0.2 } } }}
        />
        <span
          className={cn(
            "font-heading text-xs font-semibold uppercase tracking-[0.35em]",
            tone === "ink" ? "text-crimson-600" : "text-gold-400",
          )}
        >
          {eyebrow}
        </span>
        {centered && (
          <motion.span
            className={cn("h-px w-10 origin-left", tone === "ink" ? "bg-parchment-700" : "bg-gold-400/70")}
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, delay: 0.2 } } }}
          />
        )}
      </motion.div>

      <motion.h2
        id={id}
        variants={rise}
        className={cn(
          "max-w-4xl font-heading text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl",
          tone === "ink" ? "text-parchment-900" : "text-parchment-50",
        )}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={rise}
          className={cn(
            "max-w-2xl font-fell text-lg italic leading-relaxed text-pretty sm:text-xl",
            tone === "ink" ? "text-parchment-800" : "text-parchment-200/75",
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
