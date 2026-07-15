# 🎨 Styleguide: GAMBLY "Midnight Arcade"

## 1. Conceito Visual
Um mix de UI minimalista moderna com elementos de jogo táteis. O DOM (Next.js/Astro) cuida da interface "clean" e flutuante, enquanto o Canvas (PixiJS) renderiza cartas e fichas com física e brilho.

- **Vibe:** Moderno, limpo, gamificado, noturno.
- **Foco:** Legibilidade extrema nos números e feedback visual explosivo (suave, sem poluição).

## 2. Paleta de Cores (Tailwind Ready)

A interface vive no escuro. As cores servem apenas para destacar ações e valores.

### Backgrounds (Profundidade)
- **Base (O "Mesa"):** `#0B0C10` (Preto absoluto com toque azulado/frio)
- **Surface (Modais, Cards UI):** `#181A20` com 40% de opacidade (Glassmorphism sutil)
- **Glow/Ambiência:** `#3B28CC` (Um roxo escuro radiante para o centro da mesa, via background radial)

### Ações e Destaques (Neon/Vibrant)
- **Ação Principal (Sua Vez / Apostar):** `#FFD700` (Amarelo vibrante, igual ao timer da ref 1)
- **Ação Secundária (Check / Call):** `#FFFFFF` (Branco puro)
- **Ações Críticas (Fold / Stand):** `#EF4444` (Red-500 do Tailwind)
- **Ações Positivas (Raise / Hit):** `#22C55E` (Green-500 do Tailwind)

### Fichas (Chips)
Fichas precisam saltar da tela. Cores saturadas.
- **100:** Cinza escuro/Prata (`#334155`)
- **500:** Roxo vibrante (`#8B5CF6`)
- **1K:** Amarelo (`#EAB308`)
- **5K:** Laranja avermelhado (`#F97316`)

## 3. Tipografia

Dois estilos para separar bem a "Interface" do "Jogo".

- **Fonte Principal (UI, Menus, Nomes):** `Inter` ou `SF Pro`. Limpa, sem serifa, peso normal.
- **Fonte Numérica (Saldos, Apostas, Cartas):** `Space Grotesk` ou `Outfit`. Precisamos de números redondos, largos e com cara de tecnologia/gamificação.
- **Pesos:** `Regular (400)` para textos de apoio, `Bold (700)` para botões, `Black (900)` gigante para o Pote e Saldo.

## 4. Componentes UI (O "Shell")

### Botões
- **Formato:** `rounded-full` (Pill shape).
- **Estilo Padrão:** Fundo semi-transparente (`bg-white/10`), texto branco.
- **Estado Ativo/Sua Vez:** Borda brilhante (`ring-2 ring-yellow-400`), shadow glow (efeito neon suave).
- **Hover:** Aumenta a opacidade do fundo sutilmente (`hover:bg-white/20`) + leve transição no `transform scale`.

### Avatares / Jogadores
- Círculos perfeitos com bordas coloridas indicando status (ex: amarelo para "sua vez", vermelho para "fold").
- Tags flutuantes estilo pílula por cima do avatar indicando ações passadas ("Called", "Folded").

## 5. Elementos in-Game (Canvas / PixiJS)

### Cartas
- Brancas (`#FFFFFF`), cantos arredondados (`border-radius` equivalente a `xl`), proporção clássica (2.5 x 3.5).
- **Sombra:** `drop-shadow` vertical forte para dar a sensação de que estão flutuando acima da mesa escura.
- **Animação:** Quando viram ou são distribuídas, usam uma curva de Bezier rápida no início e suave no final (Ease-out).

### Fichas
- Estilo *Flat 3D*. Vistas de cima, mas com anéis concêntricos e pontos de contraste.
- Quando apostadas, movem-se para o centro com rastro rápido (motion blur simulado se necessário).

## 6. Motion & Feedback ("Juice")
- **Microinterações:** Botões da UI encolhem 2% ao clicar (`active:scale-98`).
- **Ganhos:** O Pote principal (número gigante no topo) faz um "Pop" (escala para 1.2x e volta) e conta os números rapidamente em animação fluida, não pisca direto pro valor final.
- **Atenção:** Quando o tempo está acabando, a barra de ação pisca em pulso suave, não estroboscópico.