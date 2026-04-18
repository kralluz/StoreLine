import StorefrontHome, { type StorefrontProduct } from "@/components/storefront-home";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function serializeProduct(product: {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: { toString(): string };
  stock: number;
  createdAt: Date;
}): StorefrontProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price.toString(),
    stock: product.stock,
    createdAt: product.createdAt.toISOString(),
  };
}

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ createdAt: "desc" }],
    take: 30,
  });

  const products = dbProducts.map(serializeProduct);

  const bestSellers = [...products].sort((a, b) => b.stock - a.stock).slice(0, 10);
  const launches = [...products]
    .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
    .slice(0, 10);
  const promotions = [...products].sort((a, b) => Number(a.price) - Number(b.price)).slice(0, 10);

  return (
    <StorefrontHome
      productsCount={products.length}
      bestSellers={bestSellers}
      launches={launches}
      promotions={promotions}
    />
  );
}
