import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "./card";

interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface PageTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  addHref?: string;
  addLabel?: string;
  onAdd?: () => void;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
  getKey: (row: T) => string;
}

export function PageTable<T>({ rows, columns, addHref, addLabel, onAdd, emptyIcon, emptyText, getKey }: PageTableProps<T>) {
  return (
    <>
      {(addHref || onAdd) && (
        <div className="flex justify-end mb-5">
          {onAdd ? (
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 bg-[#3b82f6] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2563eb] shadow-sm shadow-blue-100 transition"
            >
              <Plus className="w-4 h-4" />
              {addLabel ?? "Nouveau"}
            </button>
          ) : (
            <Link
              href={addHref!}
              className="inline-flex items-center gap-2 bg-[#3b82f6] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2563eb] shadow-sm shadow-blue-100 transition"
            >
              <Plus className="w-4 h-4" />
              {addLabel ?? "Nouveau"}
            </Link>
          )}
        </div>
      )}

      <Card>
        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#f8f9fc] flex items-center justify-center mx-auto mb-3">
              {emptyIcon}
            </div>
            <p className="text-sm text-[#9ca3af]">{emptyText ?? "Aucune donnée"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0f2f7]">
                  {columns.map((col) => (
                    <th key={col.key} className={cn("text-left px-6 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide", col.className)}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f7]">
                {rows.map((row) => (
                  <tr key={getKey(row)} className="hover:bg-[#f8f9fc] transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-6 py-3.5 text-sm", col.className)}>
                        {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
