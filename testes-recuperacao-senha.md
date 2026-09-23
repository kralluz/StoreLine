# Casos de Teste — Recuperação de Senha

**Disciplina:** Testes de Software
**Sistema/Módulo:** Autenticação / Recuperação de Senha
**Data:** 23/09/2026

---

## Especificação de Referência

| Código | Especificação |
|--------|---------------|
| RF-01  | O sistema deve permitir que um usuário solicite recuperação de senha informando o e-mail cadastrado. |
| RN-01  | O código de recuperação deve conter 6 dígitos e expirar após 10 minutos. |
| RN-02  | Após 3 tentativas consecutivas com código incorreto, o código atual deve ser invalidado. |
| RN-03  | Por segurança, o sistema deve exibir a mesma mensagem para e-mail cadastrado e não cadastrado: *"Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação."* |

---

## CT-REC-01 — Bloqueio após terceira tentativa consecutiva incorreta

**Origem:** RN-02 + UC-01/A3
**Tipo:** Negativo / Segurança
**Prioridade:** Alta

### Pré-condições
- Solicitação de recuperação ativa
- Código válido `482731` enviado ao usuário
- Nenhuma tentativa incorreta realizada

### Dados de entrada

| Dado | Valor |
|------|-------|
| Tentativa 1 | 111111 |
| Tentativa 2 | 222222 |
| Tentativa 3 | 333333 |
| Tentativa 4 | 482731 (código real) |

### Passos
1. Informar `111111` e confirmar
2. Informar `222222` e confirmar
3. Informar `333333` e confirmar
4. Informar o código originalmente válido `482731` e confirmar

### Resultado esperado
Após a terceira tentativa incorreta, o código `482731` fica invalidado e não pode mais concluir a recuperação. O sistema exibe mensagem informando que o código foi invalidado e um novo código deve ser solicitado.

### Análise
- **Caso suficientemente claro?** Sim
- **Ambiguidade encontrada?** Não

---

## CT-REC-02 — Recuperação de senha com fluxo principal (caminho feliz)

**Origem:** RF-01 + UC-01 (Fluxo Principal)
**Tipo:** Positivo
**Prioridade:** Alta

### Pré-condições
- Usuário com e-mail `usuario@email.com` cadastrado no sistema
- Usuário está na tela "Esqueci minha senha"
- Nenhuma solicitação de recuperação ativa para este e-mail

### Dados de entrada

| Dado | Valor |
|------|-------|
| E-mail | usuario@email.com |
| Código recebido | (código enviado por e-mail, ex: 857412) |
| Nova senha | NovaSenha@2026 |
| Confirmação nova senha | NovaSenha@2026 |

### Passos
1. Acessar a tela "Esqueci minha senha"
2. Informar `usuario@email.com` e confirmar
3. Verificar que o sistema exibe a mensagem padrão: *"Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação."*
4. Verificar que um e-mail com código de 6 dígitos foi recebido
5. Informar o código recebido antes de 10 minutos e confirmar
6. Informar a nova senha e confirmação
7. Confirmar a troca

### Resultado esperado
O sistema aceita o código, permite cadastrar nova senha e confirma a alteração com sucesso. O usuário consegue fazer login com a nova senha.

### Análise
- **Caso suficientemente claro?** Sim
- **Ambiguidade encontrada?** Não

---

## CT-REC-03 — E-mail não cadastrado exibe mesma mensagem (anonimato de segurança)

**Origem:** RN-03 + UC-01/A1
**Tipo:** Negativo / Segurança
**Prioridade:** Alta

### Pré-condições
- Usuário está na tela "Esqueci minha senha"
- O e-mail `naoexiste@email.com` **não está** cadastrado no sistema

### Dados de entrada

| Dado | Valor |
|------|-------|
| E-mail | naoexiste@email.com |

### Passos
1. Acessar a tela "Esqueci minha senha"
2. Informar `naoexiste@email.com` e confirmar
3. Verificar a mensagem exibida pelo sistema

### Resultado esperado
O sistema exibe **exatamente** a mesma mensagem que exibiria para um e-mail válido: *"Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação."*
Nenhum e-mail é enviado. Nenhuma informação adicional que revele se o e-mail existe ou não é apresentada.

### Análise
- **Caso suficientemente claro?** Sim
- **Ambiguidade encontrada?** Não — RN-03 define a mensagem exata a ser exibida

---

## CT-REC-04 — Código expirado após 10 minutos

**Origem:** RN-01 + UC-01/A2
**Tipo:** Negativo / Limite
**Prioridade:** Alta

### Pré-condições
- Solicitação de recuperação ativa
- Código de 6 dígitos enviado ao e-mail do usuário
- Aguardar mais de 10 minutos após o envio do código

### Dados de entrada

| Dado | Valor |
|------|-------|
| E-mail | usuario@email.com |
| Código (expirado) | código recebido por e-mail |
| Tempo de espera | > 10 minutos após envio |

### Passos
1. Solicitar recuperação de senha informando `usuario@email.com`
2. Aguardar mais de 10 minutos sem inserir o código
3. Inserir o código recebido e confirmar

### Resultado esperado
O sistema rejeita o código e exibe mensagem informando que o código expirou e que um novo código deve ser solicitado. O processo de troca de senha não é concluído.

### Análise
- **Caso suficientemente claro?** Parcialmente
- **Ambiguidade encontrada?** **Sim** — RN-01 diz "expirar após 10 minutos", mas não define com precisão se o código inserido **exatamente aos 10:00** é válido ou inválido. A documentação não define a fronteira.
  - **Decisão correta:** Registrar a ambiguidade e não inventar o comportamento esperado. Consultar o responsável pela especificação antes de executar o teste de fronteira.

---

## CT-REC-05 — Limite exato de expiração (fronteira dos 10 minutos)

**Origem:** RN-01 — Teste de Fronteira
**Tipo:** Limite/Fronteira
**Prioridade:** Média

### Pré-condições
- Solicitação de recuperação ativa
- Código válido enviado ao e-mail do usuário
- Controle preciso de tempo disponível (ex: ambiente de teste com relógio controlado)

### Dados de entrada

| Dado | Valor |
|------|-------|
| E-mail | usuario@email.com |
| Código recebido | (código enviado, ex: 482731) |
| Momento de inserção | Exatamente ao completar 10:00 desde o envio |

### Passos
1. Solicitar recuperação de senha
2. Anotar o horário exato de envio do código
3. No instante em que o cronômetro marca exatamente 10:00, inserir o código e confirmar

### Resultado esperado
> **Resultado indefinido pela especificação atual.**
> A documentação não esclarece se 10:00 exato é válido ou inválido.
> Este caso deve ser executado após esclarecimento com o responsável pela especificação.

### Análise
- **Caso suficientemente claro?** Não
- **Ambiguidade encontrada?** Sim — "após 10 minutos" pode significar:
  - Inválido a partir de **10:00** (>= 10 minutos)
  - Inválido somente a partir de **10:01** (> 10 minutos)

---

## CT-REC-06 — Duas tentativas incorretas seguidas de código correto (não deve bloquear)

**Origem:** RN-02 — Verificação do limite (não deve bloquear antes da 3ª tentativa)
**Tipo:** Positivo / Fronteira
**Prioridade:** Média

### Pré-condições
- Solicitação de recuperação ativa
- Código válido `857412` enviado ao usuário
- Nenhuma tentativa incorreta realizada

### Dados de entrada

| Dado | Valor |
|------|-------|
| Tentativa 1 | 111111 (incorreto) |
| Tentativa 2 | 222222 (incorreto) |
| Tentativa 3 | 857412 (correto) |

### Passos
1. Informar `111111` e confirmar
2. Informar `222222` e confirmar
3. Informar `857412` (código correto) e confirmar

### Resultado esperado
O sistema aceita o código correto na terceira tentativa (apenas 2 tentativas incorretas anteriores). O processo de recuperação prossegue normalmente e o usuário pode cadastrar nova senha.

### Análise
- **Caso suficientemente claro?** Sim
- **Ambiguidade encontrada?** Não — RN-02 é claro: o bloqueio ocorre somente após **3 tentativas consecutivas incorretas**

---

## Resumo dos Casos de Teste

| ID | Objetivo | Tipo | Prioridade | Origem |
|----|----------|------|------------|--------|
| CT-REC-01 | Bloqueio após 3 tentativas incorretas consecutivas | Negativo | Alta | RN-02 + UC-01/A3 |
| CT-REC-02 | Fluxo principal — recuperação bem-sucedida | Positivo | Alta | RF-01 + UC-01 |
| CT-REC-03 | E-mail não cadastrado exibe mesma mensagem | Negativo | Alta | RN-03 + UC-01/A1 |
| CT-REC-04 | Código expirado após 10 minutos | Negativo | Alta | RN-01 + UC-01/A2 |
| CT-REC-05 | Fronteira exata dos 10 minutos (ambiguidade) | Fronteira | Média | RN-01 |
| CT-REC-06 | 2 tentativas incorretas + 1 correta (não bloqueia) | Positivo | Média | RN-02 |

---

## Ambiguidades Identificadas na Especificação

| # | Regra | Questão | Impacto |
|---|-------|---------|---------|
| 1 | RN-01 | "Expirar após 10 minutos": código inserido aos exatos 10:00 é válido ou inválido? | CT-REC-04 e CT-REC-05 |
