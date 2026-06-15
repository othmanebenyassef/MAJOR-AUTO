"use client";

interface DateSelectProps {
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => currentYear - 10 + i);

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

function parse(value: string) {
  if (!value) return { day: "", month: "", year: "" };
  const [y, m, d] = value.split("-");
  return { day: String(parseInt(d || "0")), month: String(parseInt(m || "0")), year: y || "" };
}

function format(day: string, month: string, year: string) {
  if (!day || !month || !year) return "";
  return `${year}-${String(parseInt(month)).padStart(2, "0")}-${String(parseInt(day)).padStart(2, "0")}`;
}

const selectCls = "px-2 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6] transition cursor-pointer";

export function DateSelect({ label, value, onChange, required, error }: DateSelectProps) {
  const { day, month, year } = parse(value);

  const maxDay = month && year ? daysInMonth(parseInt(month), parseInt(year)) : 31;
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  function update(field: "day" | "month" | "year", val: string) {
    const next = { day, month, year, [field]: val };
    onChange(format(next.day, next.month, next.year));
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {/* Jour */}
        <select
          value={day}
          onChange={e => update("day", e.target.value)}
          required={required}
          className={`${selectCls} w-20`}
        >
          <option value="">Jour</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Mois */}
        <select
          value={month}
          onChange={e => update("month", e.target.value)}
          required={required}
          className={`${selectCls} flex-1`}
        >
          <option value="">Mois</option>
          {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
        </select>

        {/* Année */}
        <select
          value={year}
          onChange={e => update("year", e.target.value)}
          required={required}
          className={`${selectCls} w-24`}
        >
          <option value="">Année</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {error && <p className="text-xs text-[#f43f5e]">{error}</p>}
    </div>
  );
}
