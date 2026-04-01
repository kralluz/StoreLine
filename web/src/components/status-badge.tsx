import { statusCfg, type OrderStatus } from "@/lib/ui";

/**
 * StatusBadge — reutilizável em todos os módulos que exibem status de pedido.
 */
export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusCfg[status];
  return <span className={cfg.badge}>{cfg.label}</span>;
}
