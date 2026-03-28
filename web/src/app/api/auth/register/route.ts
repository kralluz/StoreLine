import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { RegisterSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ja esta registrado" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    const token = generateToken(user.id, user.email);

    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Usuario registrado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no registro:", error);

    if (
      error instanceof Prisma.PrismaClientInitializationError &&
      error.message.includes("DATABASE_URL")
    ) {
      return NextResponse.json(
        { error: "Configuracao ausente: defina DATABASE_URL no ambiente" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao registrar usuario" },
      { status: 500 }
    );
  }
}