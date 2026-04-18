import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser, jsonUnauthorized } from "@/lib/request-auth";

type Params = { params: Promise<{ compraId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getRequestUser(request);
    if (!user) return jsonUnauthorized();

    const { compraId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: compraId },
      select: {
        userId: true,
        items: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            productId: true,
            productName: true,
            unitPrice: true,
            quantity: true,
            lineSubtotal: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Compra nao encontrada" }, { status: 404 });
    }

    const isOwner = order.userId === user.id;
    const isAdmin = user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Compra nao encontrada" }, { status: 404 });
    }

    return NextResponse.json(
      {
        items: order.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          productName: i.productName,
          unitPrice: i.unitPrice.toString(),
          quantity: i.quantity,
          lineSubtotal: i.lineSubtotal.toString(),
          createdAt: i.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao listar itens da compra:", error);
    return NextResponse.json({ error: "Erro ao listar itens da compra" }, { status: 500 });
  }
}
