"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, Feather, Flame, Gift, Mail, MapPin, MoonStar, ScrollText } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Starfield } from "@/components/effects/Starfield";
import { Owl } from "@/components/illustrations/Owl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DELIVERY, DISTRICTS, IMAGES } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    icon: ScrollText,
    title: "Pen your parchment",
    text: "Ink your order here. It’s sealed with wax and rushed up the tower to the Owlery.",
  },
  {
    icon: Flame,
    title: "Brewed by candlelight",
    text: "Potions are pulled and pastries boxed fresh — all in under twelve minutes.",
  },
  {
    icon: Feather,
    title: "Hedwig takes flight",
    text: "Our owls glide over the blue domes of Samarkand, wind-charmed for speed.",
  },
  {
    icon: Gift,
    title: "Delivered still warm",
    text: "Heat-charmed boxes keep tarts toasty and cold brew perfectly chilled.",
  },
];

const NUMERALS = ["I", "II", "III", "IV"];

const STATS = [
  { icon: Clock, value: "≈ 25 min", label: "average flight time" },
  { icon: Feather, value: "Free", label: `owl post from ${formatPrice(DELIVERY.freeFrom)}` },
  { icon: MoonStar, value: DELIVERY.hours, label: "owls on duty, every day" },
];

const FLIGHTS = [
  { className: "top-[14%] w-20 sm:w-28", duration: 17, delay: 0, reverse: false, flap: 0.42 },
  { className: "top-[6%] w-10 opacity-60 blur-[1px] sm:w-14", duration: 26, delay: 7, reverse: false, flap: 0.3 },
  { className: "top-[58%] w-14 opacity-80 sm:w-16", duration: 21, delay: 12, reverse: true, flap: 0.36 },
];

const DRIFTING = [
  { icon: Mail, className: "left-[6%] top-[38%] size-8", duration: 7 },
  { icon: ScrollText, className: "right-[10%] top-[48%] size-10", duration: 9 },
  { icon: Mail, className: "left-[46%] top-[8%] size-6", duration: 8 },
  { icon: ScrollText, className: "left-[18%] bottom-[12%] size-7", duration: 10 },
];

export function OwlPostDelivery() {
  const [districtIndex, setDistrictIndex] = useState(0);
  const district = DISTRICTS[districtIndex];

  return (
    <section id="owl-post" aria-labelledby="owl-post-title" className="relative isolate overflow-hidden py-24 sm:py-36">
      {/* Night sky */}
      <div className="absolute inset-0 -z-30">
        <Image src={IMAGES.nightSky} alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-linear-to-b from-ink-950 via-ink-950/60 to-ink-950" />
      </div>
      <Starfield count={110} seed={77} className="-z-20" />

      {/* Moon */}
      <motion.div
        aria-hidden="true"
        className="absolute right-[7%] top-[5%] -z-20 size-24 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fffbea,#f3e6c4_45%,#bfa979)] shadow-[0_0_90px_25px_rgba(243,230,196,0.22)] sm:size-36"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute left-[28%] top-[30%] size-[18%] rounded-full bg-parchment-400/30" />
        <span className="absolute left-[58%] top-[55%] size-[12%] rounded-full bg-parchment-400/25" />
        <span className="absolute left-[40%] top-[68%] size-[8%] rounded-full bg-parchment-400/25" />
      </motion.div>

      {/* Owls on their rounds */}
      {FLIGHTS.map((flight, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className={cn("pointer-events-none absolute left-0 -z-10", flight.className)}
          style={{ scaleX: flight.reverse ? -1 : 1 }}
          initial={{ x: flight.reverse ? "110vw" : "-20vw" }}
          animate={{
            x: flight.reverse ? ["110vw", "-20vw"] : ["-20vw", "110vw"],
            y: [0, -40, 10, -30, 0],
          }}
          transition={{
            x: { duration: flight.duration, delay: flight.delay, repeat: Infinity, repeatDelay: 3, ease: "linear" },
            y: { duration: flight.duration / 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Owl className="w-full" flap={flight.flap} letter={!flight.reverse} />
        </motion.div>
      ))}

      {/* Drifting letters & scrolls */}
      {DRIFTING.map(({ icon: Icon, className, duration }, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className={cn("pointer-events-none absolute -z-10 text-gold-300/25", className)}
          animate={{ y: [0, -18, 0], rotate: [-8, 8, -8] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="size-full" strokeWidth={1.2} />
        </motion.div>
      ))}

      <div className="mx-auto max-w-7xl px-5">
        <SectionHeading
          id="owl-post-title"
          eyebrow="Owl Post Delivery"
          title={
            <>
              Hedwig’s Express, <span className="text-gilded">across Samarkand</span>
            </>
          }
          description="From the Registan to Ulugbek’s observatory, our owls deliver warm pastries and steaming potions straight to your windowsill."
        />

        {/* The four stages of an owl's errand */}
        <div className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-8 hidden h-20 w-full lg:block"
          >
            <motion.path
              d="M90 40C210-5 290 85 375 40s250-45 250 0 165 45 285 0"
              fill="none"
              stroke="rgba(232,193,90,0.35)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </svg>

          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.14, duration: 0.9, ease: EASE }}
              className="group relative rounded-3xl border border-parchment-200/10 bg-ink-900/55 p-6 backdrop-blur-md transition-colors duration-500 hover:border-gold-400/40 hover:bg-ink-800/60"
            >
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }}
                transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
                className="relative grid size-16 place-items-center rounded-2xl bg-linear-to-br from-gold-300/20 to-gold-600/5 text-gold-300 shadow-[0_0_30px_-8px_rgba(232,193,90,0.6)] ring-1 ring-gold-400/30 transition-shadow duration-500 group-hover:shadow-[0_0_45px_-4px_rgba(232,193,90,0.8)]"
              >
                <Icon className="size-7" strokeWidth={1.4} />
              </motion.div>
              <p className="mt-6 font-heading text-sm font-bold tracking-[0.3em] text-gold-500">{NUMERALS[i]}</p>
              <h3 className="mt-1 font-heading text-xl font-bold text-parchment-50">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-parchment-200/65">{text}</p>
            </motion.article>
          ))}
        </div>

        {/* Flight planner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-16 grid items-stretch gap-6 lg:mt-20 lg:grid-cols-[1.25fr_0.75fr]"
        >
          <div className="rounded-4xl border border-gold-400/15 bg-ink-900/60 p-6 backdrop-blur-xl sm:p-9">
            <p className="flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
              <MapPin className="size-3.5" /> Flight planner
            </p>
            <h3 className="mt-3 font-heading text-2xl font-bold text-parchment-50 sm:text-3xl">
              Where shall Hedwig fly?
            </h3>
            <p className="mt-2 font-fell text-lg italic text-parchment-200/65">
              Choose your district for an owl-flight estimate.
            </p>

            <div role="radiogroup" aria-label="Delivery district" className="mt-7 flex flex-wrap gap-2">
              {DISTRICTS.map((d, i) => {
                const active = i === districtIndex;
                return (
                  <button
                    key={d.name}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setDistrictIndex(i)}
                    className={cn(
                      "relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300",
                      active
                        ? "border-gold-300 text-ink-950"
                        : "border-parchment-200/15 text-parchment-200/80 hover:border-gold-400/50 hover:text-gold-200",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="district-pill"
                        className="absolute inset-0 rounded-full bg-linear-to-b from-gold-200 to-gold-500 shadow-[0_0_24px_-4px_rgba(232,193,90,0.8)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{d.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Owl post slip */}
          <div className="relative perspective-[1200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={district.name}
                initial={{ opacity: 0, rotateX: -70, y: -20 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: 50, y: 20 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{ originY: 0 }}
                className="bg-parchment relative h-full overflow-hidden rounded-4xl p-6 text-parchment-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] sm:p-8"
              >
                <p className="font-heading text-[0.65rem] font-bold uppercase tracking-[0.3em] text-parchment-700">
                  Owl Post Slip № {String(districtIndex + 1).padStart(3, "0")}
                </p>
                <p className="mt-3 font-display text-3xl font-black leading-tight">{district.name}</p>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-dashed border-parchment-700/30 pb-3">
                    <dt className="text-parchment-800">Flight time</dt>
                    <dd className="font-heading font-bold">≈ {district.minutes} min</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-dashed border-parchment-700/30 pb-3">
                    <dt className="text-parchment-800">Courier</dt>
                    <dd className="font-fell text-base italic">{district.owl}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-parchment-800">Delivery</dt>
                    <dd className="text-right font-heading font-bold">
                      Free from {formatPrice(DELIVERY.freeFrom)}
                      <span className="block font-sans text-xs font-normal text-parchment-700">
                        otherwise {formatPrice(DELIVERY.fee)}
                      </span>
                    </dd>
                  </div>
                </dl>

                <motion.div
                  aria-hidden="true"
                  initial={{ scale: 2.6, opacity: 0, rotate: -40 }}
                  animate={{ scale: 1, opacity: 0.85, rotate: -12 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 16 }}
                  className="absolute right-5 top-5 rounded-md border-2 border-crimson-600 px-2 py-1 text-center font-heading text-[0.55rem] font-black uppercase leading-tight tracking-[0.2em] text-crimson-600"
                >
                  Approved
                  <br />
                  by the Owlery
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick facts */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: EASE }}
              className="flex items-center gap-4 rounded-3xl border border-parchment-200/10 bg-ink-900/50 px-5 py-4 backdrop-blur-md"
            >
              <Icon className="size-6 shrink-0 text-gold-400" strokeWidth={1.5} />
              <div>
                <p className="font-heading text-lg font-bold text-parchment-50">{value}</p>
                <p className="text-sm text-parchment-200/60">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
