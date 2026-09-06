import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeftRight,
  Bot,
  BotMessageSquare,
  Briefcase,
  Compass,
  Copy,
  ExternalLink,
  ChevronDown,
  LifeBuoy,
  PlusCircle,
  Settings,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate, usePath } from "@/lib/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SidebarItem = {
  icon: LucideIcon;
  label: string;
  to?: string;
  soon?: boolean;
};
type SidebarSection = { title: string; items: SidebarItem[] };

const sections: SidebarSection[] = [
  {
    title: "Marketplace",
    items: [{ icon: Compass, label: "Discover Agents", to: "/agents" }],
  },
  {
    title: "Activity",
    items: [
      { icon: Briefcase, label: "My Hires", to: "/hires" },
      { icon: Activity, label: "Activity", to: "/activity" },
      { icon: ArrowLeftRight, label: "Transactions", to: "/transactions" },
    ],
  },
  {
    title: "My Agents",
    items: [
      { icon: Bot, label: "My Agents", to: "/my-agents" },
      { icon: PlusCircle, label: "List an Agent", soon: true },
    ],
  },
  { title: "Tools", items: [{ icon: BotMessageSquare, label: "Ask Grid", to: "/ask-grid" }] },
];

const accountSection: SidebarSection = {
  title: "Account",
  items: [
    { icon: Settings, label: "Settings", to: "/settings" },
    { icon: LifeBuoy, label: "Help & Support", to: "/help" },
  ],
};

type AgentSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AgentSidebar({ open, onClose }: AgentSidebarProps) {
  const path = usePath();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isActive = (to?: string) => to !== undefined && path.startsWith(to);

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
          "fixed inset-y-0 left-0 z-50 flex w-64 max-w-[100vw] flex-col overflow-x-hidden bg-black text-white transition-all duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          !open && "lg:w-16",
        )}
      >
        <div
          className={cn(
            "flex items-center py-4",
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

        <nav className="no-scrollbar min-w-0 flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <SidebarGroup
              key={section.title}
              section={section}
              open={open}
              isActive={isActive}
              onNavigate={(to) => {
                navigate(to);
                onClose();
              }}
            />
          ))}

          <div className="border-t border-white/10 pt-4">
            <SidebarGroup
              section={accountSection}
              open={open}
              isActive={isActive}
              onNavigate={(to) => {
                navigate(to);
                onClose();
              }}
            />
          </div>
        </nav>

        <div className="border-t border-white/10 p-3">
          <WalletQuickControl open={open} />
        </div>
      </aside>
    </>
  );
}

function WalletQuickControl({ open }: { open: boolean }) {
  const [walletOpen, setWalletOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x71...92F";

  const copyAddress = () => {
    void navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
      <button
        type="button"
        aria-label="Open wallet quick controls"
        data-tip="Wallet"
        onClick={() => setWalletOpen(true)}
        className={cn(
          "tip tip--right flex h-10 w-full items-center justify-center gap-2 border border-white/15 text-[13px] font-medium text-white transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black",
          !open && "lg:justify-center",
        )}
      >
        <Wallet className="h-4 w-4 shrink-0" />
        {open ? (
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate">{walletAddress}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/60" />
          </span>
        ) : null}
      </button>

      <DialogContent className="max-w-sm gap-0 rounded-[2px] border-border bg-surface p-0">
        <DialogHeader className="border-b border-border p-5 text-left">
          <DialogTitle className="flex items-center gap-2 text-[17px]">
            <Wallet className="h-4 w-4 text-[#FAC102]" />
            Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="p-5">
          <div className="border border-[#FAC102]/30 bg-[#FAC102]/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Connected via MetaMask</p>
                <div className="mt-2 flex items-center gap-2 text-[16px] font-semibold text-foreground">
                  <code>{walletAddress}</code>
                  <button
                    type="button"
                    aria-label="Copy wallet address"
                    data-tip={copied ? "Copied" : "Copy address"}
                    onClick={copyAddress}
                    className="tip tip--bottom rounded-[2px] p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-[#FAC102]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">BNB Smart Chain</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <WalletBalance label="BNB" value="0.4821" />
            <WalletBalance label="USDT" value="12.45" />
            <WalletBalance label="USDC" value="0.00" />
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button
              asChild
              variant="outline"
              className="border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
            >
              <a href="https://bscscan.com/address/0x71" target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                View on BscScan
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-destructive/40 text-[12px] text-destructive hover:bg-destructive/10"
            >
              Disconnect wallet
            </Button>
            <Button
              asChild
              className="col-span-full bg-[#FAC102] text-[12px] text-black hover:bg-[#FAC102]/90"
            >
              <Link to="/settings">Settings</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WalletBalance({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-[12px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function SidebarGroup({
  section,
  open,
  isActive,
  onNavigate,
}: {
  section: SidebarSection;
  open: boolean;
  isActive: (to?: string) => boolean;
  onNavigate: (to: string) => void;
}) {
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
      <ul className="min-w-0 space-y-0.5 overflow-x-hidden">
        {section.items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              aria-label={item.label}
              aria-current={isActive(item.to) ? "page" : undefined}
              aria-disabled={item.soon || undefined}
              data-tip={item.label}
              disabled={item.soon}
              onClick={() => item.to && onNavigate(item.to)}
              className={cn(
                "tip tip--right flex min-w-0 w-full items-center gap-3 overflow-hidden rounded-[2px] px-2 py-2 text-left text-[13px] transition-colors",
                isActive(item.to)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
                !item.to && "hover:bg-transparent",
                item.soon && "cursor-not-allowed opacity-60 hover:text-white/60",
                !open && "lg:justify-center lg:px-0",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "flex min-w-0 items-center gap-2 overflow-hidden",
                  !open && "lg:hidden",
                )}
              >
                <span className="truncate">{item.label}</span>
                {item.soon ? (
                  <span className="rounded-[2px] bg-[#FAC102] px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-black uppercase">
                    Soon
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
