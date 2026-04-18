"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

type Props = {
  productId: string;
  stock: number;
};

export default function ProductDetailActions({ productId, stock }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const outOfStock = stock <= 0;

  const handleAddToCart = async () => {
    if (outOfStock || loading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const token = window.localStorage.getItem("authToken");
    if (!token) {
      setMessage({ type: "error", text: "Faça login para adicionar ao carrinho." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage({ type: "error", text: data?.error || "Não foi possível adicionar ao carrinho." });
        return;
      }

      window.dispatchEvent(new Event("cart-updated"));
      setMessage({ type: "success", text: "Produto adicionado ao carrinho." });
    } catch {
      setMessage({ type: "error", text: "Erro de conexão. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock || loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {outOfStock ? "Sem estoque" : loading ? "Adicionando..." : "Adicionar ao carrinho"}
      </button>

      {message ? (
        <p
          className={
            message.type === "success"
              ? "rounded-lg border border-[var(--border-light)] bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent)]"
              : "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--status-error)]"
          }
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
