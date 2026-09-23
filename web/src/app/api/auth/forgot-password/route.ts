import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateResetCode, getResetCodeExpiry } from "@/lib/auth";
import { ForgotPasswordSchema } from "@/lib/schemas";

const STANDARD_MESSAGE =
  "Se o e-mail estiver cadastrado, enviaremos as instrucoes de recuperacao.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = ForgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const code = generateResetCode();
      const expiry = getResetCodeExpiry();

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetCode: code,
          resetCodeExpiry: expiry,
          resetAttempts: 0,
        },
      });

      console.log(`[RECUPERACAO] Codigo para ${email}: ${code} (expira em ${expiry.toISOString()})`);
    }

    return NextResponse.json({ message: STANDARD_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error("Erro em forgot-password:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
