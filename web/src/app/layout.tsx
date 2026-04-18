import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthStatus from "@/components/auth-status";
import { AuthProvider } from "@/components/auth-context";
import ThemeInit from "@/components/theme-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoreLine",
  description: "StoreLine application",
};

const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var stored=localStorage.getItem("theme");if(stored==="light"||stored==="dark"){document.documentElement.dataset.theme=stored;return;}var prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=prefersDark?"dark":"light";}catch(_){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeInit />
          <header className="sticky top-0 z-40 w-full border-b border-[var(--border-light)] bg-[var(--surface)]/90 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
              <Link href="/" className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase">StoreLine</span>
                <span className="text-xs text-[var(--text-subtle)]">Vitrine e compras</span>
              </Link>

              <AuthStatus />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="w-full border-t border-[var(--border-light)] bg-[var(--surface)]/92 px-4 py-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-[var(--foreground)]">StoreLine</p>
                <p>Catalogo online, carrinho e compras em um unico fluxo.</p>
              </div>

              <nav className="flex items-center gap-2" aria-label="Redes sociais">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                  aria-label="X"
                  title="X"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                    <path d="M18.9 2H22l-6.77 7.74L23 22h-6.08l-4.77-6.24L6.7 22H3.57l7.25-8.29L1 2h6.23l4.32 5.7L18.9 2Zm-1.07 18h1.68L6.32 3.9H4.5L17.83 20Z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                    <path d="M13.5 8.5V6.9c0-.6.4-1 1-1h1.8V3h-2.7c-2.3 0-3.8 1.4-3.8 3.8v1.7H7v3h2.8V21h3.7v-6.5h2.7l.5-3h-3.2Z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                    <path d="M21.5 6.5c-.7.3-1.4.5-2.1.6.8-.5 1.3-1.2 1.6-2.1-.7.5-1.6.8-2.4 1-1.4-1.4-3.8-1.3-5.1.3-.8 1-.9 2.3-.4 3.4-3-.2-5.7-1.6-7.5-3.9-1 1.8-.5 4.1 1.2 5.2-.6 0-1.2-.2-1.8-.5 0 2 1.4 3.7 3.4 4.1-.6.2-1.2.2-1.8.1.6 1.8 2.3 3 4.2 3.1-1.6 1.2-3.5 1.9-5.5 1.9H5c2 1.3 4.3 1.9 6.7 1.9 8 0 12.4-6.7 12.4-12.4v-.6c.8-.6 1.4-1.3 1.9-2.1-.8.4-1.6.7-2.5.8Z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
                    <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18.1c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.1Zm4.5-6.1c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1l-.4.5c-.1.1-.2.2-.4.1-1.2-.6-2-1.2-2.8-2.3-.2-.2 0-.3.1-.4l.3-.3c.1-.1.2-.2.3-.4.1-.1 0-.3 0-.4 0-.1-.5-1.3-.7-1.7-.2-.4-.3-.3-.5-.3h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.4 1 2.5c.1.2 1.7 2.6 4.2 3.6.6.3 1 .4 1.4.5.6.2 1.2.1 1.6.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z" />
                  </svg>
                </a>
              </nav>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
