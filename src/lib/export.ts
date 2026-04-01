/**
 * Exports an array of objects to a CSV file download.
 * Columns are derived from the first object's keys, or from the provided headers.
 */
export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string,
  headers?: string[]
): void {
  if (data.length === 0) return;

  const cols = headers ?? Object.keys(data[0]);

  const escape = (val: unknown): string => {
    const str = val == null ? "" : String(val);
    // Wrap in quotes if contains comma, newline, or quote
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = cols.map(escape).join(",");
  const rows = data.map((row) => cols.map((col) => escape(row[col])).join(","));
  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
