import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser, jsonUnauthorized } from "@/lib/request-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getRequestUser(request);
    if (!user) return jsonUnauthorized();

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { orderBy: { createdAt: "asc" } },
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
        order: {
          id: order.id,
          status: order.status,
          subtotal: order.subtotal.toString(),
          total: order.total.toString(),
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          user: isAdmin ? order.user : undefined,
          items: order.items.map((i) => ({
            id: i.id,
            productId: i.productId,
            productName: i.productName,
            unitPrice: i.unitPrice.toString(),
            quantity: i.quantity,
            lineSubtotal: i.lineSubtotal.toString(),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar compra:", error);
    return NextResponse.json({ error: "Erro ao buscar compra" }, { status: 500 });
  }
}
