import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  CircleUserRound,
  Copy,
  Eye,
  Globe2,
  KeyRound,
  LayoutGrid,
  LockKeyhole,
  LogOut,
  Monitor,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SettingSection =
  | "Profile"
  | "Preferences"
  | "Wallet"
  | "Payment Preferences"
  | "Notifications"
  | "Privacy"
  | "Security"
  | "Others";
type NavigationGroup = {
  label: string;
  items: { label: SettingSection; icon: typeof CircleUserRound }[];
};

const navigation: NavigationGroup[] = [
  {
    label: "Account",
    items: [
      { label: "Profile", icon: CircleUserRound },
      { label: "Preferences", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Wallet & Payments",
    items: [
      { label: "Wallet", icon: Wallet },
      { label: "Payment Preferences", icon: KeyRound },
    ],
  },
  {
    label: "AgentGrid",
    items: [
      { label: "Notifications", icon: Bell },
      { label: "Privacy", icon: Eye },
    ],
  },
  {
    label: "Security",
    items: [
      { label: "Security", icon: ShieldCheck },
      { label: "Others", icon: Monitor },
    ],
  },
];

export default function SettingsPage() {
  const [section, setSection] = useState<SettingSection>("Profile");

  return (
    <AppShell header={<span className="text-[13px] font-semibold text-foreground">Settings</span>}>
      <main className="px-3 pb-10 sm:px-5">
        <div className="py-6">
          <h1 className="text-[24px] font-semibold tracking-tight text-white">Settings</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Manage your account, wallet, preferences, and security.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
          <aside className="h-fit border border-border bg-background p-3">
            {navigation.map((group) => (
              <div key={group.label} className="mb-5 last:mb-0">
                <p className="px-2 pb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSection(label)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-[2px] px-2.5 py-2 text-left text-[12px] transition-colors",
                        section === label
                          ? "bg-[#FAC102] font-medium text-black"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>
          <section className="min-w-0 border border-border bg-background p-5 sm:p-6">
            {renderSection(section)}
          </section>
        </div>
      </main>
    </AppShell>
  );
}

function renderSection(section: SettingSection) {
  switch (section) {
    case "Profile":
      return <ProfileSection />;
    case "Preferences":
      return <PreferencesSection />;
    case "Wallet":
      return <WalletSection />;
    case "Payment Preferences":
      return <PaymentSection />;
    case "Notifications":
      return <NotificationsSection />;
    case "Privacy":
      return <PrivacySection />;
    case "Security":
      return <SecuritySection />;
    case "Others":
      return <OthersSection />;
  }
}

function ProfileSection() {
  return (
    <SettingPanel title="Profile" description="Your public AgentGrid identity.">
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-[2px] border border-[#FAC102]/30 bg-[#FAC102]/10 text-xl font-semibold text-[#FAC102]">
          T
        </div>
        <Button
          variant="outline"
          className="border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
        >
          Change avatar
        </Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Display name" value="Timothy" />
        <Field label="Username" value="timothy" />
        <Field label="Email" value="timothy@example.com" />
        <Field label="Bio" value="Building at the intersection of AI and Web3..." wide />
      </div>
      <div className="mt-6 flex justify-end border-t border-border pt-5">
        <Button className="bg-[#FAC102] text-[12px] text-black hover:bg-[#FAC102]/90">
          Save changes
        </Button>
      </div>
    </SettingPanel>
  );
}

function PreferencesSection() {
  return (
    <SettingPanel title="Preferences" description="Control how AgentGrid behaves.">
      <div className="grid gap-5 sm:grid-cols-2">
        <ChoiceGroup label="Theme" options={["Light", "Dark", "System"]} selected="Dark" />
        <SelectField label="Default currency" value="USD" options={["USD", "USDT", "BNB"]} />
        <SelectField
          label="Default network"
          value="BNB Smart Chain"
          options={["BNB Smart Chain", "BNB Chain Testnet"]}
        />
        <SelectField label="Language" value="English" options={["English"]} />
      </div>
    </SettingPanel>
  );
}

function WalletSection() {
  const [copied, setCopied] = useState(false);
  return (
    <SettingPanel
      title="Wallet"
      description="Manage the wallet used to identify you and authorize transactions."
    >
      <div className="border border-[#FAC102]/30 bg-[#FAC102]/5 p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-[2px] bg-[#FAC102] text-black">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground">Connected wallet</p>
            <p className="mt-1 text-[15px] text-foreground">
              <code>0x71...92F</code>
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">BNB Smart Chain</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
            onClick={() => {
              void navigator.clipboard.writeText("0x71...92F");
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy address"}
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
          >
            <a href="https://bscscan.com/address/0x71" target="_blank" rel="noreferrer">
              View on explorer
            </a>
          </Button>
          <Button
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Disconnect wallet
          </Button>
        </div>
      </div>
      <div className="mt-7">
        <SectionHeading title="Supported networks" />
        <div className="mt-4 space-y-2">
          <p className="flex items-center gap-2 text-[12px] text-foreground">
            <Check className="h-3.5 w-3.5 text-[#FAC102]" />
            BNB Smart Chain
          </p>
          <p className="flex items-center gap-2 text-[12px] text-foreground">
            <Check className="h-3.5 w-3.5 text-[#FAC102]" />
            BNB Chain Testnet
          </p>
        </div>
      </div>
    </SettingPanel>
  );
}

function PaymentSection() {
  return (
    <SettingPanel
      title="Payment Preferences"
      description="Set defaults for hiring agents. Required wallet authorization cannot be bypassed."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Preferred payment asset" value="USDT" options={["USDT", "BNB"]} />
        <SelectField
          label="Preferred network"
          value="BNB Smart Chain"
          options={["BNB Smart Chain"]}
        />
      </div>
    </SettingPanel>
  );
}

function NotificationsSection() {
  return (
    <SettingPanel
      title="Notifications"
      description="Choose which AgentGrid events should reach you."
    >
      <NotificationMatrix />
    </SettingPanel>
  );
}
function PrivacySection() {
  return (
    <SettingPanel
      title="Privacy"
      description="Control what AgentGrid displays publicly. On-chain transactions remain public on the network."
    >
      <ChoiceGroup label="Profile visibility" options={["Public", "Private"]} selected="Public" />
      <div className="mt-6 space-y-2">
        <Toggle label="Show shortened wallet address" checked />
        <Toggle label="Show my marketplace activity publicly" />
        <Toggle label="Allow public visibility of my hire history" />
      </div>
    </SettingPanel>
  );
}
function SecuritySection() {
  return (
    <SettingPanel
      title="Security"
      description="Review wallet authentication and transaction protection."
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <StatusRow label="Wallet connected" />
        <StatusRow label="Signature verification enabled" />
      </div>
      <div className="mt-7 border-t border-border pt-5">
        <SectionHeading title="Transaction protection" />
        <div className="mt-4 space-y-2">
          <Toggle label="Require wallet signature" checked locked />
          <Toggle label="Show transaction details before signing" checked />
          <Toggle label="Show estimated network fee" checked />
        </div>
      </div>
    </SettingPanel>
  );
}
function OthersSection() {
  return (
    <SettingPanel title="Others" description="Manage account data and other account-level actions.">
      <div className="mt-8 border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-[12px] font-semibold text-destructive">Danger zone</p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Export your data or permanently delete your AgentGrid account. Blockchain records cannot
          be erased.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-destructive/40 text-[12px] text-destructive hover:bg-destructive/10"
        >
          Delete account
        </Button>
      </div>
    </SettingPanel>
  );
}

function SettingPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-[18px] font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-[12px] text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h3 className="text-[12px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {title}
      </h3>
      {description ? <p className="mt-1 text-[11px] text-muted-foreground">{description}</p> : null}
    </div>
  );
}
function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <label className={cn("block", wide && "sm:col-span-2")}>
      <span className="mb-1.5 block text-[11px] text-muted-foreground">{label}</span>
      {wide ? (
        <textarea
          defaultValue={value}
          rows={3}
          className="w-full resize-none rounded-[2px] border border-border bg-surface px-3 py-2 text-[12px] text-foreground outline-none focus:border-[#FAC102]/60"
        />
      ) : (
        <input
          defaultValue={value}
          className="h-9 w-full rounded-[2px] border border-border bg-surface px-3 text-[12px] text-foreground outline-none focus:border-[#FAC102]/60"
        />
      )}
    </label>
  );
}
function SelectField({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative block">
      <span className="mb-1.5 block text-[11px] text-muted-foreground">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-9 w-full cursor-pointer items-center justify-between rounded-[2px] border border-border bg-surface px-3 text-left text-[12px] text-foreground transition-colors hover:border-[#FAC102]/60"
      >
        {selected}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className="absolute top-[calc(100%+4px)] left-0 z-30 min-w-full overflow-hidden rounded-[2px] border border-border bg-black p-1 shadow-xl"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === selected}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className={cn(
                "block w-full cursor-pointer rounded-[2px] px-3 py-2 text-left text-[12px] whitespace-nowrap transition-colors",
                option === selected
                  ? "bg-[#FAC102] text-black"
                  : "text-white hover:bg-[#FAC102] hover:text-black",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
function ChoiceGroup({
  label,
  options,
  selected,
}: {
  label: string;
  options: string[];
  selected: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[11px] text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "cursor-pointer rounded-[2px] border px-3 py-2 text-[12px] transition-colors",
              selected === option
                ? "border-[#FAC102] bg-[#FAC102]/10 text-foreground"
                : "border-border text-muted-foreground hover:border-white/30",
            )}
          >
            <input
              type="radio"
              name={label}
              defaultChecked={selected === option}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
function Toggle({
  label,
  checked = false,
  locked = false,
}: {
  label: string;
  checked?: boolean;
  locked?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 text-[12px]",
        locked ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer text-foreground",
      )}
    >
      <input
        type="checkbox"
        defaultChecked={checked}
        disabled={locked}
        className="accent-[#FAC102]"
      />
      {label}
      {locked ? <LockKeyhole className="h-3 w-3 text-muted-foreground" /> : null}
    </label>
  );
}
function NotificationMatrix() {
  const rows = [
    "Agent completed a hire",
    "Transaction confirmed",
    "Transaction failed",
    "Agent failed",
    "Payment received",
    "Security alerts",
    "Marketplace updates",
    "Ask Grid recommendations",
    "Weekly agent summary",
  ];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[460px] text-[12px]">
        <div className="grid grid-cols-[minmax(0,1fr)_72px_72px] items-center gap-3 border-b border-border pb-3 text-center text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          <span className="text-left">Action</span>
          <span>Email</span>
          <span>In-App</span>
        </div>
        {rows.map((item, index) => (
          <div
            key={item}
            className="grid grid-cols-[minmax(0,1fr)_72px_72px] items-center gap-3 border-b border-border py-3 last:border-0"
          >
            <span className="text-foreground">{item}</span>
            <span className="flex justify-center">
              <input
                type="checkbox"
                defaultChecked={index < 3}
                className="cursor-pointer accent-[#FAC102]"
                aria-label={`${item} email notification`}
              />
            </span>
            <span className="flex justify-center">
              <input
                type="checkbox"
                defaultChecked={index !== 6 && index !== 8}
                className="cursor-pointer accent-[#FAC102]"
                aria-label={`${item} in-app notification`}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
function StatusRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border border-border bg-surface px-3 py-3 text-[12px] text-foreground">
      <Check className="h-3.5 w-3.5 text-emerald" />
      {label}
    </div>
  );
}
function SessionRow({
  icon: Icon,
  device,
  detail,
}: {
  icon: typeof Monitor;
  device: string;
  detail: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-3 border-b border-border py-3 last:border-0">
      <Icon className="h-4 w-4 text-[#FAC102]" />
      <div>
        <p className="text-[12px] text-foreground">{device}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
