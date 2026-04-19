export type Settings = {
  tankCapacity: number;
  consumption: number; // L per 100 km
};

export type HistoryEntry = {
  id: string;
  type: "trip" | "refuel" | "set";
  value: number; // km for trip, liters for refuel/set
  fuelAfter: number;
  timestamp: number;
};

const KEYS = {
  settings: "motofuel:settings",
  fuel: "motofuel:currentFuel",
  history: "motofuel:history",
} as const;

export const DEFAULT_SETTINGS: Settings = { tankCapacity: 23, consumption: 7 };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export const storage = {
  getSettings(): Settings {
    const s = read<Settings>(KEYS.settings, DEFAULT_SETTINGS);
    return {
      tankCapacity: Number.isFinite(s.tankCapacity) && s.tankCapacity > 0 ? s.tankCapacity : DEFAULT_SETTINGS.tankCapacity,
      consumption: Number.isFinite(s.consumption) && s.consumption > 0 ? s.consumption : DEFAULT_SETTINGS.consumption,
    };
  },
  setSettings(s: Settings) {
    write(KEYS.settings, s);
  },
  getFuel(fallback: number): number {
    const v = read<number>(KEYS.fuel, fallback);
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
  },
  setFuel(v: number) {
    write(KEYS.fuel, v);
  },
  getHistory(): HistoryEntry[] {
    return read<HistoryEntry[]>(KEYS.history, []);
  },
  setHistory(h: HistoryEntry[]) {
    write(KEYS.history, h);
  },
};

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const fuelUsedFor = (km: number, consumption: number) => (km * consumption) / 100;
export const rangeFor = (fuel: number, consumption: number) =>
  consumption > 0 ? (fuel / consumption) * 100 : 0;
