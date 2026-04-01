import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/request-auth";

function sumQuantities(items: Array<{ quantity: number }>) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

type OrderListItem = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  subtotal: { toString(): string };
  total: { toString(): string };
  createdAt: Date;
  items: Array<{ quantity: number }>;
  user?: { id: string; name: string; email: string };
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const all = url.searchParams.get("all") === "1";

    if (!all) {
      return NextResponse.json(
        { error: "Use /api/compras/{usuario_id} (rota documentada)" },
        { status: 400 }
      );
    }

    const admin = await requireAdmin(request);
    if (!admin.ok) return admin.response;

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { select: { quantity: true } },
      },
    });

    const typed = orders as unknown as OrderListItem[];

    return NextResponse.json(
      {
        orders: typed.map((o) => ({
          id: o.id,
          status: o.status,
          subtotal: o.subtotal.toString(),
          total: o.total.toString(),
          createdAt: o.createdAt,
          itemCount: sumQuantities(o.items),
          user: o.user,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao listar compras:", error);
    return NextResponse.json({ error: "Erro ao listar compras" }, { status: 500 });
  }
}
