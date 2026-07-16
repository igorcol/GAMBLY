

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