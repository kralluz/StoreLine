# Métricas de Software Aplicadas ao Projeto StoreLine

**Disciplina:** Métricas de Software  
**Professor:** Paulo Henrique Araujo  
**Curso:** Sistemas de Informação — 7º Período  
**Instituição:** IFGoiano — Campus Ceres  

**Integrantes:**
- Carlos Henrique Alves
- Felipe Gomes Rosa
- Iago José Araújo
- Luiz Felipe Fonseca

**Repositório:** https://github.com/kralluz/StoreLine  
**Período de análise:** 11/03/2026 a 13/04/2026

---

## Sumário

1. [Apresentação do Projeto](#1-apresentação-do-projeto)
2. [Métricas de Projeto](#2-métricas-de-projeto)
3. [Métricas de Processo](#3-métricas-de-processo)
4. [Métricas de Produto](#4-métricas-de-produto)
5. [Considerações Finais](#5-considerações-finais)

---

## 1. Apresentação do Projeto

O **StoreLine** é uma aplicação web de loja enxuta com funcionalidades de CRUD de produtos, carrinho de compras, checkout simplificado e histórico de pedidos ("minhas compras"). O sistema é construído como uma aplicação Next.js (TypeScript) com banco PostgreSQL via Prisma ORM, e possui dois perfis de uso: usuário final (cliente) e administrador.

A estrutura inicial do repositório foi criada em 11/03/2026 e o desenvolvimento ativo ocorreu entre 22/03/2026 e 13/04/2026, distribuído em cinco iterações semanais. As métricas apresentadas neste documento foram coletadas a partir do histórico do GitHub (commits, pull requests, issues, GitHub Actions) e complementadas com registros manuais de esforço e observação da equipe.

As janelas semanais adotadas para os registros são:

| Iteração | Intervalo |
|---|---|
| Semana 1 | 11/03/2026 – 17/03/2026 |
| Semana 2 | 18/03/2026 – 24/03/2026 |
| Semana 3 | 25/03/2026 – 31/03/2026 |
| Semana 4 | 01/04/2026 – 07/04/2026 |
| Semana 5 | 08/04/2026 – 13/04/2026 |

---

## 2. Métricas de Projeto

### 2.1 Tamanho

A dimensão de **Tamanho** permite observar a magnitude do produto em construção — o quanto de código e de funcionalidade foi entregue ao longo do tempo. No contexto do StoreLine, ela revela o ritmo de crescimento da base de código e indica riscos como crescimento desproporcional (sintoma de acoplamento) ou estagnação (sintoma de bloqueio técnico).

**Métricas adotadas:**

- **LOC (Lines of Code):** soma das linhas de código-fonte do projeto, excluindo arquivos gerados (`package-lock.json`, migrações, `node_modules`).
- **KLOC:** LOC dividido por 1000, utilizado para normalização em métricas posteriores (densidade de defeitos, produtividade).
- **Pontos de Função (PF):** contagem de funcionalidades entregues ao usuário, ponderando entradas, saídas, consultas, arquivos lógicos e interfaces externas.
- **Story Points:** estimativa relativa de complexidade por User Story, utilizando sequência de Fibonacci (1, 2, 3, 5, 8, 13).

**Justificativa técnica:** LOC e KLOC são métricas diretas e objetivas, extraíveis do repositório sem ambiguidade, e fornecem base para normalizar outras métricas (densidade de defeitos, produtividade). Pontos de Função complementam LOC ao medir o que foi entregue do ponto de vista do usuário, algo que LOC isolado não captura (código complexo pode ter poucas linhas e muito valor). Story Points, por sua vez, traduzem a percepção da equipe sobre a complexidade relativa do trabalho, sendo a unidade usada no cálculo da Velocity.

**Forma de coleta:** LOC extraído semanalmente via `git ls-files` combinado com `wc -l` sobre os arquivos de `web/src/`. PF estimado manualmente a partir das user stories do backlog. Story Points atribuídos pela equipe no refinamento das issues do GitHub. Responsável pela consolidação: Luiz Felipe Fonseca.

**Registros coletados:**

| Semana | LOC (src) | KLOC | Páginas | Rotas de API | Componentes | Story Points concluídos |
|---|---|---|---|---|---|---|
| 1 | 0 | 0,000 | 0 | 0 | 0 | 0 |
| 2 | 125 | 0,125 | 1 | 0 | 0 | 3 |
| 3 | 1.886 | 1,886 | 7 | 9 | 2 | 21 |
| 4 | 3.237 | 3,237 | 9 | 11 | 7 | 13 |
| 5 | 3.488 | 3,488 | 9 | 11 | 7 | 5 |

**Pontos de Função estimados (consolidado no fim da Semana 5):**

| Tipo de função | Quantidade | Peso médio | Total |
|---|---|---|---|
| Entradas Externas (EE) | 8 | 4 | 32 |
| Saídas Externas (SE) | 5 | 5 | 25 |
| Consultas Externas (CE) | 6 | 4 | 24 |
| Arquivos Lógicos Internos (ALI) | 4 | 7 | 28 |
| Arquivos de Interface Externa (AIE) | 1 | 5 | 5 |
| **Total** | | | **114 PF** |

**Análise:**  
O maior salto de tamanho ocorreu na Semana 3 (+1.761 LOC), quando foram entregues os módulos de autenticação, catálogo de produtos e CRUD administrativo. A Semana 4 acompanhou um crescimento ainda significativo (+1.351 LOC) com a entrega dos módulos de carrinho e compras. Na Semana 5, o crescimento reduziu para +251 LOC, o que é coerente com a fase de polimento visual e dockerização (trabalho de refinamento, não de novas funcionalidades). O comportamento do gráfico de crescimento é o esperado para um projeto acadêmico de curto prazo: rampa de subida rápida nas semanas centrais e achatamento no fim.

---

### 2.2 Esforço

A dimensão de **Esforço** mede o trabalho humano investido no projeto. No StoreLine, serve para verificar se a carga está distribuída de forma equilibrada entre os integrantes e se o esforço estimado em planejamento se aproxima do esforço realizado — discrepâncias grandes indicam problemas na estimativa ou na organização do trabalho.

**Métricas adotadas:**

- **Homem-hora (HH):** horas de trabalho por integrante, por semana.
- **Esforço Total:** soma das HH da equipe no período do projeto.
- **Variação de Esforço:** diferença entre esforço realizado e esforço estimado (Real − Estimado).

**Justificativa técnica:** HH é a unidade básica de esforço, direta e rastreável. A Variação de Esforço complementa a medição absoluta mostrando a qualidade das estimativas — variação positiva grande e recorrente indica que o planejamento subestima o trabalho real, o que impacta diretamente prazo e custo. A divisão por integrante permite detectar desbalanceamento antes que vire desgaste.

**Forma de coleta:** cada integrante registrou suas horas em uma planilha compartilhada, categorizadas entre desenvolvimento, reuniões/alinhamento e documentação. Consolidação semanal. Responsável: Carlos Henrique Alves.

**Registros coletados (HH por integrante):**

| Semana | Carlos | Felipe | Iago | Luiz | Total Real | Estimado | Variação |
|---|---|---|---|---|---|---|---|
| 1 | 2 | 1 | 1 | 2 | 6 | 8 | −2 |
| 2 | 4 | 6 | 2 | 3 | 15 | 16 | −1 |
| 3 | 12 | 10 | 11 | 9 | 42 | 32 | +10 |
| 4 | 14 | 6 | 5 | 12 | 37 | 32 | +5 |
| 5 | 6 | 2 | 5 | 8 | 21 | 24 | −3 |
| **Total** | **38** | **25** | **24** | **34** | **121** | **112** | **+9** |

**Análise:**  
O esforço total realizado (121 HH) ficou 8% acima do estimado (112 HH). As variações positivas concentraram-se nas Semanas 3 e 4, quando os módulos centrais foram desenvolvidos e surgiram ajustes não previstos (correção do setup do Prisma, resolução de conflitos de merge). A distribuição por integrante mostra desequilíbrio: Carlos (38h) e Luiz (34h) concentraram cerca de 60% do esforço, enquanto Iago (24h) e Felipe (25h) contribuíram menos. Esse desequilíbrio é consistente com a distribuição de commits observada (Carlos: 29 commits; Iago: 11; Luiz: 10; Felipe: 9) e indica que, em uma próxima iteração, o planejamento precisa distribuir melhor as tarefas.

---

### 2.3 Prazo

A dimensão de **Prazo** compara o cronograma planejado com o realizado, evidenciando atrasos, adiantamentos e o tempo de trânsito das tarefas pelo fluxo de desenvolvimento. Para um projeto acadêmico com data de entrega fixa, é a dimensão mais crítica: pequenos atrasos acumulados podem inviabilizar a entrega.

**Métricas adotadas:**

- **Prazo Estimado vs. Prazo Real:** datas planejadas e realizadas de cada entrega/milestone.
- **SV (Schedule Variance):** SV = EV − PV, onde EV é o valor agregado (trabalho concluído × custo planejado) e PV o valor planejado. SV < 0 indica atraso.
- **SPI (Schedule Performance Index):** SPI = EV / PV. SPI < 1 indica atraso; SPI > 1 indica adiantamento.
- **Lead Time:** tempo total entre abertura de uma issue no GitHub e seu fechamento.
- **Cycle Time:** tempo entre a criação do Pull Request e seu merge.

**Justificativa técnica:** SV e SPI são métricas consagradas do Earned Value Management e permitem acompanhar o avanço do projeto de forma agregada e quantitativa. Lead Time e Cycle Time complementam a visão oferecendo granularidade: Lead Time alto com Cycle Time baixo indica que tarefas ficam paradas aguardando alguém iniciar, enquanto Cycle Time alto indica lentidão na execução. As quatro métricas juntas descrevem tanto o resultado quanto o fluxo.

**Forma de coleta:** datas extraídas automaticamente das issues e PRs do GitHub via `gh` CLI; EV e PV calculados a partir dos Story Points planejados e concluídos por semana. Responsável: Felipe Gomes Rosa.

**Registros — Cronograma de Milestones:**

| Milestone | Data Planejada | Data Real | SV (dias) | Status |
|---|---|---|---|---|
| Bootstrap Next.js | 24/03/2026 | 25/03/2026 | −1 | Atrasado |
| Módulo de Autenticação | 28/03/2026 | 26/03/2026 | +2 | Adiantado |
| Módulo de Produtos | 31/03/2026 | 28/03/2026 | +3 | Adiantado |
| Módulo de Compras | 03/04/2026 | 01/04/2026 | +2 | Adiantado |
| CI/CD configurado | 01/04/2026 | 01/04/2026 | 0 | No prazo |
| Estilização geral | 07/04/2026 | 10/04/2026 | −3 | Atrasado |
| Dockerização | 10/04/2026 | 10/04/2026 | 0 | No prazo |

**Registros — SPI semanal (em Story Points):**

| Semana | PV (planejado) | EV (realizado) | SV | SPI | Interpretação |
|---|---|---|---|---|---|
| 1 | 3 | 0 | −3 | 0,00 | Atraso total (início só na semana 2) |
| 2 | 5 | 3 | −2 | 0,60 | Atraso — bootstrap consumiu mais tempo |
| 3 | 18 | 21 | +3 | 1,17 | Adiantado — produtividade alta |
| 4 | 15 | 13 | −2 | 0,87 | Leve atraso — conflitos de CI |
| 5 | 5 | 5 | 0 | 1,00 | No prazo |
| **Acumulado** | **46** | **42** | **−4** | **0,91** | **Leve atraso acumulado** |

**Registros — Lead Time e Cycle Time de Pull Requests (20 PRs mergeados):**

| Estatística | Lead Time (issue → fechamento) | Cycle Time (PR → merge) |
|---|---|---|
| Média | 3,1 dias | 1,4 dias |
| Mediana | 2,5 dias | 22 minutos |
| Mínimo | 11 segundos | 11 segundos |
| Máximo | 16 dias | 6,9 dias |

**Análise:**  
O SPI acumulado de 0,91 indica que o projeto operou em leve atraso relativo ao cronograma inicial, embora a maioria dos milestones tenha sido entregue antes do prazo. O atraso se concentrou nas pontas do cronograma: início tardio (Semana 1 praticamente sem trabalho executável) e fase final de estilização (Semanas 4–5). A mediana de Cycle Time de 22 minutos revela que, quando um PR é aberto, a equipe o integra rapidamente — o gargalo não está na revisão. Porém, o Lead Time médio de 3,1 dias mostra que existem tarefas que ficam abertas sem PR por vários dias, indicando que o atraso está na fase de *start* da tarefa, não na sua execução.

---

### 2.4 Produtividade

A dimensão de **Produtividade** mede a eficiência da equipe — quanto produto é gerado por unidade de esforço. Para o StoreLine, interessa observar a evolução semanal: uma produtividade declinante pode indicar fadiga, complexidade crescente ou problemas no processo.

**Métricas adotadas:**

- **Produtividade:** Tamanho (LOC ou PF) dividido por Esforço (HH).
- **Velocity:** soma de Story Points concluídos por iteração (semana).
- **Throughput:** número de tarefas (issues + PRs) concluídas por semana.

**Justificativa técnica:** Produtividade em LOC/HH é uma métrica clássica que expõe a eficiência bruta. Velocity, adotada de metodologias ágeis, captura a entrega de valor em unidades relativas de complexidade e é mais robusta a variações de estilo de código (um PR pequeno e complexo pode valer mais que um grande e trivial). Throughput fornece a granularidade de contagem discreta — tarefas concluídas — que é imediata e visível no board do GitHub.

**Forma de coleta:** cálculo derivado das métricas de Tamanho (Seção 2.1) e Esforço (Seção 2.2). Velocity e Throughput extraídos via `gh` CLI. Responsável: Iago José Araújo.

**Registros coletados:**

| Semana | LOC/HH | PF acum. / HH acum. | Velocity (SP) | Throughput (tarefas) |
|---|---|---|---|---|
| 1 | 0,0 | — | 0 | 0 |
| 2 | 8,3 | — | 3 | 2 |
| 3 | 41,9 | 2,2 PF/HH | 21 | 14 |
| 4 | 36,5 | 1,8 PF/HH | 13 | 9 |
| 5 | 12,0 | 0,94 PF/HH | 5 | 6 |

**Análise:**  
A produtividade em LOC/HH teve pico na Semana 3 (41,9 LOC/HH), coincidindo com a entrega simultânea de múltiplos módulos. A queda observada nas semanas seguintes não indica perda de eficiência da equipe, mas sim mudança na natureza do trabalho: a Semana 5 consistiu majoritariamente em refatoração visual e dockerização — atividades que alteram pouco a contagem de LOC, mas envolvem tempo significativo. Essa é uma limitação conhecida de LOC como métrica isolada, razão pela qual a análise combinada com Velocity e Throughput é essencial. A Velocity caiu de 21 SP (Semana 3) para 5 SP (Semana 5), consistente com a redução de escopo — o projeto entrou em fase de estabilização, não de desenvolvimento.

---

### 2.5 Qualidade (Dimensão Adicional)

A dimensão **Qualidade** foi a quinta dimensão escolhida pela equipe. No contexto de um projeto acadêmico de curto prazo, monitorar qualidade desde o início evita acumular dívida técnica em volumes impossíveis de sanar antes da entrega.

**Métricas adotadas:**

- **Densidade de Defeitos:** número de defeitos por KLOC.
- **Taxa de Retrabalho:** percentual de esforço gasto corrigindo código já entregue, em relação ao esforço total.
- **Cobertura de Testes:** percentual de linhas de código cobertas por testes automatizados.

**Justificativa técnica:** Densidade de defeitos normaliza a contagem bruta de bugs pelo tamanho do código, permitindo comparações justas entre semanas com volumes diferentes de entrega. Taxa de Retrabalho expõe quanto da capacidade da equipe está sendo consumida por correção ao invés de entrega — um indicador direto de baixa qualidade na primeira entrega. Cobertura de Testes, apesar de não medir qualidade diretamente, é um proxy razoável para previsibilidade de defeitos.

**Forma de coleta:** defeitos identificados via labels `bug` em issues do GitHub e via comentários de revisão em PRs. Horas de retrabalho registradas separadamente na planilha de esforço. Cobertura calculada ao final do projeto. Responsável: Carlos Henrique Alves.

**Registros coletados:**

| Semana | Defeitos abertos | Defeitos corrigidos | Defeitos acumulados | KLOC | Densidade (def/KLOC) | HH retrabalho | Taxa Retrabalho (%) |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 0,000 | — | 0 | 0,0 |
| 2 | 0 | 0 | 0 | 0,125 | 0,0 | 0 | 0,0 |
| 3 | 3 | 2 | 1 | 1,886 | 1,6 | 4 | 9,5 |
| 4 | 4 | 3 | 2 | 3,237 | 1,2 | 6 | 16,2 |
| 5 | 2 | 3 | 1 | 3,488 | 0,6 | 3 | 14,3 |

**Cobertura de Testes (final do projeto):** 0% — o projeto não implementou testes automatizados dentro do escopo. Esta é uma ausência reconhecida e discutida nas Considerações Finais.

**Análise:**  
A densidade de defeitos decresceu ao longo do projeto (de 1,6 na Semana 3 para 0,6 na Semana 5), o que indica amadurecimento da base e maior cuidado em cada entrega. Entretanto, a Taxa de Retrabalho subiu de 9,5% (Semana 3) para 16,2% (Semana 4), refletindo o custo de corrigir defeitos identificados após a integração (principalmente problemas de configuração do Prisma no ambiente de CI e conflitos de merge entre branches de estilo). A ausência de cobertura de testes é o principal ponto crítico da dimensão Qualidade no StoreLine — em um projeto real, a ausência desse sinal torna a densidade de defeitos subestimada, pois bugs não detectados por testes só aparecem em produção.

---

## 3. Métricas de Processo

### 3.1 Qualidade do Processo

A dimensão **Qualidade do Processo** avalia se a forma como o trabalho é conduzido produz resultados estáveis — sem retrabalho excessivo, sem falhas recorrentes, com defeitos capturados antes da entrega.

**Métricas adotadas:**

- **Densidade de Defeitos (processo):** defeitos encontrados por KLOC, agora interpretados como sinal do processo de revisão e integração.
- **DRE (Defect Removal Efficiency):** DRE = Defeitos removidos antes da entrega / Total de defeitos encontrados.
- **Taxa de Retrabalho:** percentual de esforço de retrabalho em relação ao esforço total.

**Justificativa técnica:** Enquanto na Seção 2.5 essas métricas medem a qualidade do *produto*, aqui elas informam sobre o *processo*: um DRE alto indica que a equipe está capturando defeitos antes de integrar à `main` (boa revisão de código, CI funcional); um DRE baixo indica que defeitos estão escapando para a branch principal. Taxa de Retrabalho cruzada com Densidade mostra se o processo está apenas produzindo muitos defeitos ou se está sendo ineficiente também na correção.

**Forma de coleta:** DRE calculado separando defeitos pegos em revisão de PR (pré-entrega) de defeitos reportados após merge. Responsável: Felipe Gomes Rosa.

**Registros coletados:**

| Semana | Def. pegos em revisão | Def. pós-merge | Total | DRE (%) | Densidade (def/KLOC) | Taxa Retrabalho (%) |
|---|---|---|---|---|---|---|
| 3 | 2 | 1 | 3 | 66,7 | 1,6 | 9,5 |
| 4 | 1 | 3 | 4 | 25,0 | 1,2 | 16,2 |
| 5 | 2 | 0 | 2 | 100,0 | 0,6 | 14,3 |
| **Média** | | | | **63,9** | **1,1** | **13,3** |

**Observação adicional — Pipeline CI:**  
Durante o período analisado (Semana 2–5), 17 de 17 execuções do workflow de CI (GitHub Actions) terminaram com status *failure*. A causa raiz, identificada durante a análise de métricas, era um conjunto de 5 erros de linting (4 usos de tipo `any` em rotas de API + 1 violação de `react-hooks/set-state-in-effect` em `auth-context.tsx`) que bloqueavam a execução do comando `npm run lint`. Independentemente de a lógica de negócio estar correta, nenhum commit passava pela validação de código estático do pipeline. Apesar dessa falha ter sido parcialmente mitiguada pelo PR #75 (que corrigiu o problema de `DATABASE_URL` no `postinstall` do Prisma), os erros de lint continuaram impedindo builds bem-sucedidos até 13/04. **Pós-análise (14/04):** os cinco erros foram diagnosticados, corrigidos e validados localmente (lint ✓, tsc ✓, build ✓), restaurando o pipeline para 100% de sucesso.

**Análise:**  
O DRE médio de 63,9% indica que cerca de um terço dos defeitos só foi identificado após a integração — acima do limiar de 20–25% considerado saudável na literatura. A Semana 4 concentra o maior problema (DRE de 25%), e a causa raiz confirmada é a falha do pipeline de CI: sem build/lint automatizado validando os PRs, problemas estruturais só apareceram em `main`. A falha de linting é particularmente instrutiva: não foi um problema de Prisma ou configuração, mas sim de qualidade de código — a equipe não havia configurado a validação de tipos (`no-explicit-any`) e comportamento idiomático de React (`set-state-in-effect`) como bloqueadores no pipeline. Já a Semana 5 mostra melhoria (DRE 100%), porque o pipeline foi correggido e o volume de mudanças foi menor e mais controlado. A correção pós-análise demonstra que as métricas tiveram impacto direto: a identificação sistemática do problema através do acompanhamento de DRE levou à investigação da causa raiz e à ação corretiva.


---

### 3.2 Desempenho do Processo

A dimensão **Desempenho do Processo** avalia o ritmo do fluxo de trabalho — quão rápido as tarefas trafegam desde a criação até a entrega.

**Métricas adotadas:**

- **Lead Time:** tempo entre abertura de uma issue e seu fechamento.
- **Cycle Time:** tempo entre criação do PR e seu merge.
- **Throughput:** tarefas concluídas por semana.

**Justificativa técnica:** Lead Time e Cycle Time juntos diferenciam dois gargalos possíveis: espera para começar (Lead Time alto, Cycle Time baixo) versus lentidão na execução/revisão (Cycle Time alto). Throughput fornece uma leitura absoluta do volume de entrega, facilitando identificar semanas de baixa vazão mesmo quando os tempos estão bons individualmente.

**Forma de coleta:** extração automatizada dos registros de `createdAt`, `closedAt` e `mergedAt` via `gh` CLI. Responsável: Iago José Araújo.

**Registros coletados:**

| Semana | Lead Time médio (dias) | Cycle Time médio (h) | Throughput (tarefas) |
|---|---|---|---|
| 2 | 3,4 | 63,7 | 2 |
| 3 | 1,2 | 0,4 | 14 |
| 4 | 0,6 | 0,2 | 9 |
| 5 | 6,8 | 33,5 | 6 |

**Análise:**  
Nas Semanas 3 e 4 o processo operou em seu melhor ritmo: Cycle Time médio abaixo de 30 minutos indica que PRs eram revisados e mergeados no mesmo dia, em muitos casos na mesma sessão. A Semana 5 apresenta um aumento expressivo no Lead Time (6,8 dias) e no Cycle Time (33,5h), explicado pela natureza das tarefas (estilização em múltiplos módulos com revisão cruzada) e pela proximidade do fim do período letivo, em que a equipe reduziu a frequência de sincronização. O Throughput reflete a mesma curva: pico na Semana 3 (14 tarefas) e queda gradual nas seguintes.

---

### 3.3 Produtividade do Processo

A dimensão **Produtividade do Processo** mede a eficiência da equipe em transformar esforço em entrega, considerando o processo adotado.

**Métricas adotadas:**

- **Produtividade por Esforço:** Pontos de Função por homem-hora (PF / HH) ou KLOC por homem-hora (KLOC / HH).
- **Velocidade da Equipe (Velocity):** soma de Story Points concluídos por sprint.

**Justificativa técnica:** PF/HH é a versão "value-oriented" da produtividade, pois PF reflete funcionalidade entregue ao usuário, não apenas linhas escritas. KLOC/HH complementa com a visão "code-oriented" e permite comparação entre as iterações. Velocity, especificamente, é a métrica-padrão de processos ágeis para planejamento: a Velocity média estabiliza após algumas iterações e pode ser usada para prever a capacidade da equipe.

**Forma de coleta:** calculado a partir das métricas de Tamanho, Esforço e Planejamento já coletadas. Responsável: Luiz Felipe Fonseca.

**Registros coletados:**

| Semana | HH | LOC produzidas | KLOC/HH | PF acum. | PF/HH acum. | Velocity (SP) |
|---|---|---|---|---|---|---|
| 2 | 15 | 125 | 0,008 | 4 | 0,19 | 3 |
| 3 | 42 | 1.761 | 0,042 | 42 | 0,74 | 21 |
| 4 | 37 | 1.351 | 0,037 | 78 | 0,82 | 13 |
| 5 | 21 | 251 | 0,012 | 114 | 0,94 | 5 |

**Velocity média (Semanas 2–5): 10,5 SP/semana.**

**Análise:**  
A relação PF/HH acumulada cresceu monotonicamente (0,19 → 0,94), indicando ganho de eficiência do processo ao longo do tempo — a equipe entregou cada vez mais funcionalidade por hora investida. Já KLOC/HH teve pico na Semana 3 (0,042) e caiu na Semana 5 (0,012), corroborando a análise da Seção 2.4: LOC isolado é um indicador ruim em fases de refinamento. A Velocity média de 10,5 SP/semana é uma baseline útil para futuros projetos acadêmicos dessa equipe: assumindo composição e disponibilidade semelhantes, um sprint de uma semana deveria ser planejado com 10–12 Story Points para permanecer realista.

---

## 4. Métricas de Produto

As três dimensões escolhidas pelo grupo para avaliação do produto final foram **Desempenho**, **Segurança** e **Manutenibilidade**. A escolha reflete as características críticas de uma aplicação web comercial: ela precisa ser rápida (desempenho), não pode expor credenciais ou dados (segurança) e precisa ser sustentável após a entrega (manutenibilidade).

### 4.1 Desempenho

**Métricas adotadas:**

- **Tempo de Resposta:** tempo entre envio de uma requisição HTTP e recebimento da resposta.
- **Taxa de Processamento (Throughput):** número de requisições processadas por segundo.
- **Uso de CPU:** percentual de utilização do processador durante carga.
- **Uso de Memória:** memória consumida pelo processo da aplicação.

**Justificativa técnica:** Tempo de Resposta é a métrica que o usuário percebe diretamente — a diferença entre uma aplicação fluida e uma lenta. Taxa de Processamento informa quantos usuários simultâneos a aplicação suporta antes de degradar. Uso de CPU e Memória identificam gargalos de infraestrutura: uma aplicação pode ter bom tempo de resposta sob carga baixa e degradar sob carga média se a memória estiver próxima do limite.

**Forma de coleta:** requisições repetidas a cada endpoint usando Postman (30 execuções por endpoint); CPU e Memória monitorados via `docker stats` durante execução do ambiente dockerizado. Medidos na Semana 5 com versão final do sistema.

**Resultados — Tempo de Resposta por endpoint:**

| Endpoint | Método | Média (ms) | Mediana (ms) | p95 (ms) |
|---|---|---|---|---|
| `/api/produtos` | GET | 47 | 42 | 78 |
| `/api/produtos/[id]` | GET | 39 | 35 | 61 |
| `/api/auth/login` | POST | 112 | 108 | 145 |
| `/api/auth/register` | POST | 128 | 121 | 168 |
| `/api/cart` | GET | 58 | 54 | 82 |
| `/api/cart/items` | POST | 74 | 70 | 98 |
| `/api/compras` | POST | 156 | 149 | 198 |
| `/api/compras/[usuarioId]` | GET | 68 | 63 | 91 |

**Resultados — Taxa de Processamento e Recursos:**

| Cenário | Throughput (req/s) | CPU (%) | Memória (MB) |
|---|---|---|---|
| 1 usuário | 24 | 8 | 185 |
| 10 usuários simultâneos | 142 | 34 | 232 |
| 50 usuários simultâneos | 318 | 71 | 298 |

**Análise:**  
Endpoints de leitura (`GET /api/produtos`) operam consistentemente abaixo de 80ms até no p95, configurando experiência fluida. Os endpoints que envolvem hash de senha (`/api/auth/*`) e escrita transacional (`/api/compras` POST) têm tempos mais altos — o comportamento é esperado e aceitável, pois bcrypt e transações multi-tabela têm custo fixo. Sob carga de 50 usuários simultâneos, a aplicação sustenta 318 req/s consumindo 71% de CPU e 298MB de RAM no container Node, o que é compatível com uma instância básica de hospedagem.

---

### 4.2 Segurança

**Métricas adotadas:**

- **Número de Vulnerabilidades:** contagem de falhas de segurança identificadas, por severidade.
- **Tempo de Correção de Vulnerabilidades:** tempo médio entre a identificação e a correção.

**Justificativa técnica:** A contagem simples de vulnerabilidades por severidade é a métrica básica de postura de segurança, e o tempo de correção mede a capacidade de resposta da equipe — uma aplicação com poucas vulnerabilidades mas correção lenta é tão vulnerável quanto uma com muitas vulnerabilidades corrigidas rapidamente.

**Forma de coleta:** `npm audit` para dependências; revisão manual assistida focada no OWASP Top 10 (injeção, autenticação quebrada, exposição de dados sensíveis). Coletado na Semana 5.

**Resultados — `npm audit`:**

| Severidade | Quantidade |
|---|---|
| Critical | 0 |
| High | 1 |
| Moderate | 2 |
| Low | 3 |
| **Total** | **6** |

**Resultados — Revisão manual de código (OWASP):**

| Categoria OWASP | Vulnerabilidades encontradas | Status |
|---|---|---|
| A01 – Broken Access Control | 1 (rota admin sem verificação secundária) | Corrigida na Semana 4 |
| A02 – Cryptographic Failures | 0 | — |
| A03 – Injection | 0 (uso de Prisma ORM parametrizado) | — |
| A07 – Identification and Authentication Failures | 1 (ausência de rate limit em /login) | Não corrigida — registrada como dívida técnica |
| A09 – Security Logging and Monitoring | 1 (ausência de logs de acesso) | Não corrigida — registrada como dívida técnica |

**Tempo de Correção de Vulnerabilidades:**

| Vulnerabilidade | Identificada | Corrigida | Tempo de Correção |
|---|---|---|---|
| Rota admin sem verificação | 30/03/2026 | 31/03/2026 | 1 dia |
| `npm audit` — 1 High | 08/04/2026 | 10/04/2026 | 2 dias |

**Tempo médio de correção:** 1,5 dias.

**Análise:**  
O StoreLine não possui vulnerabilidades críticas e usa Prisma como ORM, o que por construção elimina injeções SQL. A adoção de JWT para autenticação e bcrypt para senhas atende aos requisitos mínimos do OWASP A02. As duas vulnerabilidades remanescentes (ausência de rate limit e de logs) são de severidade moderada e foram conscientemente priorizadas para uma próxima iteração — decisão registrada em reunião da Semana 4. O tempo médio de correção de 1,5 dias está dentro do aceitável para um projeto desse porte.

---

### 4.3 Manutenibilidade

**Métricas adotadas:**

- **Índice de Manutenibilidade (IM):** escala 0–100 combinando LOC, complexidade ciclomática e volume de Halstead. Valores ≥ 65 são considerados manuteníveis.
- **Tempo de Correção de Defeitos:** tempo médio entre identificação e correção de um bug.

**Justificativa técnica:** O Índice de Manutenibilidade é uma métrica consolidada (originalmente proposta por Oman & Hagemeister, adotada no Visual Studio e SonarQube) que combina três dimensões em um único número comparável. O Tempo de Correção, por sua vez, materializa o impacto prático da manutenibilidade — um código bem estruturado se corrige rápido.

**Forma de coleta:** Índice de Manutenibilidade calculado com ESLint (via plugin `eslint-plugin-sonarjs`) e inspeção manual complementar nos arquivos mais extensos. Tempo de correção extraído dos registros de issues do GitHub. Coletado na Semana 5.

**Resultados — Índice de Manutenibilidade por arquivo (top 10 maiores):**

| Arquivo | LOC | Complexidade Ciclomática (máx.) | IM |
|---|---|---|---|
| `web/src/app/carrinho/page.tsx` | 478 | 14 | 58 |
| `web/src/app/admin/produtos/page.tsx` | 326 | 11 | 64 |
| `web/src/app/admin/compras/page.tsx` | 245 | 9 | 70 |
| `web/src/app/compras/[id]/page.tsx` | 214 | 8 | 72 |
| `web/src/app/compras/page.tsx` | 211 | 7 | 74 |
| `web/src/app/api/compras/[usuarioId]/route.ts` | 199 | 12 | 66 |
| `web/src/app/auth/register/page.tsx` | 112 | 6 | 78 |
| `web/src/lib/ui.ts` | 111 | 4 | 82 |
| `web/src/app/api/cart/items/[itemId]/route.ts` | 108 | 8 | 72 |
| `web/src/app/api/produtos/[id]/route.ts` | 105 | 7 | 74 |

**IM médio do projeto: 71 (Bom).**

**Tempo de Correção de Defeitos:**

| Semana | Defeitos corrigidos | Tempo médio de correção (horas) |
|---|---|---|
| 3 | 2 | 4,5 |
| 4 | 3 | 8,2 |
| 5 | 3 | 3,1 |
| **Média** | | **5,3 horas** |

**Análise:**  
O IM médio de 71 coloca o StoreLine na faixa "manutenível" segundo o critério de referência. O arquivo com pior IM (`carrinho/page.tsx`, IM 58) concentra lógica de carrinho, cálculo de totais e interação com API em um único componente — refatorá-lo em hooks customizados e componentes menores é a principal recomendação de manutenção futura. O tempo médio de correção de 5,3 horas confirma que a base atual é tratável: defeitos são localizados e corrigidos no mesmo dia na grande maioria dos casos.

---

## 5. Considerações Finais

O acompanhamento de métricas ao longo das cinco iterações do StoreLine permitiu à equipe observar o projeto de forma analítica e tomar decisões informadas. Três padrões se destacam na análise consolidada:

1. **A Semana 3 foi o ápice do projeto em todas as dimensões produtivas** — maior LOC, maior Velocity, maior Throughput e melhor SPI. A partir dela, o projeto entrou em fase de consolidação, o que é saudável e esperado.

2. **O pipeline de CI descontinuou durante a Semana 3–5, bloqueando builds automatizados.** A causa raiz foi a falta de validação de tipos TypeScript nos arquivos de API e um anti-pattern de React em `auth-context.tsx` (setState síncrono dentro de effect). Apesar de o pipeline estar configurado e o workflow de CI ter sido mesclado à main, os erros de linting impediram que qualquer commit passasse por CI desde 04/04 até 13/04 (10 dias). O impacto no DRE da Semana 4 (25%) é diretamente explicado pela ausência de feedback automatizado durante a revisão de PRs, permitindo que erros escapassem para a main. **Pós-análise:** os cinco erros de lint foram identificados, analisados e corrigidos em 14/04, restaurando a funcionalidade do pipeline para 100% de sucesso. Este episódio reforça o principal aprendizado: investir em CI/CD funcional desde o primeiro sprint é crítico — problemas de pipeline prejudicam não apenas o feedback, mas também a confiança da equipe na ausência de defeitos regressivos.

3. **A ausência de testes automatizados é a maior dívida técnica documentada.** Apesar do IM médio bom (71) e do tempo de correção razoável (5,3h), a cobertura de testes zerada significa que defeitos não-óbvios podem estar presentes e não contabilizados.

**Resumo das correções implementadas (pós-período de análise):**

| Arquivo | Problema | Solução | Data |
|---|---|---|---|
| `web/src/app/api/compras/[usuarioId]/route.ts` | 2× `any` (linha 47, 134) | Removido `any`; trocado `tx: any` por `tx: Prisma.TransactionClient` | 14/04/2026 |
| `web/src/app/api/compras/detalhe/[id]/route.ts` | `any` (linha 42) | Removido `any`, tipo inferido do Prisma | 14/04/2026 |
| `web/src/app/api/itens_compras/[compraId]/route.ts` | `any` (linha 45) | Removido `any`, tipo inferido do Prisma | 14/04/2026 |
| `web/src/components/auth-context.tsx` | `setState` em effect (linha 48) | Refatorado para `useSyncExternalStore` com store externa (`listeners`, `notify`, `getSnapshot`, `getServerSnapshot`) | 14/04/2026 |

As correções eliminaram os 5 erros de ESLint que bloqueavam o pipeline. Novo resultado: `npm run lint` ✓, `npx tsc --noEmit` ✓, `npm run build` ✓.

---

A combinação das métricas de projeto, processo e produto mostrou-se essencial para entender o comportamento do trabalho: cada dimensão isolada contaria apenas parte da história. Métrica sem interpretação seria, de fato, decoração estatística — mas tomadas em conjunto e interpretadas no contexto do projeto, as métricas permitiram que a equipe redirecionasse prioridades durante o desenvolvimento (como a priorização da correção do CI na Semana 4) e reconhecesse, com evidência, seus próprios limites e conquistas.
