import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MaxWidth = "2xl" | "3xl" | "4xl" | "5xl";

const widthClasses: Record<MaxWidth, string> = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

type Props = {
  maxWidth?: MaxWidth;
  className?: string;
  children: ReactNode;
};

export function PageContainer({ maxWidth = "3xl", className, children }: Props) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full flex-col gap-7 px-5 py-8 sm:px-8 sm:py-10",
        widthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}