import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";

export type Column<T> = {
  key: keyof T & string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

function toCSV<T extends Record<string, any>>(rows: T[], columns: Column<T>[]) {
  const escape = (v: any) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => escape(c.label)).join(",");
  const body = rows.map((r) => columns.map((c) => escape(r[c.key])).join(",")).join("\n");
  return header + "\n" + body;
}

export function SubmissionsTable<T extends Record<string, any>>({
  rows,
  columns,
  searchKeys,
  filename,
  emptyText = "No submissions yet.",
}: {
  rows: T[];
  columns: Column<T>[];
  searchKeys: (keyof T & string)[];
  filename: string;
  emptyText?: string;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) =>
      searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle)),
    );
  }, [rows, q, searchKeys]);

  const exportCSV = () => {
    const csv = toCSV(filtered, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="pl-9"
          />
        </div>
        <Button onClick={exportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" /> CSV
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-3 py-2 font-medium">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-muted-foreground">
                  {emptyText}
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/20">
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2 align-top">
                      {c.render ? c.render(r) : (r[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {rows.length}
      </p>
    </div>
  );
}
