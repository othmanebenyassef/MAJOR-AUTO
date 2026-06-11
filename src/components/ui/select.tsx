import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">{label}</label>}
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6] transition",
          error && "border-[#fda4b0]",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-[#f43f5e]">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";
