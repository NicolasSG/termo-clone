[README.md](https://github.com/user-attachments/files/26857133/README.md)
# Termo Clone 🎮

Uma implementação em desenvolvimento do jogo **Termo** (versão em português do Wordle) com suporte a múltiplos modos de jogo. Desenvolvido com HTML5, CSS3 e JavaScript vanilla (ES6+).

## 📋 Sobre o Projeto

Termo Clone é um jogo de adivinhação de palavras inspirado no viral Wordle/Termo, onde:
- O jogador tem **6 tentativas** para adivinhar uma palavra de 5 letras
- Cada letra recebe feedback visual:
  - 🟩 **Verde**: letra correta na posição correta
  - 🟨 **Amarelo**: letra correta em posição errada
  - ⬜ **Cinza**: letra não está na palavra
- O teclado visual se atualiza com o feedback a cada tentativa
- Suporte a entrada por teclado físico ou cliques no teclado virtual

## ✨ Funcionalidades Implementadas

### 1️⃣ Modo Termo (Completo)
- [x] Grid 5x6 para 6 tentativas com 5 letras cada
- [x] Seleção visual de quadrado ativo (clique ou setas)
- [x] Entrada de letras via teclado físico ou virtual
- [x] Validação de palavras contra banco de dados (words.json)
- [x] Algoritmo inteligente de comparação de palavras
  - Detecta letras repetidas corretamente
  - Prioritiza letras verdes sobre amarelas
  - Gerencia "estoque" de letras para evitar falsas positivas
- [x] Feedback visual com animações (flip cascata, shake)
- [x] Atualização dinâmica do teclado com cores
- [x] Detecção de vitória/derrota

### 2️⃣ Modo Dueto (Em Desenvolvimento)
- [x] Grid duplo: 2 grids 5x7 lado a lado
- [x] Lógica de bloqueio de linhas quando jogador vence
- [x] Entrada simultânea em ambas as linhas
- [x] Teclado visual com feedback bi-cromático (split colors)
- [ ] Menu de conclusão/compartilhamento

### 3️⃣ Modo Quarteto (Não Implementado)
- [ ] Grid 4 vezes maior (matriz de palavras)
- [ ] Mecânica de "snake" para selecionar palavras adjacentes
- [ ] Validação de sequências

## 🚀 Como Usar

### Requisitos
- Navegador moderno com suporte a:
  - ES6+ (async/await, arrow functions)
  - Fetch API
  - DOM Manipulation

### Instalação e Execução
```bash
git clone https://github.com/NicolasSG/termo-clone.git
cd termo-clone
```

Abra o arquivo `index.html` no navegador ou use uma extensão como **Live Server**:
```bash
# Com Live Server no VS Code
# Clique direito em index.html > "Open with Live Server"
```

### Banco de Palavras
O jogo carrega palavras de um arquivo `words.json` que deve estar na raiz do projeto:
```json
[
  "ABACA",
  "ABADE",
  ...
]
```

## 🎮 Controles

### Teclado Físico
- **A-Z**: Digitar letras
- **Enter**: Confirmar palavra
- **Backspace**: Deletar letra

### Mouse
- **Clique nas letras do teclado virtual**: Digitar
- **Clique nos quadrados da grid**: Mudar quadrado ativo

## 🛠️ Estrutura Técnica

### Arquitetura
```
termo-clone/
├── index.html       # Estrutura semântica + templates
├── style.css        # Estilos (CSS Grid, Flexbox, animações)
├── script.js        # Lógica do jogo (ES6+)
├── words.json       # Banco de palavras
└── assets/          # Ícones e imagens
```

### Tecnologias Principais

#### 1. **Template Element**
Usa `<template>` tags para renderizar diferentes modos de jogo sem duplicação de código:
```javascript
const template = document.querySelector("#termo__template");
container.appendChild(template.content.cloneNode(true));
```

#### 2. **Event Delegation**
Listeners centralizados na grid e teclado para melhor performance:
```javascript
keyboard.addEventListener("click", (e) => {
  if (e.target.classList.contains("kbd__backspace")) {
    removeLetter();
  }
  // ...
});
```

#### 3. **Algoritmo de Comparação**
Implementação robusta que evita falsos positivos com letras repetidas:
```javascript
function compareWords(secret, guess) {
  // 1. Conta frequência de letras na palavra secreta
  // 2. Marca letras verdes e remove do "estoque"
  // 3. Marca letras amarelas apenas se houver "estoque" disponível
  // 4. Retorna array com cores para cada posição
}
```

#### 4. **Async/Await**
Carregamento dinâmico de dados e animações:
```javascript
async function revealSequence(squares, colors) {
  for (let i = 0; i < squares.length; i++) {
    squares[i].classList.add(`grid__letter-color_${colors[i]}`);
    await sleep(200); // Efeito cascata
  }
}
```

#### 5. **CSS Animations**
- **Flip cascata**: Rotação em 3D das letras (200ms stagger)
- **Shake**: Vibração quando palavra inválida
- **Fade in**: Cores do teclado aparecem suavemente

## 📊 O Que Falta Implementar

### 🔜 Quarteto (Prioridade Alta)
```
[ ] Estrutura de grid 4x4 com mini-grids internos
[ ] Mecânica de movimento tipo "snake"
[ ] Validação de adjacência (horizontal, vertical, diagonal)
[ ] Renderização dinâmica com template
[ ] Lógica de vitória (todas as 16 mini-palavras)
```

### 🔜 Estatísticas (Prioridade Alta)
```
[ ] Armazenar dados no localStorage
[ ] Rastrear:
    [ ] Total de jogos
    [ ] Jogos ganhos
    [ ] Taxa de vitória
    [ ] Distribuição (tentativa 1, 2, 3... 6)
    [ ] Sequência de vitórias
[ ] Mostrar modal com gráficos
[ ] Compartilhamento de resultado (emoji)
```

### 🔜 Configurações (Prioridade Média)
```
[ ] Modal de ajustes
[ ] Tema claro/escuro
[ ] Dificuldade (palavras fáceis vs. desafio)
[ ] Idioma (português vs. inglês)
[ ] Resetar estatísticas
[ ] Som on/off
```

### 🔜 Polish & UX (Prioridade Média)
```
[ ] Modal de "Como Jogar"
[ ] Feedback sonoro
[ ] Animação de vitória confetti
[ ] Compartilhamento em redes sociais
[ ] Versão mobile otimizada
[ ] Dark mode
```

## 🧪 Detalhes Técnicos Interessantes

### 1. Gestão de Estado Duplo (Termo vs. Dueto)
O código detecta o modo de jogo e adapta a lógica automaticamente:
```javascript
if (gameType === "termo") {
  // Usa activeRow único
} else if (gameType === "dueto") {
  // Usa activeRow2 (array com 2 linhas)
}
```

### 2. Cores Prioritárias
As cores são aplicadas ao teclado com prioridade:
- 🟩 Verde = 3
- 🟨 Amarelo = 2
- ⬜ Cinza = 1

Exemplo: Se uma letra foi amarela, clicar na palavra anterior que ela é verde **não anula** o amarelo.

### 3. Dueto com Cores Bi-cromáticas
Cada tecla do Dueto pode ter **2 cores diferentes** (uma para cada jogador):
```javascript
element.style.setProperty("--first_dueto_color", resolvedColor1);
element.style.setProperty("--second_dueto_color", resolvedColor2);
```

## 🐛 Bugs Conhecidos / Melhorias Futuras

- [ ] Validação de entrada case-insensitive na busca de palavras
- [ ] Cursor responsivo em mobile
- [ ] Suporte a acentos/caracteres especiais (AÇÃO, AÇÚCAR, etc.)
- [ ] Otimização de performance para 10k+ palavras
- [ ] Animações com `requestAnimationFrame`

## 📱 Responsividade

O projeto é **mobile-first**, mas ainda está em desenvolvimento para otimizações finais:
- ✅ Grid adapta para telas pequenas
- ⚠️ Teclado virtual precisa de ajustes de espaço
- ⚠️ Modo Dueto pode ficar cramped em mobile

## 📚 Recursos Utilizados

- [Wordle Original](https://www.nytimes.com/games/wordle) - Inspiração
- [Termo (versão PT)](https://term.ooo) - Referência local
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN - Template Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
- [CSS Tricks - Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

## 👨‍💻 Aprendizados Principais

Durante este projeto, aprendi:

1. **Algoritmos de comparação robustos** - Lidar com letras repetidas sem falsas positivas
2. **Gerenciamento de estado complexo** - Manter sincronização entre grid, teclado e lógica
3. **Template elements** - Reutilizar HTML dinamicamente sem innerHTML
4. **CSS animations** - Efeitos visuais com timing e cascata
5. **Async JavaScript** - Fetch de dados e delays de animação
6. **Event delegation** - Performance otimizada para múltiplos elementos

## 📄 Licença

Este projeto é de código aberto para fins educacionais. Sinta-se livre para clonar, modificar e aprender!

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Abra uma issue ou faça um pull request.

---

**Status**: 🟡 Em Desenvolvimento  
**Versão**: 0.2.0 (Termo + Dueto funcionais)  
**Próximas Features**: Quarteto, Estatísticas, Configurações  
**Última atualização**: Abril 2026
