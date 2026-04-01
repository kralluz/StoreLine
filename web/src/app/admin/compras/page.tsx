"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { page, card, text, btn, table, feedback, type OrderStatus } from "@/lib/ui";

type AdminOrderSummary = {
  id: string;
  status: OrderStatus;
  subtotal: string;
  total: string;
  createdAt: string;
  itemCount: number;
  user?: { id: string; name: string; email: string };
};

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

function getLocalUserRole(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { role?: string };
    return parsed.role ?? null;
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

export default function AdminComprasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);

  async function loadOrders() {
    setError("");
    const token = getAuthToken();
    const response = await fetch("/api/compras?all=1", {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    });
    const data = (await response.json()) as { orders?: AdminOrderSummary[]; error?: string };
    if (!response.ok) throw new Error(data.error || "Erro ao carregar compras");
    setOrders(data.orders ?? []);
  }

  useEffect(() => {
    const role = getLocalUserRole();
    if (role !== "ADMIN") {
      router.replace("/auth/login");
      return;
    }
    loadOrders()
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={`${page.wide} flex flex-col gap-6`}>
        <h1 className={text.pageTitle}>Admin · Compras</h1>
        <p className={feedback.loading}>Carregando...</p>
      </div>
    );
  }

  // ── Conteúdo ──────────────────────────────────────────────────────────────
  return (
    <div className={`${page.wide} flex flex-col gap-6`}>

      {/* Cabeçalho */}
      <div className={page.header}>
        <div>
          <p className={text.label}>Painel Admin</p>
          <h1 className={text.pageTitle}>Compras</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => loadOrders().catch(() => {})}
            className={btn.ghost}
          >
            Atualizar
          </button>
          <Link href="/admin/produtos" className={btn.ghost}>
            Produtos
          </Link>
          <Link href="/" className={btn.ghost}>
            Home
          </Link>
        </div>
      </div>

      {/* Erro */}
      {error && <p className={feedback.error}>{error}</p>}

      {/* Sumário rápido */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className={`${card.base} flex flex-col gap-1`}>
          <span className={text.label}>Total de pedidos</span>
          <span className="text-2xl font-bold text-zinc-900">{orders.length}</span>
        </div>
        <div className={`${card.base} flex flex-col gap-1`}>
          <span className={text.label}>Pendentes</span>
          <span className="text-2xl font-bold text-amber-600">
            {orders.filter((o) => o.status === "PENDING").length}
          </span>
        </div>
        <div className={`${card.base} col-span-2 flex flex-col gap-1 sm:col-span-1`}>
          <span className={text.label}>Confirmadas</span>
          <span className="text-2xl font-bold text-emerald-600">
            {orders.filter((o) => o.status === "CONFIRMED").length}
          </span>
        </div>
      </div>

      {/* Tabela de pedidos */}
      <div className={card.base}>
        <h2 className={`${text.sectionTitle} mb-4`}>
          Histórico global{" "}
          <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
            {orders.length}
          </span>
        </h2>

        {orders.length === 0 ? (
          <div className={feedback.empty}>
            <p className="text-4xl mb-3">📦</p>
            <p>Nenhuma compra registrada ainda.</p>
          </div>
        ) : (
          <>
            {/* Desktop: tabela */}
            <div className={`${table.wrapper} hidden sm:block`}>
              <table className={table.base}>
                <thead className={table.thead}>
                  <tr>
                    <th className={table.th}>Pedido</th>
                    <th className={table.th}>Cliente</th>
                    <th className={table.th}>Status</th>
                    <th className={table.thRight}>Itens</th>
                    <th className={table.thRight}>Total</th>
                    <th className={table.th}>Data</th>
                    <th className={table.th}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {orders.map((o) => (
                    <tr key={o.id} className={table.tr}>
                      <td className={table.td}>
                        <span className="font-mono text-xs text-zinc-500">
                          #{o.id.slice(0, 8)}…
                        </span>
                      </td>
                      <td className={table.td}>
                        {o.user ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-zinc-900">{o.user.name}</span>
                            <span className="text-xs text-zinc-400">{o.user.email}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                      <td className={table.td}>
                        <StatusBadge status={o.status} />
                      </td>
                      <td className={table.tdRight}>{o.itemCount}</td>
                      <td className={`${table.tdRight} font-semibold text-zinc-900`}>
                        R$ {Number(o.total).toFixed(2)}
                      </td>
                      <td className={`${table.td} whitespace-nowrap text-xs text-zinc-500`}>
                        {formatDate(o.createdAt)}
                      </td>
                      <td className={table.td}>
                        <Link href={`/compras/${o.id}`} className={btn.ghost}>
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: cards */}
            <ul className="flex flex-col gap-3 sm:hidden">
              {orders.map((o) => (
                <li key={o.id} className={card.item}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-mono text-xs text-zinc-400">
                          #{o.id.slice(0, 8)}…
                        </span>
                        {o.user && (
                          <span className="truncate font-medium text-zinc-900">{o.user.name}</span>
                        )}
                        {o.user && (
                          <span className="truncate text-xs text-zinc-400">{o.user.email}</span>
                        )}
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={text.label}>
                        {o.itemCount} {o.itemCount === 1 ? "item" : "itens"} •{" "}
                        {formatDate(o.createdAt)}
                      </span>
                      <span className="font-bold text-zinc-900">
                        R$ {Number(o.total).toFixed(2)}
                      </span>
                    </div>
                    <Link href={`/compras/${o.id}`} className={`${btn.ghost} w-fit`}>
                      Ver detalhes →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

    </div>
  );
}
