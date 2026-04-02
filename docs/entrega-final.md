# StoreLine - Documentacao final de entrega

## Escopo implementado

- Autenticacao com papeis.
- Catalogo de produtos.
- Carrinho de compras com operacoes de adicionar, atualizar, remover e limpar.
- Finalizacao de compra e historico do usuario.
- Painel administrativo para produtos e historico global de compras.

## Principais rotas frontend

- `/` home
- `/produtos` listagem publica
- `/produtos/[id]` detalhe do produto
- `/carrinho` gerenciamento de carrinho
- `/compras` historico e finalizacao
- `/compras/[id]` detalhe de compra
- `/admin/produtos` painel de produtos
- `/admin/compras` painel de compras

## Principais rotas API

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/produtos`
- `POST /api/cart/items`
- `GET /api/cart`
- `PUT /api/cart/items/[itemId]`
- `DELETE /api/cart/items/[itemId]`
- `DELETE /api/cart`
- `POST /api/compras/[usuarioId]`
- `GET /api/compras/[usuarioId]`
- `GET /api/compras/detalhe/[id]`

## Como validar rapidamente

1. Iniciar aplicacao com `npm run dev` na pasta `web`.
2. Fazer login com usuario comum.
3. Adicionar item ao carrinho e ajustar quantidade.
4. Finalizar compra e validar historico.
5. Fazer login como ADMIN e validar telas administrativas.

## Observacoes finais

- A interface adota componentes reutilizaveis para manter consistencia visual entre telas de compras e admin.
- O backend protege rotas sensiveis com verificacao de token e papel de usuario.