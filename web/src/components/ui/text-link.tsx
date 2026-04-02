import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type LinkVariant = "text" | "chip" | "chipPrimary";

const variantClasses: Record<LinkVariant, string> = {
  text: "text-sm underline",
  chip: "rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium",
  chipPrimary: "rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white",
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