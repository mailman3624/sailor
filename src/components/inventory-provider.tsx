"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { sampleData } from "@/lib/sample-data";
import type { AppState, DailyCheckEntry, InventoryItem, StockInEntry, StockOutEntry } from "@/lib/types";

const STORAGE_KEY = "sailor-piece-next-v1";
const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;

type Ctx = {
  state: AppState;
  ready: boolean;
  selectItem: (id: string) => void;
  addItem: (item: Omit<InventoryItem, "recipe" | "steps"> & { recipe?: InventoryItem["recipe"]; steps?: string[] }) => void;
  deleteItem: (id: string) => void;
  addStockIn: (entry: Omit<StockInEntry, "id">) => void;
  addStockOut: (entry: Omit<StockOutEntry, "id">) => void;
  addDailyCheck: (entry: Omit<DailyCheckEntry, "id">) => void;
  reset: () => void;
};

const InventoryContext = createContext<Ctx | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(sampleData);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (Array.isArray(parsed.items)) setState(parsed);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);
  const value = useMemo<Ctx>(() => ({
    state,
    ready,
    selectItem: (id) => setState((prev) => ({ ...prev, selectedItemId: id })),
    addItem: (item) => setState((prev) => ({ ...prev, items: [...prev.items, { ...item, recipe: item.recipe ?? [], steps: item.steps ?? [] }], selectedItemId: item.id })),
    deleteItem: (id) => setState((prev) => {
      const items = prev.items.filter((item) => item.id !== id).map((item) => ({ ...item, recipe: item.recipe.filter((r) => r.id !== id) }));
      return { items, stockIns: prev.stockIns.filter((e) => e.itemId !== id), stockOuts: prev.stockOuts.filter((e) => e.itemId !== id), dailyChecks: prev.dailyChecks.filter((e) => e.itemId !== id), selectedItemId: items[0]?.id ?? "" };
    }),
    addStockIn: (entry) => setState((prev) => ({ ...prev, stockIns: [{ ...entry, id: uid() }, ...prev.stockIns] })),
    addStockOut: (entry) => setState((prev) => ({ ...prev, stockOuts: [{ ...entry, id: uid() }, ...prev.stockOuts] })),
    addDailyCheck: (entry) => setState((prev) => ({ ...prev, dailyChecks: [{ ...entry, id: uid() }, ...prev.dailyChecks] })),
    reset: () => setState(sampleData)
  }), [ready, state]);
  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
