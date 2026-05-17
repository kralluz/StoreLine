# Por que Next.js? — StoreLine na Prática

> Apresentação técnica do StoreLine como **case real de Next.js 16 + App Router + React 19**, organizado pelo papel de cada dev e com comparações diretas a outros frameworks populares.

---

## 1. Resumo executivo

O StoreLine é uma loja virtual completa (catálogo público, autenticação, carrinho, checkout, área admin) construída em **um único projeto Next.js**. Tudo o que normalmente exigiria 2 ou 3 repositórios separados (frontend SPA + API REST + servidor de assets) acontece dentro de `web/`:

| Função | Em Next.js 16 | Stack tradicional equivalente |
|--------|--------------|-------------------------------|
| UI | App Router (Server + Client Components) | React + React Router + Webpack/Vite |
| API REST | Route Handlers (`app/**/route.ts`) | Express/Fastify + Cors + body-parser |
| Auth gate | Função `requireAdmin()` chamada por route handlers | Middleware Express + JWT |
| Roteamento | File-based (`app/produtos/[id]/page.tsx`) | React Router config-based |
| SSR de catálogo | `async` Server Component lendo Prisma direto | API call + `useEffect` + skeleton + estado |
| Build de produção | `output: "standalone"` (auto-bundle) | Webpack manual + Express server scratch |
| Fonts otimizadas | `next/font/google` (auto-inline, sem layout shift) | `<link rel="preconnect">` + CSS manual |
| Deploy | 1 container Docker | 2+ containers (web + api) ou Vercel + serverless extra |

**Resultado prático:** 4 devs com perfis diferentes contribuíram sem conflito de stack — frontend e backend falam a mesma linguagem (TypeScript), compartilham `@/lib/*`, deployam juntos.

---

## 2. Equipe e papéis

| Dev | Papel | Áreas tocadas |
|-----|-------|---------------|
| **Carlos Henrique** ([@kralluz](https://github.com/kralluz)) | Backend / Data | Prisma schema, Route Handlers, módulo de compras, CI/CD |
| **Luiz Felipe Fonseca** ([@fonslu](https://github.com/fonslu)) | Auth / DevOps / Refactor | Auth helpers, dockerização, Next standalone, refactor `useSyncExternalStore` |
| **Iago José Vieira de Araujo** ([@iagojv](https://github.com/iagojv)) | Frontend / UX | App Router, layouts, design system, estilização |
| **Felipe Gomes** ([@zirilu](https://github.com/zirilu)) | Backend / Frontend Catálogo | Prisma inicial, módulo de produtos (público + admin) |

---

## 3. Carlos Henrique — Route Handlers + Prisma no mesmo repo

### Pontos Next.js destacados

**API REST nasce direto de arquivos `route.ts`** sem servidor Express, sem CORS, sem rota declarativa, sem boilerplate. O mesmo TypeScript que renderiza a tela escreve a API.

#### Exemplo real — [`web/src/app/api/produtos/route.ts`](../web/src/app/api/produtos/route.ts)

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/request-auth";
import { ProductCreateSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const all = url.searchParams.get("all") === "1";

  if (all) {
    const admin = await requireAdmin(request);
    if (!admin.ok) return admin.response;
  }

  const products = await prisma.product.findMany({
    where: all ? undefined : { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return admin.response;

  const validation = ProductCreateSchema.safeParse(await request.json());
  if (!validation.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: validation.error.flatten() },
      { status: 400 }
    );
  }
  // ... create + return
}
```

#### O que isso entrega em Next.js

- **File = endpoint**: `app/api/produtos/route.ts` → `GET/POST /api/produtos`. Sem `app.get("/api/produtos", handler)`.
- **HTTP method = nome do export**: `GET`, `POST`, `PUT`, `DELETE`, `PATCH` viram funções nomeadas no mesmo arquivo. Express precisa de roteador + verbo + path para cada.
- **`NextRequest`/`NextResponse`** já são tipados (params, query, headers, cookies, JSON). Express devolve `req: any` + `res: any` por padrão.
- **Mesmo TS, mesmo `tsconfig`, mesmo `@/lib/*`** que a UI. Não há repo separado, build separado, deploy separado.

### Comparação com Express + React separados

| Aspecto | Next.js Route Handler | Express + React (CRA/Vite) |
|---------|----------------------|---------------------------|
| Registro de rota | Filesystem (`app/api/.../route.ts`) | `app.get("/...", handler)` |
| Tipos request/response | Nativos (`NextRequest`/`NextResponse`) | `@types/express` opcional + `req: any` |
| Validação body | `await request.json()` + Zod | `body-parser` + Zod |
| CORS | Não precisa (mesma origin) | `cors()` middleware obrigatório |
| Cookies/sessões | API uniforme com SSR | `cookie-parser` separado |
| Build | 1 comando (`next build`) | 2 (webpack frontend + tsc backend) |
| Deploy | 1 servidor (`node server.js` standalone) | 2 containers ou nginx reverse proxy |
| Tipo compartilhado UI↔API | `import type` direto | Geração via OpenAPI ou duplicação manual |

### Comparação com outros frameworks fullstack

- **Remix** — também tem `loader` + `action` no mesmo arquivo da página, mas mistura UI e API. Next separa em `page.tsx` vs `route.ts`, mais explícito.
- **NestJS + React** — decorators, módulos, providers, DI container, separação de 2 repos. Para CRUD básico, exige ~5x mais código.
- **Django/Rails + React** — backend monolítico em outra linguagem; perde-se reuso de tipos TS.

---

## 4. Luiz Felipe — Auth helpers + Next standalone + Docker

### Pontos Next.js destacados

#### 4.1 `output: "standalone"` — Docker de 1 comando

[`web/next.config.ts`](../web/next.config.ts):

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

**Uma linha** transforma o build em um bundle auto-contido (`server.js` + `node_modules` mínimo + assets). Resultado: [`web/Dockerfile`](../web/Dockerfile) multi-stage com imagem final `node:20-slim` pesando uma fração do que pesaria em CRA + Express.

```dockerfile
# Stage 2: Production image
FROM node:20-slim AS runner

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENTRYPOINT ["./docker-entrypoint.sh"]
```

E o entrypoint conecta tudo:

```sh
#!/bin/sh
echo "Running migrations..."
prisma migrate deploy
echo "Starting application..."
exec node server.js
```

> **Sem standalone**: precisaria copiar `node_modules` inteiro (~500MB), escrever um Express custom servindo `.next/static`, configurar headers de cache manualmente.

#### 4.2 Auth como função, não middleware framework

[`web/src/lib/request-auth.ts`](../web/src/lib/request-auth.ts) — `requireAdmin` é uma **função TypeScript pura** que recebe `NextRequest` e retorna union type. Cada route handler decide quando chamar.

```ts
export async function requireAdmin(request: NextRequest): Promise<
  | { ok: true; user: AuthUser }
  | { ok: false; response: NextResponse }
> {
  const user = await getRequestUser(request);
  if (!user) return { ok: false, response: jsonUnauthorized() };
  if (user.role !== "ADMIN") {
    return { ok: false, response: jsonForbidden("Apenas administrador") };
  }
  return { ok: true, user };
}
```

Uso no handler ([`api/produtos/route.ts`](../web/src/app/api/produtos/route.ts:31)):

```ts
const admin = await requireAdmin(request);
if (!admin.ok) return admin.response;
// admin.user é AuthUser tipado a partir daqui
```

**Tipo-narrowing nativo** faz o TS saber que após `admin.ok` é true, `admin.user` existe e é `AuthUser`. Em Express middleware, costumamos mutar `req.user` com `any`.

#### 4.3 Client store com `useSyncExternalStore` (React 19)

[`web/src/components/auth-context.tsx`](../web/src/components/auth-context.tsx) — refactor recente (PR #85) trocou `useState + useEffect` por `useSyncExternalStore`:

```tsx
const listeners = new Set<() => void>();
function notify() { listeners.forEach((l) => l()); }

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", () => callback());
  window.addEventListener("focus", () => callback());
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", () => callback());
    window.removeEventListener("focus", () => callback());
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // ...
}
```

**Por que isso é idiomático Next + React 19**:
- Elimina cascading renders (`react-hooks/set-state-in-effect`).
- Server-snapshot retorna `null` → SSR consistente, sem warning de hydration.
- Sincroniza entre abas via `storage` event sem hooks customizados.

### Comparação

| Necessidade | Next.js (StoreLine) | SPA + Express |
|-------------|---------------------|---------------|
| Build de produção | `next build` → standalone | Webpack + Babel + tsc backend |
| Imagem Docker | `node:20-slim` + `server.js` | Frontend nginx + backend node + reverse proxy |
| Migrations no boot | `docker-entrypoint.sh` → 1 container | Job separado ou hook no nginx |
| Auth | Função pura por handler | Middleware global `app.use(authMiddleware)` |
| State global cross-tab | `useSyncExternalStore` + `storage` event | Redux + custom middleware |

---

## 5. Iago — App Router + Layouts + Client Components

### Pontos Next.js destacados

#### 5.1 Root Layout compartilhado

[`web/src/app/layout.tsx`](../web/src/app/layout.tsx) define **header + footer + provider de auth + script de tema** uma única vez, e **todas as 11 rotas** herdam.

```tsx
export const metadata: Metadata = {
  title: "StoreLine",
  description: "StoreLine application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <header className="sticky top-0 ..."> ... <AuthStatus /></header>
          <main className="flex-1">{children}</main>
          <footer> ... </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### 5.2 Fonts otimizadas com `next/font`

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
```

**O que Next faz automaticamente**:
- Baixa a fonte no **build time** (não roda em produção).
- Auto-host em `_next/static/media/` (sem chamada externa ao Google).
- Gera `@font-face` com `font-display: swap`.
- Atrela a uma CSS variable usável no Tailwind.

Em CRA: `<link>` no `index.html`, FOUT visível, dependência runtime de Google CDN.

#### 5.3 Client/Server boundary explícito

A loja toda é **Server Component por padrão** (sem `'use client'`). Apenas componentes interativos opt-in:

- [`auth-status.tsx`](../web/src/components/auth-status.tsx) → `'use client'` (precisa de `useState`, `useRouter`)
- [`product-detail-actions.tsx`](../web/src/components/product-detail-actions.tsx) → `'use client'` (botão Adicionar ao Carrinho)
- [`storefront-home.tsx`](../web/src/components/storefront-home.tsx) → Server Component, recebe dados como props

**O bundle JavaScript que vai pro browser só contém os componentes client.** Em CRA, **tudo** vai pro bundle.

#### 5.4 `next/link` para navegação instantânea

```tsx
<Link href={`/produtos/${product.id}`} className="block">
  {/* card */}
</Link>
```

Faz **prefetch automático** ao entrar no viewport. Em React Router, prefetch é manual com `useTransition` + hooks customizados.

#### 5.5 `useRouter` programático

[`auth-status.tsx:106`](../web/src/components/auth-status.tsx#L102):

```tsx
const handleLogout = () => {
  logout();
  setOpen(false);
  router.push("/");
};
```

API uniforme entre App Router e Server Actions. React Router muda API entre v5 e v6+.

### Comparação

| Feature | Next.js App Router | React Router | Angular |
|---------|-------------------|--------------|---------|
| Layouts hierárquicos | Nativo (`layout.tsx`) | Manual via outlet | Module + outlet config |
| Metadata por rota | `export const metadata` | `react-helmet` | Title service |
| Fonts otimizadas | `next/font` (zero-config) | CSS manual + preconnect | Manual |
| Client/Server boundary | `'use client'` | Tudo client | Tudo client |
| Prefetch | Automático em `<Link>` | Manual | `RouterModule.preloadingStrategy` |
| 404 | `app/not-found.tsx` + `notFound()` | `<Route path="*">` | NotFound module |

---

## 6. Felipe Gomes — Server Components fazendo fetch direto do banco

### Pontos Next.js destacados

#### 6.1 Página de catálogo sem `useEffect`

[`web/src/app/produtos/page.tsx`](../web/src/app/produtos/page.tsx):

```tsx
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ stock: "desc" }, { createdAt: "desc" }],
  });

  return (
    <section className="grid gap-4 ...">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </section>
  );
}
```

**O que acontece:**
1. Componente é **async**.
2. Roda **no servidor**, abre conexão Prisma, busca produtos.
3. Renderiza HTML **com os produtos já embutidos**.
4. Cliente recebe HTML pronto + payload mínimo do React (não duplica os produtos).
5. Sem loading skeleton, sem `useEffect`, sem `useState`, sem estado de erro.

#### 6.2 Página de detalhe com dynamic segment + `notFound()`

[`web/src/app/produtos/[id]/page.tsx`](../web/src/app/produtos/[id]/page.tsx):

```tsx
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function ProdutoDetalhePage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
  });

  if (!product) notFound();

  return ( /* JSX usando product.* */ );
}
```

- `[id]` no path = segmento dinâmico, tipado em `params`.
- `notFound()` interrompe a renderização e dispara `app/not-found.tsx` (ou 404 padrão).
- Zero JS de rota no cliente para essa lógica.

#### 6.3 Home buscando 3 listas (best sellers, lançamentos, promoções)

[`web/src/app/page.tsx`](../web/src/app/page.tsx):

```tsx
export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ createdAt: "desc" }],
    take: 30,
  });

  const products = dbProducts.map(serializeProduct);
  const bestSellers = [...products].sort((a, b) => b.stock - a.stock).slice(0, 10);
  const launches    = [...products].sort(/* createdAt */).slice(0, 10);
  const promotions  = [...products].sort(/* price */).slice(0, 10);

  return <StorefrontHome bestSellers={...} launches={...} promotions={...} />;
}
```

Toda a lógica de ordenação roda **no servidor**, antes do HTML sair. Cliente nem sabe que existe.

### Comparação

| Cenário | Next.js Server Component | CRA / Vite + React |
|---------|-------------------------|--------------------|
| Listar produtos | `await prisma.findMany()` direto | `useEffect` + `fetch("/api/produtos")` + `useState` + loading state + error state |
| SEO | HTML completo no primeiro byte | HTML vazio → JS hydrata → CLS |
| Bundle do cliente | Não inclui código do fetch | Inclui hooks + fetch + tipagem |
| Acesso ao banco | Direto, sem REST intermediário | Obrigatoriamente passa por API |
| Cache | Configurável por rota (`dynamic`, `revalidate`) | Manual com React Query/SWR |

| vs Remix | Server Component | Remix `loader` |
|----------|-----------------|----------------|
| API | `async function Page()` | `export async function loader() {}` |
| Streaming | Native (RSC) | Native (Web Fetch + `Response`) |
| Type-flow | `await` direto em props | `useLoaderData<typeof loader>()` |

| vs Angular | Server Component | Angular Universal |
|-----------|-----------------|-------------------|
| Setup | Zero | `@angular/platform-server` + módulos extras |
| Mental model | Função async | Resolver + Service + module |

---

## 7. Tabela comparativa consolidada — Next.js 16 vs alternativas

| Feature | **Next.js 16** | CRA | Vite + React | Remix | Angular | NestJS + React |
|---------|---------------|-----|--------------|-------|---------|----------------|
| Roteamento file-based | ✅ App Router | ❌ Manual | ❌ Plugin | ✅ | ❌ Config | ❌ Decorators |
| Server Components | ✅ | ❌ | ❌ | ❌ (loaders) | ❌ | ❌ |
| Route Handlers (API junto) | ✅ | ❌ | ❌ | ✅ (`action`) | ❌ | ✅ (controllers) |
| SSR built-in | ✅ | ❌ | ⚠️ Plugin | ✅ | ⚠️ Universal | ❌ |
| SSG built-in | ✅ | ❌ | ⚠️ Plugin | ✅ | ⚠️ Prerender | ❌ |
| `next/image` (otimização) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `next/font` (fontes inline) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Layouts hierárquicos nativos | ✅ | ❌ | ❌ | ✅ | ⚠️ Module | ❌ |
| Build standalone (Docker enxuto) | ✅ | ❌ | ❌ | ⚠️ Manual | ❌ | ⚠️ Manual |
| Prefetch automático | ✅ | ❌ | ❌ | ✅ | ⚠️ Strategy | ❌ |
| Streaming SSR | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Acesso direto ao banco em UI | ✅ (Server Component) | ❌ | ❌ | ✅ (loader) | ❌ | ❌ |
| Deploy unitário | ✅ 1 container | ❌ 2+ | ❌ 2+ | ✅ | ❌ 2+ | ❌ 2+ |
| Curva inicial | Baixa | Baixa | Baixa | Média | Alta | Alta |
| Tipagem end-to-end | ✅ nativa | ⚠️ duplica | ⚠️ duplica | ✅ | ✅ | ✅ |

---

## 8. Métricas concretas do StoreLine

| Indicador | Valor |
|-----------|-------|
| Linhas de TS/TSX | ~149 KB (`web/src/`) |
| Route handlers (`api/**/route.ts`) | 11 endpoints |
| Páginas | 11 rotas (Server + Client) |
| Servidores em produção | **1** (next standalone) |
| Containers em produção | **2** (db + web) |
| Tempo para subir tudo do zero | `docker compose up --build` — 1 comando |
| Devs colaborando | 4 (perfis diferentes, mesma stack) |
| Linguagem unificada UI ↔ API | TypeScript |

---

## 9. Conclusão para a banca

**Next.js 16 + App Router permitiu que um time de 4 pessoas com perfis distintos entregasse uma loja completa sem fragmentar a stack:**

- O backend dev escreveu API REST como funções TypeScript, sem framework HTTP separado.
- O DevOps dev empacotou tudo em **1 container** com `output: "standalone"` + 1 entrypoint.
- O frontend dev usou layouts hierárquicos, fonts otimizadas e client/server boundary explícito.
- O dev de catálogo eliminou loading skeletons buscando dados **no servidor**, dentro do próprio componente.

**Em CRA + Express equivalente**: seriam 2 repos, 2 builds, 2 deploys, duplicação de tipos, CORS, e ~3x mais código de plumbing antes da primeira tela.

O projeto demonstra na prática o slogan da Vercel: **"The React Framework for the Web"** — não é apenas um SSR a mais, é o **fim da separação artificial entre frontend e backend** em projetos web modernos.

---

## Referências dos arquivos citados

- [`web/next.config.ts`](../web/next.config.ts) — config standalone
- [`web/src/app/layout.tsx`](../web/src/app/layout.tsx) — root layout + fonts
- [`web/src/app/page.tsx`](../web/src/app/page.tsx) — home Server Component
- [`web/src/app/produtos/page.tsx`](../web/src/app/produtos/page.tsx) — catálogo Server Component
- [`web/src/app/produtos/[id]/page.tsx`](../web/src/app/produtos/[id]/page.tsx) — dynamic segment + `notFound()`
- [`web/src/app/api/produtos/route.ts`](../web/src/app/api/produtos/route.ts) — Route Handler GET/POST
- [`web/src/app/api/cart/items/route.ts`](../web/src/app/api/cart/items/route.ts) — POST com validação Zod
- [`web/src/app/api/auth/login/route.ts`](../web/src/app/api/auth/login/route.ts) — auth handler
- [`web/src/components/auth-context.tsx`](../web/src/components/auth-context.tsx) — `useSyncExternalStore`
- [`web/src/components/auth-status.tsx`](../web/src/components/auth-status.tsx) — Client Component com `useRouter`
- [`web/src/lib/request-auth.ts`](../web/src/lib/request-auth.ts) — auth helper tipado
- [`web/Dockerfile`](../web/Dockerfile) — multi-stage Docker
- [`web/docker-entrypoint.sh`](../web/docker-entrypoint.sh) — migrate + start
