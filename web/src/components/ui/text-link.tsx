import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type LinkVariant = "text" | "chip" | "chipPrimary";

const variantClasses: Record<LinkVariant, string> = {
  text: "text-sm text-[#00674F] underline underline-offset-2 hover:text-[#005641]",
  chip: "rounded-xl border border-[#00674F]/30 bg-[var(--surface)]/80 px-3 py-1.5 text-sm font-medium text-[#00674F] hover:border-[#00674F]/55 hover:bg-[#E7F2EE]",
  chipPrimary:
    "rounded-xl bg-[#00674F] px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[#005641] hover:shadow-md",
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