import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, isResetCodeExpired, MAX_RESET_ATTEMPTS } from "@/lib/auth";
import { ResetPasswordSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = ResetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { email, code, newPassword } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetCode || !user.resetCodeExpiry) {
      return NextResponse.json(
        { error: "Solicitacao de recuperacao nao encontrada" },
        { status: 400 }
      );
    }

    if (user.resetAttempts >= MAX_RESET_ATTEMPTS) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetCode: null, resetCodeExpiry: null, resetAttempts: 0 },
      });
      return NextResponse.json(
        { error: "Codigo invalidado por excesso de tentativas. Solicite um novo codigo." },
        { status: 400 }
      );
    }

    if (isResetCodeExpired(user.resetCodeExpiry)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetCode: null, resetCodeExpiry: null, resetAttempts: 0 },
      });
      return NextResponse.json(
        { error: "Codigo expirado. Solicite um novo codigo." },
        { status: 400 }
      );
    }

    if (user.resetCode !== code) {
      const newAttempts = user.resetAttempts + 1;

      if (newAttempts >= MAX_RESET_ATTEMPTS) {
        await prisma.user.update({
          where: { id: user.id },
          data: { resetCode: null, resetCodeExpiry: null, resetAttempts: 0 },
        });
        return NextResponse.json(
          { error: "Codigo invalidado por excesso de tentativas. Solicite um novo codigo." },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { resetAttempts: newAttempts },
      });

      return NextResponse.json(
        { error: `Codigo incorreto. Tentativas restantes: ${MAX_RESET_ATTEMPTS - newAttempts}.` },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetCode: null,
        resetCodeExpiry: null,
        resetAttempts: 0,
      },
    });

    return NextResponse.json(
      { message: "Senha alterada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro em reset-password:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
