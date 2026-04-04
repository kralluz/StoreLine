"use client";

import { useEffect, useState, type FormEvent } from "react";
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
  onValidationError: (message: string) => void;
};

function CartLineItem({
  item,
  isUpdating,
  isRemoving,
  onUpdate,
  onRemove,
  onValidationError,
}: CartLineItemProps) {
  const [quantityText, setQuantityText] = useState(String(item.quantity));

  const quantityValue = Number(quantityText);
  const isQuantityValid = Number.isInteger(quantityValue) && quantityValue >= 1;

  return (
    <Card as="li" className="p-3" contentClassName="">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="truncate font-medium">{item.product.name}</p>
          <p className="text-sm text-[var(--text-muted)]">
            R$ {item.product.price} • Estoque: {item.product.stock}
          </p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">Item ID: {item.id}</p>
        </div>

        <div className="grid gap-2 md:min-w-[280px]">
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
            <input
              type="number"
              min="1"
              step="1"
              value={quantityText}
              onChange={(e) => setQuantityText(e.target.value)}
              aria-label={`Quantidade de ${item.product.name}`}
              className="rounded border border-[var(--border-default)] px-3 py-2"
              disabled={isUpdating || isRemoving}
            />
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
              variant="outline"
              size="sm"
              disabled={isUpdating || isRemoving || !isQuantityValid}
              onClick={() => {
                if (!isQuantityValid) {
                  onValidationError("Quantidade invalida");
                  return;
                }
                onUpdate(item.id, quantityValue).catch(() => {});
              }}
            >
              {isUpdating ? "Salvando..." : "Atualizar"}
            </Button>
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
          <p className="text-sm text-[var(--text-muted)]">
            Subtotal: R$ {Number(item.lineSubtotal).toFixed(2)}
          </p>
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

  const [newProductId, setNewProductId] = useState("");
  const [newQuantity, setNewQuantity] = useState("1");
  const [adding, setAdding] = useState(false);

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

  async function handleAddItem(e: FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");

    try {
      if (!newProductId.trim()) {
        throw new Error("Informe o ID do produto");
      }

      const parsedQuantity = Number(newQuantity);
      if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
        throw new Error("Quantidade invalida");
      }

      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");

      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: newProductId.trim(),
          quantity: parsedQuantity,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Erro ao adicionar item");
      }

      setNewProductId("");
      setNewQuantity("1");
      await fetchCart();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao adicionar item");
    } finally {
      setAdding(false);
    }
  }

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
    <PageContainer maxWidth="4xl">
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

      <Card title="Adicionar item" contentClassName="mt-3">
        <form onSubmit={handleAddItem} className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
          <input
            value={newProductId}
            onChange={(e) => setNewProductId(e.target.value)}
            placeholder="ID do produto"
            aria-label="ID do produto para adicionar ao carrinho"
            className="rounded border border-[var(--border-default)] px-3 py-2"
            required
            disabled={adding}
          />
          <input
            type="number"
            min="1"
            step="1"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            aria-label="Quantidade para adicionar ao carrinho"
            className="rounded border border-[var(--border-default)] px-3 py-2"
            required
            disabled={adding}
          />
          <Button type="submit" disabled={adding}>
            {adding ? "Adicionando..." : "Adicionar"}
          </Button>
        </form>
      </Card>

      <Card
        title={`Itens (${cart?.itemCount ?? 0})`}
        contentClassName="mt-3"
      >
        {!cart || cart.items.length === 0 ? (
          <p className="text-[var(--text-muted)]">Seu carrinho esta vazio.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {cart.items.map((item) => (
              <CartLineItem
                key={`${item.id}-${item.quantity}`}
                item={item}
                isUpdating={updatingItemId === item.id}
                isRemoving={removingItemId === item.id}
                onUpdate={handleUpdateItem}
                onRemove={handleRemoveItem}
                onValidationError={setError}
              />
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-semibold">Total: R$ {cart?.total ?? "0.00"}</p>
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={finalizing || !cart || cart.items.length === 0}
              onClick={() => handleCheckout().catch(() => {})}
            >
              {finalizing ? "Finalizando..." : "Finalizar compra"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fetchCart().catch((e) => setError(e instanceof Error ? e.message : "Erro"))}
            >
              Atualizar carrinho
            </Button>
            <Button
              type="button"
              variant="text"
              onClick={() => handleClearCart().catch(() => {})}
              disabled={clearing || !cart || cart.items.length === 0}
              className="text-red-700"
            >
              {clearing ? "Limpando..." : "Limpar carrinho"}
            </Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}