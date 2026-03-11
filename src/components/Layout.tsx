import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          © 2026 CivicReport — Empowering citizens to improve their city.
        </div>
      </footer>
    </div>
  );
}
