import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";
import { Calendar } from "lucide-react";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3b82f6] pointer-events-none" />
        <input
          ref={ref}
          type="date"
          className={cn(
            "w-full pl-9 pr-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl",
            "text-sm text-[#1e2433] cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6] transition",
            "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer",
            error && "border-[#fda4b0] focus:ring-[#fda4b0]",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#f43f5e]">{error}</p>}
    </div>
  )
);
DateInput.displayName = "DateInput";
