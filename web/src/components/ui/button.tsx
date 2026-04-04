import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline" | "text";
type ButtonSize = "sm" | "md";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "rounded-xl bg-[#00674F] text-white shadow-sm hover:bg-[#005641] hover:shadow-md active:scale-[0.99] disabled:opacity-60",
  outline:
    "rounded-xl border border-[#00674F]/35 text-[#00674F] hover:bg-[#E7F2EE] hover:border-[#00674F]/55 disabled:opacity-60",
  text: "text-sm text-[#00674F] underline underline-offset-2 hover:text-[#005641] disabled:opacity-60",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm font-medium",
  md: "px-4 py-2 text-sm font-medium",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: Props) {
  const useSizeClass = variant !== "text";

  return (
    <button
      type={type}
      className={cn(
        variantClasses[variant],
        useSizeClass && sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}