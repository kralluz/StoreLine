"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function MinhasComprasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);
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

  async function finalizePurchase() {
    setFinalizing(true);
    setError("");
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");
      const userId = getLocalUserId();
      if (!userId) throw new Error("Usuario ausente");

      const response = await fetch(`/api/compras/${userId}`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as { error?: string; order?: { id: string } };
      if (!response.ok) throw new Error(data.error || "Erro ao finalizar compra");
      if (data.order?.id) {
        router.push(`/compras/${data.order.id}`);
        return;
      }
      await loadOrders();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao finalizar compra");
    } finally {
      setFinalizing(false);
    }
  }

  useEffect(() => {
    const token = getAuthToken();
    const userId = getLocalUserId();
    if (!token || !userId) {
      router.replace("/auth/login");
      return;
    }
    loadOrders()
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Erro ao carregar compras"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={`${page.narrow} flex flex-col gap-6`}>
        <h1 className={text.pageTitle}>Minhas compras</h1>
        <p className={feedback.loading}>Carregando...</p>
      </div>
    );
  }

  // ── Conteúdo principal ───────────────────────────────────────────────────
  return (
    <div className={`${page.narrow} flex flex-col gap-6`}>

      {/* Cabeçalho */}
      <div className={page.header}>
        <h1 className={text.pageTitle}>Minhas compras</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadOrders().catch((e) => setError(e instanceof Error ? e.message : "Erro"))}
            className={btn.ghost}
            disabled={finalizing}
          >
            Atualizar
          </button>
          <Link href="/" className={btn.ghost}>
            Home
          </Link>
        </div>
      </div>

      {/* Erro */}
      {error && <p className={feedback.error}>{error}</p>}

      {/* Finalizar compra */}
      <div className={card.base}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={text.sectionTitle}>Finalizar compra</h2>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">
              Converte os itens do seu carrinho em um pedido.
            </p>
          </div>
          <button
            type="button"
            onClick={finalizePurchase}
            className={btn.success}
            disabled={finalizing}
          >
            {finalizing ? "Finalizando..." : "Finalizar compra"}
          </button>
        </div>
      </div>

      {/* Histórico */}
      <div className={card.base}>
        <h2 className={`${text.sectionTitle} mb-4`}>Histórico de pedidos</h2>

        {orders.length === 0 ? (
          <div className={feedback.empty}>
            <p className="text-4xl mb-3">🛍️</p>
            <p>Nenhuma compra encontrada.</p>
            <p className="mt-1 text-[var(--text-subtle)]">Adicione itens ao carrinho e finalize uma compra.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((o) => (
              <li key={o.id} className={card.item}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                  {/* Info do pedido */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`${text.strong} truncate`}>
                        Pedido #{o.id.slice(0, 8)}…
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className={text.label}>
                      {o.itemCount} {o.itemCount === 1 ? "item" : "itens"} •{" "}
                      {formatDate(o.createdAt)}
                    </p>
                  </div>

                  {/* Total + ação */}
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-base font-bold text-[var(--foreground)]">
                      R$ {Number(o.total).toFixed(2)}
                    </p>
                    <Link href={`/compras/${o.id}`} className={btn.ghost}>
                      Ver detalhes →
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
