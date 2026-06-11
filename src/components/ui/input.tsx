import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2.5 bg-[#f8f9fc] border border-[#e8eaf0] rounded-xl text-sm text-[#1e2433] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#c7d7fd] focus:border-[#3b82f6] transition",
          error && "border-[#fda4b0] focus:ring-[#fda4b0]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#f43f5e]">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
