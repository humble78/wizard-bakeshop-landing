import { cn } from "@/lib/utils";

const HEADLINES = [
  "Butterbeer Latte",
  "Treacle Tart",
  "Cauldron Cakes",
  "Felix Felicis Raf",
  "Owl Post across Samarkand",
  "Chocolate Frogs",
  "Polyjuice Cold Brew",
  "Pumpkin Pasties",
];

const NEWS = [
  "Extra! Extra!",
  "Hat sorts 3,000 pastry lovers",
  "Owl spotted over Registan",
  "Cauldron cake shortage averted",
  "Lumos at 08:00 sharp",
  "Chocolate frog escapes, recaptured",
];

function Ribbon({ items, className, reverse = false }: { items: string[]; className?: string; reverse?: boolean }) {
  return (
    <div className={cn("flex w-[112%] -translate-x-[6%] overflow-hidden py-4 sm:py-5", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 animate-marquee items-center motion-reduce:animate-none",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {[...items, ...items].map((text, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap pr-8">
            {text}
            <span className="text-[0.7em] opacity-70">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two crossing enchanted ribbons — house colours, Daily Prophet headlines. */
export function ProphetMarquee() {
  return (
    <section aria-hidden="true" className="relative overflow-hidden py-14 sm:py-20">
      <Ribbon
        items={NEWS}
        reverse
        className="rotate-2 bg-serpent-700 font-fell text-lg italic text-parchment-100/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] sm:text-xl"
      />
      <Ribbon
        items={HEADLINES}
        className="relative z-10 -mt-12 -rotate-2 border-y border-gold-400/40 bg-linear-to-r from-crimson-600 via-crimson-500 to-crimson-600 font-heading text-xl font-bold uppercase tracking-[0.2em] text-gold-200 shadow-[0_20px_60px_-15px_rgba(127,9,9,0.8)] sm:-mt-14 sm:text-2xl"
      />
    </section>
  );
}
