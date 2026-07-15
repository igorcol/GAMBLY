# 🏗️ GAMBLY: Arquitetura de Diretórios

A regra de ouro da nossa arquitetura: **A interface (UI) e a renderização (Canvas) são burras.** Elas apenas despacham ações (`GameAction`) e reagem ao estado (`GameState`) ditado pelo `/core`.

```text
/src
  ├── /app                         # App Router (Next.js)
  │    ├── (marketing)             # Área Pública
  │    │    └── page.tsx           # Landing Page
  │    ├── (auth)                  # Autenticação
  │    │    ├── login/page.tsx
  │    │    └── register/page.tsx
  │    ├── (casino)                # Área Logada (Compartilha estado global de saldo)
  │    │    ├── layout.tsx         # Shell com Topbar/HUD global
  │    │    ├── page.tsx           # Lobby (Seleção de mesas/jogos)
  │    │    ├── profile/page.tsx   # Estatísticas e Histórico
  │    │    └── games
  │    │         └── blackjack
  │    │              ├── layout.tsx # Esconde barras para imersão total
  │    │              └── page.tsx   # Ponto de montagem da v0.1.0-alpha
  │    ├── layout.tsx              # Root Layout (Fontes, Metadata)
  │    └── globals.css             # Tailwind base e variáveis CSS customizadas
  │
  ├── /components                  # DOM / React Components
  │    ├── /ui                     # Design System (Buttons, Modals, Inputs)
  │    └── /game                   # HUD específico do jogo (Action Bar, Player Plate)
  │
  ├── /core                        # O Cérebro (TypeScript Puro, sem React ou Pixi)
  │    ├── /blackjack
  │    │    ├── engine.ts          # State Machine, Regras, AI do Dealer
  │    │    └── types.ts           # Contratos estritos: GameState, GameAction, Card
  │    └── /adapters
  │         ├── LocalRoom.ts       # Adaptador v0.1.0: Roda a engine no client
  │         └── SocketRoom.ts      # Adaptador v1.0.0: WebSocket (preparado para o futuro)
  │
  ├── /store                       # Gerenciamento de Estado Global (Zustand)
  │    ├── bankrollStore.ts        # Saldo total do usuário
  │    └── tableStore.ts           # Sincroniza o GameState do core com a UI
  │
  ├── /canvas                      # Motor Gráfico (PixiJS / Matter.js)
  │    ├── GameApp.ts              # Inicialização do WebGL/Canvas
  │    ├── /scenes                 # Gerenciamento de Cenas (TableScene)
  │    ├── /entities               # Classes visuais (CardSprite, ChipSprite)
  │    └── /systems                # Loops contínuos (Animações, Shaders, Física)
  │
  └── /assets                      # Recursos estáticos
       ├── /textures               # Spritesheets das cartas e fichas
       ├── /audio                  # SFX (Fichas batendo, cartas virando)
       └── /shaders                # .glsl (Efeitos de neon, glow, CRT)