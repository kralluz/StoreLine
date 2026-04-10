/**
 * Design system tokens — StoreLine
 *
 * Use estas constantes em todas as páginas para garantir
 * uniformidade visual entre os módulos.
 */

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
export const page = {
  /** Container estreito — páginas de usuário */
  narrow: "mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10",
  /** Container médio — admin */
  wide: "mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10",
  /** Cabeçalho da página: título + ações lado a lado */
  header: "flex flex-wrap items-center justify-between gap-3",
} as const;

// ---------------------------------------------------------------------------
// Seções / Cards
// ---------------------------------------------------------------------------
export const card = {
  base: "rounded-xl border border-[var(--border-light)] bg-[var(--surface)] p-4 shadow-sm sm:p-6",
  /** Item de lista dentro de um card */
  item: "rounded-lg border border-[var(--border-light)] bg-[var(--surface)] p-3 sm:p-4",
} as const;

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------
export const text = {
  pageTitle: "text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl",
  sectionTitle: "text-base font-semibold text-[var(--foreground)] sm:text-lg",
  label: "text-sm text-[var(--text-subtle)]",
  muted: "text-xs text-[var(--text-subtle)]",
  strong: "font-semibold text-[var(--foreground)]",
  mono: "font-mono text-xs text-[var(--text-subtle)]",
} as const;

// ---------------------------------------------------------------------------
// Botões
// ---------------------------------------------------------------------------
export const btn = {
  primary:
    "inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  success:
    "inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-[var(--text-subtle)] transition-colors hover:bg-[color-mix(in_srgb,var(--surface)_92%,black_8%)] hover:text-[var(--foreground)] focus:outline-none",
  link: "text-sm font-medium text-[var(--text-subtle)] underline-offset-2 transition-colors hover:text-[var(--foreground)] hover:underline",
  dangerGhost:
    "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none",
} as const;

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------
export const input = {
  base: "w-full rounded-lg border border-[var(--border-default)] px-3 py-2 text-sm placeholder-zinc-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900",
  textarea:
    "w-full resize-none rounded-lg border border-[var(--border-default)] px-3 py-2 text-sm placeholder-zinc-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900",
} as const;

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------
export const feedback = {
  error:
    "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
  empty: "py-10 text-center text-sm text-[var(--text-subtle)]",
  loading: "py-10 text-center text-sm text-[var(--text-subtle)]",
} as const;

// ---------------------------------------------------------------------------
// Tabela responsiva
// ---------------------------------------------------------------------------
export const table = {
  wrapper: "overflow-x-auto rounded-lg border border-[var(--border-light)]",
  base: "min-w-full divide-y divide-[var(--border-light)] text-sm",
  thead: "bg-[var(--surface)]",
  th: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]",
  thRight: "px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-subtle)]",
  td: "px-4 py-3 text-[var(--text-muted)]",
  tdRight: "px-4 py-3 text-right text-[var(--text-muted)]",
  tdStrong: "px-4 py-3 font-medium text-[var(--foreground)]",
  tr: "border-t border-[var(--border-light)] transition-colors hover:bg-[var(--surface)]",
  tfoot: "border-t-2 border-[var(--border-light)] bg-[var(--surface)]",
} as const;

// ---------------------------------------------------------------------------
// Status badge de pedido
// ---------------------------------------------------------------------------
export const statusCfg = {
  PENDING: {
    badge: "inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800",
    label: "Pendente",
  },
  CONFIRMED: {
    badge: "inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800",
    label: "Confirmada",
  },
  CANCELLED: {
    badge: "inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800",
    label: "Cancelada",
  },
} as const;

export type OrderStatus = keyof typeof statusCfg;
