document.addEventListener('DOMContentLoaded', function() {
  const rules = [
    "Objetivo do Jogo: Adivinhar a palavra secreta antes de cometer 7 erros.",
    "Início do Jogo: O jogo começa com a exibição de uma dica ou tema relacionado à palavra secreta. A palavra secreta é representada por traços, indicando o número de letras.",
    "Tentativas: O jogador pode tentar adivinhar a palavra completa ou uma letra de cada vez. Cada letra correta é revelada na posição correspondente na palavra secreta. Cada letra errada é registrada e conta como um erro.",
    "Número Máximo de Erros: O jogador pode cometer até 7 erros. A cada erro, uma parte do boneco é desenhada na forca. Se o jogador cometer 7 erros, o jogo termina e o boneco é enforcado.",
    "Teclado Virtual: O jogador pode usar o teclado virtual para selecionar letras. Letras já tentadas (corretas ou erradas) são desativadas no teclado virtual.",
    "Reiniciar o Jogo: Após o término do jogo (vitória ou derrota), o jogador pode reiniciar o jogo para tentar uma nova palavra.",
    "Feedback Visual: Letras corretas são reveladas na palavra secreta. Letras erradas são destacadas e o número de tentativas restantes é atualizado visualmente.",
  ];

  let currentRuleIndex = 0;

  const showRulesBtn = document.querySelector('.show-rules-btn');
  const rulesContainer = document.querySelector('.rules-container');

  showRulesBtn.addEventListener('click', function() {
    if (currentRuleIndex < rules.length) {
      const rule = document.createElement('p');
      rule.textContent = rules[currentRuleIndex];
      rulesContainer.appendChild(rule);
      currentRuleIndex++;
    } else {
      showRulesBtn.disabled = true;
    }
  });
});