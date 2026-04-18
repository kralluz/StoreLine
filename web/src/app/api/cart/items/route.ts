import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTokenFromHeader, verifyToken } from "@/lib/auth";
import { AddCartItemSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get("authorization") ?? undefined);
    if (!token) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token invalido" }, { status: 401 });
    }

    const body = await request.json();
    const validation = AddCartItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: validation.error.flatten((i) => i.message) },
        { status: 400 }
      );
    }

    const { productId, quantity } = validation.data;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Produto nao encontrado ou inativo" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Estoque insuficiente", available: product.stock },
        { status: 409 }
      );
    }

    const cart = await prisma.cart.findUnique({ where: { userId: payload.userId } });
    if (!cart) {
      return NextResponse.json({ error: "Carrinho nao encontrado" }, { status: 404 });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    let item;
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: "Estoque insuficiente", available: product.stock },
          { status: 409 }
        );
      }
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: { select: { id: true, name: true, imageUrl: true, price: true, stock: true } } },
      });
    } else {
      item = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
        include: { product: { select: { id: true, name: true, imageUrl: true, price: true, stock: true } } },
      });
    }

    return NextResponse.json(
      {
        message: "Item adicionado ao carrinho",
        item: {
          id: item.id,
          quantity: item.quantity,
          product: item.product,
          lineSubtotal: (Number(item.product.price) * item.quantity).toFixed(2),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao adicionar item ao carrinho:", error);
    return NextResponse.json({ error: "Erro ao adicionar item ao carrinho" }, { status: 500 });
  }
}
