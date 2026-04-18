"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const datasetTheme = document.documentElement.dataset.theme;
  if (datasetTheme === "light" || datasetTheme === "dark") {
    return datasetTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "theme") {
        setTheme(resolveInitialTheme());
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  const handleToggle = () => {
    setTheme((currentTheme) => {
      const updatedTheme: Theme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = updatedTheme;
      window.localStorage.setItem("theme", updatedTheme);
      return updatedTheme;
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)]/85 text-[var(--accent)] shadow-sm hover:border-[var(--accent)]/45 hover:bg-[var(--accent-soft)] hover:shadow-md"
      aria-label={`Mudar para tema ${nextTheme === "dark" ? "escuro" : "claro"}`}
      title={`Mudar para tema ${nextTheme === "dark" ? "escuro" : "claro"}`}
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}