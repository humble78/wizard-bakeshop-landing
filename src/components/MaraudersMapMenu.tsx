"use client";

import { AnimatePresence, motion, useInView, type Variants } from "framer-motion";
import { CakeSlice, Check, Coffee, Crown, Plus, WandSparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { SpellButton } from "@/components/ui/SpellButton";
import { MENU, MENU_CATEGORIES, type MenuCategory, type MenuItem } from "@/lib/data";
import { cn, formatPrice, round } from "@/lib/utils";

const CATEGORY_ICONS: Record<MenuCategory, typeof Coffee> = {
  potions: Coffee,
  pastries: CakeSlice,
  specials: Crown,
};

const OATH = "I solemnly swear that I am up to no good.";
const OATH_WORDS = OATH.split(" ").reduce<{ word: string; start: number }[]>((words, word) => {
  const previous = words.at(-1);
  words.push({ word, start: previous ? previous.start + previous.word.length + 1 : 0 });
  return words;
}, []);

const EASE = [0.16, 1, 0.3, 1] as const;

// Ink bleeds into the parchment: blurred and faint, then crisp.
const inkGroup: Variants = {
  hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.14 } },
};

const inkItem: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)", transition: { duration: 0.5 } },
  show: (delay: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE, delay },
  }),
};

const oathLetters: Variants = {
  hidden: { transition: { staggerChildren: 0.005, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.5 } },
};

const oathLetter: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  show: { opacity: 1, transition: { duration: 0.15 } },
};

const grid: Variants = {
  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  show: (delay: number) => ({ transition: { staggerChildren: 0.1, delayChildren: delay } }),
  exit: { transition: { staggerChildren: 0.03 } },
};

// Each card unfolds downward from its top edge like a parchment flap.
const card: Variants = {
  hidden: { opacity: 0, rotateX: -80, y: 40, filter: "blur(6px)", transition: { duration: 0.4 } },
  show: { opacity: 1, rotateX: 0, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
  exit: { opacity: 0, y: -16, filter: "blur(6px)", transition: { duration: 0.25 } },
};

export function MaraudersMapMenu() {
  // Observe the section, not the parchment: Chromium treats the parchment's own
  // collapsed clip-path as "not visible", so it would never report intersecting.
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { once: true, margin: "0px 0px -30% 0px" });
  const [unfolded, setUnfolded] = useState(false);
  const [inked, setInked] = useState(true);
  const [category, setCategory] = useState<MenuCategory>("potions");
  // Cards wait for the header ink on a full reveal, but not when switching tabs.
  const [cardsDelay, setCardsDelay] = useState(1.1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const showInk = unfolded && inked;
  const inkState = showInk ? "show" : "hidden";
  const items = MENU.filter((item) => item.category === category);
  const activeCategory = MENU_CATEGORIES.find((c) => c.id === category) ?? MENU_CATEGORIES[0];

  const selectCategory = (next: MenuCategory) => {
    setCardsDelay(0.1);
    setCategory(next);
  };

  const reink = () => {
    setCardsDelay(0.9);
    setInked(true);
  };

  const handleTabKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const current = MENU_CATEGORIES.findIndex((c) => c.id === category);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = (current + step + MENU_CATEGORIES.length) % MENU_CATEGORIES.length;
    selectCategory(MENU_CATEGORIES[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section ref={section} id="menu" aria-labelledby="menu-title" className="relative isolate px-3 py-24 sm:px-6 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/4 -z-10 mx-auto h-[60%] max-w-5xl rounded-full bg-gold-500/10 blur-[120px]"
      />

      <motion.div
        // overflow-clip (not hidden) so the sticky "blank parchment" prompt can follow the viewport.
        className="bg-parchment relative mx-auto max-w-7xl overflow-clip rounded-[28px] text-parchment-900 shadow-[0_60px_140px_-40px_rgba(0,0,0,1),0_0_0_1px_rgba(196,160,99,0.4)]"
        initial={{ clipPath: "inset(0% 50% 0% 50% round 28px)", scaleY: 0.94 }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0% round 28px)", scaleY: 1 } : undefined}
        transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
        onAnimationComplete={() => {
          if (inView) setUnfolded(true);
        }}
      >
        <FoldCreases />

        <AnimatePresence>
          {showInk && (
            <motion.div
              key="footprints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              transition={{ delay: 1.2 }}
              aria-hidden="true"
            >
              <FootprintTrail className="left-[3%] top-[2%] hidden md:block" label="Mr. Crumb" seed={0} />
              <FootprintTrail className="bottom-[4%] right-[4%] hidden md:block" label="Ms. Foam" seed={1} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative px-4 pb-12 pt-14 sm:px-10 sm:pb-16 sm:pt-20 lg:px-14">
          {/* Header — the map's famous dedication, lightly adapted */}
          <motion.header
            variants={inkGroup}
            initial="hidden"
            animate={inkState}
            className="mx-auto flex max-w-3xl flex-col items-center text-center"
          >
            <motion.p variants={inkItem} className="font-fell text-base italic leading-relaxed text-parchment-800 sm:text-lg">
              Messrs. Mocha, Crumb, Foam &amp; Sprinkles
              <br />
              Purveyors of Aids to Magical Breakfast-Makers
              <br />
              are proud to present
            </motion.p>
            <motion.h2
              id="menu-title"
              variants={inkItem}
              className="mt-4 font-display text-[clamp(2.2rem,7vw,4.75rem)] font-black leading-[0.95] text-parchment-900"
            >
              The Marauder’s Menu
            </motion.h2>
            <motion.div variants={inkItem} aria-hidden="true" className="mt-5 flex items-center gap-3 text-parchment-700">
              <span className="h-px w-16 bg-current" />
              <WandSparkles className="size-4" />
              <span className="h-px w-16 bg-current" />
            </motion.div>
            <motion.p variants={oathLetters} className="mt-5 font-fell text-xl italic text-crimson-600 sm:text-2xl">
              <span className="sr-only">{OATH}</span>
              {OATH_WORDS.map(({ word, start }) => (
                <span key={start} aria-hidden="true" className="inline-block whitespace-nowrap">
                  {word.split("").map((char, i) => (
                    <motion.span key={i} variants={oathLetter} className="inline-block">
                      {char}
                    </motion.span>
                  ))}
                  &nbsp;
                </span>
              ))}
            </motion.p>
          </motion.header>

          {/* Category tabs */}
          <motion.div
            variants={inkItem}
            custom={0.9}
            initial="hidden"
            animate={inkState}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div
              role="tablist"
              aria-label="Menu sections"
              onKeyDown={handleTabKeys}
              className="flex flex-wrap justify-center gap-1 sm:gap-4"
            >
              {MENU_CATEGORIES.map((c, i) => {
                const Icon = CATEGORY_ICONS[c.id];
                const active = c.id === category;
                return (
                  <button
                    key={c.id}
                    ref={(node) => {
                      tabs.current[i] = node;
                    }}
                    role="tab"
                    id={`tab-${c.id}`}
                    aria-selected={active}
                    aria-controls="menu-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => selectCategory(c.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-2.5 font-heading text-xs font-bold uppercase tracking-[0.14em] transition-colors sm:text-sm",
                      active ? "text-crimson-600" : "text-parchment-700 hover:text-parchment-900",
                    )}
                  >
                    <Icon className="size-4" />
                    {c.label}
                    {active && (
                      <motion.span
                        layoutId="map-tab-ink"
                        className="absolute inset-x-2 -bottom-0.5 h-[3px] rounded-full bg-crimson-600"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeCategory.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="font-fell text-lg italic text-parchment-700"
              >
                {activeCategory.blurb}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Cards */}
          <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${category}`} className="mt-10">
            <AnimatePresence mode="wait">
              <motion.ul
                key={category}
                variants={grid}
                custom={cardsDelay}
                initial="hidden"
                animate={inkState}
                exit="exit"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
              >
                {items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          <motion.div
            variants={inkItem}
            custom={1.4}
            initial="hidden"
            animate={inkState}
            className="mt-14 flex flex-col items-center gap-4 text-center"
          >
            <p className="font-fell text-base italic text-parchment-700">
              Finished browsing? Wipe the parchment clean before a prefect sees it.
            </p>
            <SpellButton variant="ink" onClick={() => setInked(false)}>
              Mischief Managed
            </SpellButton>
          </motion.div>
        </div>

        {/* Blank parchment prompt */}
        <AnimatePresence>
          {unfolded && !inked && (
            <motion.div
              key="blank"
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <div className="sticky top-[30vh] flex flex-col items-center gap-5 px-6 pt-24 text-center">
                <p className="max-w-md font-fell text-xl italic text-parchment-800">
                  Just an old, blank piece of parchment… nothing to see here.
                </p>
                <SpellButton
                  variant="ink"
                  icon={<WandSparkles className="size-4" />}
                  onClick={reink}
                >
                  I solemnly swear…
                </SpellButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timeout = window.setTimeout(() => setJustAdded(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [justAdded]);

  return (
    <motion.li variants={card} style={{ transformPerspective: 1200, originY: 0 }}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-parchment-700/25 bg-parchment-50/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_18px_40px_-24px_rgba(47,33,14,0.8)] transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-parchment-700/50 hover:shadow-[0_34px_60px_-28px_rgba(47,33,14,0.95)]">
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover sepia-[.4] transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:sepia-0"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(47,33,14,0.55))]" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-parchment-50/90 px-2.5 py-1 font-heading text-[0.6rem] font-bold uppercase tracking-[0.15em] text-parchment-900 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          {item.house && (
            <span className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-crimson-600 font-display text-sm font-black text-gold-200 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_-3px_6px_rgba(0,0,0,0.35)] ring-2 ring-crimson-500/60">
              {item.house[0].toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-heading text-lg font-bold leading-tight text-parchment-900">{item.name}</h3>
          <p className="mt-2 flex-1 font-fell text-[1.05rem] italic leading-snug text-parchment-800">{item.description}</p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-parchment-700/35 pt-4">
            <span className="font-heading text-lg font-bold tabular-nums text-parchment-900">{formatPrice(item.price)}</span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                add(item);
                setJustAdded(true);
              }}
              aria-label={`Add ${item.name} to your parchment`}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 font-heading text-[0.65rem] font-bold uppercase tracking-[0.18em] text-parchment-50 transition-colors duration-300",
                justAdded ? "bg-serpent-500" : "bg-parchment-900 hover:bg-crimson-600",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={justAdded ? "added" : "add"}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {justAdded ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                </motion.span>
              </AnimatePresence>
              {justAdded ? "Inked" : "Add"}
            </motion.button>
          </div>
        </div>
      </article>
    </motion.li>
  );
}

/** Faint creases where the map has been folded a thousand times. */
function FoldCreases() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {[25, 50, 75].map((left) => (
        <span
          key={left}
          className="absolute inset-y-0 w-6 -translate-x-1/2 bg-linear-to-r from-transparent via-parchment-800/10 to-parchment-50/20"
          style={{ left: `${left}%` }}
        />
      ))}
      <span className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-linear-to-b from-transparent via-parchment-800/8 to-parchment-50/15" />
    </div>
  );
}

const STEP_INTERVAL = 0.45;
const STEP_LIFE = 2.6;
const STEPS = 12;
const CYCLE = STEPS * STEP_INTERVAL + STEP_LIFE;

/** Footsteps wandering across the map, each pair fading as the walker moves on. */
function FootprintTrail({ className, label, seed }: { className?: string; label: string; seed: number }) {
  const direction = seed % 2 === 0 ? 1 : -1;
  const steps = Array.from({ length: STEPS }, (_, i) => {
    const x = i * 30;
    const y = 60 + Math.sin(i / 2.2 + seed) * 34;
    const dy = Math.cos(i / 2.2 + seed) * (34 / 2.2);
    const angle = (Math.atan2(dy, 30) * 180) / Math.PI + 90;
    const side = i % 2 === 0 ? -1 : 1;
    const normal = ((angle - 90) * Math.PI) / 180 + Math.PI / 2;
    return {
      x: round((direction === 1 ? x : 330 - x) + Math.cos(normal) * side * 6),
      y: round(y + Math.sin(normal) * side * 6),
      angle: round(direction === 1 ? angle : -angle),
    };
  });
  const last = steps[steps.length - 1];

  return (
    <div className={cn("pointer-events-none absolute h-35 w-90", className)}>
      {steps.map((step, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 9 21"
          className="absolute h-[18px] w-2 text-parchment-900"
          style={{ left: step.x, top: step.y, rotate: step.angle }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0.55, 0] }}
          transition={{
            duration: STEP_LIFE,
            times: [0, 0.08, 0.7, 1],
            delay: i * STEP_INTERVAL,
            repeat: Infinity,
            repeatDelay: CYCLE - STEP_LIFE,
          }}
        >
          <path
            d="M4.5 0C7 0 9 2.6 9 6.6c0 3.3-1.6 5.2-2 7-.3 1-1.1 1.3-2.5 1.3S2.3 14.6 2 13.6c-.4-1.8-2-3.7-2-7C0 2.6 2 0 4.5 0Z"
            fill="currentColor"
          />
          <ellipse cx="4.5" cy="18.4" rx="2.9" ry="2.3" fill="currentColor" />
        </motion.svg>
      ))}
      <motion.span
        className="absolute whitespace-nowrap border border-parchment-900/60 bg-parchment-100/70 px-2 py-0.5 font-fell text-sm italic text-parchment-900"
        style={{ left: last.x + 14, top: last.y - 26 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: STEP_LIFE + 1,
          times: [0, 0.1, 0.75, 1],
          delay: (STEPS - 1) * STEP_INTERVAL,
          repeat: Infinity,
          repeatDelay: CYCLE - STEP_LIFE - 1,
        }}
      >
        {label}
      </motion.span>
    </div>
  );
}
