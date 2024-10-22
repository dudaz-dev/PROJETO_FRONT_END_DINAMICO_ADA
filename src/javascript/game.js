let words = [];
let selectedWord = '';
let hint = '';
let attempts = 6;
let guessedLetters = [];
let score = parseInt(localStorage.getItem('score')) || 0;
let usedWords = [];

let victories = parseInt(localStorage.getItem('victories')) || 0;
let defeats = parseInt(localStorage.getItem('defeats')) || 0;

document.addEventListener('DOMContentLoaded', () => {
  fetch('../../api/palavras.json')
    .then(response => response.json())
    .then(data => {
      words = data;
      if (Array.isArray(words) && words.length > 0) {
        document.getElementById('start-game-btn').addEventListener('click', startGame);
        document.getElementById('reset-game-btn').addEventListener('click', resetGame);
        document.getElementById('reset-scoreboard-btn').addEventListener('click', resetScoreboard);
      } else {
        console.error('Erro: Nenhuma palavra encontrada no arquivo JSON.');
      }
      updateScoreboard();
    })
    .catch(error => console.error('Erro ao carregar palavras:', error));
});

function startGame() {
  if (!Array.isArray(words) || words.length === 0) {
    console.error('Erro: Nenhuma palavra disponível para iniciar o jogo.');
    return;
  }

  let selectedWordObject;

  do {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWordObject = words[randomIndex];
  } while (usedWords.includes(selectedWordObject.palavra) && usedWords.length < words.length);

  if (!selectedWordObject || !selectedWordObject.palavra) {
    console.error('Erro: Palavra selecionada inválida.', selectedWordObject);
    return;
  }

  selectedWord = selectedWordObject.palavra.toLowerCase();
  hint = selectedWordObject.dica;
  attempts = 6;
  guessedLetters = [];

  usedWords.push(selectedWord);

  document.getElementById('hint').textContent = hint;
  document.getElementById('word-display').innerHTML = generateWordLines(selectedWord);
  document.getElementById('letters-chosen').innerHTML = '';
  document.getElementById('remaining-attempts').textContent = attempts;
  document.getElementById('score').textContent = score;

  document.querySelector('.container-imagens img').src = `../assets/img/logo.png`;

  document.querySelector('.container-game-function').classList.remove('hide');
  document.querySelector('.teclado-virtual').classList.remove('hide');
  document.querySelector('.container-guess-word').classList.remove('hide');

  createKeyboard();

  document.getElementById('guess-word-btn').style.display = 'block';
  document.querySelector('.container-game-function-hide').classList.remove('hide');

  document.getElementById('start-game-btn').classList.add('hide');
}



function resetGame() {
  startGame();
}

function generateWordLines(word) {
  return word
    .split('')
    .map(letter => (guessedLetters.includes(letter) || letter === '-') ? letter : '_')
    .join(' ');
}

function createKeyboard() {
  const keyboardContainer = document.querySelector('.teclado-virtual ul');
  keyboardContainer.innerHTML = '';

  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const button = document.createElement('button');
    button.textContent = letter;
    button.addEventListener('click', () => handleGuess(letter));
    keyboardContainer.appendChild(button);
  }
}

function handleGuess(letter) {
  if (guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);
  const lettersChosenElement = document.getElementById('letters-chosen');
  const letterElement = document.createElement('li');
  letterElement.textContent = letter;
  lettersChosenElement.appendChild(letterElement);

  const buttons = document.querySelectorAll('.teclado-virtual button');
  buttons.forEach(button => {
    if (button.textContent === letter) {
      button.disabled = true;
      if (selectedWord.includes(letter)) {
        button.style.backgroundColor = 'green';
        updateWordDisplay();
      } else {
        button.style.backgroundColor = 'darkgray';
        attempts--;

        document.getElementById('remaining-attempts').textContent = attempts;

        if (attempts > 0) {
          document.querySelector('.container-imagens img').src = `../assets/img/derrota0${6 - attempts}.png`;
        } else {
          document.querySelector('.container-imagens img').src = `../assets/img/derrota07.png`;
          document.getElementById('defeat-message').textContent = `Você perdeu! A palavra era: ${selectedWord}`;
          document.getElementById('defeat-message').classList.remove('hide');
          handleDefeat();
          disableKeyboard();
          setTimeout(() => {
            document.getElementById('defeat-message').classList.add('hide');
            startGame();
          }, 5000);
        }
      }
    }
  });
}

function disableKeyboard() {
  const buttons = document.querySelectorAll('.teclado-virtual button');
  buttons.forEach(button => {
    button.classList.add('disabled');
    button.disabled = true;
  });
}

function enableKeyboard() {
  const buttons = document.querySelectorAll('.teclado-virtual button');
  buttons.forEach(button => {
    button.classList.remove('disabled');
    button.disabled = false;
  });
}
function updateScoreboard() {
  document.getElementById('victories').textContent = victories;
  document.getElementById('defeats').textContent = defeats;
  document.getElementById('score').textContent = score;
}

function handleVictory() {
  victories++;
  score += 10;
  localStorage.setItem('victories', victories);
  localStorage.setItem('score', score);
  updateScoreboard();
  showMessage('Parabéns! Você adivinhou a palavra!');
}

function handleDefeat() {
  defeats++;
  score -= 5;
  if (score < 0) {
    score = 0;
  }
  localStorage.setItem('defeats', defeats);
  localStorage.setItem('score', score);
  updateScoreboard();
  disableKeyboard();

  const guessInput = document.getElementById('guess-word-input');
  const guessButton = document.getElementById('guess-word-btn');
  guessInput.disabled = true;
  guessButton.disabled = true;

  showMessage(`Você perdeu! A palavra era: ${selectedWord}`);

  setTimeout(() => {
    guessInput.disabled = false;
    guessButton.disabled = false;
    enableKeyboard();
  }, 5000);
}

function resetScoreboard() {
  victories = 0;
  defeats = 0;
  score = 0;
  localStorage.setItem('victories', victories);
  localStorage.setItem('defeats', defeats);
  localStorage.setItem('score', score);
  updateScoreboard();
}

function showMessage(message) {
  const messageElement = document.getElementById('defeat-message');
  messageElement.textContent = message;
  messageElement.classList.add('show');

  setTimeout(() => {
    messageElement.classList.remove('show');
  }, 5000);
}

document.getElementById('guess-word-btn').addEventListener('click', guessWord);

function guessWord() {
  const guessInput = document.getElementById('guess-word-input');
  const guess = guessInput.value.toLowerCase().trim();

  const guessButton = document.getElementById('guess-word-btn');
  guessButton.disabled = true;

  if (guess === selectedWord) {
    handleVictory();
    document.getElementById('defeat-message').textContent = 'Parabéns! Você adivinhou a palavra!';
    document.getElementById('defeat-message').classList.remove('hide');
    setTimeout(() => {
      document.getElementById('defeat-message').classList.add('hide');
      guessInput.disabled = false;
      guessButton.disabled = false;
      enableKeyboard();
      startGame();
    }, 3000);
  } else {
    handleDefeat();
    document.getElementById('defeat-message').textContent = `Você errou! A palavra correta era: ${selectedWord}`;
    document.getElementById('defeat-message').classList.remove('hide');
    setTimeout(() => {
      document.getElementById('defeat-message').classList.add('hide');
      guessInput.disabled = false;
      guessButton.disabled = false;
      enableKeyboard();
      startGame();
    }, 5000);
  }

  guessInput.value = '';
}

function updateWordDisplay() {
  const wordArray = selectedWord.split('');
  const displayWord = wordArray.map(letter => (guessedLetters.includes(letter) || letter === '-') ? letter : '_').join(' ');

  document.getElementById('word-display').innerHTML = generateWordLines(selectedWord);

  if (!displayWord.includes('_')) {
    score += 10;
    localStorage.setItem('score', score);
    handleVictory();
    startGame();
  }
}
