const wordDisplay = document.querySelector('.word-display');
const guessesText = document.querySelector('.guesses-text b');
const keyboardDiv = document.querySelector('.keyboard');
const hangmanImage = document.querySelector('.hangman-box img');
const gameModal = document.querySelector('.game-modal');
const playAgainBtn = gameModal.querySelector('button');
const scoreText = document.querySelector('.score-text');

let currentWord, correctLetters, wrongGuessCount, wordList;
let victories = 0, defeats = 0;
const maxGuesses = 6;

const fetchWordList = async () => {
    try {
        const response = await fetch('words.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        wordList = await response.json();
        getRandomWord();
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
};

const resetGame = () => {
    correctLetters = new Array(currentWord.length).fill('');
    wrongGuessCount = 0;
    hangmanImage.src = "./src/images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    updateScore();

    wordDisplay.innerHTML = currentWord.split("").map(letter =>
        `<li class="letter">${letter === '-' ? '-' : ''}</li>`
    ).join("");

    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    const { palavra, dica } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = palavra;
    document.querySelector(".hint-text b").innerText = dica;

    resetGame();
}

const gameOver = (isVictory) => {
    if (isVictory) {
        victories++;
    } else {
        defeats++;
    }

    const modalText = isVictory ? `Você descobriu a Palavra: ` : 'A palavra correta é: ';
    gameModal.querySelector("img").src = `./src/images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Parabéns' : 'Derrota!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");

    updateScore();
}

const loadScore = () => {
    const savedVictories = localStorage.getItem('victories');
    const savedDefeats = localStorage.getItem('defeats');

    victories = savedVictories ? parseInt(savedVictories) : 0;
    defeats = savedDefeats ? parseInt(savedDefeats) : 0;

    updateScore();
}

const updateScore = () => {
    scoreText.innerText = `Vitórias: ${victories} | Derrotas: ${defeats}`;

    localStorage.setItem('victories', victories);
    localStorage.setItem('defeats', defeats);
}

for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

const initGame = (button, clickedLetter) => {
    let correctGuess = false;

    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters[index] = letter;
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
                correctGuess = true;
            }
        });
    } else {
        wrongGuessCount++;
        hangmanImage.src = `./src/images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (currentWord.split('').every((letter, index) => letter === correctLetters[index] || letter === '-')) {
        return gameOver(true);
    }
}

const restartBtn = document.getElementById('restart-btn');
const guessBtn = document.getElementById('guess-btn');

restartBtn.addEventListener("click", resetGame);

guessBtn.addEventListener("click", () => {
    const userGuess = prompt("Chute uma palavra:");
    if (userGuess) {
        if (userGuess.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ===
            currentWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()) {
            gameOver(true);
        } else {
            wrongGuessCount = maxGuesses;
            gameOver(false);
        }
    }
});

fetchWordList();

loadScore();

playAgainBtn.addEventListener("click", getRandomWord);
