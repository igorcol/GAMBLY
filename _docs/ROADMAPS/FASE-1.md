Roadmap Técnico: v0.1.0-alpha
Etapa 1: Os Contratos (Tipagens Estritas)
Onde definimos a linguagem universal do projeto.

Criar /core/blackjack/types.ts.

Definir os enums de naipes (Suit), valores (Rank) e a interface Card.

Tipar as ações permitidas (GameAction: Hit, Stand, Double, Split).

Tipar o estado da mesa (GameState: Fases do jogo, mãos, valores, quem está jogando).

Etapa 2: A Física do Baralho e Regras Matemáticas
Funções puras em TypeScript, sem estado.

Lógica de geração de baralhos (1 a 8 decks).

Lógica de embaralhamento.

Função crítica: calculateScore(hand). Tem que tratar o Ás dinamicamente (valendo 1 ou 11 para não estourar 21).

Etapa 3: O Cérebro (State Machine & Local Adapter)
O controlador que dita o ritmo do jogo.

Criar a máquina de estados: BETTING -> DEALING -> PLAYER_TURN -> DEALER_TURN -> PAYOUT.

Implementar o LocalRoomAdapter para receber as ações do jogador, processar as regras locais e emitir o novo GameState.

Implementar a "IA" do Dealer (básica: Hit até 16, Stand no 17).

Etapa 4: A Ponte (Zustand)
Onde a interface descobre o que está acontecendo.

Criar o bankrollStore.ts (estado volátil de dinheiro).

Criar o tableStore.ts, que assina (subscribe) os eventos do LocalRoomAdapter e atualiza as variáveis para o React ler.

Etapa 5: A Casca (UI / DOM)
O Next.js entra em cena.

Montar a HUD com Tailwind.

Implementar a Action Bar (Botões de Hit/Stand que só habilitam quando a store avisa que é PLAYER_TURN).

Etapa 6: O Palco (PixiJS)
Apenas renderização visual e "Juice".

Subir a instância do Canvas no React.

Ler o estado do Zustand e desenhar/animar as cartas e fichas na tela, isolando a engine gráfica da lógica de negócios.