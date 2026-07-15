

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