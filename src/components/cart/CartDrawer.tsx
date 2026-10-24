"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Feather, Minus, Plus, ScrollText, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Owl } from "@/components/illustrations/Owl";
import { SpellButton } from "@/components/ui/SpellButton";
import { DELIVERY } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { lines, subtotal, count, setQuantity, clear, isOpen, closeCart } = useCart();
  const [sent, setSent] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  const deliveryFee = subtotal === 0 || subtotal >= DELIVERY.freeFrom ? 0 : DELIVERY.fee;
  const remainingForFree = Math.max(0, DELIVERY.freeFrom - subtotal);
  const freeProgress = Math.min(1, subtotal / DELIVERY.freeFrom);

  const sendByOwl = () => {
    setSent(true);
    clear();
  };

  return (
    <AnimatePresence onExitComplete={() => setSent(false)}>
      {isOpen && (
        <div key="parchment" className="fixed inset-0 z-80">
          <motion.div
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="parchment-title"
            className="bg-parchment absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col text-parchment-900 shadow-[-30px_0_80px_-20px_rgba(0,0,0,0.9)]"
            initial={{ x: "100%", rotateY: -12 }}
            animate={{ x: 0, rotateY: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            style={{ transformPerspective: 1200, originX: 1 }}
          >
            {/* Scroll roller */}
            <span className="absolute inset-y-0 left-0 w-2.5 bg-linear-to-r from-parchment-800 via-parchment-600 to-parchment-400 shadow-[4px_0_10px_rgba(47,33,14,0.35)]" />

            <header className="flex items-center justify-between gap-4 border-b border-parchment-700/25 px-8 pb-5 pt-7">
              <div>
                <p className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-crimson-600">
                  {count} {count === 1 ? "item" : "items"} inked
                </p>
                <h2 id="parchment-title" className="font-display text-3xl font-bold">
                  Your Parchment
                </h2>
              </div>
              <button
                ref={closeButton}
                type="button"
                onClick={closeCart}
                aria-label="Close parchment"
                className="grid size-11 place-items-center rounded-full border border-parchment-700/30 transition-colors hover:bg-parchment-900 hover:text-parchment-50"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-8">
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 py-16 text-center">
                  <motion.div
                    initial={{ x: -40, y: 40, rotate: -10, opacity: 0 }}
                    animate={{ x: [-40, 0, 160], y: [40, 0, -180], rotate: [-10, 0, 12], opacity: [0, 1, 0] }}
                    transition={{ duration: 3.2, times: [0, 0.35, 1], ease: "easeInOut" }}
                  >
                    <Owl className="w-28" flap={0.22} />
                  </motion.div>
                  <h3 className="font-heading text-2xl font-bold">Your owl has taken flight!</h3>
                  <p className="max-w-xs font-fell text-lg italic text-parchment-800">
                    Expect a gentle tap at your window in about 25 minutes. Mischief managed.
                  </p>
                  <SpellButton variant="ink" onClick={closeCart}>
                    Back to the castle
                  </SpellButton>
                </div>
              ) : lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                  <ScrollText className="size-12 text-parchment-600" strokeWidth={1.2} />
                  <h3 className="font-heading text-xl font-bold">This parchment is blank</h3>
                  <p className="max-w-xs font-fell text-lg italic text-parchment-800">
                    Tap your wand on a treat from the Marauder’s Menu and it will appear here.
                  </p>
                  <SpellButton variant="ink" href="#menu" onClick={closeCart}>
                    Open the map
                  </SpellButton>
                </div>
              ) : (
                <ul className="py-2">
                  <AnimatePresence initial={false}>
                    {lines.map(({ item, quantity }) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                        className="flex items-center gap-4 border-b border-dashed border-parchment-700/30 py-4"
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-parchment-700/30">
                          <Image src={item.image} alt="" fill sizes="64px" className="object-cover sepia-[.25]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-heading text-sm font-bold">{item.name}</p>
                          <p className="text-xs text-parchment-700">{formatPrice(item.price)} each</p>
                          <div className="mt-2 inline-flex items-center rounded-full border border-parchment-700/30">
                            <button
                              type="button"
                              onClick={() => setQuantity(item.id, quantity - 1)}
                              aria-label={`Remove one ${item.name}`}
                              className="grid size-7 place-items-center rounded-full transition-colors hover:bg-parchment-900 hover:text-parchment-50"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-7 text-center font-heading text-sm font-bold tabular-nums">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(item.id, quantity + 1)}
                              aria-label={`Add one more ${item.name}`}
                              className="grid size-7 place-items-center rounded-full transition-colors hover:bg-parchment-900 hover:text-parchment-50"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="font-heading text-sm font-bold tabular-nums">
                          {formatPrice(item.price * quantity)}
                        </p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {!sent && lines.length > 0 && (
              <footer className="space-y-4 border-t border-parchment-700/25 px-8 pb-8 pt-5">
                <div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-parchment-700/20">
                    <motion.div
                      className="h-full rounded-full bg-linear-to-r from-crimson-600 to-gold-500"
                      animate={{ width: `${freeProgress * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 font-fell text-sm italic text-parchment-800">
                    <Feather className="size-3.5" />
                    {remainingForFree > 0
                      ? `${formatPrice(remainingForFree)} more for free owl delivery`
                      : "Hedwig flies this one for free!"}
                  </p>
                </div>

                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-parchment-800">Subtotal</dt>
                    <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-parchment-800">Owl post</dt>
                    <dd className="font-semibold tabular-nums">{deliveryFee ? formatPrice(deliveryFee) : "Free"}</dd>
                  </div>
                  <div className="flex justify-between border-t border-parchment-700/25 pt-2 font-heading text-lg font-bold">
                    <dt>Total</dt>
                    <dd className="tabular-nums">{formatPrice(subtotal + deliveryFee)}</dd>
                  </div>
                </dl>

                <SpellButton variant="ink" onClick={sendByOwl} className="w-full" icon={<Feather className="size-4" />}>
                  Send by Owl
                </SpellButton>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
