"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  PageContainer,
  PageHeader,
  StatusBadge,
  TextLink,
} from "@/components/ui";

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
      <PageContainer maxWidth="5xl">
        <h1 className="text-3xl font-semibold">Admin / Compras</h1>
        <p className="text-zinc-700">Carregando...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Admin / Compras"
        actions={
          <>
            <Button type="button" onClick={() => loadOrders().catch(() => {})} variant="text">
              Atualizar
            </Button>
            <TextLink href="/admin/produtos">Admin / Produtos</TextLink>
            <TextLink href="/">Home</TextLink>
          </>
        }
      />

      <Alert message={error} />

      <Card title="Historico de compras" contentClassName="mt-3">
        {orders.length === 0 ? (
          <p className="text-zinc-700">Nenhuma compra encontrada.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {orders.map((o) => (
              <Card key={o.id} as="li" className="p-3" contentClassName="">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">Compra #{o.id}</p>
                    <p className="text-sm text-zinc-700">
                      <StatusBadge status={o.status} /> • Itens: {o.itemCount} • R$ {o.total}
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      {new Date(o.createdAt).toLocaleString("pt-BR")}
                      {o.user ? ` • ${o.user.name} (${o.user.email})` : ""}
                    </p>
                  </div>

                  <TextLink href={`/compras/${o.id}`}>Ver</TextLink>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </Card>
    </PageContainer>
  );
}
