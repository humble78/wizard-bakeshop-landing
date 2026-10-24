"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Sparkles, WandSparkles } from "lucide-react";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { FloatingCandles } from "@/components/effects/FloatingCandles";
import { MagicParticles } from "@/components/effects/MagicParticles";
import { Smoke } from "@/components/effects/Smoke";
import { SpellButton } from "@/components/ui/SpellButton";
import { IMAGES, MENU_BY_ID, type MenuItem } from "@/lib/data";
import { cn } from "@/lib/utils";

// Each letter carries a global index so the stagger flows across both words.
const TITLE = ["Espresso", "Patronum"].map((word, w, words) => {
  const offset = words.slice(0, w).join("").length;
  return { word, letters: word.split("").map((char, i) => ({ char, index: offset + i })) };
});

const letter: Variants = {
  hidden: { y: "115%", rotate: 10, opacity: 0, filter: "blur(12px)" },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: 0.35 + i * 0.05, duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay, duration: 1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const ARCHES = [
  {
    item: MENU_BY_ID["butterbeer-latte"],
    className: "left-[3%] top-[20%] w-[min(11vw,13rem)] -rotate-3",
    depth: 1,
    delay: 1.3,
  },
  {
    item: MENU_BY_ID["cauldron-cake"],
    className: "right-[3%] top-[42%] w-[min(12vw,14rem)] rotate-3",
    depth: 1.2,
    delay: 1.45,
  },
  {
    item: MENU_BY_ID["treacle-tart"],
    className: "right-[11%] top-[11%] w-[min(6.5vw,7.5rem)] -rotate-2",
    depth: -0.6,
    delay: 1.6,
  },
  {
    item: MENU_BY_ID["golden-snitch-cupcake"],
    className: "left-[12%] bottom-[9%] w-[min(6.5vw,7.5rem)] rotate-2",
    depth: -0.5,
    delay: 1.75,
  },
];

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.3]);
  const candlesY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Pointer parallax, normalised to [-0.5, 0.5].
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 50, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 50, damping: 18 });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={section}
      id="top"
      onPointerMove={handlePointerMove}
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* Backdrop: the castle library at night */}
      <motion.div className="absolute inset-0 -z-30" style={{ scale: backdropScale }}>
        <Image
          src={IMAGES.hero}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover opacity-30 saturate-[.65]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_35%,rgba(232,193,90,0.16),transparent_55%),linear-gradient(to_bottom,rgba(6,5,9,0.7),rgba(6,5,9,0.35)_35%,rgba(6,5,9,0.6)_75%,#060509)]" />

      <motion.div className="absolute inset-0 -z-10" style={{ y: candlesY }}>
        <FloatingCandles />
      </motion.div>
      <MagicParticles className="-z-10" />
      <Smoke className="-z-10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-b from-transparent to-ink-950" />

      {/* Rune circle + patronus glow behind the title */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="size-[min(130vw,46rem)] rounded-full bg-[radial-gradient(circle,rgba(190,215,255,0.16),rgba(190,215,255,0.04)_45%,transparent_70%)]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <RuneCircle className="absolute inset-0 animate-orbit max-sm:opacity-40 motion-reduce:animate-none" />
      </div>

      {/* Arched "castle windows" of signature treats */}
      {ARCHES.map((arch) => (
        <ArchWindow key={arch.item.id} {...arch} pointerX={smoothX} pointerY={smoothY} />
      ))}

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-28 pt-32 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Soft shadow pool so the candles behind never fight the lettering */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-10%] top-[18%] bottom-[8%] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(6,5,9,0.72),rgba(6,5,9,0.35)_45%,transparent_72%)]"
        />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="mb-6 flex items-center gap-3 font-heading text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-gold-400 sm:text-xs"
        >
          <Sparkles className="size-3.5" />
          Samarkand · Registan St. 9¾
          <Sparkles className="size-3.5" />
        </motion.p>

        <h1 className="flex flex-col items-center">
          <span className="sr-only">Espresso Patronum: Magic in Every Crumb, Spell in Every Sip.</span>
          <span
            aria-hidden="true"
            className="font-display text-[clamp(2.9rem,12.5vw,8.5rem)] font-black leading-[0.92] tracking-tight"
          >
            {TITLE.map(({ word, letters }) => (
              <span key={word} className="block overflow-hidden px-[0.06em] py-[0.08em]">
                {letters.map(({ char, index }) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letter}
                    initial="hidden"
                    animate="show"
                    className="text-gilded inline-block animate-shimmer drop-shadow-[0_0_30px_rgba(232,193,90,0.25)] motion-reduce:animate-none"
                    style={{ animationDelay: `${-index * 0.25}s` }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </span>

          <motion.span
            aria-hidden="true"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1.1}
            className="mt-4 block font-fell text-[clamp(1.35rem,3.6vw,2.6rem)] italic leading-tight text-parchment-100"
          >
            Magic in Every <span className="text-gold-300">Crumb</span>, Spell in Every{" "}
            <span className="text-gold-300">Sip</span>.
          </motion.span>
        </h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.3}
          className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-parchment-200/70 sm:text-lg"
        >
          A candlelit bakery &amp; coffee house where lattes are charmed, tarts are enchanted, and owls deliver
          everything warm across Samarkand.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.5}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <SpellButton href="#menu" icon={<WandSparkles className="size-4" />}>
            Accio Coffee!
          </SpellButton>
          <SpellButton href="#sorting" variant="ghost">
            Get Sorted
          </SpellButton>
        </motion.div>
      </motion.div>

      {/* Corner coordinates */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="pointer-events-none absolute inset-x-6 bottom-8 hidden items-end justify-between font-heading text-[0.65rem] uppercase tracking-[0.3em] text-parchment-200/45 md:flex"
      >
        <span>39.6542° N · 66.9597° E</span>
        <span>Lumos 08:00 · Nox 23:00</span>
      </motion.div>

      <motion.a
        href="#sorting"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2.2}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-fell text-sm italic text-parchment-200/60 transition-colors hover:text-gold-300"
      >
        I solemnly swear…
        <span className="relative h-12 w-px overflow-hidden bg-gold-400/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-transparent to-gold-300"
            animate={{ y: ["-100%", "220%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}

interface ArchWindowProps {
  item: MenuItem;
  className: string;
  depth: number;
  delay: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

function ArchWindow({ item, className, depth, delay, pointerX, pointerY }: ArchWindowProps) {
  const x = useTransform(pointerX, (v) => v * 50 * depth);
  const y = useTransform(pointerY, (v) => v * 36 * depth);

  return (
    <motion.figure
      className={cn("absolute z-0 hidden xl:block", className)}
      style={{ x, y }}
      initial={{ opacity: 0, clipPath: "inset(100% 0% 0% 0% round 999px 999px 20px 20px)" }}
      animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 999px 999px 20px 20px)" }}
      transition={{ delay, duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6 + Math.abs(depth) * 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="arch relative aspect-[3/4.2] overflow-hidden p-1.5 ring-1 ring-gold-400/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_60px_-20px_rgba(232,193,90,0.4)]">
          <div className="arch relative size-full overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="16vw"
              className="object-cover sepia-[.2] transition-transform duration-1000 hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink-950/70 via-transparent to-transparent" />
          </div>
        </div>
        <figcaption className="mt-3 text-center font-fell text-sm italic text-parchment-200/70">
          {item.name}
        </figcaption>
      </motion.div>
    </motion.figure>
  );
}

function RuneCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <path id="rune-path" d="M200 200m-170 0a170 170 0 1 1 340 0a170 170 0 1 1-340 0" />
      </defs>
      <circle cx="200" cy="200" r="184" fill="none" stroke="rgba(232,193,90,0.14)" />
      <circle cx="200" cy="200" r="156" fill="none" stroke="rgba(232,193,90,0.08)" strokeDasharray="2 6" />
      <text className="font-heading" fontSize="11" letterSpacing="6" fill="rgba(245,217,139,0.32)">
        <textPath href="#rune-path">
          ✦ ACCIO ESPRESSO ✦ LUMOS LATTE ✦ WINGARDIUM CROISSANT ✦ EXPECTO PATRONUM ✦ MISCHIEF MANAGED
        </textPath>
      </text>
    </svg>
  );
}
