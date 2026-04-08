# StoreLine Web

Aplicacao Next.js com frontend e rotas API do StoreLine.

## Pre-requisitos

- Node.js 20+
- PostgreSQL rodando localmente ou remoto

## Setup

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Ajuste as variaveis em `.env`:

- `DATABASE_URL`
- `JWT_SECRET`

3. Instale dependencias:

```bash
npm install
```

4. Rode as migrations e gere o client do Prisma:

```bash
npx prisma migrate dev
npm run prisma:generate
```

5. Inicie o projeto:

```bash
npm run dev
```

Abra http://localhost:3000.
