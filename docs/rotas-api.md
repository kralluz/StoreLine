# Rotas Principais

## Produtos
- GET /produtos
- GET /produtos/{id}
- POST /produtos
- PUT /produtos/{id}
- DELETE /produtos/{id}

## Usuarios
- GET /usuarios/{id}
- POST /usuarios
- PUT /usuarios/{id}
- DELETE /usuarios/{id}

## Carrinho
- GET /carrinho/{usuario_id}
- POST /carrinho/{usuario_id}
- PUT /carrinho/{usuario_id}/{produto_id}
- DELETE /carrinho/{usuario_id}/{produto_id}

## Compras
- GET /compras/{usuario_id}
- POST /compras/{usuario_id}

## Itens da Compra
- GET /itens_compras/{compra_id}
