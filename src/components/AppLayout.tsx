import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-md px-5 pt-safe pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
