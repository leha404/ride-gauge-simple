import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share, PlusSquare, Smartphone } from "lucide-react";

export default function Install() {
  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pt-safe pb-10">
      <div className="pt-6">
        <h1 className="text-2xl font-semibold">Install MotoFuel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add it to your iPhone home screen — works fully offline, no account needed.
        </p>
      </div>

      <ol className="mt-6 space-y-3">
        {[
          { Icon: Smartphone, title: "Open in Safari", body: "PWA install only works from Apple's Safari browser on iPhone." },
          { Icon: Share, title: "Tap the Share button", body: "It's the square with an arrow at the bottom of the screen." },
          { Icon: PlusSquare, title: "Add to Home Screen", body: "Scroll down in the share menu and tap “Add to Home Screen”." },
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
        <Link to="/">Open MotoFuel</Link>
      </Button>
    </div>
  );
}
