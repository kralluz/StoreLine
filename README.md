# StoreLine

Loja enxuta com foco em tres fluxos principais:

- CRUD de produtos
- Carrinho de compras
- Minhas compras

## Estrutura atual

```text
.
|-- README.md
|-- docs/
|   |-- escopo.md
|   |-- modelo-dados.sql
|   |-- rotas-api.md
|   `-- user-stories.md
`-- web/
    |-- prisma/
    |-- public/
    |-- src/
    |   |-- app/
    |   `-- lib/
    `-- package.json
```

## Desenvolvimento

O app Next.js (frontend + rotas API) fica em web.

```bash
cd web
npm install
npm run dev
```
