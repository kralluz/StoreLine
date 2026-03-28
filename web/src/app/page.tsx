import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold">StoreLine</h1>
      <p className="text-zinc-700">API e frontend unificados em web/src.</p>
      <div className="flex gap-3">
        <Link href="/produtos" className="rounded border border-zinc-300 px-4 py-2">
          Ver produtos
        </Link>
        <Link href="/auth/login" className="rounded bg-zinc-900 px-4 py-2 text-white">
          Entrar
        </Link>
        <Link href="/auth/register" className="rounded border border-zinc-300 px-4 py-2">
          Criar conta
        </Link>
      </div>
    </div>
  );
}
