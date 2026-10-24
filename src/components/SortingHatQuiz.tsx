"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, RotateCcw, ScrollText } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Starfield } from "@/components/effects/Starfield";
import { Crest } from "@/components/illustrations/Crest";
import { SortingHat } from "@/components/illustrations/SortingHat";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpellButton } from "@/components/ui/SpellButton";
import { HOUSES, IMAGES, MENU_BY_ID, QUIZ, type House, type HouseId } from "@/lib/data";
import { cn, formatPrice, round } from "@/lib/utils";

type Phase =
  | { kind: "question"; index: number }
  | { kind: "sorting" }
  | { kind: "result"; house: HouseId };

const NUMERALS = ["I", "II", "III", "IV"];

const HAT_MUSINGS = [
  "Hmm… a new head! Let’s see what you crave.",
  "Interesting… very interesting.",
  "One more, and I shall know your palate.",
];

const DELIBERATIONS = [
  "Difficult. Very difficult…",
  "Plenty of appetite, I see…",
  "A refined palate, oh yes…",
  "Not a bad sweet tooth, either…",
  "Now, where shall I put you…",
];

const SORTING_MS = 3200;
const DEFAULT_GLOW = "rgba(232, 193, 90, 0.28)";

/** Majority wins; on a tie the Hat trusts your most recent instinct. */
function sortIntoHouse(answers: HouseId[]): HouseId {
  const tally = new Map<HouseId, number>();
  for (const house of answers) tally.set(house, (tally.get(house) ?? 0) + 1);
  const best = Math.max(...tally.values());
  for (let i = answers.length - 1; i >= 0; i--) {
    if (tally.get(answers[i]) === best) return answers[i];
  }
  return answers[0];
}

export function SortingHatQuiz() {
  const [phase, setPhase] = useState<Phase>({ kind: "question", index: 0 });
  const [answers, setAnswers] = useState<HouseId[]>([]);
  const [picked, setPicked] = useState<number | null>(null);

  // Let the chosen option glow for a beat before moving on.
  useEffect(() => {
    if (picked === null || phase.kind !== "question") return;
    const timeout = window.setTimeout(() => {
      const nextAnswers = [...answers, QUIZ[phase.index].options[picked].house];
      setAnswers(nextAnswers);
      setPicked(null);
      setPhase(
        phase.index + 1 < QUIZ.length ? { kind: "question", index: phase.index + 1 } : { kind: "sorting" },
      );
    }, 480);
    return () => window.clearTimeout(timeout);
  }, [picked, phase, answers]);

  // The Hat deliberates, then announces.
  useEffect(() => {
    if (phase.kind !== "sorting") return;
    const timeout = window.setTimeout(
      () => setPhase({ kind: "result", house: sortIntoHouse(answers) }),
      SORTING_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [phase, answers]);

  const goBack = () => {
    if (phase.kind !== "question" || phase.index === 0) return;
    setAnswers((current) => current.slice(0, -1));
    setPhase({ kind: "question", index: phase.index - 1 });
  };

  const restart = () => {
    setAnswers([]);
    setPicked(null);
    setPhase({ kind: "question", index: 0 });
  };

  const house = phase.kind === "result" ? HOUSES[phase.house] : null;
  const speech = house
    ? house.verdict
    : phase.kind === "question"
      ? HAT_MUSINGS[phase.index]
      : "Hmm… let me look inside your stomach…";

  return (
    <section id="sorting" aria-labelledby="sorting-title" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-20">
        <Image src={IMAGES.library} alt="" fill sizes="100vw" className="object-cover opacity-[0.08] saturate-0" />
        <div className="absolute inset-0 bg-linear-to-b from-ink-950 via-ink-950/80 to-ink-950" />
      </div>
      <Starfield count={60} seed={12} className="-z-10 opacity-60" />

      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          id="sorting-title"
          eyebrow="The Sorting Hat"
          title={
            <>
              Let the Hat choose <span className="text-gilded">your treat</span>
            </>
          }
          description="Three questions. One ancient, slightly singed hat. A pastry chosen for your very soul."
        />

        <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* The hat on its stool */}
          <div className="relative flex flex-col items-center">
            <motion.div
              aria-hidden="true"
              className="absolute top-6 size-72 rounded-full blur-3xl sm:size-96"
              animate={{ backgroundColor: house ? house.colors.glow : DEFAULT_GLOW }}
              transition={{ duration: 1.2 }}
            />

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={speech}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="bg-parchment relative z-10 mb-6 max-w-sm rounded-2xl px-6 py-4 text-center font-fell text-lg italic leading-snug text-parchment-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]"
              >
                “{speech}”
                <span className="bg-parchment absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45" />
              </motion.blockquote>
            </AnimatePresence>

            <SortingHat
              thinking={phase.kind === "sorting"}
              className="relative z-10 w-56 drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)] sm:w-72"
            />
            <div className="-mt-6 h-6 w-64 rounded-[50%] bg-black/60 blur-md sm:w-80" />
          </div>

          {/* The quiz card */}
          <div
            aria-live="polite"
            className="relative overflow-hidden rounded-4xl border border-gold-400/15 bg-ink-900/70 p-6 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-10 lg:min-h-140"
          >
            <span className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-gold-400/10 blur-3xl" />
            <AnimatePresence mode="wait">
              {phase.kind === "question" && (
                <QuestionStep
                  key={`question-${phase.index}`}
                  index={phase.index}
                  picked={picked}
                  onPick={setPicked}
                  onBack={goBack}
                />
              )}
              {phase.kind === "sorting" && <SortingStep key="sorting" />}
              {house && <ResultStep key={`result-${house.id}`} house={house} onRestart={restart} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const stepMotion = {
  initial: { opacity: 0, x: 40, filter: "blur(8px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -40, filter: "blur(8px)" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

interface QuestionStepProps {
  index: number;
  picked: number | null;
  onPick: (option: number) => void;
  onBack: () => void;
}

function QuestionStep({ index, picked, onPick, onBack }: QuestionStepProps) {
  const question = QUIZ[index];

  return (
    <motion.div {...stepMotion} className="relative">
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
          Question {index + 1} of {QUIZ.length}
        </p>
        <div className="flex gap-2" aria-hidden="true">
          {QUIZ.map((q, i) => (
            <span
              key={q.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i < index && "w-6 bg-gold-500",
                i === index && "w-10 bg-gold-300 shadow-[0_0_12px_rgba(245,217,139,0.9)]",
                i > index && "w-6 bg-parchment-200/15",
              )}
            />
          ))}
        </div>
      </div>

      <h3 className="mt-6 font-heading text-2xl font-bold leading-snug text-parchment-50 text-balance sm:text-3xl">
        {question.prompt}
      </h3>

      <ul className="mt-8 grid gap-3">
        {question.options.map((option, i) => {
          const isPicked = picked === i;
          return (
            <motion.li
              key={option.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => onPick(i)}
                disabled={picked !== null}
                aria-pressed={isPicked}
                className={cn(
                  "group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-300 sm:px-5",
                  isPicked
                    ? "border-gold-300 bg-gold-400/15 shadow-[0_0_40px_-10px_rgba(232,193,90,0.8)]"
                    : "border-parchment-200/10 bg-ink-800/60 hover:-translate-y-0.5 hover:border-gold-400/50 hover:bg-ink-700/60",
                  picked !== null && !isPicked && "opacity-35",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border font-heading text-xs font-bold transition-colors",
                    isPicked ? "border-gold-300 bg-gold-300 text-ink-950" : "border-gold-400/30 text-gold-300",
                  )}
                >
                  {isPicked ? <Check className="size-4" /> : NUMERALS[i]}
                </span>
                <span className="font-fell text-lg italic leading-snug text-parchment-100">{option.label}</span>
                <ArrowRight className="ml-auto size-4 shrink-0 -translate-x-2 text-gold-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </button>
            </motion.li>
          );
        })}
      </ul>

      {index > 0 && (
        <button
          type="button"
          onClick={onBack}
          disabled={picked !== null}
          className="mt-6 inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-parchment-200/50 transition-colors hover:text-gold-300"
        >
          <ArrowLeft className="size-3.5" /> Previous question
        </button>
      )}
    </motion.div>
  );
}

function SortingStep() {
  const [line, setLine] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setLine((current) => (current + 1) % DELIBERATIONS.length), 750);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      {...stepMotion}
      className="flex min-h-104 flex-col items-center justify-center gap-10 text-center lg:min-h-116"
    >
      <div className="relative size-32" aria-hidden="true">
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        >
          {Object.values(HOUSES).map((h, i) => {
            const angle = (i / 4) * Math.PI * 2;
            return (
              <span
                key={h.id}
                className="absolute size-4 rounded-full"
                style={{
                  left: `${round(50 + Math.cos(angle) * 44)}%`,
                  top: `${round(50 + Math.sin(angle) * 44)}%`,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: h.colors.accent,
                  boxShadow: `0 0 18px 4px ${h.colors.glow}`,
                }}
              />
            );
          })}
        </motion.div>
        <div className="absolute inset-6 rounded-full border border-dashed border-gold-400/40" />
        <div className="absolute inset-0 grid place-items-center font-display text-3xl text-gold-300">?</div>
      </div>

      <div className="h-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.3 }}
            className="font-fell text-2xl italic text-parchment-100"
          >
            {DELIBERATIONS[line]}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="font-heading text-xs uppercase tracking-[0.3em] text-gold-400/70">The Hat is deliberating</p>
    </motion.div>
  );
}

const resultContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const resultItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// Celebration sparks fanning out from the crest.
const CREST_SPARKS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const distance = 70 + (i % 3) * 22;
  return { x: round(Math.cos(angle) * distance), y: round(Math.sin(angle) * distance) };
});

function ResultStep({ house, onRestart }: { house: House; onRestart: () => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const special = MENU_BY_ID[house.specialId];

  return (
    <motion.div {...stepMotion} className="relative">
      <motion.div variants={resultContainer} initial="hidden" animate="show">
        <motion.div
          variants={resultItem}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
          style={{
            background: `linear-gradient(135deg, ${house.colors.primary} 0%, #0b0910 120%)`,
            boxShadow: `0 30px 80px -30px ${house.colors.glow}`,
          }}
        >
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full opacity-40"
            style={{ background: `conic-gradient(from 0deg, transparent, ${house.colors.secondary}, transparent 30%)` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative flex items-center gap-5 sm:gap-7">
            <div className="relative shrink-0">
              {CREST_SPARKS.map((spark, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 size-1.5 rotate-45"
                  style={{ backgroundColor: house.colors.secondary }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: spark.x, y: spark.y, opacity: 0 }}
                  transition={{ duration: 1.1, delay: 0.25, ease: [0.2, 0.8, 0.3, 1] }}
                />
              ))}
              <motion.div
                initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
              >
                <Crest house={house} className="w-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] sm:w-24" />
              </motion.div>
            </div>
            <div>
              <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-parchment-100/70">
                The Hat has spoken
              </p>
              <h3
                className="font-display text-3xl font-black leading-none sm:text-4xl xl:text-[2.75rem]"
                style={{ color: house.colors.secondary, textShadow: `0 0 30px ${house.colors.glow}` }}
              >
                {house.name}
              </h3>
              <p className="mt-2 font-fell text-base italic text-parchment-100/80">{house.traits}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={resultItem} className="mt-6 grid items-center gap-5 sm:grid-cols-[9.5rem_1fr]">
          <div className="arch relative aspect-4/5 w-32 overflow-hidden ring-1 ring-gold-400/30 sm:w-full">
            <Image src={special.image} alt={special.name} fill sizes="160px" className="object-cover brightness-90 sepia-[.15]" />
          </div>
          <div>
            <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold-400">
              Your enchanted pairing
            </p>
            <h4 className="mt-1 font-heading text-2xl font-bold text-parchment-50">{special.name}</h4>
            <p className="mt-2 font-fell text-lg italic leading-snug text-parchment-200/70">{special.description}</p>
            <p className="mt-3 font-heading text-xl font-bold text-gold-300">{formatPrice(special.price)}</p>
          </div>
        </motion.div>

        <motion.div variants={resultItem} className="mt-7 flex flex-wrap gap-3">
          <SpellButton
            onClick={() => {
              add(special);
              setAdded(true);
            }}
            icon={added ? <Check className="size-4" /> : <ScrollText className="size-4" />}
          >
            {added ? "Add another" : "Add to Parchment"}
          </SpellButton>
          <SpellButton variant="ghost" onClick={onRestart} icon={<RotateCcw className="size-4" />}>
            Sort me again
          </SpellButton>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
