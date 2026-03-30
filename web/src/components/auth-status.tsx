"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

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
        <div className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium">
          {user.name}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium"
      >
        Entrar
      </Link>
      <Link
        href="/auth/register"
        className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
      >
        Criar conta
      </Link>
    </div>
  );
}
