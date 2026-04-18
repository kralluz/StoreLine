import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getRequestUser, jsonUnauthorized } from "@/lib/request-auth";

function sumQuantities(items: Array<{ quantity: number }>) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

type Params = { params: Promise<{ usuarioId: string }> };

type CartSnapshot = {
  id: string;
  items: Array<{
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: { toString(): string };
      stock: number;
      isActive: boolean;
    };
  }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authUser = await getRequestUser(request);
    if (!authUser) return jsonUnauthorized();

    const { usuarioId } = await params;

    const isOwner = authUser.id === usuarioId;
    const isAdmin = authUser.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: usuarioId },
      orderBy: { createdAt: "desc" },
      include: { items: { select: { quantity: true } } },
    });

    return NextResponse.json(
      {
        orders: orders.map((o) => ({
          id: o.id,
          status: o.status,
          subtotal: o.subtotal.toString(),
          total: o.total.toString(),
          createdAt: o.createdAt,
          itemCount: sumQuantities(o.items),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao listar compras do usuario:", error);
    return NextResponse.json({ error: "Erro ao listar compras" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const authUser = await getRequestUser(request);
    if (!authUser) return jsonUnauthorized();

    const { usuarioId } = await params;

    const isOwner = authUser.id === usuarioId;
    const isAdmin = authUser.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 403 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: usuarioId },
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

    const typedCart = cart as unknown as CartSnapshot | null;

    if (!typedCart) {
      return NextResponse.json({ error: "Carrinho nao encontrado" }, { status: 404 });
    }

    if (typedCart.items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const invalidProduct = typedCart.items.find((i) => !i.product.isActive);
    if (invalidProduct) {
      return NextResponse.json(
        { error: "Carrinho contem produto inativo", productId: invalidProduct.productId },
        { status: 409 }
      );
    }

    const insufficient = typedCart.items.find((i) => i.product.stock < i.quantity);
    if (insufficient) {
      return NextResponse.json(
        {
          error: "Estoque insuficiente",
          productId: insufficient.productId,
          available: insufficient.product.stock,
        },
        { status: 409 }
      );
    }

    const subtotalNumber = typedCart.items.reduce(
      (sum, item) => sum + Number(item.product.price.toString()) * item.quantity,
      0
    );

    const subtotal = subtotalNumber.toFixed(2);

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of typedCart.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (updated.count !== 1) {
          throw new Error("STOCK_CHANGED");
        }
      }

      const order = await tx.order.create({
        data: {
          userId: usuarioId,
          status: "CONFIRMED",
          subtotal,
          total: subtotal,
          items: {
            create: typedCart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              unitPrice: item.product.price.toString(),
              quantity: item.quantity,
              lineSubtotal: (Number(item.product.price.toString()) * item.quantity).toFixed(2),
            })),
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: typedCart.id } });

      return order;
    });

    return NextResponse.json(
      {
        message: "Compra finalizada",
        order: {
          id: result.id,
          status: result.status,
          subtotal: result.subtotal.toString(),
          total: result.total.toString(),
          createdAt: result.createdAt,
          itemCount: sumQuantities(result.items),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_CHANGED") {
      return NextResponse.json(
        { error: "Estoque mudou durante a compra, tente novamente" },
        { status: 409 }
      );
    }

    console.error("Erro ao finalizar compra:", error);
    return NextResponse.json({ error: "Erro ao finalizar compra" }, { status: 500 });
  }
}
