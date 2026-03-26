import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePasswords, generateToken } from "@/lib/auth";
import { LoginSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar input
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Verificar senha
    const passwordValid = await comparePasswords(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Gerar token
    const token = generateToken(user.id, user.email);

    return NextResponse.json(
      {
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
