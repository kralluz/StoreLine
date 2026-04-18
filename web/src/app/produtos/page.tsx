import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function imageForProduct(id: string, imageUrl?: string | null) {
  return imageUrl || `https://picsum.photos/seed/storeline-grid-${id}/720/500`;
}

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ stock: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(0,103,79,0.08),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(59,192,155,0.06),transparent_30%)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="rounded-2xl border border-[var(--border-light)] bg-[var(--surface)]/94 p-5 shadow-[0_12px_30px_rgba(15,23,20,0.07)] sm:p-6">
          <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">Catálogo de produtos</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {products.length} {products.length === 1 ? "produto disponível" : "produtos disponíveis"}
          </p>
        </header>

        {products.length === 0 ? (
          <section className="rounded-2xl border border-[var(--border-light)] bg-[var(--surface)]/94 p-8 text-center shadow-[0_10px_22px_rgba(15,23,20,0.06)]">
            <p className="text-lg font-medium text-[var(--foreground)]">Nenhum produto disponível no momento.</p>
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-xl border border-[var(--border-light)] bg-[var(--surface)] shadow-[0_10px_24px_rgba(15,23,20,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,20,0.12)]"
              >
                <Link href={`/produtos/${product.id}`} className="block">
                  <div className="relative h-40 overflow-hidden bg-[var(--accent-soft)]">
                    <img
                      src={imageForProduct(product.id, product.imageUrl)}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[var(--surface)]/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--foreground)]">
                      {product.stock} em estoque
                    </span>
                  </div>

                  <div className="space-y-2.5 p-4">
                    <h2 className="line-clamp-1 text-sm font-semibold text-[var(--foreground)] sm:text-base">{product.name}</h2>
                    <p className="line-clamp-2 min-h-10 text-sm leading-5 text-[var(--text-muted)]">
                      {product.description ?? "Produto disponível no catálogo StoreLine."}
                    </p>

                    <div className="flex items-end justify-between gap-3 pt-1">
                      <p className="text-lg font-semibold text-[var(--foreground)]">{formatCurrency(product.price.toString())}</p>
                      <span className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--accent)]">
                        Ver detalhes
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
