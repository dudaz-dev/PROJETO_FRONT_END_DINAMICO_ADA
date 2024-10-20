document.addEventListener("DOMContentLoaded", () => {
  const tecladoForca = document.querySelector(".tecladoForca");
  const imagem = document.querySelector(".imagemForca img");
  const palavraSecreta = document.querySelector(".palavraSecreta");
  const dicaForca = document.querySelector(".dicaForca");
  const resetaJogo = document.querySelector(".resetaJogo");
  const adivinharPalavraBtn = document.querySelector(".adivinharPalavraBtn");
  const inputPalavraInteira = document.querySelector(".inputPalavraInteira");
  let indexImg = 1;
  let palavrasData;

  // Função para carregar o JSON
  async function carregaPalavras() {
    const response = await fetch("./palavras.json");
    palavrasData = await response.json();
  }

  // Função para inicializar o jogo
  function init() {
    indexImg = 1;
    imagem.src = `img/forca1.png`;

    if (!palavrasData) {
      carregaPalavras().then(() => {
        geradorSecaoPalavras();
        geradorDeTeclas();
      });
    } else {
      geradorSecaoPalavras();
      geradorDeTeclas();
    }
  }

  // Função para obter a palavra e a dica
  function palavras() {
    // Seleciona uma palavra e dica aleatória do arquivo JSON
    const randomIndex = Math.floor(Math.random() * palavrasData.length);
    return palavrasData[randomIndex];
  }

  // Função para gerar a palavra secreta e a dica
  function geradorSecaoPalavras() {
    palavraSecreta.textContent = "";

    const { palavra, dica } = palavras(); // Obtem a palavra e a dica
    const palavraSemAcento = palavra
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    Array.from(palavraSemAcento).forEach((letra) => {
      const span = document.createElement("span");
      if (letra === "-") {
        span.textContent = "-"; // Mostra o traço diretamente
        span.classList.add("letra-aceita"); // Adiciona uma classe para marcar como "correta"
      } else {
        span.textContent = "_"; // Coloca o sublinhado para outras letras
        span.setAttribute("data-letra", letra.toUpperCase());
      }
      palavraSecreta.appendChild(span);
    });

    dicaForca.textContent = `Dica: ${dica}`;
  }

  // Função para gerar as teclas do teclado virtual
  function geradorDeTeclas() {
    tecladoForca.textContent = ""; // Limpa qualquer conteúdo anterior

    for (let i = 65; i <= 90; i++) {
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

    // Verifica se não há mais underscores, mas ignora spans que contêm traços
    const won = !Array.from(spans).find((span) => span.textContent === "_" && !span.classList.contains("letra-aceita"));

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
        init();
      }, 100);
    }
  }

  // Função para tentar adivinhar a palavra inteira
  function adivinharPalavraInteira() {
    const palavraTentada = inputPalavraInteira.value.trim().toUpperCase();
    const palavraAtual = Array.from(document.querySelectorAll('.palavraSecreta span'))
      .map(span => span.getAttribute('data-letra') || span.textContent)
      .join('');

    if (palavraTentada === palavraAtual) {
      alert("Parabéns! Você acertou a palavra!");
      init(); // Reinicia o jogo
    } else {
      alert("Palavra incorreta!");
      respostaErrada(); // Conta como erro
    }
    inputPalavraInteira.value = ''; // Limpa o campo de input
  }

  // Inicializa o jogo quando a página carrega
  init();

  // Reseta o jogo ao clicar no botão "NOVO JOGO"
  resetaJogo.addEventListener("click", init);

  // Evento para tentar adivinhar a palavra completa
  adivinharPalavraBtn.addEventListener("click", adivinharPalavraInteira);
});
