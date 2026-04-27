import { useFuel } from "@/state/fuel";
import { Button } from "@/components/ui/button";
import { Fuel, MapPin, Pencil, Trash2 } from "lucide-react";
import { fuelUsedFor, HistoryEntry } from "@/lib/storage";

const fmt = (ts: number) =>
  new Date(ts).toLocaleString("ru-RU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const dayKey = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const fmtDay = (ts: number) =>
  new Date(ts).toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

function rowMeta(e: HistoryEntry) {
  if (e.type === "trip") return { Icon: MapPin, label: "Поездка", value: `−${e.value.toFixed(1)} км`, color: "text-muted-foreground" };
  if (e.type === "refuel") return { Icon: Fuel, label: "Заправка", value: `+${e.value.toFixed(2)} л`, color: "text-primary" };
  return { Icon: Pencil, label: "Установлено", value: `${e.value.toFixed(2)} л`, color: "text-foreground" };
}

export default function HistoryPage() {
  const { history, settings, deleteEntry } = useFuel();
  const groupedByDay = history.reduce<
    Array<{ key: string; label: string; dayKm: number; dayLiters: number; entries: HistoryEntry[] }>
  >((acc, entry) => {
    const key = dayKey(entry.timestamp);
    const currentGroup = acc.at(-1);

    if (!currentGroup || currentGroup.key !== key) {
      acc.push({
        key,
        label: fmtDay(entry.timestamp),
        dayKm: entry.type === "trip" ? entry.value : 0,
        dayLiters: entry.type === "trip" ? fuelUsedFor(entry.value, settings.consumption) : 0,
        entries: [entry],
      });
      return acc;
    }

    currentGroup.entries.push(entry);
    if (entry.type === "trip") currentGroup.dayKm += entry.value;
    if (entry.type === "trip") currentGroup.dayLiters += fuelUsedFor(entry.value, settings.consumption);
    return acc;
  }, []);

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-semibold">История</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Только локальные записи. Удаление записи не пересчитывает текущий уровень топлива.
      </p>

      {history.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center text-muted-foreground">
          <Fuel className="h-10 w-10 opacity-50" />
          <p className="mt-3 text-sm">Пока нет записей.<br />Добавьте поездку или заправку, чтобы начать.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {groupedByDay.map((group) => (
            <li key={group.key} className="list-none">
              <p className="mb-1 text-right text-xs text-muted-foreground">
                {group.label}
                {" · "}
                <span className="num text-orange-500">{group.dayKm.toFixed(1)} км за день</span>
                {" · "}
                <span className="num text-emerald-500">{group.dayLiters.toFixed(2)} л потрачено</span>
              </p>
              <ul className="space-y-2">
                {group.entries.map((e) => {
                  const { Icon, label, value, color } = rowMeta(e);
                  return (
                    <li
                      key={e.id}
                      className="flex items-center gap-3 rounded-2xl bg-card p-3"
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-medium">{label}</span>
                          <span className={`num text-sm font-semibold ${color}`}>{value}</span>
                        </div>
                        <div className="mt-0.5 flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
                          <span>{fmt(e.timestamp)}</span>
                          <span className="num">→ {e.fuelAfter.toFixed(2)} л</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEntry(e.id)}
                        className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:text-destructive"
                        aria-label="Удалить запись"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
