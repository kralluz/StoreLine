"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold">StoreLine</h1>
      <p className="text-[var(--text-muted)]">API e frontend unificados em web/src.</p>
      <div className="flex gap-3">
        <Link href="/produtos" className="rounded border border-[var(--border-default)] px-4 py-2">
          Ver produtos
        </Link>
      </div>
    </div>
  );
}
