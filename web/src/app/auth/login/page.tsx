"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registrationSuccess = searchParams.get("registered") === "1";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      login(data.token, data.user);

      router.push("/");
    } catch (err) {
      setError("Erro de conexao");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <h1 className="mb-6 text-2xl font-semibold">Login</h1>
      {registrationSuccess ? (
        <p className="mb-4 rounded-lg border border-[var(--border-light)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
          Cadastro concluido. Entre com seu email e senha para acessar a conta.
        </p>
      ) : null}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="rounded border border-[var(--border-default)] px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
          className="rounded border border-[var(--border-default)] px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-[var(--text-muted)]">
        Nao tem conta? <Link href="/auth/register" className="underline">Registre-se</Link>
      </p>
    </div>
  );
}