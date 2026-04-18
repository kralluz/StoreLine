"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  PageContainer,
  PageHeader,
  TextLink,
} from "@/components/ui";

type CartItem = {
  id: string;
  quantity: number;
  lineSubtotal: number;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
    price: string;
    stock: number;
    isActive: boolean;
  };
};

type CartData = {
  id: string;
  total: string;
  itemCount: number;
  items: CartItem[];
};

type CartLineItemProps = {
  item: CartItem;
  isUpdating: boolean;
  isRemoving: boolean;
  onUpdate: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
};

function imageForProduct(id: string, imageUrl?: string | null) {
  return imageUrl || `https://picsum.photos/seed/storeline-cart-${id}/320/240`;
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function CartLineItem({
  item,
  isUpdating,
  isRemoving,
  onUpdate,
  onRemove,
}: CartLineItemProps) {
  return (
    <Card as="li" className="p-4" contentClassName="">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-[var(--border-light)] bg-[var(--accent-soft)]">
            <img
              src={imageForProduct(item.product.id, item.product.imageUrl)}
              alt={item.product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--foreground)] sm:text-base">{item.product.name}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {formatCurrency(item.product.price)} • Estoque: {item.product.stock}
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">Subtotal: {formatCurrency(item.lineSubtotal)}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:min-w-[280px]">
          <div className="grid grid-cols-[auto_1fr_auto] gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={`Diminuir quantidade de ${item.product.name}`}
              disabled={isUpdating || isRemoving || item.quantity <= 1}
              onClick={() => onUpdate(item.id, item.quantity - 1).catch(() => {})}
            >
              -
            </Button>
            <div className="flex items-center justify-center rounded border border-[var(--border-default)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]">
              {item.quantity}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={`Aumentar quantidade de ${item.product.name}`}
              disabled={isUpdating || isRemoving || item.quantity >= item.product.stock}
              onClick={() => onUpdate(item.id, item.quantity + 1).catch(() => {})}
            >
              +
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="text"
              disabled={isUpdating || isRemoving}
              onClick={() => onRemove(item.id).catch(() => {})}
              className="text-red-700"
            >
              {isRemoving ? "Removendo..." : "Remover"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export default function CarrinhoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState<CartData | null>(null);

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

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

  async function fetchCart() {
    setError("");
    const token = getAuthToken();
    if (!token) throw new Error("Token ausente");

    const response = await fetch("/api/cart", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as CartData & { error?: string };
    if (!response.ok) {
      throw new Error(data.error || "Erro ao carregar carrinho");
    }

    setCart(data);
  }

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    fetchCart()
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erro ao carregar carrinho");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpdateItem(itemId: string, quantity: number) {
    setUpdatingItemId(itemId);
    setError("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");

      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar item");
      }

      await fetchCart();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao atualizar item");
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function handleRemoveItem(itemId: string) {
    setRemovingItemId(itemId);
    setError("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");

      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Erro ao remover item");
      }

      await fetchCart();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao remover item");
    } finally {
      setRemovingItemId(null);
    }
  }

  async function handleClearCart() {
    setClearing(true);
    setError("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");

      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Erro ao limpar carrinho");
      }

      await fetchCart();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao limpar carrinho");
    } finally {
      setClearing(false);
    }
  }

  async function handleCheckout() {
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

      const data = (await response.json()) as { error?: string; order?: { id: string } };
      if (!response.ok) {
        throw new Error(data.error || "Erro ao finalizar compra");
      }

      if (data.order?.id) {
        router.push(`/compras/${data.order.id}`);
        return;
      }

      router.push("/compras");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao finalizar compra");
    } finally {
      setFinalizing(false);
    }
  }

  if (loading) {
    return (
      <PageContainer maxWidth="4xl">
        <h1 className="text-3xl font-semibold">Carrinho</h1>
        <p className="text-[var(--text-muted)]">Carregando...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Carrinho"
        actions={
          <>
            <TextLink href="/produtos">Ver produtos</TextLink>
            <TextLink href="/compras">Minhas compras</TextLink>
            <TextLink href="/">Home</TextLink>
          </>
        }
      />

      <Alert message={error} />

      {!cart || cart.items.length === 0 ? (
        <Card contentClassName="mt-2">
          <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-8 text-center">
            <p className="text-lg font-semibold text-[var(--foreground)]">Seu carrinho está vazio</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Adicione produtos pelo catálogo para continuar.</p>
            <div className="mt-4">
              <TextLink href="/produtos">Ir para produtos</TextLink>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card title={`Itens no carrinho (${cart.itemCount})`} contentClassName="mt-3">
            <ul className="flex flex-col gap-3">
              {cart.items.map((item) => (
                <CartLineItem
                  key={`${item.id}-${item.quantity}`}
                  item={item}
                  isUpdating={updatingItemId === item.id}
                  isRemoving={removingItemId === item.id}
                  onUpdate={handleUpdateItem}
                  onRemove={handleRemoveItem}
                />
              ))}
            </ul>
          </Card>

          <Card title="Resumo do pedido" contentClassName="mt-3">
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>Itens</span>
                  <span>{cart.itemCount}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border-light)] pt-2 text-base font-semibold text-[var(--foreground)]">
                  <span>Total</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="text"
                  onClick={() => handleClearCart().catch(() => {})}
                  disabled={clearing}
                  className="text-red-700"
                >
                  {clearing ? "Limpando..." : "Limpar carrinho"}
                </Button>
                <Button
                  type="button"
                  disabled={finalizing}
                  onClick={() => handleCheckout().catch(() => {})}
                >
                  {finalizing ? "Finalizando..." : "Finalizar compra"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}