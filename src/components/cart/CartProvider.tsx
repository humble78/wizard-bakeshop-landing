"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cartStore } from "@/lib/cart-store";
import { MENU_BY_ID, type MenuItem } from "@/lib/data";

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

interface Toast {
  id: number;
  item: MenuItem;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (item: MenuItem) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toast: Toast | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const quantities = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastId = useRef(0);

  const lines = useMemo(
    () =>
      Object.entries(quantities).flatMap(([id, quantity]) => {
        const item = MENU_BY_ID[id];
        return item ? [{ item, quantity }] : [];
      }),
    [quantities],
  );

  const add = useCallback((item: MenuItem) => {
    cartStore.add(item.id);
    toastId.current += 1;
    setToast({ id: toastId.current, item });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const openCart = useCallback(() => {
    setToast(null);
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => setIsOpen(false), []);

  // Toasts fade on their own after a moment.
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.quantity * line.item.price, 0),
      add,
      setQuantity: cartStore.setQuantity,
      clear: cartStore.clear,
      isOpen,
      openCart,
      closeCart,
      toast,
      dismissToast,
    }),
    [lines, add, isOpen, openCart, closeCart, toast, dismissToast],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return context;
}
