"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminOrderSummary = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
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

function formatStatus(status: AdminOrderSummary["status"]) {
  if (status === "CONFIRMED") return "Confirmada";
  if (status === "CANCELLED") return "Cancelada";
  return "Pendente";
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
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = (await response.json()) as { orders?: AdminOrderSummary[]; error?: string };

    if (!response.ok) {
      throw new Error(data.error || "Erro ao carregar compras");
    }

    setOrders(data.orders ?? []);
  }

  useEffect(() => {
    const role = getLocalUserRole();
    if (role !== "ADMIN") {
      router.replace("/auth/login");
      return;
    }

    loadOrders()
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erro ao carregar");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-8">
        <h1 className="text-3xl font-semibold">Admin / Compras</h1>
        <p className="text-zinc-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Admin / Compras</h1>
        <div className="flex gap-3">
          <button type="button" onClick={() => loadOrders().catch(() => {})} className="text-sm underline">
            Atualizar
          </button>
          <Link href="/admin/produtos" className="text-sm underline">
            Admin / Produtos
          </Link>
          <Link href="/" className="text-sm underline">
            Home
          </Link>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <section className="rounded border border-zinc-200 p-4">
        <h2 className="text-lg font-medium">Historico de compras</h2>

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
                      {o.user ? ` • ${o.user.name} (${o.user.email})` : ""}
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
