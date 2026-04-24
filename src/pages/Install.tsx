import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share, PlusSquare, Smartphone } from "lucide-react";

export default function Install() {
  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pt-safe pb-10">
      <div className="pt-6">
        <h1 className="text-2xl font-semibold">Установка MotoFuel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Добавьте приложение на главный экран iPhone — работает полностью офлайн, аккаунт не нужен.
        </p>
      </div>

      <ol className="mt-6 space-y-3">
        {[
          { Icon: Smartphone, title: "Откройте в Safari", body: "Установка PWA на iPhone работает только через браузер Safari от Apple." },
          { Icon: Share, title: "Нажмите кнопку «Поделиться»", body: "Это квадрат со стрелкой внизу экрана." },
          { Icon: PlusSquare, title: "Добавить на экран «Домой»", body: "Прокрутите меню «Поделиться» вниз и нажмите «Добавить на экран «Домой»»." },
        ].map(({ Icon, title, body }, i) => (
          <li key={i} className="flex gap-3 rounded-2xl bg-card p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{i + 1}. {title}</div>
              <div className="mt-0.5 text-sm text-muted-foreground">{body}</div>
            </div>
          </li>
        ))}
      </ol>

      <Button asChild className="mt-8 h-14 w-full rounded-2xl text-base font-semibold">
        <Link to="/">Открыть MotoFuel</Link>
      </Button>
    </div>
  );
}
