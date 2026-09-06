import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { AgentSidebar } from "@/components/agents/AgentSidebar";
import { cn } from "@/lib/utils";

type AppShellProps = {
  header?: ReactNode;
  actions?: ReactNode;
  headerClassName?: string;
  children: ReactNode;
};

export function AppShell({ header, actions, headerClassName, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setSidebarOpen((prev) => (isDesktop ? !prev : true));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <AgentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={cn(
          "flex flex-col transition-[padding] duration-200",
          sidebarOpen ? "lg:pl-64" : "lg:pl-16",
        )}
      >
        <header
          className={cn(
            "sticky top-0 z-20 flex items-center gap-3 bg-surface/95 px-4 py-3 backdrop-blur-sm sm:px-6",
            headerClassName,
          )}
        >
          <button
            type="button"
            aria-label="Open menu"
            data-tip="Menu"
            onClick={toggleSidebar}
            className="tip tip--bottom grid h-9 w-9 shrink-0 place-items-center border border-border text-foreground transition-colors hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">{header}</div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
        {children}
      </div>
    </div>
  );
}
