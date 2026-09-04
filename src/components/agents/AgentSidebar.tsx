import { useEffect } from "react";
import {
  Activity,
  ArrowLeftRight,
  Bot,
  BotMessageSquare,
  Briefcase,
  Compass,
  LifeBuoy,
  PlusCircle,
  Settings,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = { icon: LucideIcon; label: string; active?: boolean };
type SidebarSection = { title: string; items: SidebarItem[] };

const sections: SidebarSection[] = [
  {
    title: "Marketplace",
    items: [{ icon: Compass, label: "Discover Agents", active: true }],
  },
  {
    title: "Activity",
    items: [
      { icon: Briefcase, label: "My Hires" },
      { icon: Activity, label: "Activity" },
      { icon: ArrowLeftRight, label: "Transactions" },
    ],
  },
  {
    title: "My Agents",
    items: [
      { icon: Bot, label: "My Agents" },
      { icon: PlusCircle, label: "List an Agent" },
    ],
  },
  { title: "Tools", items: [{ icon: BotMessageSquare, label: "Ask Grid" }] },
];

const accountSection: SidebarSection = {
  title: "Account",
  items: [
    { icon: Settings, label: "Settings" },
    { icon: LifeBuoy, label: "Help & Support" },
  ],
};

type AgentSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AgentSidebar({ open, onClose }: AgentSidebarProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-label="AgentGrid navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-black text-white transition-all duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          !open && "lg:w-16",
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-white/10 py-4",
            open ? "justify-between px-5" : "justify-center px-0",
          )}
        >
          <img
            src={open ? "/logo.svg" : "/favicon.svg"}
            alt="AgentGrid"
            className={open ? "h-7 w-auto" : "h-8 w-8"}
          />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-[2px] text-white/60 transition-colors hover:bg-white/10 hover:text-white",
              !open && "hidden",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 py-5">
          {sections.map((section) => (
            <SidebarGroup key={section.title} section={section} open={open} />
          ))}

          <div className="border-t border-white/10 pt-4">
            <SidebarGroup section={accountSection} open={open} />
          </div>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            aria-label="Wallet"
            data-tip="Wallet"
            className={cn(
              "tip tip--right flex h-10 w-full items-center justify-center gap-2 border border-white/15 text-[13px] font-medium text-white transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black",
              !open && "lg:justify-center",
            )}
          >
            <Wallet className="h-4 w-4 shrink-0" />
            <span className={cn(!open && "lg:hidden")}>Wallet</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarGroup({ section, open }: { section: SidebarSection; open: boolean }) {
  return (
    <div>
      <p
        className={cn(
          "px-2 pb-2 text-[11px] font-semibold tracking-wide text-white/40 uppercase",
          !open && "lg:hidden",
        )}
      >
        {section.title}
      </p>
      <ul className="space-y-0.5">
        {section.items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              aria-label={item.label}
              aria-current={item.active ? "page" : undefined}
              data-tip={item.label}
              className={cn(
                "tip tip--right flex w-full items-center gap-3 rounded-[2px] px-2 py-2 text-left text-[13px] transition-colors",
                item.active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
                !open && "lg:justify-center lg:px-0",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className={cn(!open && "lg:hidden")}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
