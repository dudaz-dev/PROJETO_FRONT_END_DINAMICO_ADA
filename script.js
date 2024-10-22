document.addEventListener("DOMContentLoaded", () => {
  const tecladoForca = document.querySelector(".tecladoForca");
  const imagem = document.querySelector(".imagemForca img");
  const palavraSecreta = document.querySelector(".palavraSecreta");
  const dicaForca = document.querySelector(".dicaForca");
  const resetaJogo = document.querySelector(".resetaJogo");
  const adivinharPalavraBtn = document.querySelector(".adivinharPalavraBtn");
  const inputPalavraInteira = document.querySelector(".inputPalavraInteira");
  const errosEl = document.querySelector(".erros");
  const acertosEl = document.querySelector(".acertos");
  const tentativasRestantesEl = document.querySelector(".tentativasRestantes");

  let indexImg = 1;
  let palavrasData;
  let erros = localStorage.getItem("erros") ? parseInt(localStorage.getItem("erros")) : 0;
  let acertos = localStorage.getItem("acertos") ? parseInt(localStorage.getItem("acertos")) : 0;
  let tentativasRestantes = localStorage.getItem("tentativasRestantes") ? parseInt(localStorage.getItem("tentativasRestantes")) : 7;
  let palavraCompletaDescoberta = false;
  let palavrasUsadas = JSON.parse(localStorage.getItem("palavrasUsadas")) || [];

  // Atualiza a UI com os valores iniciais
  errosEl.textContent = erros;
  acertosEl.textContent = acertos;
  tentativasRestantesEl.textContent = tentativasRestantes;

  // Função para carregar o JSON
  async function carregaPalavras() {
    const response = await fetch("./palavras.json");
    palavrasData = await response.json();
  }

  // Função para inicializar o jogo
  function init(novaRodada = false) {
    indexImg = 1;
    tentativasRestantes = 7;
    palavraCompletaDescoberta = false;

    imagem.src = `img/forca1.png`;

    // Atualiza a interface
    atualizaStatus();

    if (!palavrasData) {
      carregaPalavras().then(() => {
        geradorSecaoPalavras(novaRodada);
        geradorDeTeclas();
      });
    } else {
      geradorSecaoPalavras(novaRodada);
      geradorDeTeclas();
    }

    salvaEstado(); // Armazena as tentativas e o estado inicial no localStorage
  }

  // Função para sortear uma palavra
  function palavras() {
    let palavraEscolhida;
    do {
      const randomIndex = Math.floor(Math.random() * palavrasData.length);
      palavraEscolhida = palavrasData[randomIndex];
    } while (palavrasUsadas.includes(palavraEscolhida.palavra)); // Garante que a palavra não foi usada

    palavrasUsadas.push(palavraEscolhida.palavra); // Armazena a palavra no array de usadas
    localStorage.setItem("palavrasUsadas", JSON.stringify(palavrasUsadas)); // Salva no localStorage
    return palavraEscolhida;
  }

  // Função para gerar a palavra na interface
  function geradorSecaoPalavras(novaRodada) {
    palavraSecreta.textContent = "";

    const { palavra, dica } = palavras();
    const palavraSemAcento = palavra
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    Array.from(palavraSemAcento).forEach((letra) => {
      const span = document.createElement("span");
      if (letra === "-") {
        span.textContent = "-";
        span.classList.add("letra-aceita");
      } else {
        span.textContent = "_";
        span.setAttribute("data-letra", letra.toUpperCase());
      }
      palavraSecreta.appendChild(span);
    });

    dicaForca.textContent = `Dica: ${dica}`;
  }

  // Função para gerar as teclas
  function geradorDeTeclas() {
    tecladoForca.textContent = "";

    for (let i = 65; i <= 90; i++) {
      const botao = document.createElement("button");
      const letra = String.fromCharCode(i).toUpperCase();
      botao.textContent = letra;
      botao.classList.add("letra-botao");

      botao.onclick = () => {
        botao.disabled = true; // Desabilita o botão após ser clicado
        botao.style.backgroundColor = "gray"; // Muda a cor para indicar que foi clicado
        verificaLetra(letra); // Verifica se a letra está correta
      };

      tecladoForca.appendChild(botao); // Adiciona o botão ao teclado virtual
    }
  }

  // Função para verificar se a letra está na palavra
  function verificaLetra(letra) {
    const arr = document.querySelectorAll(`[data-letra="${letra}"]`);

    if (!arr.length) {
      respostaErrada();
    } else {
      arr.forEach((e) => {
        e.textContent = letra;
      });

      const spans = document.querySelectorAll(".palavraSecreta span");
      palavraCompletaDescoberta = !Array.from(spans).find((span) => span.textContent === "_" && !span.classList.contains("letra-aceita"));

      if (palavraCompletaDescoberta) {
        acertos++;
        salvaEstado();
        setTimeout(() => {
          alert("Ganhou!!!");
          init(true);
        }, 100);
      }
    }

    atualizaStatus();
  }

  // Função que trata o erro (muda a imagem da forca)
  function respostaErrada() {
    indexImg++;
    erros++;
    tentativasRestantes--;
    imagem.src = `img/forca${indexImg}.png`;

    if (indexImg === 7) { // Limite de erros
      setTimeout(() => {
        alert("Você perdeu =/");
        init(); // Reinicia o jogo com nova rodada
      }, 100);
      localStorage.setItem("acertos", 0); // Zera acertos ao perder
    }

    salvaEstado();
    atualizaStatus();
  }

  // Função para atualizar a UI com os erros e acertos
  function atualizaStatus() {
    errosEl.textContent = erros;
    acertosEl.textContent = acertos;
    tentativasRestantesEl.textContent = tentativasRestantes;
  }

  // Salva o estado atual no localStorage
  function salvaEstado() {
    localStorage.setItem("erros", erros);
    localStorage.setItem("acertos", acertos);
    localStorage.setItem("tentativasRestantes", tentativasRestantes);
  }

  // Função para tentar adivinhar a palavra inteira
  function adivinharPalavraInteira() {
    const palavraTentativa = inputPalavraInteira.value.trim().toUpperCase();
    const palavraAtual = Array.from(document.querySelectorAll(".palavraSecreta span"))
      .map(span => span.getAttribute("data-letra") || span.textContent)
      .join("");

    if (palavraTentativa === palavraAtual) {
      acertos++; // Conta como acerto completo
      salvaEstado();
      alert("Parabéns! Você acertou a palavra!");
      init(true); // Continua o jogo com nova palavra
    } else {
      alert("Palavra incorreta!");
      respostaErrada(); // Conta como erro
    }
    inputPalavraInteira.value = ""; // Limpa o campo de input
  }

  // Reseta o jogo ao clicar no botão "NOVO JOGO"
  resetaJogo.addEventListener("click", () => {
    localStorage.clear(); // Limpa o localStorage ao iniciar novo jogo
    palavrasUsadas = []; // Zera as palavras usadas
    acertos = 0;
    erros = 0;
    init(); // Inicia o jogo do zero
  });

  // Evento para tentar adivinhar a palavra completa
  adivinharPalavraBtn.addEventListener("click", adivinharPalavraInteira);

  // Inicia o jogo
  init();
});