"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { page, card, text, btn, table, feedback, type OrderStatus } from "@/lib/ui";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  lineSubtotal: string;
};

type OrderDetail = {
  id: string;
  status: OrderStatus;
  subtotal: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

type Props = { params: Promise<{ id: string }> };

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CompraDetalhePage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderDetail | null>(null);

  useEffect(() => {
    async function load() {
      const token = getAuthToken();
      if (!token) {
        router.replace("/auth/login");
        return;
      }
      const { id } = await params;
      const response = await fetch(`/api/compras/detalhe/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as { order?: OrderDetail; error?: string };
      if (!response.ok) throw new Error(data.error || "Erro ao carregar compra");
      setOrder(data.order ?? null);
    }
    load()
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Erro ao carregar compra"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={`${page.narrow} flex flex-col gap-6`}>
        <h1 className={text.pageTitle}>Detalhe do pedido</h1>
        <p className={feedback.loading}>Carregando...</p>
      </div>
    );
  }

  // ── Erro ─────────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className={`${page.narrow} flex flex-col gap-6`}>
        <div className={page.header}>
          <h1 className={text.pageTitle}>Detalhe do pedido</h1>
          <Link href="/compras" className={btn.ghost}>← Minhas compras</Link>
        </div>
        <p className={feedback.error}>{error || "Pedido não encontrado."}</p>
      </div>
    );
  }

  const discount = (Number(order.subtotal) - Number(order.total)).toFixed(2);
  const hasDiscount = Number(discount) > 0;

  // ── Conteúdo ──────────────────────────────────────────────────────────────
  return (
    <div className={`${page.narrow} flex flex-col gap-6`}>

      {/* Cabeçalho */}
      <div className={page.header}>
        <div className="flex flex-col gap-1">
          <Link href="/compras" className={`${btn.ghost} w-fit`}>
            ← Minhas compras
          </Link>
          <h1 className={text.pageTitle}>
            Pedido <span className="font-mono text-xl">#{order.id.slice(0, 8)}…</span>
          </h1>
        </div>
        <Link href="/" className={btn.ghost}>Home</Link>
      </div>

      {/* Status + datas */}
      <div className={card.base}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className={text.label}>Status do pedido</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="text-right">
            <p className={text.label}>Criado em</p>
            <p className="text-sm font-medium text-zinc-700">{formatDate(order.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Itens — tabela no desktop, cards no mobile */}
      <div className={card.base}>
        <h2 className={`${text.sectionTitle} mb-4`}>Itens do pedido</h2>

        {order.items.length === 0 ? (
          <p className={feedback.empty}>Nenhum item.</p>
        ) : (
          <>
            {/* Desktop: tabela */}
            <div className={`${table.wrapper} hidden sm:block`}>
              <table className={table.base}>
                <thead className={table.thead}>
                  <tr>
                    <th className={table.th}>Produto</th>
                    <th className={table.thRight}>Qtd.</th>
                    <th className={table.thRight}>Preço unit.</th>
                    <th className={table.thRight}>Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 bg-white">
                  {order.items.map((item) => (
                    <tr key={item.id} className={table.tr}>
                      <td className={table.tdStrong}>{item.productName}</td>
                      <td className={table.tdRight}>{item.quantity}</td>
                      <td className={table.tdRight}>R$ {Number(item.unitPrice).toFixed(2)}</td>
                      <td className={`${table.tdRight} font-medium text-zinc-900`}>
                        R$ {Number(item.lineSubtotal).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: cards */}
            <ul className="flex flex-col gap-2 sm:hidden">
              {order.items.map((item) => (
                <li key={item.id} className={card.item}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-900">{item.productName}</p>
                      <p className={text.label}>
                        {item.quantity} × R$ {Number(item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-zinc-900">
                      R$ {Number(item.lineSubtotal).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Totais */}
      <div className={card.base}>
        <h2 className={`${text.sectionTitle} mb-4`}>Resumo</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={text.label}>Subtotal</span>
            <span className="text-sm font-medium text-zinc-700">
              R$ {Number(order.subtotal).toFixed(2)}
            </span>
          </div>
          {hasDiscount && (
            <div className="flex items-center justify-between">
              <span className={text.label}>Desconto</span>
              <span className="text-sm font-medium text-emerald-600">
                − R$ {discount}
              </span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-3">
            <span className="font-semibold text-zinc-900">Total</span>
            <span className="text-xl font-bold text-zinc-900">
              R$ {Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
