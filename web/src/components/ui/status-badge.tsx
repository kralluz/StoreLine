type Status = "PENDING" | "CONFIRMED" | "CANCELLED";

const labels: Record<Status, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

export function StatusBadge({ status }: { status: Status }) {
  return <span className="font-medium">{labels[status]}</span>;
}