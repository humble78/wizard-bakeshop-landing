"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScrollText, Sparkles } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartToast() {
  const { toast, openCart, isOpen } = useCart();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-70 flex justify-center px-4 sm:bottom-8"
    >
      <AnimatePresence>
        {toast && !isOpen && (
          <motion.button
            key={toast.id}
            type="button"
            onClick={openCart}
            initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: -60 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-parchment-700/40 bg-parchment px-5 py-3 text-left text-parchment-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-crimson-600 text-gold-200 shadow-[0_0_0_3px_rgba(127,9,9,0.25)]">
              <Sparkles className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="font-heading text-sm font-bold">{toast.item.name}</span>
              <span className="font-fell text-sm italic text-parchment-700">
                inked onto your parchment
              </span>
            </span>
            <ScrollText className="ml-2 size-5 shrink-0 text-parchment-700" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
