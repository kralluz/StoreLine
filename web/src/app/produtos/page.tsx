import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Produtos</h1>
        <Link href="/" className="text-sm underline">
          Voltar
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-zinc-700">Nenhum produto disponivel.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((p) => (
            <li key={p.id} className="rounded border border-zinc-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-medium">{p.name}</h2>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-700">{p.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {p.price.toString()}</p>
                  <p className="text-xs text-zinc-600">Estoque: {p.stock}</p>
                </div>
              </div>

              <div className="mt-3">
                <Link href={`/produtos/${p.id}`} className="text-sm underline">
                  Ver detalhes
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
