import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFuel } from "@/state/fuel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEFAULT_SETTINGS, HistoryEntry } from "@/lib/storage";
import { toast } from "@/components/ui/use-toast";
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
  const { settings, history, updateSettings, resetSettings, clearHistory, importHistory } = useFuel();
  const [tank, setTank] = useState(String(settings.tankCapacity));
  const [cons, setCons] = useState(String(settings.consumption));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTank(String(settings.tankCapacity));
    setCons(String(settings.consumption));
  }, [settings]);

  const tankN = parseFloat(tank);
  const consN = parseFloat(cons);
  const dirty = tankN !== settings.tankCapacity || consN !== settings.consumption;
  const valid = Number.isFinite(tankN) && tankN > 0 && Number.isFinite(consN) && consN > 0;

  const isValidEntry = (value: unknown): value is HistoryEntry => {
    if (!value || typeof value !== "object") return false;
    const entry = value as Partial<HistoryEntry>;
    const validType = entry.type === "trip" || entry.type === "refuel" || entry.type === "set";
    return (
      typeof entry.id === "string" &&
      entry.id.trim().length > 0 &&
      validType &&
      typeof entry.value === "number" &&
      Number.isFinite(entry.value) &&
      typeof entry.fuelAfter === "number" &&
      Number.isFinite(entry.fuelAfter) &&
      typeof entry.timestamp === "number" &&
      Number.isFinite(entry.timestamp)
    );
  };

  const handleExport = () => {
    const payload = {
      version: 1,
      exportedAt: Date.now(),
      history,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ride-history-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Экспорт готов", description: `Сохранено ${history.length} записей.` });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      let candidate: unknown = parsed;
      if (
        parsed &&
        typeof parsed === "object" &&
        "history" in parsed &&
        Array.isArray((parsed as { history?: unknown }).history)
      ) {
        candidate = (parsed as { history: unknown }).history;
      }
      if (!Array.isArray(candidate)) {
        throw new Error("Некорректный формат файла.");
      }
      const entries = candidate.filter(isValidEntry);
      if (entries.length === 0) {
        throw new Error("В файле нет корректных записей.");
      }
      const imported = importHistory(entries);
      toast({ title: "Импорт завершен", description: `Загружено ${imported} записей.` });
    } catch (error) {
      toast({
        title: "Не удалось импортировать",
        description: error instanceof Error ? error.message : "Проверьте, что выбран JSON из экспорта приложения.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pt-6 pb-4">
      <h1 className="text-2xl font-semibold">Настройки</h1>
      <p className="mt-1 text-sm text-muted-foreground">Настройте параметры вашего мотоцикла.</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl bg-card p-4">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Объем бака</label>
          <div className="relative mt-2">
            <Input
              type="number"
              inputMode="decimal"
              value={tank}
              onChange={(e) => setTank(e.target.value)}
              className="num h-14 rounded-xl border-border bg-secondary pr-12 text-xl font-semibold"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">л</span>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-4">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Средний расход</label>
          <div className="relative mt-2">
            <Input
              type="number"
              inputMode="decimal"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              className="num h-14 rounded-xl border-border bg-secondary pr-20 text-xl font-semibold"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">л/100 км</span>
          </div>
        </div>

        <Button
          disabled={!dirty || !valid}
          onClick={() => updateSettings({ tankCapacity: tankN, consumption: consN })}
          className="h-14 w-full rounded-2xl text-base font-semibold"
        >
          Сохранить изменения
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={resetSettings}
            className="h-12 rounded-2xl"
          >
            Сбросить по умолчанию
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="h-12 rounded-2xl text-destructive hover:text-destructive">
                Очистить историю
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Очистить всю историю?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это удалит все записи поездок и заправок. Текущий уровень топлива останется без изменений.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Очистить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={handleExport} className="h-12 rounded-2xl">
            Экспорт истории
          </Button>
          <Button variant="secondary" onClick={handleImportClick} className="h-12 rounded-2xl">
            Импорт истории
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
        </div>

        <p className="pt-2 text-center text-xs text-muted-foreground">
          Значения по умолчанию: {DEFAULT_SETTINGS.tankCapacity} л · {DEFAULT_SETTINGS.consumption} л/100 км
        </p>
      </div>
    </div>
  );
}
