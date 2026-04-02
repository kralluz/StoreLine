"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { Button, TextLink } from "@/components/ui";

export default function AuthStatus() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <TextLink href="/carrinho" variant="chip">
          Carrinho
        </TextLink>
        <div className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium">
          {user.name}
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
