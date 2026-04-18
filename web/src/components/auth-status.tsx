"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import ThemeToggle from "@/components/theme-toggle";

function AvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
}

export default function AuthStatus() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const loadCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }

      const token = window.localStorage.getItem("authToken");
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const response = await fetch("/api/cart", {
          headers: { authorization: `Bearer ${token}` },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setCartCount(0);
          return;
        }

        setCartCount(Number(data?.itemCount ?? 0));
      } catch {
        setCartCount(0);
      }
    };

    const refresh = () => {
      void loadCartCount();
    };

    refresh();

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("cart-updated", refresh as EventListener);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("cart-updated", refresh as EventListener);
    };
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const menuItems = user
    ? [
        { href: "/carrinho", label: "Carrinho" },
        { href: "/compras", label: "Minhas compras" },
        ...(isAdmin
          ? [
              { href: "/admin/produtos", label: "Admin produtos" },
              { href: "/admin/compras", label: "Admin compras" },
            ]
          : []),
      ]
    : [];

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]"
        >
          Entrar
        </Link>
        <Link
          href="/auth/register"
          className="rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white hover:brightness-95"
        >
          Criar conta
        </Link>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex items-center rounded-full border border-[var(--border-default)] bg-[var(--surface)]/90 p-2 shadow-sm transition hover:border-[var(--accent)]/45 hover:shadow-md"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
          {user ? initials(user.name) : <AvatarIcon />}
        </span>
        {cartCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[#dc2626] px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-[70] mt-3 w-[18rem] overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] shadow-[0_20px_50px_rgba(15,23,20,0.16)]">
          <div className="border-b border-[var(--border-light)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">{user.email}</p>
            <p className="mt-2 inline-flex rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent)]">
              {isAdmin ? "Administrador" : "Cliente"}
            </p>
          </div>

          <div className="p-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
              >
                {item.label}
                {item.href === "/carrinho" && cartCount > 0 ? (
                  <span className="ml-auto rounded-full bg-[#dc2626] px-2 py-0.5 text-[11px] font-semibold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </Link>
            ))}

            <div className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5">
              <span className="text-sm font-medium text-[var(--foreground)]">Tema</span>
              <ThemeToggle />
            </div>
          </div>

          <div className="border-t border-[var(--border-light)] p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[var(--status-error)] hover:bg-red-50"
            >
              Sair
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
