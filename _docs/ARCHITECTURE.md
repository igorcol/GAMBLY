# Arquitetura do Sistema - Gambly

Este documento define a estrutura arquitetural do projeto Gambly. O design é baseado na separação estrita entre **Lógica de Domínio (Core)** e **Camada de Apresentação (App/UI)**.

## 1. Visão Geral
O sistema utiliza um padrão de "Engine Agnóstica":
- **Core (`src/core/`)**: Contém a lógica de regras de jogo (puro TypeScript). Não conhece o React nem o DOM.
- **Store (`src/store/`)**: Orquestrador que conecta a Engine ao estado da interface.
- **UI (`src/app/` e `src/components/`)**: Responsável pela renderização e animação.

---

## 2. Estrutura do Domínio (`src/core/[jogo]/`)
Para cada novo jogo, a estrutura padrão é:

- **`types.ts`**: Define os contratos de dados (`GameState`, `Card`, `Hand`).
- **`engine.ts`**: Classe principal (`BlackjackEngine`). Contém as regras de negócio, cálculo de pontuação, estados de fase e manipulação da lógica pura.
- **`deck.ts`**: Responsável pela geração, embaralhamento e gerenciamento da entropia das cartas.

---

## 3. Gerenciamento de Estado (`src/store/`)

- **`tableStore.ts`**: O cérebro orquestrador.
  - **Função**: Mantém a instância da Engine, gerencia o `pendingBet`, controla o tempo das animações (`async delay`) e sincroniza pagamentos com o `bankrollStore`.
  - **Regra**: Toda ação do usuário passa por `dispatchAction`, que decide se chama a Engine ou se executa um fluxo assíncrono (ex: turno do Dealer).

- **`bankrollStore.ts`**: Gerencia o saldo global do usuário de forma persistente.

---

## 4. Fluxo de Dados

O fluxo de dados segue este padrão unidirecional:

1. **Input**: Usuário interage com a UI (Componente).
2. **Action**: `tableStore.dispatchAction()` é chamado.
3. **Core**: A `BlackjackEngine` calcula a nova regra.
4. **Emit**: A `Engine` emite um novo `GameState` através de um callback `onStateChange`.
5. **Update**: O `tableStore` recebe o novo estado, atualiza o Zustand e o React re-renderiza a UI.



---

## 5. Convenções de Desenvolvimento

- **Engine é "burra"**: Ela só executa comandos e emite estados. Ela não deve conter `setTimeout` ou `await delay`.
- **Store é "orquestrador"**: Ele gerencia o timing, animações e efeitos colaterais (pagamentos, logs).
- **Testes**: Métodos de Debug (como `forceHand`) devem ser expostos na `window` para facilitar testes de ponta-a-ponta no Console.