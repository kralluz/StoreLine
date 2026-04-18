"use client";

import { useEffect } from "react";

type Theme = "light" | "dark";

function applyInitialTheme() {
  const stored = window.localStorage.getItem("theme");

  if (stored === "light" || stored === "dark") {
    document.documentElement.dataset.theme = stored as Theme;
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
}

export default function ThemeInit() {
  useEffect(() => {
    applyInitialTheme();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "theme") {
        applyInitialTheme();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}
