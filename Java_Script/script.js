document.addEventListener("DOMContentLoaded", () => {

  const tecladoForca = document.querySelector(".tecladoForca");
  const imagem = document.querySelector(".imagemForca img");


  function init() {

    imagem.src = `img/forca.png`;

    geradorDeTeclas();
  }

  function geradorDeTeclas() {
    tecladoForca.textContent = "";

    for (let i = 97; i < 123; i++) {
      const botao = document.createElement("button");
      const letra = String.fromCharCode(i).toUpperCase();
      botao.textContent = letra;
      botao.classList.add('letra-botao');

      tecladoForca.appendChild(botao);
    }
  }

  init();
});

