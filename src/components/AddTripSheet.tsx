import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFuel } from "@/state/fuel";
import { fuelUsedFor, clamp } from "@/lib/storage";

type Props = { open: boolean; onOpenChange: (o: boolean) => void };

export function AddTripSheet({ open, onOpenChange }: Props) {
  const { settings, fuel, addTrip } = useFuel();
  const [value, setValue] = useState("");

  const km = parseFloat(value);
  const valid = Number.isFinite(km) && km > 0;
  const used = valid ? fuelUsedFor(km, settings.consumption) : 0;
  const after = valid ? clamp(fuel - used, 0, settings.tankCapacity) : fuel;

  const submit = () => {
    if (!valid) return;
    addTrip(km);
    setValue("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setValue(""); }}>
      <SheetContent side="bottom" className="rounded-t-3xl border-border bg-card pb-8">
        <SheetHeader>
          <SheetTitle className="text-2xl">Добавить поездку</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Расстояние</label>
            <div className="relative mt-2">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                className="num h-16 rounded-2xl border-border bg-secondary pr-14 text-3xl font-semibold"
              />
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">км</span>
            </div>
          </div>
          <div className="rounded-2xl bg-secondary/60 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Будет израсходовано</span>
              <span className="num font-medium">{used.toFixed(2)} л</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Останется топлива</span>
              <span className="num font-medium">{after.toFixed(2)} л</span>
            </div>
          </div>
          <Button
            onClick={submit}
            disabled={!valid}
            className="h-14 w-full rounded-2xl text-base font-semibold"
          >
            Сохранить поездку
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
