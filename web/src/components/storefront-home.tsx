"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, MouseEvent, useState } from "react";
import { useAuth } from "@/components/auth-context";

export type StorefrontProduct = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: string;
  stock: number;
  createdAt: string;
};

type Props = {
  productsCount: number;
  bestSellers: StorefrontProduct[];
  launches: StorefrontProduct[];
  promotions: StorefrontProduct[];
};

type ModalMode = "login" | "register";

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function imageForProduct(id: string, imageUrl?: string | null) {
  return imageUrl || `https://picsum.photos/seed/storeline-${id}/560/360`;
}

function CartPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 3h3l2.4 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 6H7" />
      <path d="M15 9h4" />
      <path d="M17 7v4" />
    </svg>
  );
}

function ProductCard({
  product,
  badge,
  showPromo,
  onCardClick,
  onAddToCart,
}: {
  product: StorefrontProduct;
  badge: string;
  showPromo?: boolean;
  onCardClick: (productId: string) => void;
  onAddToCart: (productId: string, event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const currentPrice = Number(product.price);
  const previousPrice = showPromo ? currentPrice * 1.18 : null;

  return (
    <article
      className="group w-[16.25rem] shrink-0 snap-start overflow-hidden rounded-xl border border-[var(--border-light)] bg-[var(--surface)] shadow-[0_8px_18px_rgba(15,23,20,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(15,23,20,0.12)] sm:w-[17.5rem]"
      role="button"
      tabIndex={0}
      onClick={() => onCardClick(product.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onCardClick(product.id);
        }
      }}
    >
      <div className="relative h-36 overflow-hidden bg-[var(--accent-soft)] sm:h-40">
        <img
          src={imageForProduct(product.id, product.imageUrl)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[var(--surface)]/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--foreground)]">
          {badge}
        </span>
      </div>

      <div className="space-y-2.5 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-[var(--foreground)] sm:text-base">{product.name}</h3>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-[var(--text-muted)]">
          {product.description ?? "Produto disponível no catálogo StoreLine."}
        </p>

        <div className="flex items-end justify-between gap-3 pt-1">
          <div>
            {previousPrice ? (
              <p className="text-xs text-[var(--text-subtle)] line-through">{formatCurrency(previousPrice.toFixed(2))}</p>
            ) : null}
            <p className="text-lg font-semibold text-[var(--foreground)]">{formatCurrency(product.price)}</p>
          </div>
          <button
            type="button"
            onClick={(event) => onAddToCart(product.id, event)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
          >
            <CartPlusIcon />
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductCarousel({
  title,
  subtitle,
  products,
  badge,
  showPromo,
  onCardClick,
  onAddToCart,
}: {
  title: string;
  subtitle: string;
  products: StorefrontProduct[];
  badge: string;
  showPromo?: boolean;
  onCardClick: (productId: string) => void;
  onAddToCart: (productId: string, event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-[var(--border-light)] bg-[var(--surface)]/94 p-4 shadow-[0_10px_24px_rgba(15,23,20,0.06)] sm:p-5">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-[var(--border-light)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--text-muted)]">
          Sem produtos nesta seção no momento.
        </p>
      ) : (
        <div className="store-carousel -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
          {products.map((product) => (
            <ProductCard
              key={`${title}-${product.id}`}
              product={product}
              badge={badge}
              showPromo={showPromo}
              onCardClick={onCardClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function StorefrontHome({ productsCount, bestSellers, launches, promotions }: Props) {
  const router = useRouter();
  const { user, login } = useAuth();

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("login");
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalNotice, setModalNotice] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => {
      setToast((current) => (current?.text === text ? null : current));
    }, 2600);
  };

  const addProductToCart = async (productId: string, tokenOverride?: string) => {
    setToast(null);

    const token = tokenOverride ?? window.localStorage.getItem("authToken");
    if (!token) {
      showToast("error", "Faça login para adicionar produtos ao carrinho.");
      return false;
    }

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
      showToast("error", data?.error || "Nao foi possivel adicionar o produto ao carrinho.");
      return false;
    }

    showToast("success", "Produto adicionado ao carrinho com sucesso.");
    window.dispatchEvent(new Event("cart-updated"));
    return true;
  };

  const handleAddToCartClick = async (productId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!user) {
      setPendingProductId(productId);
      setModalMode("login");
      setModalError("");
      setModalNotice("");
      setModalOpen(true);
      return;
    }

    await addProductToCart(productId);
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setModalError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();
      if (!response.ok) {
        setModalError(data?.error || "Erro ao fazer login.");
        return;
      }

      login(data.token, data.user);

      if (pendingProductId) {
        const added = await addProductToCart(pendingProductId, data.token);
        if (added) {
          setModalOpen(false);
          setPendingProductId(null);
        }
      } else {
        setModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      setModalError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setModalError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setModalError(data?.error || "Erro ao registrar.");
        return;
      }

      setModalMode("login");
      setLoginForm((prev) => ({ ...prev, email: registerForm.email }));
      setModalNotice("Cadastro concluído. Faça login para continuar.");
    } catch (error) {
      console.error(error);
      setModalError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,103,79,0.08),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(59,192,155,0.06),transparent_30%)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="rounded-2xl border border-[var(--border-light)] bg-[var(--surface)]/94 p-5 shadow-[0_12px_30px_rgba(15,23,20,0.07)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-[0.18em] text-[var(--accent)] uppercase">StoreLine</p>
              <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                Encontre produtos com preço justo e navegação simples.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                Veja os destaques da loja em carrosséis separados por contexto de compra.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)]">
                <p className="text-xs text-[var(--text-subtle)]">Itens na vitrine</p>
                <p className="text-lg font-semibold">{productsCount}</p>
              </div>
              <Link
                href="/produtos"
                className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)]/45 hover:bg-[var(--accent-soft)]"
              >
                Ver catálogo
              </Link>
            </div>
          </div>

        </section>

        <ProductCarousel
          title="Mais vendidos"
          subtitle="Produtos com maior saída no momento."
          products={bestSellers}
          badge="Mais vendido"
          onCardClick={(id) => router.push(`/produtos/${id}`)}
          onAddToCart={handleAddToCartClick}
        />

        <ProductCarousel
          title="Lançamentos"
          subtitle="Novidades que chegaram recentemente ao catálogo."
          products={launches}
          badge="Novo"
          onCardClick={(id) => router.push(`/produtos/${id}`)}
          onAddToCart={handleAddToCartClick}
        />

        <ProductCarousel
          title="Promoções"
          subtitle="Ofertas selecionadas para economizar agora."
          products={promotions}
          badge="Oferta"
          showPromo
          onCardClick={(id) => router.push(`/produtos/${id}`)}
          onAddToCart={handleAddToCartClick}
        />
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-light)] bg-[var(--surface)] p-5 shadow-[0_24px_60px_rgba(15,23,20,0.25)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {modalMode === "login" ? "Entre para continuar" : "Crie sua conta"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-[var(--border-default)] px-2.5 py-1 text-sm text-[var(--text-muted)] hover:bg-[var(--accent-soft)]"
              >
                Fechar
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setModalMode("login");
                  setModalError("");
                }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  modalMode === "login"
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--border-default)] text-[var(--foreground)]"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalMode("register");
                  setModalError("");
                }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  modalMode === "register"
                    ? "bg-[var(--accent)] text-white"
                    : "border border-[var(--border-default)] text-[var(--foreground)]"
                }`}
              >
                Criar conta
              </button>
            </div>

            {modalNotice ? (
              <p className="mb-3 rounded-lg border border-[var(--border-light)] bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent)]">
                {modalNotice}
              </p>
            ) : null}
            {modalError ? (
              <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--status-error)]">
                {modalError}
              </p>
            ) : null}

            {modalMode === "login" ? (
              <form className="space-y-3" onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                />
                <input
                  type="password"
                  required
                  placeholder="Senha"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar e adicionar"}
                </button>
              </form>
            ) : (
              <form className="space-y-3" onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  required
                  placeholder="Nome"
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                />
                <input
                  type="password"
                  required
                  placeholder="Senha"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {loading ? "Criando conta..." : "Criar conta"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed right-4 top-20 z-[85] max-w-sm rounded-xl border px-4 py-3 text-sm shadow-[0_18px_40px_rgba(15,23,20,0.2)] backdrop-blur sm:right-6">
          <div
            className={
              toast.type === "success"
                ? "rounded-lg border border-[var(--border-light)] bg-[var(--accent-soft)] px-3 py-2 text-[var(--accent)]"
                : "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[var(--status-error)]"
            }
          >
            {toast.text}
          </div>
        </div>
      ) : null}
    </main>
  );
}
