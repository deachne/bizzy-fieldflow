import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AskBizzy } from "./AskBizzy";

export function Layout() {
  return (
    <div className="flex h-screen w-full bg-gradient-earth">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Ask Bizzy Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/40 p-4">
          <AskBizzy />
        </div>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}