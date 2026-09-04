import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";

type DateRangePickerProps = {
  from?: Date | undefined;
  to?: Date | undefined;
  onApply: (range: DateRange) => void;
  onClose: () => void;
};

const MAX_RANGE_DAYS = 153;

export function DateRangePicker({ from, to, onApply, onClose }: DateRangePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>({ from, to });
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (next: DateRange | undefined) => {
    if (next?.from && next.to) {
      const days = Math.ceil((next.to.getTime() - next.from.getTime()) / 86_400_000);
      if (days > MAX_RANGE_DAYS) {
        setError("Choose a range of five months or less.");
        return;
      }
    }
    setError(null);
    setRange(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-date-title"
        className="relative w-full max-w-[380px] rounded-[2px] border border-border bg-surface p-5 shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close custom date picker"
          onClick={onClose}
          className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-[2px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#FAC102]" />
          <h2 id="custom-date-title" className="text-[16px] font-semibold text-foreground">
            Custom date range
          </h2>
        </div>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Select a from and to date, up to five months apart.
        </p>

        <div className="mt-4 overflow-hidden rounded-[2px] border border-border bg-background">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
            defaultMonth={range?.from ?? new Date("2026-09-04")}
            showOutsideDays
            className="w-full p-3"
            classNames={{
              months: "flex flex-col",
              month: "space-y-3",
              month_caption:
                "flex h-8 items-center justify-center text-[13px] font-semibold text-foreground",
              nav: "absolute inset-x-3 top-3 flex items-center justify-between",
              button_previous:
                "grid h-7 w-7 place-items-center rounded-[2px] text-muted-foreground transition-colors hover:bg-[#FAC102] hover:text-black",
              button_next:
                "grid h-7 w-7 place-items-center rounded-[2px] text-muted-foreground transition-colors hover:bg-[#FAC102] hover:text-black",
              weekdays: "grid grid-cols-7",
              weekday: "py-2 text-center text-[10px] font-medium text-muted-foreground",
              week: "grid grid-cols-7",
              day: "relative p-0 text-center text-[12px] text-foreground",
              day_button:
                "mx-auto grid h-8 w-8 place-items-center rounded-[2px] text-[12px] transition-colors hover:bg-[#FAC102] hover:text-black",
              selected: "bg-[#FAC102] text-black",
              range_start: "rounded-l-[2px] bg-[#FAC102] text-black",
              range_end: "rounded-r-[2px] bg-[#FAC102] text-black",
              range_middle: "bg-[#FAC102]/20 text-foreground",
              today: "font-bold text-[#FAC102]",
              outside: "text-muted-foreground/40",
              disabled: "cursor-not-allowed text-muted-foreground/30",
            }}
          />
        </div>

        {error ? <p className="mt-3 text-[12px] text-destructive">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            disabled={!range?.from || !range.to || error !== null}
            onClick={() => range && onApply(range)}
            className="bg-[#FAC102] text-black hover:bg-[#FAC102]/90 disabled:opacity-40"
          >
            Apply range
          </Button>
        </div>
      </div>
    </div>
  );
}
