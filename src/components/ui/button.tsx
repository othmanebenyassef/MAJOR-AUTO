import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary:   "bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-sm shadow-blue-100",
  secondary: "bg-[#eef3ff] text-[#3b82f6] hover:bg-[#dbeafe]",
  danger:    "bg-[#fff1f3] text-[#f43f5e] hover:bg-[#ffe4e6]",
  ghost:     "text-[#6b7280] hover:bg-[#f8f9fc] hover:text-[#1e2433]",
  outline:   "border border-[#e8eaf0] text-[#374151] hover:bg-[#f8f9fc]",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-5 py-2.5 text-sm rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
