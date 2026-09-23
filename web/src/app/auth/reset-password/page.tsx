"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: emailFromQuery,
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("As senhas nao conferem");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao redefinir senha");
        return;
      }

      setMessage("Senha alterada com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch {
      setError("Erro de conexao");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <h1 className="mb-2 text-2xl font-semibold">Redefinir senha</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        Digite o codigo de 6 digitos recebido e sua nova senha.
      </p>

      {message && (
        <p className="mb-4 rounded-lg border border-[var(--border-light)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
          {message}
        </p>
      )}
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
          type="text"
          name="code"
          placeholder="Codigo de 6 digitos"
          value={formData.code}
          onChange={handleChange}
          required
          maxLength={6}
          inputMode="numeric"
          pattern="\d{6}"
          className="rounded border border-[var(--border-default)] px-3 py-2 text-center text-lg tracking-widest"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="Nova senha"
          value={formData.newPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="rounded border border-[var(--border-default)] px-3 py-2"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar nova senha"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="rounded border border-[var(--border-default)] px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-1 text-sm text-[var(--text-muted)]">
        <Link href="/auth/forgot-password" className="underline">
          Solicitar novo codigo
        </Link>
        <Link href="/auth/login" className="underline">
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
