"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Card,
  PageContainer,
  PageHeader,
  StatusBadge,
  TextLink,
} from "@/components/ui";

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
      <PageContainer maxWidth="3xl">
        <h1 className="text-3xl font-semibold">Detalhe da compra</h1>
        <p className="text-zinc-700">Carregando...</p>
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer maxWidth="3xl">
        <PageHeader
          title="Detalhe da compra"
          actions={<TextLink href="/compras">Voltar</TextLink>}
        />
        <Alert message={error || "Compra nao encontrada"} />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="3xl">
      <PageHeader
        title={`Compra #${order.id}`}
        actions={
          <>
            <TextLink href="/compras">Minhas compras</TextLink>
            <TextLink href="/">Home</TextLink>
          </>
        }
      />

      <Card>
        <StatusBadge status={order.status} />
        <p className="mt-1 text-sm text-zinc-700">
          Criada em {new Date(order.createdAt).toLocaleString("pt-BR")}
        </p>
      </Card>

      <Card title="Itens" contentClassName="mt-3">

        {order.items.length === 0 ? (
          <p className="text-zinc-700">Nenhum item.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {order.items.map((i) => (
              <Card key={i.id} as="li" className="p-3" contentClassName="">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{i.productName}</p>
                    <p className="text-sm text-zinc-700">
                      {i.quantity} × R$ {i.unitPrice}
                    </p>
                  </div>
                  <p className="text-sm font-medium">R$ {i.lineSubtotal}</p>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-700">Subtotal</p>
          <p className="font-medium">R$ {order.subtotal}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-zinc-700">Total</p>
          <p className="text-lg font-semibold">R$ {order.total}</p>
        </div>
      </Card>
    </PageContainer>
  );
}
