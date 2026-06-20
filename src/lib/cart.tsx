import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Course } from "./courses";

type CartCtx = {
  items: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  total: (courses: Course[]) => number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "innovatech_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      add: (id) => setItems((prev) => (prev.includes(id) ? prev : [...prev, id])),
      remove: (id) => setItems((prev) => prev.filter((x) => x !== id)),
      clear: () => setItems([]),
      has: (id) => items.includes(id),
      total: (courses) =>
        items.reduce((s, id) => s + (courses.find((c) => c.id === id)?.priceClp ?? 0), 0),
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
