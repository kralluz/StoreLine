"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { Button, TextLink } from "@/components/ui";

export default function AuthStatus() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <>
            <TextLink href="/admin/produtos" variant="chipPrimary">
              Admin produtos
            </TextLink>
            <TextLink href="/admin/compras" variant="chip">
              Admin compras
            </TextLink>
          </>
        ) : null}

        <TextLink href="/produtos" variant="chip">
          Produtos
        </TextLink>
        <TextLink href="/carrinho" variant="chip">
          Carrinho
        </TextLink>
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)]/85 px-3 py-1.5 text-sm font-medium text-[var(--foreground)]">
          {user.name} {isAdmin ? "(ADMIN)" : ""}
        </div>
        <Button type="button" onClick={handleLogout} variant="outline" size="sm">
          Desconectar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TextLink href="/auth/login" variant="chip">
        Entrar
      </TextLink>
      <TextLink href="/auth/register" variant="chipPrimary">
        Criar conta
      </TextLink>
    </div>
  );
}
