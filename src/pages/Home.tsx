import { useState } from "react";
import { useFuel } from "@/state/fuel";
import { FuelGauge } from "@/components/FuelGauge";
import { Button } from "@/components/ui/button";
import { AddTripSheet } from "@/components/AddTripSheet";
import { RefuelSheet } from "@/components/RefuelSheet";
import { AlertTriangle, Fuel, Plus } from "lucide-react";

export default function Home() {
  const { settings, fuel, percent, range, isLow } = useFuel();
  const [tripOpen, setTripOpen] = useState(false);
  const [refuelOpen, setRefuelOpen] = useState(false);

  return (
    <div className="flex flex-col items-center pt-6">
      <div className="w-full">
        <h1 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">MotoFuel</h1>
        <p className="mt-1 text-xs text-muted-foreground">Estimated tank level</p>
      </div>

      <div className="mt-8">
        <FuelGauge
          percent={percent}
          liters={fuel}
          capacity={settings.tankCapacity}
          range={range}
          low={isLow}
        />
      </div>

      {isLow && (
        <div className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="text-sm">
            <div className="font-semibold">Low fuel</div>
            <div className="text-destructive/80">Less than 15% remaining — consider refueling soon.</div>
          </div>
        </div>
      )}

      <div className="mt-8 grid w-full grid-cols-2 gap-3">
        <Button
          onClick={() => setTripOpen(true)}
          variant="secondary"
          className="h-16 flex-col gap-1 rounded-2xl text-sm font-semibold"
        >
          <Plus className="!h-5 !w-5" />
          Add trip
        </Button>
        <Button
          onClick={() => setRefuelOpen(true)}
          className="h-16 flex-col gap-1 rounded-2xl text-sm font-semibold"
        >
          <Fuel className="!h-5 !w-5" />
          Refuel
        </Button>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-card p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Capacity</div>
          <div className="num mt-1 text-xl font-semibold">{settings.tankCapacity} L</div>
        </div>
        <div className="rounded-2xl bg-card p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Consumption</div>
          <div className="num mt-1 text-xl font-semibold">{settings.consumption} L/100km</div>
        </div>
      </div>

      <AddTripSheet open={tripOpen} onOpenChange={setTripOpen} />
      <RefuelSheet open={refuelOpen} onOpenChange={setRefuelOpen} />
    </div>
  );
}
