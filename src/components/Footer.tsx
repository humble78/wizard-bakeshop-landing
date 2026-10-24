import { ArrowUp, Clock, MapPin, Navigation, Sparkles } from "lucide-react";
import Image from "next/image";
import { FloatingCandles } from "@/components/effects/FloatingCandles";
import { LogoMark } from "@/components/illustrations/LogoMark";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpellButton } from "@/components/ui/SpellButton";
import { DELIVERY, IMAGES } from "@/lib/data";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Registan+Square+Samarkand";

async function CurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer id="visit" aria-labelledby="visit-title" className="relative isolate overflow-hidden pt-24 sm:pt-32">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-gold-400/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 -z-10 size-200 -translate-x-1/2 rounded-full bg-crimson-600/10 blur-[140px]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            id="visit-title"
            align="left"
            eyebrow="Visit the Common Room"
            title={
              <>
                Pull up a chair <span className="text-gilded">by the fire</span>
              </>
            }
            description="Velvet armchairs, crackling candles and the smell of fresh treacle tart. Password not required — but appreciated."
          />

          <ul className="mt-10 space-y-5">
            <li className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold-400" />
              <div>
                <p className="font-heading font-bold text-parchment-50">Registan Street 9¾, Samarkand</p>
                <p className="font-fell text-base italic text-parchment-200/60">
                  Look for the brick archway — and walk straight through.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-gold-400" />
              <div>
                <p className="font-heading font-bold text-parchment-50">Daily {DELIVERY.hours}</p>
                <p className="font-fell text-base italic text-parchment-200/60">
                  Lumos at opening, Nox at closing. Owls fly the same hours.
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <SpellButton href={MAPS_URL} external icon={<Navigation className="size-4" />}>
              Open in Maps
            </SpellButton>
            <SpellButton href="#menu" variant="ghost">
              Browse the menu
            </SpellButton>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-md">
          <div className="pointer-events-none absolute -inset-x-16 -top-24 bottom-1/2">
            <FloatingCandles count={6} seed={9} />
          </div>
          <div className="arch relative aspect-4/5 overflow-hidden p-2 ring-1 ring-gold-400/30 shadow-[0_40px_100px_-30px_rgba(0,0,0,1),0_0_80px_-30px_rgba(232,193,90,0.5)]">
            <div className="arch relative size-full overflow-hidden">
              <Image
                src={IMAGES.cafe}
                alt="The warmly lit interior of a café at night"
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover sepia-[.3]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
            </div>
          </div>
          <figcaption className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gold-400/30 bg-ink-900/90 px-5 py-2.5 font-heading text-[0.65rem] font-bold uppercase tracking-[0.3em] text-gold-300 backdrop-blur-md">
            <Sparkles className="size-3.5" /> Est. in Samarkand
          </figcaption>
        </figure>
      </div>

      {/* Sign-off */}
      <div className="mt-28 border-t border-gold-400/10 pt-12">
        <p
          aria-hidden="true"
          className="text-gilded animate-shimmer select-none text-center font-display text-[7.4vw] font-black leading-none tracking-tight motion-reduce:animate-none"
        >
          Mischief Managed
        </p>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-parchment-200/10 px-5 py-8 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <LogoMark className="size-8 text-gold-400" />
            <p className="text-sm text-parchment-200/60">
              © <CurrentYear /> Espresso Patronum · Samarkand
            </p>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-parchment-200/40">
            An unofficial, fan-made tribute. Not affiliated with or endorsed by Warner Bros. or the Wizarding World.
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.25em] text-parchment-200/60 transition-colors hover:text-gold-300"
          >
            Back to the Great Hall
            <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
