import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthStatus from "@/components/auth-status";
import { AuthProvider } from "@/components/auth-context";
import ThemeToggle from "@/components/theme-toggle";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <header className="w-full border-b border-[var(--border-light)] px-4 py-3">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-2">
              <ThemeToggle />
              <AuthStatus />
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
