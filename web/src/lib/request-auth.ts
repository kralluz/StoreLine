import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTokenFromHeader, verifyToken } from "@/lib/auth";

export type AuthUser = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name: string;
};

export function jsonUnauthorized(message = "Nao autorizado") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function jsonForbidden(message = "Acesso negado") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function getRequestUser(request: NextRequest): Promise<AuthUser | null> {
  const token = extractTokenFromHeader(request.headers.get("authorization") ?? undefined);
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, name: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

export async function requireAdmin(request: NextRequest): Promise<
  | { ok: true; user: AuthUser }
  | { ok: false; response: NextResponse }
> {
  const user = await getRequestUser(request);

  if (!user) {
    return { ok: false, response: jsonUnauthorized() };
  }

  if (user.role !== "ADMIN") {
    return { ok: false, response: jsonForbidden("Apenas administrador") };
  }

  return { ok: true, user };
}
