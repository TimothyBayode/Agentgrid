import { useEffect, useState } from "react";
import { BotMessageSquare, Send, X } from "lucide-react";
import type { StatusGroup } from "@/data/hires";

type AskGridProps = {
  onFilter: (status: StatusGroup | "All") => void;
};

type Chip = {
  label: string;
  run: (apply: (status: StatusGroup | "All") => void, note: (text: string) => void) => void;
};

const chips: Chip[] = [
  {
    label: "Show me my failed hires",
    run: (apply) => apply("Failed"),
  },
  {
    label: "Show my active jobs",
    run: (apply) => apply("Active"),
  },
  {
    label: "How much have I spent this month?",
    run: (_apply, note) =>
      note(
        "You've spent $3.88 across 9 billed hires this month. The largest was $1.20 to YieldMax for a cross-DEX route simulation.",
      ),
  },
  {
    label: "Which agent has performed best for me?",
    run: (_apply, note) =>
      note(
        "Chain Sentinel is your top performer at a 100% success rate and 5.0 reputation. Arb Weaver is close behind at 98.9%.",
      ),
  },
  {
    label: "What did the YieldMax agent do?",
    run: (_apply, note) =>
      note(
        "YieldMax rebalanced your USDT/BNB LP position to 50/50 weights, improving net APY by 0.8%. Cost was $0.42 and it completed in 2m 12s.",
      ),
  },
  {
    label: "Hire the same agent again",
    run: (_apply, note) =>
      note(
        "I've prepared a re-hire for YieldMax on your USDT/BNB position at the standard 0.00042 BNB fee. This needs your wallet signature to proceed — no work starts until you approve.",
      ),
  },
];

export function AskGrid({ onFilter }: AskGridProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const apply = (status: StatusGroup | "All") => onFilter(status);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div className="rounded-[2px] border border-border bg-background">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <BotMessageSquare className="h-4 w-4 text-[#FAC102]" />
            <h2 className="text-[13px] font-semibold text-foreground">Ask Grid</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="tip tip--bottom inline-flex h-7 items-center gap-1.5 rounded-[2px] bg-[#FAC102] px-3 text-[12px] font-semibold text-black transition-colors hover:bg-[#FAC102]/90"
            data-tip="Open Ask Grid"
          >
            <BotMessageSquare className="h-3.5 w-3.5" />
            Ask Grid
          </button>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setNote(null);
                  chip.run(apply, setNote);
                }}
                className="inline-flex items-center gap-1.5 rounded-[2px] border border-border bg-surface px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-[#FAC102]/50 hover:text-foreground"
              >
                <Send className="h-3 w-3" />
                {chip.label}
              </button>
            ))}
          </div>

          {note ? (
            <div className="mt-3 flex items-start gap-2 rounded-[2px] border border-[#FAC102]/25 bg-[#FAC102]/5 p-3">
              <BotMessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#FAC102]" />
              <p className="text-[13px] leading-relaxed text-foreground">{note}</p>
            </div>
          ) : null}
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close Ask Grid"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm"
          />
          <aside
            aria-label="Ask Grid helper"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface text-foreground shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <BotMessageSquare className="h-4 w-4 text-[#FAC102]" />
                <h2 className="text-[15px] font-semibold">Ask Grid</h2>
              </div>
              <button
                type="button"
                aria-label="Close Ask Grid"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-[2px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Ask about your hires or choose a shortcut below.
              </p>
              <div className="mt-5 grid gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setNote(null);
                      chip.run(apply, setNote);
                    }}
                    className="inline-flex items-center gap-2 rounded-[2px] border border-border bg-background px-3 py-2.5 text-left text-[12px] text-muted-foreground transition-colors hover:border-[#FAC102]/50 hover:bg-[#FAC102] hover:text-black"
                  >
                    <Send className="h-3 w-3 shrink-0" />
                    {chip.label}
                  </button>
                ))}
              </div>

              {note ? (
                <div className="mt-4 flex items-start gap-2 rounded-[2px] border border-[#FAC102]/25 bg-[#FAC102]/5 p-3">
                  <BotMessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#FAC102]" />
                  <p className="text-[13px] leading-relaxed text-foreground">{note}</p>
                </div>
              ) : null}
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
