import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, actions }: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}