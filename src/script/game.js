import { randomAnimalName } from './consumeAPI.js';

let animal;
let clickedAnwser = [];

const displayRandomAnimal = async () => {
    animal = await randomAnimalName(); // Sorteia o animal
    if (animal) {
        document.querySelector('.theme-tip').textContent = animal.dica;
        const underscoredWord = animal.palavra.split('').map(char => char === '-' ? '- ' : '_ ').join('');
        document.querySelector('.word-field').textContent = underscoredWord;

        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', (event) => {
                const letter = event.currentTarget.textContent;
                checkLetters(letter, animal.palavra); 
                event.currentTarget.classList.add('clicked');
            });
        });
    }
};

const initializeGameStats = () => {
    if (!localStorage.getItem('gamesWon')) {
        localStorage.setItem('gamesWon', 0);
    }
    if (!localStorage.getItem('gamesLost')) {
        localStorage.setItem('gamesLost', 0);
    }
    updateScoreDisplay();
};

const updateScoreDisplay = () => {
    const wins = localStorage.getItem('gamesWon');
    const losses = localStorage.getItem('gamesLost');
    
    document.querySelectorAll('.wins').forEach(span => {
        span.textContent = wins;
    });
    
    document.querySelectorAll('.defeats').forEach(span => {
        span.textContent = losses;
    });
};

const incrementWins = () => {
    const wins = parseInt(localStorage.getItem('gamesWon'));
    localStorage.setItem('gamesWon', wins + 1);
    updateScoreDisplay(); // Atualiza a exibição após ganhar
};

const incrementLosses = () => {
    const losses = parseInt(localStorage.getItem('gamesLost'));
    localStorage.setItem('gamesLost', losses + 1);
    updateScoreDisplay(); 
};

const ilose = (wordCorrect) => {
    document.querySelector(".life-count").textContent = 0;
    const heroElement = document.querySelector("#hero");
    heroElement.src = "../src/images/nahamDamage.png"; 
    heroElement.classList.add('disappear');
    
    document.querySelectorAll(".key").forEach(key => {
        key.style.pointerEvents = "none"; 
    });
    setTimeout(() => {
        incrementLosses(); 
        gameOverModal.style.display = "block"; 
        document.querySelector(".theCorrectAnimal").textContent = wordCorrect;
    }, 2000); 
};

const iwin = (word, answer) => {
    if (answer === word) {
        document.querySelector('.word-field').textContent = answer; // Mostra a palavra completa
        incrementWins(); // Incrementa vitórias
        showVictoryModal(); // Exibe o modal de vitória
    }
};

const showVictoryModal = () => {
    document.querySelector('.victory-modal').style.display = 'flex';

    document.querySelectorAll('.confetti').forEach(confetti => {
        confetti.style.setProperty('--x-position', Math.random());
        confetti.style.animation = 'fall 2s linear infinite';
    });
};

const checkLetters = (letter, palavra) => {
    let wordArray = document.querySelector('.word-field').textContent.split(' ');
    let found = false;

    for (let i = 0; i < palavra.length; i++) {
        if (palavra[i] === '-') {
            clickedAnwser[i] = '-';
        } else if (palavra[i].toUpperCase() === letter.toUpperCase()) {
            wordArray[i] = letter;
            clickedAnwser[i] = letter;
            found = true;
        }
    }

    // Verifica se o jogador ganhou
        iwin(palavra, clickedAnwser.join('').toLowerCase());
        document.querySelector('.word-field').textContent = wordArray.join(' '); // Atualiza a palavra exibida
   

    if (!found) {
        const lifeElement = document.querySelector(".life-count");
        let life = parseInt(lifeElement.textContent);
        const heroElement = document.querySelector("#hero");

        switch (life) {
            case 1:
                ilose(palavra);
                break;

            default:
                life--; 
                lifeElement.textContent = life; 
                heroElement.src = "../src/images/nahamDamage.png";
                setTimeout(() => {
                    heroElement.src = "https://github.com/JefersonT4v4res/ImersaoDev_Alura/blob/main/_imgs/Naham.png?raw=true";
                }, 300);
                break;
        }
    }
};

document.querySelector(".text-send").addEventListener("click", () => {
    let typedAnswer = document.querySelector(".inp_text").value.toLowerCase();
    let correctWord = animal.palavra.toLowerCase();
    
    if (typedAnswer === "") {
        document.querySelector(".warning").textContent = "Insira um nome primeiro!";
    } else if (typedAnswer === correctWord) {
        document.querySelector('.word-field').textContent = typedAnswer;
        incrementWins();
        showVictoryModal();
        document.querySelector(".text-send").disabled = true;
    } else {
        ilose(correctWord);
        document.querySelector(".text-send").disabled = true;
    }
    
    document.querySelector(".inp_text").value = "";
});


document.getElementById("btn_comecar").addEventListener("click", async () => {
    await displayRandomAnimal();
    initializeGameStats();
    document.querySelector(".cover-gamer").style.display = 'none';
    document.querySelector(".container-game").style.display = 'flex'; 
});
