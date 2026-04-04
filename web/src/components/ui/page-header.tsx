import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, actions }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h1>
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}