import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailActions from "@/components/product-detail-actions";

export const dynamic = "force-dynamic";

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function imageForProduct(id: string, imageUrl?: string | null) {
  return imageUrl || `https://picsum.photos/seed/storeline-detail-${id}/920/620`;
}

type Props = { params: Promise<{ id: string }> };

export default async function ProdutoDetalhePage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
  });

  if (!product) notFound();

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(0,103,79,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,192,155,0.12),transparent_28%)]" />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link href="/produtos" className="text-sm font-medium text-[var(--accent)] underline underline-offset-4">
          Voltar para a vitrine
        </Link>

        <section className="grid gap-0 overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--surface)]/92 shadow-[0_16px_40px_rgba(15,23,20,0.08)] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col border-b border-[var(--border-light)] lg:border-b-0 lg:border-r">
            <div className="relative h-56 overflow-hidden bg-[var(--accent-soft)] sm:h-72">
              <img
                src={imageForProduct(product.id, product.imageUrl)}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)]">Detalhe do produto</p>
              <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">{product.name}</h1>
              <p className="text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                {product.description ?? "Produto disponível no catálogo StoreLine."}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
            <div className="space-y-5">
              <div className="rounded-xl border border-[var(--border-light)] bg-[var(--accent-soft)] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">Preço atual</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">{formatCurrency(product.price.toString())}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)]">Estoque</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{product.stock} unidades</p>
                </div>
                <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)]">Status</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">Ativo</p>
                </div>
              </div>

              <ProductDetailActions productId={product.id} stock={product.stock} />
            </div>

            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-4">
              <h2 className="text-base font-semibold text-[var(--foreground)]">Resumo rápido</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Produto pronto para compra com estoque e preço visíveis.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}