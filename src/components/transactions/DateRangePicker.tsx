import { useState, type ReactNode } from "react";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { useDayPicker, type DateRange, type MonthCaptionProps } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type DateRangePickerProps = {
  from?: Date | undefined;
  to?: Date | undefined;
  onApply: (range: DateRange) => void;
  onClose: () => void;
};

const MAX_RANGE_DAYS = 153;
const CALENDAR_START = new Date(2020, 0, 1);
const CALENDAR_END = new Date(2030, 11, 31);

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
        className="relative w-full max-w-[760px] rounded-[2px] border border-border bg-surface p-5 shadow-2xl"
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <DateCalendar label="From" month={range?.from} selected={range} onSelect={handleSelect} />
          <DateCalendar
            label="To"
            month={range?.to ?? (range?.from ? addMonths(range.from, 1) : undefined)}
            selected={range}
            onSelect={handleSelect}
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

function DateCalendar({
  label,
  month,
  selected,
  onSelect,
}: {
  label: string;
  month?: Date | undefined;
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[2px] border border-border bg-background">
      <div className="border-b border-border px-3 py-2 text-[11px] font-semibold tracking-[0.14em] text-[#FAC102] uppercase">
        {label}
      </div>
      <Calendar
        mode="range"
        selected={selected}
        onSelect={onSelect}
        defaultMonth={month ?? new Date("2026-09-04")}
        startMonth={CALENDAR_START}
        endMonth={CALENDAR_END}
        className="w-full p-3"
        components={{ MonthCaption: CalendarMonthCaption }}
        classNames={{
          months: "flex flex-col",
          month: "space-y-3",
          nav: "absolute inset-x-3 top-0 z-10 flex items-center justify-between",
          button_previous:
            "grid h-7 w-7 place-items-center rounded-[2px] text-[#FAC102] transition-colors hover:bg-[#FAC102] hover:text-black",
          button_next:
            "grid h-7 w-7 place-items-center rounded-[2px] text-[#FAC102] transition-colors hover:bg-[#FAC102] hover:text-black",
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
  );
}

function CalendarMonthCaption({ calendarMonth, ...props }: MonthCaptionProps) {
  const { goToMonth } = useDayPicker();
  const [open, setOpen] = useState<"month" | "year" | null>(null);
  const currentMonth = calendarMonth.date;
  const currentYear = currentMonth.getFullYear();
  const years = Array.from(
    { length: CALENDAR_END.getFullYear() - CALENDAR_START.getFullYear() + 1 },
    (_, index) => CALENDAR_START.getFullYear() + index,
  );
  const months = Array.from({ length: 12 }, (_, index) => new Date(2000, index, 1));

  const setMonth = (month: number, year = currentYear) => {
    goToMonth(new Date(year, month, 1));
    setOpen(null);
  };

  return (
    <div {...props} className="relative flex h-8 items-center justify-center gap-1 px-8">
      <CaptionMenu
        label={currentMonth.toLocaleString("default", { month: "long" })}
        open={open === "month"}
        onToggle={() => setOpen(open === "month" ? null : "month")}
      >
        <div className="grid grid-cols-2 gap-1">
          {months.map((month) => (
            <CaptionOption
              key={month.getMonth()}
              active={month.getMonth() === currentMonth.getMonth()}
              onClick={() => setMonth(month.getMonth())}
            >
              {month.toLocaleString("default", { month: "short" })}
            </CaptionOption>
          ))}
        </div>
      </CaptionMenu>
      <CaptionMenu
        label={String(currentYear)}
        open={open === "year"}
        onToggle={() => setOpen(open === "year" ? null : "year")}
      >
        <div className="grid max-h-48 grid-cols-2 gap-1 overflow-y-auto">
          {years.map((year) => (
            <CaptionOption
              key={year}
              active={year === currentYear}
              onClick={() => setMonth(currentMonth.getMonth(), year)}
            >
              {year}
            </CaptionOption>
          ))}
        </div>
      </CaptionMenu>
    </div>
  );
}

function CaptionMenu({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="inline-flex items-center gap-1 rounded-[2px] px-1.5 py-1 text-[12px] font-semibold text-foreground transition-colors hover:bg-[#FAC102] hover:text-black"
      >
        {label}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open ? (
        <div className="absolute top-[calc(100%+4px)] left-1/2 z-40 min-w-28 -translate-x-1/2 rounded-[2px] border border-[#FAC102]/30 bg-[#111] p-1.5 shadow-xl">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function CaptionOption({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[2px] px-2 py-1.5 text-[11px] transition-colors ${
        active ? "bg-[#FAC102] text-black" : "text-white hover:bg-[#FAC102] hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function addMonths(date: Date, amount: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + amount);
  return result;
}
