"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrderSummary = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
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

function formatStatus(status: OrderSummary["status"]) {
  if (status === "CONFIRMED") return "Confirmada";
  if (status === "CANCELLED") return "Cancelada";
  return "Pendente";
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
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as { orders?: OrderSummary[]; error?: string };

    if (!response.ok) {
      throw new Error(data.error || "Erro ao carregar compras");
    }

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
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as {
        error?: string;
        order?: { id: string };
      };

      if (!response.ok) {
        throw new Error(data.error || "Erro ao finalizar compra");
      }

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
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erro ao carregar compras");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-8">
        <h1 className="text-3xl font-semibold">Minhas compras</h1>
        <p className="text-zinc-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Minhas compras</h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => loadOrders().catch((e) => setError(e instanceof Error ? e.message : "Erro"))}
            className="text-sm underline"
            disabled={finalizing}
          >
            Atualizar
          </button>
          <Link href="/" className="text-sm underline">
            Home
          </Link>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <section className="rounded border border-zinc-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Finalizar compra</h2>
          <button
            type="button"
            onClick={finalizePurchase}
            className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-60"
            disabled={finalizing}
          >
            {finalizing ? "Finalizando..." : "Finalizar compra"}
          </button>
        </div>
        <p className="mt-2 text-sm text-zinc-700">
          Finaliza a compra usando os itens atuais do seu carrinho.
        </p>
      </section>

      <section className="rounded border border-zinc-200 p-4">
        <h2 className="text-lg font-medium">Historico</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-zinc-700">Nenhuma compra encontrada.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {orders.map((o) => (
              <li key={o.id} className="rounded border border-zinc-200 p-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">Compra #{o.id}</p>
                    <p className="text-sm text-zinc-700">
                      {formatStatus(o.status)} • Itens: {o.itemCount} • R$ {o.total}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {new Date(o.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>

                  <Link href={`/compras/${o.id}`} className="text-sm underline">
                    Ver
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
