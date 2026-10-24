"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartToast } from "@/components/cart/CartToast";
import { LumosCursor } from "@/components/effects/LumosCursor";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        {children}
        <CartDrawer />
        <CartToast />
        <LumosCursor />
      </CartProvider>
    </MotionConfig>
  );
}
