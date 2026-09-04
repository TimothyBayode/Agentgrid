import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function AgentSearch({ value, onChange }: Props) {
  return (
    <div className="tip tip--bottom relative w-full" data-tip="Search the agent marketplace">
      <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-white" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search agents, capabilities, protocols"
        aria-label="Search agents"
        className="h-9 w-full rounded-[2px] border border-border bg-black pr-4 pl-11 text-[13px] text-white placeholder:text-white/60 transition-colors focus:border-[#333333] focus:outline-none"
      />
    </div>
  );
}
