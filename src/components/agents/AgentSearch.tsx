import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function AgentSearch({ value, onChange }: Props) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search agents, capabilities, protocols"
        aria-label="Search agents"
        className="h-10 w-full rounded-full border border-border bg-surface pr-4 pl-11 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/25 focus:ring-2 focus:ring-ring/25 focus:outline-none"
      />
    </div>
  );
}
