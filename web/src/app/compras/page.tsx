"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { page, card, text, btn, feedback, type OrderStatus } from "@/lib/ui";

type OrderSummary = {
  id: string;
  status: OrderStatus;
  subtotal: string;
  total: string;
  createdAt: string;
  itemCount: number;
};

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

function getLocalUserId(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { id?: string };
    return parsed.id ?? null;
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export default function MinhasComprasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<OrderSummary[]>([]);

  async function loadOrders() {
    setError("");
    const token = getAuthToken();
    if (!token) throw new Error("Token ausente");

    const userId = getLocalUserId();
    if (!userId) throw new Error("Usuario ausente");

    const response = await fetch(`/api/compras/${userId}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    const data = (await response.json()) as { orders?: OrderSummary[]; error?: string };
    if (!response.ok) throw new Error(data.error || "Erro ao carregar compras");

    setOrders(data.orders ?? []);
  }

  useEffect(() => {
    const token = getAuthToken();
    const userId = getLocalUserId();

    if (!token || !userId) {
      router.replace("/auth/login");
      return;
    }

    loadOrders()
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erro ao carregar compras");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalizedOrders = useMemo(() => {
    return orders.filter((order) => order.status === "CONFIRMED");
  }, [orders]);

  const confirmedTotal = useMemo(() => {
    return finalizedOrders.reduce((acc, order) => acc + Number(order.total), 0);
  }, [finalizedOrders]);

  if (loading) {
    return (
      <div className={`${page.narrow} flex flex-col gap-6`}>
        <h1 className={text.pageTitle}>Minhas compras</h1>
        <p className={feedback.loading}>Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className={`${page.narrow} flex flex-col gap-6`}>
      <div className={`${card.base} bg-[var(--surface)]/94`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className={text.pageTitle}>Minhas compras</h1>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">
              Histórico de pedidos finalizados na sua conta.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:min-w-[15rem]">
            <div className="rounded-lg border border-[var(--border-light)] bg-[var(--surface)] px-3 py-2">
              <p className="text-[var(--text-subtle)]">Pedidos</p>
              <p className="mt-0.5 font-semibold text-[var(--foreground)]">{finalizedOrders.length}</p>
            </div>
            <div className="rounded-lg border border-[var(--border-light)] bg-[var(--surface)] px-3 py-2">
              <p className="text-[var(--text-subtle)]">Total gasto</p>
              <p className="mt-0.5 font-semibold text-[var(--foreground)]">{formatCurrency(String(confirmedTotal))}</p>
            </div>
          </div>
        </div>
      </div>

      {error ? <p className={feedback.error}>{error}</p> : null}

      <div className={card.base}>
        <h2 className={`${text.sectionTitle} mb-4`}>Pedidos finalizados</h2>

        {finalizedOrders.length === 0 ? (
          <div className={feedback.empty}>
            <p>Nenhuma compra finalizada até o momento.</p>
            <p className="mt-1 text-[var(--text-subtle)]">Quando você concluir pedidos, eles aparecerão aqui.</p>
            <div className="mt-4">
              <Link href="/produtos" className={btn.ghost}>
                Ver produtos
              </Link>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {finalizedOrders.map((order) => (
              <li key={order.id} className={`${card.item} p-4`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[var(--foreground)] sm:text-base">
                        Pedido #{order.id.slice(0, 10)}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-[var(--text-subtle)]">
                      {order.itemCount} {order.itemCount === 1 ? "item" : "itens"} • {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <p className="text-base font-semibold text-[var(--foreground)]">{formatCurrency(order.total)}</p>
                    <Link href={`/compras/${order.id}`} className={btn.ghost}>
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
