"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
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

function formatStatus(status: OrderDetail["status"]) {
  if (status === "CONFIRMED") return "Confirmada";
  if (status === "CANCELLED") return "Cancelada";
  return "Pendente";
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
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as { order?: OrderDetail; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar compra");
      }

      setOrder(data.order ?? null);
    }

    load()
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erro ao carregar compra");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-8">
        <h1 className="text-3xl font-semibold">Detalhe da compra</h1>
        <p className="text-zinc-700">Carregando...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold">Detalhe da compra</h1>
          <Link href="/compras" className="text-sm underline">
            Voltar
          </Link>
        </div>
        <p className="text-red-600">{error || "Compra nao encontrada"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Compra #{order.id}</h1>
        <div className="flex gap-3">
          <Link href="/compras" className="text-sm underline">
            Minhas compras
          </Link>
          <Link href="/" className="text-sm underline">
            Home
          </Link>
        </div>
      </div>

      <section className="rounded border border-zinc-200 p-4">
        <p className="font-medium">{formatStatus(order.status)}</p>
        <p className="mt-1 text-sm text-zinc-700">
          Criada em {new Date(order.createdAt).toLocaleString("pt-BR")}
        </p>
      </section>

      <section className="rounded border border-zinc-200 p-4">
        <h2 className="text-lg font-medium">Itens</h2>

        {order.items.length === 0 ? (
          <p className="mt-3 text-zinc-700">Nenhum item.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {order.items.map((i) => (
              <li key={i.id} className="rounded border border-zinc-200 p-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{i.productName}</p>
                    <p className="text-sm text-zinc-700">
                      {i.quantity} × R$ {i.unitPrice}
                    </p>
                  </div>
                  <p className="text-sm font-medium">R$ {i.lineSubtotal}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded border border-zinc-200 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-700">Subtotal</p>
          <p className="font-medium">R$ {order.subtotal}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-zinc-700">Total</p>
          <p className="text-lg font-semibold">R$ {order.total}</p>
        </div>
      </section>
    </div>
  );
}
