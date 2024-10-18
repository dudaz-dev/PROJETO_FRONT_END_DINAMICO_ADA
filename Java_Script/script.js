// Certifica-se de que o DOM foi carregado completamente
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona os elementos necessários
  const tecladoForca = document.querySelector(".tecladoForca");
  const imagem = document.querySelector(".imagemForca img");

  // Função de inicialização
  function init() {
    // Define a imagem inicial da forca
    imagem.src = `img/forca.png`;

    // Gera as teclas (botões)
    geradorDeTeclas();
  }

  // Função para criar as teclas (botões) de A a Z
  function geradorDeTeclas() {
    tecladoForca.textContent = ""; // Limpa o conteúdo antes de adicionar as letras

    // Loop para criar os botões de 'A' a 'Z'
    for (let i = 97; i < 123; i++) { // 'a' é 97 no código ASCII e 'z' é 122
      const botao = document.createElement("button");
      const letra = String.fromCharCode(i).toUpperCase(); // Converte o código ASCII para a letra correspondente
      botao.textContent = letra;
      botao.classList.add('letra-botao'); // Adiciona uma classe para estilizar (opcional)

      // Adiciona o botão ao contêiner de teclas
      tecladoForca.appendChild(botao);
    }
  }

  // Inicia o jogo ao carregar a página
  init();
});

