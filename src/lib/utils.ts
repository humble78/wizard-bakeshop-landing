import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price in Uzbek so'm. Grouping is done by hand so the server
 * and the browser always produce identical markup (no ICU differences).
 */
export function formatPrice(amount: number) {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS`;
}

/**
 * Seeded PRNG (mulberry32). Decorative randomness — particle positions,
 * candle heights, stars — must be deterministic so the prerendered HTML
 * matches hydration and Cache Components can prerender the page.
 */
export function createRandom(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rounds to two decimals to keep generated inline styles compact. */
export function round(value: number) {
  return Math.round(value * 100) / 100;
}
