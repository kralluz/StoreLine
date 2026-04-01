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
  base: "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6",
  /** Item de lista dentro de um card */
  item: "rounded-lg border border-zinc-100 bg-zinc-50 p-3 sm:p-4",
} as const;

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------
export const text = {
  pageTitle: "text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl",
  sectionTitle: "text-base font-semibold text-zinc-900 sm:text-lg",
  label: "text-sm text-zinc-500",
  muted: "text-xs text-zinc-400",
  strong: "font-semibold text-zinc-900",
  mono: "font-mono text-xs text-zinc-500",
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
    "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none",
  link: "text-sm font-medium text-zinc-600 underline-offset-2 transition-colors hover:text-zinc-900 hover:underline",
  dangerGhost:
    "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none",
} as const;

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------
export const input = {
  base: "w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm placeholder-zinc-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900",
  textarea:
    "w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm placeholder-zinc-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-zinc-900",
} as const;

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------
export const feedback = {
  error:
    "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
  empty: "py-10 text-center text-sm text-zinc-400",
  loading: "py-10 text-center text-sm text-zinc-400",
} as const;

// ---------------------------------------------------------------------------
// Tabela responsiva
// ---------------------------------------------------------------------------
export const table = {
  wrapper: "overflow-x-auto rounded-lg border border-zinc-200",
  base: "min-w-full divide-y divide-zinc-200 text-sm",
  thead: "bg-zinc-50",
  th: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500",
  thRight: "px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500",
  td: "px-4 py-3 text-zinc-700",
  tdRight: "px-4 py-3 text-right text-zinc-700",
  tdStrong: "px-4 py-3 font-medium text-zinc-900",
  tr: "border-t border-zinc-100 transition-colors hover:bg-zinc-50",
  tfoot: "border-t-2 border-zinc-200 bg-zinc-50",
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
