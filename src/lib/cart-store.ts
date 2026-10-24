import { MENU_BY_ID } from "./data";

/** itemId → quantity */
export type CartState = Readonly<Record<string, number>>;

const STORAGE_KEY = "espresso-patronum:parchment";
const EMPTY: CartState = Object.freeze({});

let state: CartState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function readStorage(): CartState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return EMPTY;

    const next: Record<string, number> = {};
    for (const [id, qty] of Object.entries(parsed)) {
      // Drop anything the menu no longer serves.
      if (MENU_BY_ID[id] && typeof qty === "number" && qty > 0) {
        next[id] = Math.min(Math.floor(qty), 99);
      }
    }
    return next;
  } catch {
    return EMPTY;
  }
}

function commit(next: CartState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage disabled — the cart still works in memory.
  }
  listeners.forEach((listener) => listener());
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): CartState {
    if (!hydrated && typeof window !== "undefined") {
      hydrated = true;
      state = readStorage();
    }
    return state;
  },

  getServerSnapshot(): CartState {
    return EMPTY;
  },

  add(id: string, by = 1) {
    const current = cartStore.getSnapshot();
    commit({ ...current, [id]: Math.min((current[id] ?? 0) + by, 99) });
  },

  setQuantity(id: string, quantity: number) {
    const current = cartStore.getSnapshot();
    if (quantity <= 0) {
      const rest = { ...current };
      delete rest[id];
      commit(rest);
      return;
    }
    commit({ ...current, [id]: Math.min(quantity, 99) });
  },

  clear() {
    commit(EMPTY);
  },
};
