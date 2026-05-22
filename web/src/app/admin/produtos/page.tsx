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
  imageUrl: string | null;
  price: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type ProductFormState = {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  stock: string;
  isActive: boolean;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  imageUrl: "",
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

function ConfirmModal({
  productName,
  onConfirm,
  onCancel,
}: {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6 shadow-[0_20px_50px_rgba(15,23,20,0.2)]">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Remover produto</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Tem certeza que deseja remover <span className="font-medium text-[var(--foreground)]">{productName}</span>? Essa ação não pode ser desfeita.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-[var(--status-error)] text-white hover:brightness-90"
          >
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({
  editingId,
  form,
  saving,
  error,
  onChange,
  onSubmit,
  onClose,
}: {
  editingId: string | null;
  form: ProductFormState;
  saving: boolean;
  error: string;
  onChange: (patch: Partial<ProductFormState>) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}) {
  const isEditing = editingId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[0_20px_50px_rgba(15,23,20,0.2)]">
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-6 py-4">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            {isEditing ? "Editar produto" : "Novo produto"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-subtle)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 px-6 py-5">
          {error ? (
            <p className="rounded-lg border border-[var(--status-error)]/30 bg-[color-mix(in_srgb,var(--status-error)_8%,transparent)] px-3 py-2 text-sm text-[var(--status-error)]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-subtle)]">Nome</label>
            <input
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Nome do produto"
              required
              className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-subtle)]">Descricao <span className="font-normal opacity-60">(opcional)</span></label>
            <textarea
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Descricao do produto"
              rows={3}
              className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--text-subtle)]">URL da imagem <span className="font-normal opacity-60">(opcional)</span></label>
            <input
              value={form.imageUrl}
              onChange={(e) => onChange({ imageUrl: e.target.value })}
              placeholder="https://..."
              className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--text-subtle)]">Preco (R$)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => onChange({ price: e.target.value })}
                required
                className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--text-subtle)]">Estoque</label>
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                value={form.stock}
                onChange={(e) => onChange({ stock: e.target.value })}
                required
                className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => onChange({ isActive: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Ativo — visivel na listagem publica
          </label>

          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Criar produto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProdutosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const confirmProduct = useMemo(
    () => products.find((p) => p.id === confirmDeleteId) ?? null,
    [products, confirmDeleteId]
  );

  async function loadProducts() {
    setError("");
    const token = getAuthToken();
    const response = await fetch("/api/produtos?all=1", {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    });
    const data = (await response.json()) as { products?: Product[]; error?: string };
    if (!response.ok) throw new Error(data.error || "Erro ao carregar produtos");
    setProducts(data.products ?? []);
  }

  useEffect(() => {
    const role = getLocalUserRole();
    if (role !== "ADMIN") {
      router.replace("/auth/login");
      return;
    }
    loadProducts()
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "",
      price: p.price,
      stock: String(p.stock),
      isActive: p.isActive,
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setFormError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");

      const payload = {
        name: form.name,
        description: form.description.trim() === "" ? null : form.description,
        imageUrl: form.imageUrl.trim() === "" ? null : form.imageUrl.trim(),
        price: form.price,
        stock: form.stock,
        isActive: form.isActive,
      };

      const url = editingId ? `/api/produtos/${editingId}` : "/api/produtos";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Erro ao salvar produto");

      await loadProducts();
      closeModal();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError("");
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token ausente");

      const response = await fetch(`/api/produtos/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Erro ao remover produto");

      await loadProducts();
      if (editingId === id) closeModal();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao remover");
    } finally {
      setConfirmDeleteId(null);
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
            <TextLink href="/produtos" variant="chip">Ver listagem publica</TextLink>
            <TextLink href="/" variant="chip">Home</TextLink>
          </>
        }
      />

      <Alert message={error} />

      <div className="flex justify-end">
        <Button type="button" onClick={openCreate}>
          + Novo produto
        </Button>
      </div>

      <Card title="Produtos" contentClassName="mt-3">
        {products.length === 0 ? (
          <p className="text-[var(--text-muted)]">Nenhum produto cadastrado.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {products.map((p) => (
              <Card key={p.id} as="li" className="p-3" contentClassName="">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-[var(--border-light)] bg-[var(--accent-soft)]">
                      <img
                        src={p.imageUrl || `https://picsum.photos/seed/storeline-admin-${p.id}/112/112`}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--foreground)]">
                        {p.name}{" "}
                        {!p.isActive && <span className="text-xs text-[var(--text-subtle)]">(inativo)</span>}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">R$ {p.price} • Estoque: {p.stock}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button type="button" onClick={() => openEdit(p)} variant="text" size="sm">
                      Editar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setConfirmDeleteId(p.id)}
                      variant="text"
                      size="sm"
                      className="text-[var(--status-error)] hover:bg-[color-mix(in_srgb,var(--status-error)_10%,transparent)]"
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

      {modalOpen ? (
        <ProductModal
          editingId={editingId}
          form={form}
          saving={saving}
          error={formError}
          onChange={(patch) => setForm((s) => ({ ...s, ...patch }))}
          onSubmit={onSubmit}
          onClose={closeModal}
        />
      ) : null}

      {confirmProduct ? (
        <ConfirmModal
          productName={confirmProduct.name}
          onConfirm={() => onDelete(confirmDeleteId!)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      ) : null}
    </PageContainer>
  );
}
