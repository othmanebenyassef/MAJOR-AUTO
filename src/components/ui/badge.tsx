import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "outline";
}

const variantClasses = {
  default:  "bg-[#f8f9fc] text-[#6b7280] border border-[#e8eaf0]",
  success:  "bg-[#edfaf4] text-[#059669] border border-[#a7f0c8]",
  warning:  "bg-[#fffbeb] text-[#d97706] border border-[#fcd34d]",
  danger:   "bg-[#fff1f3] text-[#e11d48] border border-[#fda4b0]",
  info:     "bg-[#eef3ff] text-[#3b82f6] border border-[#c7d7fd]",
  purple:   "bg-[#f5f3ff] text-[#7c3aed] border border-[#c4b5fd]",
  outline:  "border border-[#e8eaf0] text-[#6b7280] bg-transparent",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
