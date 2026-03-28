import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTokenFromHeader, verifyToken } from "@/lib/auth";
import { UpdateCartItemSchema } from "@/lib/schemas";

async function getCartItemForUser(itemId: string, userId: string) {
  return prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId },
    },
    include: {
      product: { select: { id: true, name: true, price: true, stock: true } },
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const token = extractTokenFromHeader(request.headers.get("authorization") ?? undefined);
    if (!token) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalido" }, { status: 401 });
    }

    const { itemId } = await params;

    const body = await request.json();
    const validation = UpdateCartItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: validation.error.flatten((i) => i.message) },
        { status: 400 }
      );
    }

    const { quantity } = validation.data;

    const cartItem = await getCartItemForUser(itemId, payload.userId);
    if (!cartItem) {
      return NextResponse.json({ error: "Item nao encontrado no carrinho" }, { status: 404 });
    }

    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: "Estoque insuficiente", available: cartItem.product.stock },
        { status: 409 }
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: { select: { id: true, name: true, price: true, stock: true } } },
    });

    return NextResponse.json({
      message: "Quantidade atualizada",
      item: {
        id: updated.id,
        quantity: updated.quantity,
        product: updated.product,
        lineSubtotal: (Number(updated.product.price) * updated.quantity).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar item do carrinho:", error);
    return NextResponse.json({ error: "Erro ao atualizar item do carrinho" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const token = extractTokenFromHeader(request.headers.get("authorization") ?? undefined);
    if (!token) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalido" }, { status: 401 });
    }

    const { itemId } = await params;

    const cartItem = await getCartItemForUser(itemId, payload.userId);
    if (!cartItem) {
      return NextResponse.json({ error: "Item nao encontrado no carrinho" }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return NextResponse.json({ message: "Item removido do carrinho" });
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    return NextResponse.json({ error: "Erro ao remover item do carrinho" }, { status: 500 });
  }
}
