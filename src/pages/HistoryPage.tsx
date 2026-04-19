import { useFuel } from "@/state/fuel";
import { Button } from "@/components/ui/button";
import { Fuel, MapPin, Pencil, Trash2 } from "lucide-react";
import { HistoryEntry } from "@/lib/storage";

const fmt = (ts: number) =>
  new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function rowMeta(e: HistoryEntry) {
  if (e.type === "trip") return { Icon: MapPin, label: "Trip", value: `−${e.value.toFixed(1)} km`, color: "text-muted-foreground" };
  if (e.type === "refuel") return { Icon: Fuel, label: "Refuel", value: `+${e.value.toFixed(2)} L`, color: "text-primary" };
  return { Icon: Pencil, label: "Set fuel", value: `${e.value.toFixed(2)} L`, color: "text-foreground" };
}

export default function HistoryPage() {
  const { history, deleteEntry } = useFuel();

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-semibold">History</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Local entries only. Deleting an entry doesn't recalculate current fuel.
      </p>

      {history.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center text-muted-foreground">
          <Fuel className="h-10 w-10 opacity-50" />
          <p className="mt-3 text-sm">No entries yet.<br />Add a trip or refuel to get started.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {history.map((e) => {
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
                    <span className="num">→ {e.fuelAfter.toFixed(2)} L</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEntry(e.id)}
                  className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:text-destructive"
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
