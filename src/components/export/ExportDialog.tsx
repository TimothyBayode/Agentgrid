import { FileSpreadsheet, FileText, X } from "lucide-react";
import * as XLSX from "xlsx";

export type ExportRow = Record<string, string>;
export type ExportFormat = "pdf" | "csv" | "xlsx";

type ExportDialogProps = {
  title?: string;
  countLabel: string;
  filename: string;
  sheetName?: string;
  rows: ExportRow[];
  onClose: () => void;
};

export function ExportDialog({
  title = "Export",
  countLabel,
  filename,
  sheetName = "Export",
  rows,
  onClose,
}: ExportDialogProps) {
  const exportFile = (format: ExportFormat) => {
    if (format === "csv") exportCsv(rows, filename);
    if (format === "xlsx") exportXlsx(rows, filename, sheetName);
    if (format === "pdf") exportPdf(rows, title, filename);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        className="relative w-full max-w-md rounded-[2px] border border-border bg-surface p-5 shadow-2xl"
      >
        <button
          type="button"
          aria-label={`Close ${title.toLowerCase()} dialog`}
          onClick={onClose}
          className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-[2px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 id="export-dialog-title" className="text-[18px] font-semibold text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Choose a document format for the {countLabel} currently shown.
        </p>

        <div className="mt-5 grid gap-2">
          <ExportOption
            icon={FileText}
            label="PDF document"
            description="Open a print-ready document and save it as PDF."
            onClick={() => exportFile("pdf")}
          />
          <ExportOption
            icon={FileText}
            label="CSV file"
            description="Download a lightweight comma-separated list."
            onClick={() => exportFile("csv")}
          />
          <ExportOption
            icon={FileSpreadsheet}
            label="Excel workbook"
            description="Download an .xlsx workbook for analysis and sharing."
            onClick={() => exportFile("xlsx")}
          />
        </div>
      </div>
    </div>
  );
}

function ExportOption({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: typeof FileText;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-[2px] border border-border bg-background p-3 text-left transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
    >
      <Icon className="h-5 w-5 shrink-0 text-[#FAC102] group-hover:text-black" />
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-foreground group-hover:text-black">
          {label}
        </span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground group-hover:text-black/70">
          {description}
        </span>
      </span>
    </button>
  );
}

function exportCsv(rows: ExportRow[], filename: string) {
  const headers = Object.keys(rows[0] ?? {});
  const csv = [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))]
    .map((row) => row.map(toCsvValue).join(","))
    .join("\n");
  downloadBlob(csv, "text/csv;charset=utf-8;", `${filename}.csv`);
}

function exportXlsx(rows: ExportRow[], filename: string, sheetName: string) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

function exportPdf(rows: ExportRow[], title: string, filename: string) {
  const headers = Object.keys(rows[0] ?? {});
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${headers.map((header) => `<td>${escapeHtml(row[header] ?? "")}</td>`).join("")}</tr>`,
    )
    .join("");
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1100,height=800");
  if (!printWindow) return;
  printWindow.document.write(`<!doctype html><html><head><title>${escapeHtml(title)}</title><style>
    body{font-family:Inter,Arial,sans-serif;color:#111827;padding:32px}h1{font-size:24px}p{color:#6b7280}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #d1d5db;padding:8px;text-align:left}th{background:#f3f4f6}
  </style></head><body><h1>${escapeHtml(title)}</h1><p>Exported ${new Date().toLocaleDateString()}</p><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
  void filename;
}

function downloadBlob(content: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function toCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}
