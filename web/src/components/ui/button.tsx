import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline" | "text";
type ButtonSize = "sm" | "md";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "rounded bg-zinc-900 text-white disabled:opacity-60",
  outline: "rounded border border-zinc-300 text-zinc-900 disabled:opacity-60",
  text: "text-sm underline disabled:opacity-60",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm font-medium",
  md: "px-4 py-2",
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