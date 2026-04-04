import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProdutoDetalhePage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
  });

  if (!product) notFound();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <Link href="/produtos" className="text-sm underline">
          Voltar
        </Link>
      </div>

      {product.description && <p className="text-[var(--text-muted)]">{product.description}</p>}

      <div className="rounded border border-[var(--border-light)] p-4">
        <p className="text-lg font-medium">R$ {product.price.toString()}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Estoque: {product.stock}</p>
      </div>
    </div>
  );
}
