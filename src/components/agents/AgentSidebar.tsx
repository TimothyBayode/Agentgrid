import { Compass, History, Home, LayoutGrid, Menu, MonitorPlay } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Discover" },
  { icon: MonitorPlay, label: "Live agents" },
  { icon: LayoutGrid, label: "My grid" },
  { icon: History, label: "History" },
] as const;

export function AgentSidebar() {
  return (
    <nav
      aria-label="Marketplace sections"
      className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t border-border bg-sidebar px-2 lg:top-0 lg:right-auto lg:h-screen lg:w-[64px] lg:flex-col lg:justify-start lg:gap-1 lg:border-t-0 lg:border-r lg:py-4"
    >
      <button
        type="button"
        aria-label="Menu"
        className="hidden h-10 w-10 place-items-center text-sidebar-foreground hover:bg-sidebar-accent lg:mb-4 lg:grid"
      >
        <Menu className="h-5 w-5" />
      </button>

      {items.map((item, index) => (
        <button
          key={item.label}
          type="button"
          aria-label={item.label}
          aria-current={index === 0 ? "page" : undefined}
          className={cn(
            "grid h-10 w-10 place-items-center transition-colors",
            index === 0
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <item.icon className="h-5 w-5" />
        </button>
      ))}
    </nav>
  );
}
