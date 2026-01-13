import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}