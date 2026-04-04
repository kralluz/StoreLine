"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  PageContainer,
  PageHeader,
  TextLink,
} from "@/components/ui";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  isActive: boolean;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "0",
  stock: "0",
  isActive: true,
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

export default function AdminProdutosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function loadProducts() {
    setError("");
    const token = getAuthToken();

    const response = await fetch("/api/produtos?all=1", {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = (await response.json()) as { products?: Product[]; error?: string };

    if (!response.ok) {
      throw new Error(data.error || "Erro ao carregar produtos");
    }

    setProducts(data.products ?? []);
  }

  useEffect(() => {
    const role = getLocalUserRole();
    if (role !== "ADMIN") {
      router.replace("/auth/login");
      return;
    }

    loadProducts()
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erro ao carregar");
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      stock: String(p.stock),
      isActive: p.isActive,
    });
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");

      const payload = {
        name: form.name,
        description: form.description.trim() === "" ? null : form.description,
        price: form.price,
        stock: form.stock,
        isActive: form.isActive,
      };

      const url = editingId ? `/api/produtos/${editingId}` : "/api/produtos";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar produto");
      }

      await loadProducts();
      startCreate();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Remover este produto?")) return;

    setError("");
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");

      const response = await fetch(`/api/produtos/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Erro ao remover produto");
      }

      await loadProducts();
      if (editingId === id) startCreate();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao remover");
    }
  }

  if (loading) {
    return (
      <PageContainer maxWidth="4xl">
        <h1 className="text-3xl font-semibold">Admin / Produtos</h1>
        <p className="text-[var(--text-muted)]">Carregando...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="4xl">
      <PageHeader
        title="Admin / Produtos"
        actions={
          <>
            <TextLink href="/produtos">Ver listagem publica</TextLink>
            <TextLink href="/">Home</TextLink>
          </>
        }
      />

      <Alert message={error} />

      <Card>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">{isEditing ? "Editar" : "Novo"} produto</h2>
          <Button
            type="button"
            onClick={startCreate}
            variant="text"
            disabled={saving}
          >
            Limpar
          </Button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="Nome"
            className="rounded border border-[var(--border-default)] px-3 py-2"
            required
          />

          <textarea
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            placeholder="Descricao (opcional)"
            className="min-h-[88px] rounded border border-[var(--border-default)] px-3 py-2"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
              placeholder="Preco"
              className="rounded border border-[var(--border-default)] px-3 py-2"
              required
            />
            <input
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))}
              placeholder="Estoque"
              className="rounded border border-[var(--border-default)] px-3 py-2"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))}
            />
            Ativo (visivel na listagem publica)
          </label>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
          </Button>
        </form>
      </Card>

      <Card title="Produtos" contentClassName="mt-3">
        {products.length === 0 ? (
          <p className="text-[var(--text-muted)]">Nenhum produto cadastrado.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {products.map((p) => (
              <Card key={p.id} as="li" className="p-3" contentClassName="">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {p.name}{" "}
                      {!p.isActive && <span className="text-xs text-[var(--text-subtle)]">(inativo)</span>}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">R$ {p.price} • Estoque: {p.stock}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" onClick={() => startEdit(p)} variant="text">
                      Editar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      variant="text"
                      className="text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </ul>
        )}
      </Card>
    </PageContainer>
  );
}
