import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps<T extends ElementType = "section"> = {
  as?: T;
  title?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Card<T extends ElementType = "section">({
  as,
  title,
  className,
  contentClassName,
  children,
  ...props
}: CardProps<T>) {
  const Component = as ?? "section";

  return (
    <Component
      className={cn(
        "rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/92 p-5 shadow-[0_8px_24px_rgba(15,23,20,0.06)] sm:p-6",
        className,
      )}
      {...props}
    >
      {title ? <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2> : null}
      <div className={contentClassName}>{children}</div>
    </Component>
  );
}