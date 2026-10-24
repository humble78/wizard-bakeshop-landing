"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { Menu, ScrollText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { LogoMark } from "@/components/illustrations/LogoMark";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#sorting", label: "Sorting Hat" },
  { href: "#menu", label: "The Map" },
  { href: "#owl-post", label: "Owl Post" },
  { href: "#visit", label: "Visit" },
];

const overlay: Variants = {
  hidden: { opacity: 0, clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" },
  show: {
    opacity: 1,
    clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)",
    transition: { duration: 0.7, ease: [0.7, 0, 0.2, 1], staggerChildren: 0.07, delayChildren: 0.25 },
  },
  exit: {
    opacity: 0,
    clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)",
    transition: { duration: 0.5, ease: [0.7, 0, 0.2, 1] },
  },
};

const overlayLink: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    // Tuck away while reading downward, return on the first scroll up.
    setHidden((current) => (y > 520 && y > previous + 4 ? true : y < previous - 4 ? false : current));
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-crimson-500 via-gold-400 to-serpent-400"
        style={{ scaleX: progress }}
      />

      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
        animate={{ y: hidden && !menuOpen ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Main"
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-full border px-3 py-2 transition-[background-color,border-color,box-shadow] duration-500 sm:px-5",
            scrolled || menuOpen
              ? "border-gold-400/15 bg-ink-900/70 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              : "border-transparent",
          )}
        >
          <a href="#top" className="group flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <LogoMark className="size-9 text-gold-300 transition-transform duration-700 group-hover:rotate-[360deg]" />
            <span className="font-heading text-[0.8rem] font-bold uppercase tracking-[0.28em] text-parchment-50">
              Espresso <span className="text-gold-400">Patronum</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative block px-4 py-2 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-parchment-200/80 transition-colors hover:text-gold-300"
                >
                  {link.label}
                  <span className="absolute inset-x-4 bottom-1 h-px origin-center scale-x-0 bg-gold-400 shadow-[0_0_8px_rgba(232,193,90,0.9)] transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open your parchment, ${count} ${count === 1 ? "item" : "items"}`}
              className="relative flex items-center gap-2 rounded-full border border-gold-400/30 bg-ink-950/40 px-3.5 py-2 text-gold-200 transition-all duration-500 hover:border-gold-300 hover:shadow-[0_0_30px_-6px_rgba(232,193,90,0.7)] sm:px-4"
            >
              <ScrollText className="size-4.5" />
              <span className="hidden font-heading text-xs font-semibold uppercase tracking-[0.2em] sm:inline">
                Parchment
              </span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 1.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-crimson-500 px-1 text-[0.65rem] font-bold leading-5 text-gold-100 shadow-[0_0_12px_rgba(196,58,58,0.8)]"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full border border-gold-400/30 text-gold-200 lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-950/95 px-8 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-3">
              {LINKS.map((link, i) => (
                <motion.li key={link.href} variants={overlayLink}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 font-heading text-4xl font-bold text-parchment-50 transition-colors hover:text-gold-300"
                  >
                    <span className="font-fell text-base italic text-gold-400">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.p variants={overlayLink} className="mt-12 font-fell text-lg italic text-parchment-200/60">
              Registan St. 9¾ · Samarkand · Owls fly {`08:00 — 23:00`}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
