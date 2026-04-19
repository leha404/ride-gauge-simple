import { useEffect, useState } from "react";
import { useFuel } from "@/state/fuel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEFAULT_SETTINGS } from "@/lib/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, clearHistory } = useFuel();
  const [tank, setTank] = useState(String(settings.tankCapacity));
  const [cons, setCons] = useState(String(settings.consumption));

  useEffect(() => {
    setTank(String(settings.tankCapacity));
    setCons(String(settings.consumption));
  }, [settings]);

  const tankN = parseFloat(tank);
  const consN = parseFloat(cons);
  const dirty = tankN !== settings.tankCapacity || consN !== settings.consumption;
  const valid = Number.isFinite(tankN) && tankN > 0 && Number.isFinite(consN) && consN > 0;

  return (
    <div className="pt-6 pb-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Tune your bike's specs.</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl bg-card p-4">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Tank capacity</label>
          <div className="relative mt-2">
            <Input
              type="number"
              inputMode="decimal"
              value={tank}
              onChange={(e) => setTank(e.target.value)}
              className="num h-14 rounded-xl border-border bg-secondary pr-12 text-xl font-semibold"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">L</span>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-4">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Average consumption</label>
          <div className="relative mt-2">
            <Input
              type="number"
              inputMode="decimal"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              className="num h-14 rounded-xl border-border bg-secondary pr-20 text-xl font-semibold"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">L/100km</span>
          </div>
        </div>

        <Button
          disabled={!dirty || !valid}
          onClick={() => updateSettings({ tankCapacity: tankN, consumption: consN })}
          className="h-14 w-full rounded-2xl text-base font-semibold"
        >
          Save changes
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={resetSettings}
            className="h-12 rounded-2xl"
          >
            Reset defaults
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="h-12 rounded-2xl text-destructive hover:text-destructive">
                Clear history
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This deletes all trip and refuel entries. Your current fuel level is not affected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="pt-2 text-center text-xs text-muted-foreground">
          Defaults: {DEFAULT_SETTINGS.tankCapacity} L · {DEFAULT_SETTINGS.consumption} L/100km
        </p>
      </div>
    </div>
  );
}
