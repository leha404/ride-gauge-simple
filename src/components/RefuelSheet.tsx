import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFuel } from "@/state/fuel";
import { cn } from "@/lib/utils";
import { clamp } from "@/lib/storage";

type Props = { open: boolean; onOpenChange: (o: boolean) => void };
type Mode = "add" | "set";

export function RefuelSheet({ open, onOpenChange }: Props) {
  const { settings, fuel, addLiters, setExact, fillToFull } = useFuel();
  const [mode, setMode] = useState<Mode>("add");
  const [value, setValue] = useState("");

  const num = parseFloat(value);
  const valid = Number.isFinite(num) && num >= 0 && (mode === "add" ? num > 0 : true);
  const after = valid
    ? mode === "add"
      ? clamp(fuel + num, 0, settings.tankCapacity)
      : clamp(num, 0, settings.tankCapacity)
    : fuel;

  const reset = () => setValue("");
  const close = (o: boolean) => { onOpenChange(o); if (!o) reset(); };

  const submit = () => {
    if (!valid) return;
    if (mode === "add") addLiters(num);
    else setExact(num);
    reset();
    onOpenChange(false);
  };

  const quick = (delta: number) => {
    setMode("add");
    setValue(String(delta));
  };

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent side="bottom" className="rounded-t-3xl border-border bg-card pb-8">
        <SheetHeader>
          <SheetTitle className="text-2xl">Refuel</SheetTitle>
        </SheetHeader>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
          {(["add", "set"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setValue(""); }}
              className={cn(
                "rounded-xl py-2 text-sm font-medium transition-colors",
                mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {m === "add" ? "Add liters" : "Set exact"}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              {mode === "add" ? "Liters to add" : "Current liters"}
            </label>
            <div className="relative mt-2">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                className="num h-16 rounded-2xl border-border bg-secondary pr-12 text-3xl font-semibold"
              />
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">L</span>
            </div>
          </div>

          {mode === "add" && (
            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" onClick={() => quick(5)} className="h-11 rounded-xl">+5 L</Button>
              <Button variant="secondary" onClick={() => quick(10)} className="h-11 rounded-xl">+10 L</Button>
              <Button variant="secondary" onClick={() => { fillToFull(); onOpenChange(false); }} className="h-11 rounded-xl">
                Fill up
              </Button>
            </div>
          )}

          <div className="rounded-2xl bg-secondary/60 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fuel after</span>
              <span className="num font-medium">
                {after.toFixed(2)} / {settings.tankCapacity} L
              </span>
            </div>
          </div>

          <Button onClick={submit} disabled={!valid} className="h-14 w-full rounded-2xl text-base font-semibold">
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
