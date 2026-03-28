"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StoredUser = {
  name?: string;
};

export default function AuthStatus() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      setUserName(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as StoredUser;
      setUserName(parsedUser.name?.trim() || "Usuario");
    } catch {
      setUserName(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUserName(null);
    router.push("/");
  };

  if (userName) {
    return (
      <div className="flex items-center gap-2">
        <div className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium">
          {userName}
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
