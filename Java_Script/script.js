import palavras from "./palavras.js";

document.addEventListener("DOMContentLoaded", () => {

  const tecladoForca = document.querySelector(".tecladoForca");
  const imagem = document.querySelector(".imagemForca img");
  const palavraSecreta = document.querySelector(".palavraSecreta");
  const dicaForca = document.querySelector(".dicaForca");
  const resetaJogo = document.querySelector(".resetaJogo");
  let indexImg;

  // Função de inicialização
  function init() {
    indexImg = 1;
    imagem.src = `img/forca1.png`;

    geradorSecaoPalavras();
    geradorDeTeclas();
  }

  // Função para gerar a palavra secreta e a dica
  function geradorSecaoPalavras() {
    palavraSecreta.textContent = "";

    const { palavra, dica } = palavras(); // A função palavras() retorna um objeto com palavra e dica
    const palavraSemAcento = palavra
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    Array.from(palavraSemAcento).forEach((letra) => {
      const span = document.createElement("span");
      span.textContent = "_";
      span.setAttribute("data-letra", letra.toUpperCase());
      palavraSecreta.appendChild(span);
    });

    dicaForca.textContent = `Dica: ${dica}`;
  };

  // Função para gerar as teclas do teclado virtual
  function geradorDeTeclas() {
    tecladoForca.textContent = ""; // Limpa qualquer conteúdo anterior

    for (let i = 65; i <= 90; i++) { // Letras de A a Z (códigos ASCII 65 a 90)
      const botao = document.createElement("button");
      const letra = String.fromCharCode(i).toUpperCase();
      botao.textContent = letra;
      botao.classList.add('letra-botao');

      botao.onclick = () => {
        botao.disabled = true; // Desabilita o botão após ser clicado
        botao.style.backgroundColor = "gray"; // Muda a cor para indicar que foi clicado
        verificaLetra(letra); // Verifica se a letra está correta
      }

      tecladoForca.appendChild(botao); // Adiciona o botão ao teclado virtual
    }
  }

  // Função para verificar se a letra está na palavra
  function verificaLetra(letra) {
    const arr = document.querySelectorAll(`[data-letra="${letra}"]`); // Seleciona os spans com a letra

    if (!arr.length) respostaErrada();

    arr.forEach((e) => {
      e.textContent = letra;
    });

    const spans = document.querySelectorAll(`.palavraSecreta span`);
    const won = !Array.from(spans).find((span) => span.textContent === "_");

    if (won) {
      setTimeout(() => {
        alert("Ganhou!!!");
        init();
      }, 100);
    }
  }

  // Função que trata o erro (muda a imagem da forca)
  function respostaErrada() {
    indexImg++;
    imagem.src = `img/forca${indexImg}.png`;

    if (indexImg === 7) { // Limite de erros
      setTimeout(() => {
        alert("Você perdeu =/");
        init(); // Reinicia o jogo
      }, 100);
    }
  }

  // Inicializa o jogo quando a página carrega
  init();

  // Reseta o jogo ao clicar no botão "NOVO JOGO"
  resetaJogo.addEventListener("click", init);

});
