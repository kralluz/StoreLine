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
    <Component className={cn("rounded border border-zinc-200 p-4", className)} {...props}>
      {title ? <h2 className="text-lg font-medium">{title}</h2> : null}
      <div className={contentClassName}>{children}</div>
    </Component>
  );
}