// CSV export with UTF-8 BOM so Excel/Sheets opens it correctly.
function escapeField(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCSV(rows: Array<Record<string, unknown>>, columns: string[]): string {
  const header = columns.map(escapeField).join(",");
  const body = rows.map((r) => columns.map((c) => escapeField(r[c])).join(",")).join("\r\n");
  return "\uFEFF" + header + "\r\n" + body;
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
