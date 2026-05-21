import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type LinkVariant = "text" | "chip" | "chipPrimary";

const variantClasses: Record<LinkVariant, string> = {
  text: "text-sm font-medium text-[var(--accent)] underline underline-offset-2 hover:text-[var(--button-primary-hover)]",
  chip: "inline-flex items-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
  chipPrimary:
    "inline-flex items-center rounded-xl bg-[var(--button-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--button-primary-hover)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
};

type Props = LinkProps & {
  className?: string;
  variant?: LinkVariant;
  children: ReactNode;
};

export function TextLink({ className, variant = "text", children, ...props }: Props) {
  return (
    <Link className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Link>
  );
}