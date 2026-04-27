import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  DEFAULT_SETTINGS,
  HistoryEntry,
  Settings,
  clamp,
  fuelUsedFor,
  storage,
} from "@/lib/storage";

type FuelContextValue = {
  settings: Settings;
  fuel: number;
  history: HistoryEntry[];
  percent: number;
  range: number;
  isLow: boolean;
  addTrip: (km: number) => void;
  addLiters: (liters: number) => void;
  setExact: (liters: number) => void;
  fillToFull: () => void;
  updateSettings: (s: Settings) => void;
  resetSettings: () => void;
  deleteEntry: (id: string) => void;
  clearHistory: () => void;
  importHistory: (entries: HistoryEntry[]) => number;
};

const FuelContext = createContext<FuelContextValue | null>(null);

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function FuelProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => storage.getSettings());
  const [fuel, setFuel] = useState<number>(() =>
    clamp(storage.getFuel(storage.getSettings().tankCapacity), 0, storage.getSettings().tankCapacity),
  );
  const [history, setHistory] = useState<HistoryEntry[]>(() => storage.getHistory());

  useEffect(() => storage.setSettings(settings), [settings]);
  useEffect(() => storage.setFuel(fuel), [fuel]);
  useEffect(() => storage.setHistory(history), [history]);

  const log = useCallback((entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    setHistory((h) => [{ ...entry, id: newId(), timestamp: Date.now() }, ...h]);
  }, []);

  const addTrip = useCallback(
    (km: number) => {
      if (!Number.isFinite(km) || km <= 0) return;
      const used = fuelUsedFor(km, settings.consumption);
      const next = clamp(fuel - used, 0, settings.tankCapacity);
      setFuel(next);
      log({ type: "trip", value: km, fuelAfter: next });
    },
    [fuel, settings, log],
  );

  const addLiters = useCallback(
    (liters: number) => {
      if (!Number.isFinite(liters) || liters <= 0) return;
      const next = clamp(fuel + liters, 0, settings.tankCapacity);
      setFuel(next);
      log({ type: "refuel", value: liters, fuelAfter: next });
    },
    [fuel, settings, log],
  );

  const setExact = useCallback(
    (liters: number) => {
      if (!Number.isFinite(liters) || liters < 0) return;
      const next = clamp(liters, 0, settings.tankCapacity);
      setFuel(next);
      log({ type: "set", value: next, fuelAfter: next });
    },
    [settings, log],
  );

  const fillToFull = useCallback(() => {
    const added = settings.tankCapacity - fuel;
    if (added <= 0.001) return;
    setFuel(settings.tankCapacity);
    log({ type: "refuel", value: added, fuelAfter: settings.tankCapacity });
  }, [fuel, settings, log]);

  const updateSettings = useCallback((s: Settings) => {
    setSettings(s);
    setFuel((f) => clamp(f, 0, s.tankCapacity));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);
  const deleteEntry = useCallback((id: string) => setHistory((h) => h.filter((e) => e.id !== id)), []);
  const clearHistory = useCallback(() => setHistory([]), []);
  const importHistory = useCallback((entries: HistoryEntry[]) => {
    const normalized = entries
      .map((entry) => ({
        ...entry,
        id:
          typeof entry.id === "string" && entry.id.trim()
            ? entry.id
            : newId(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
    setHistory(normalized);
    return normalized.length;
  }, []);

  const value = useMemo<FuelContextValue>(() => {
    const percent = settings.tankCapacity > 0 ? (fuel / settings.tankCapacity) * 100 : 0;
    const range = settings.consumption > 0 ? (fuel / settings.consumption) * 100 : 0;
    return {
      settings,
      fuel,
      history,
      percent,
      range,
      isLow: percent < 15,
      addTrip,
      addLiters,
      setExact,
      fillToFull,
      updateSettings,
      resetSettings,
      deleteEntry,
      clearHistory,
      importHistory,
    };
  }, [settings, fuel, history, addTrip, addLiters, setExact, fillToFull, updateSettings, resetSettings, deleteEntry, clearHistory, importHistory]);

  return <FuelContext.Provider value={value}>{children}</FuelContext.Provider>;
}

export function useFuel() {
  const ctx = useContext(FuelContext);
  if (!ctx) throw new Error("useFuel must be used inside <FuelProvider>");
  return ctx;
}
