# StoreLine

[![CI](https://github.com/kralluz/StoreLine/actions/workflows/ci.yml/badge.svg)](https://github.com/kralluz/StoreLine/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org)

Loja virtual enxuta — projeto acadêmico de Engenharia de Software.

Três fluxos:

- **CRUD de Produtos** (público + admin)
- **Carrinho de Compras**
- **Minhas Compras** (checkout + histórico)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend + API | Next.js 16 (App Router, rotas `/api/*`) |
| Linguagem | TypeScript 5 |
| ORM | Prisma 6 |
| Banco | PostgreSQL 15 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Validação | Zod |
| Styling | Tailwind CSS 4 |
| Container | Docker + docker-compose |
| CI | GitHub Actions (lint + tsc + build + migrate deploy) |

---

## Subir com 1 comando (recomendado)

**Requisitos**: Docker Desktop com Compose v2.

```bash
git clone https://github.com/kralluz/StoreLine.git
cd StoreLine
docker compose up --build
```

App disponível em http://localhost:3000

Compose já cuida de:
- Subir PostgreSQL 15 (porta `5432`, user `admin` / senha `admin123`, db `storeline`)
- Build da imagem Next.js
- Aguardar healthcheck do banco
- Rodar `prisma migrate deploy` automaticamente
- Iniciar servidor Next.js standalone

Para derrubar tudo:
```bash
docker compose down
```

Para zerar dados do banco:
```bash
docker compose down -v
```

---

## Fallback manual (sem Docker)

**Requisitos**: Node.js 20+, PostgreSQL 15+ rodando local.

```bash
cd web
cp .env.example .env          # ajustar DATABASE_URL e JWT_SECRET
npm install
npx prisma migrate dev
npm run dev
```

Variáveis em [web/.env.example](web/.env.example):

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | String de conexão Postgres |
| `JWT_SECRET` | Segredo de assinatura JWT (gerar com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |

---

## Estrutura

```text
.
├── docker-compose.yml          ← orquestração db + web
├── README.md
├── docs/
│   ├── escopo.md               ← escopo do projeto
│   ├── user-stories.md         ← histórias de usuário
│   ├── rotas-api.md            ← contrato da API
│   ├── modelo-dados.sql        ← modelagem ER
│   ├── entrega-final.md        ← documentação acadêmica
│   └── roteiro-apresentacao.md ← roteiro para banca
└── web/
    ├── Dockerfile              ← build multi-stage Next standalone
    ├── docker-entrypoint.sh    ← migrate deploy + start
    ├── prisma/                 ← schema + migrations
    └── src/
        ├── app/                ← rotas (UI + API)
        └── lib/                ← prisma client, auth, schemas
```

---

## Documentação

- [Escopo](docs/escopo.md)
- [User Stories](docs/user-stories.md)
- [Rotas API](docs/rotas-api.md)
- [Modelo de Dados](docs/modelo-dados.sql)
- [Entrega Final](docs/entrega-final.md)
- [Roteiro de Apresentação](docs/roteiro-apresentacao.md)

---

## Equipe e responsabilidades

| Dev | Papel principal | Áreas |
|-----|----------------|-------|
| **Carlos Henrique** ([@kralluz](https://github.com/kralluz)) | Tech lead / Backend | Prisma schema, modelagem, módulo de compras, CI/CD, docs finais |
| **Luiz Felipe Fonseca** ([@fonslu](https://github.com/fonslu)) | Backend + DevOps | Auth, dockerização, refactor storefront/cart/order, CI Vercel |
| **Iago José Vieira de Araujo** ([@iagojv](https://github.com/iagojv)) | Frontend / UX | Design system, estilização (auth, home, produtos, carrinho), contexto global de auth |
| **Felipe Gomes** ([@zirilu](https://github.com/zirilu)) | Backend / Frontend | Schema inicial Prisma, módulo de produtos (público + admin) |

---

## Scripts úteis (dentro de `web/`)

```bash
npm run dev               # dev server
npm run build             # build de produção
npm run start             # rodar build
npm run lint              # eslint
npm run prisma:generate   # gerar Prisma Client
npx prisma migrate dev    # criar nova migration
npx prisma studio         # GUI do banco
```

---

## Licença

[MIT](LICENSE)
