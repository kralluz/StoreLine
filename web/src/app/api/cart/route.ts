import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTokenFromHeader, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get("authorization") ?? undefined);
    if (!token) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalido" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: payload.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                isActive: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Carrinho nao encontrado" }, { status: 404 });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    return NextResponse.json({
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product,
        lineSubtotal: Number(item.product.price) * item.quantity,
      })),
      total: total.toFixed(2),
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error("Erro ao buscar carrinho:", error);
    return NextResponse.json({ error: "Erro ao buscar carrinho" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get("authorization") ?? undefined);
    if (!token) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalido" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: payload.userId },
    });

    if (!cart) {
      return NextResponse.json({ error: "Carrinho nao encontrado" }, { status: 404 });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ message: "Carrinho limpo com sucesso" });
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    return NextResponse.json({ error: "Erro ao limpar carrinho" }, { status: 500 });
  }
}
