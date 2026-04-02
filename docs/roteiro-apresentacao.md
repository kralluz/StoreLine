# StoreLine - Roteiro de apresentacao final

## Objetivo

Apresentar o fluxo completo da aplicacao StoreLine, cobrindo autenticacao, catalogo, carrinho, compras e administracao.

## Sequencia recomendada (10-15 minutos)

1. Contexto inicial
- Mostrar objetivo do projeto e stack (Next.js, Prisma, PostgreSQL).
- Mostrar rapidamente a organizacao: `web/src/app` (paginas e APIs) e `docs`.

2. Fluxo usuario comum
- Login.
- Navegacao por produtos.
- Adicao de item ao carrinho.
- Atualizacao e remocao de itens do carrinho.
- Finalizacao e consulta de compras.

3. Fluxo administrador
- Acesso ao painel admin de produtos.
- Criacao/edicao/remocao de produtos.
- Acesso ao painel admin de compras.
- Consulta de historico global de compras.

4. Encerramento tecnico
- Estrategia de validacao das entradas (schemas).
- Regras de permissao por papel.
- Padrao de interface reaproveitavel para telas de compras/admin.

## Checklist de demo

- Banco migrado e aplicacao inicializando sem erro.
- Usuario comum e usuario admin disponiveis para login.
- Produtos com estoque cadastrado para demonstracao.
- Carrinho com APIs funcionando (GET, POST item, PUT item, DELETE item, DELETE carrinho).
- Rotas admin liberadas apenas para ADMIN.

## Riscos durante a apresentacao

- Token ausente/expirado no navegador: relogar antes da demo.
- Base sem dados: manter script de seed ou cadastro rapido preparado.
- Ambiente sem internet: garantir dependencias instaladas previamente.

## Evidencias sugeridas para entrega

- Capturas de tela dos fluxos principais (usuario e admin).
- Logs de build/lint executados.
- Links para issues concluidas e PR correspondente.