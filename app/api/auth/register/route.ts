import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { RegisterSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar input
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está registrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // Gerar token
    const token = generateToken(user.id, user.email);

    // Criar carrinho vazio para o novo usuário
    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Usuário registrado com sucesso",
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
    return NextResponse.json(
      { error: "Erro ao registrar usuário" },
      { status: 500 }
    );
  }
}
