import { cn } from "@/lib/utils";

type Props = {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
};

export function AgentFilters({ categories, active, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Agent categories"
      className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
    >
      {categories.map((category) => {
        const selected = category === active;
        return (
          <button
            key={category}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(category)}
            className={cn(
              "h-7 shrink-0 border px-4 text-[12px] transition-colors",
              selected
                ? "border-black bg-black text-white"
                : "border-transparent bg-[#333333] text-white hover:bg-[#3d3d3d]",
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
