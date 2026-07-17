

# VER ERRO DO SPLIT
clicando em split:

-Apareceu 2 montes separados.
-Dinheiro q tava em 1000, caiu para 900 na bet normal, dps do split desceu pra 800 (bet inicial de 100).

problema visual:
-não aparece outra stack de ficha no monte da esquerda, deveria aparecer na hora q dou o split.
-a mão q não esta sendo jogada no split deveria ficar com baixa opacidade, para saber qual mão estou jogando.

na minha jogada atual, um monte estava com 17, outro com 19.
dealer somou 19.

apareceu na tela DEALER WINS, acredito que porque minha primeira mão era 17 (menor), mas a segunda era 19, daria um push.

------

1. Refatorar o BetStack: Fazer ele aceitar uma prop amount (que vem de hand.bet) em vez de receber um array pendingChips que não existe mais para as mãos divididas.

2. Refatorar o page.tsx:
Adicionar a lógica de opacity baseada no activeHandIndex.
Mover a exibição do banner de resultado para dentro do map das mãos, permitindo que cada mão mostre seu próprio "WIN/PUSH/LOSS".

3. Refatorar o engine.ts: Se necessário, garantir que o payout seja calculado individualmente e que o status final não "atropele" o outro.

A Sequência Proposta
Etiqueta 1: O BetStack Individual

Por que: Hoje o BetStack depende de uma lista global de fichas (pendingChips). Precisamos torná-lo autônomo. Ele deve apenas receber um valor (amount) via props. Isso resolve o problema visual das fichas não aparecendo no Split e prepara o terreno para o jogo entender que cada mão tem sua própria aposta.

Etiqueta 2: Refatoração do page.tsx (Layout e Opacidade)

Por que: Com o BetStack resolvido, agora sim vamos "limpar" o page.tsx. Vamos implementar a lógica da opacidade baseada no activeHandIndex (para destacar qual mão você está jogando) e garantir que a estrutura do map seja a fonte única da verdade para a renderização das mãos.

Etiqueta 3: Feedback de Resultado Individual

Por que: Por último, resolvemos a questão do banner "DEALER WINS" global. Vamos mover a lógica do banner para dentro do loop de mãos. Assim, se a mão 1 perder e a mão 2 ganhar, o usuário verá o feedback correto em cada uma, eliminando o erro de avaliação.

===================


# DEV PANEL

## 1. Controle de Bankroll (Stress Test)
[X] Set manual: +10, +100, +500, +1000

[X] Falência ($0): Para testar se os bloqueios de UI estão funcionando (impedir o Double ou o Deal sem saldo).

[X] Reset ($1.000): Para continuar os testes após perder tudo.

## 2. Manipulação de Mãos (Hand Forcer)
[X] Input Customizado: Um campo de texto rápido onde você digita A, 7 e o botão aplica à sua mão.

[X] Cenário de Split: Injeta um par (ex: [8, 8]) para você testar rapidamente a renderização dos múltiplos montes e das stacks de fichas individuais.

[X] Blackjack Automático: Injeta [A, K] instantaneamente.


[X] Dealer Blackjack: Força o dealer a ter um Blackjack para testar como as mãos do jogador reagem (útil para quando formos implementar a mecânica de Insurance).

## 3. Raio-X do Estado (State Inspector)
Uma área em formato de código (JSON) que mostra em tempo real as variáveis invisíveis que afetam a UI: activeHandIndex, o tamanho atual do playerHands, e o score atual do Dealer. Isso mata a dúvida se o erro é visual (Tailwind/React) ou estrutural (Engine)

## 4. Manipulação de Tempo e Fase
Skip Animations / Fast Forward: Como agora temos delays reais no tableStore para puxar as cartas, seria útil um toggle para "Zerar Delays", permitindo que o jogo rode instantaneamente durante os testes de estresse.

Forçar Payout: Muda o estado direto para PAYOUT para você testar os ajustes finos no DopaminePopup e nas cores do banner de vitória/derrota.


