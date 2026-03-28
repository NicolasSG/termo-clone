let rowIndex = 1;
let pickWord = "";
let globalWordList = [];
let activeRow = null;

await initGame();

async function initGame() {
  try {
    // 1. Carrega os dados
    const data = await fetchJSONData("./words.json");
    globalWordList = data;

    // 2. Sorteia a palavra
    pickWord = await randomWord();
    console.log("Palavra sorteada:", pickWord);

    // 3. Define a linha inicial
    activeRow = document.querySelector(`.grid__${rowIndex}_row`);

    // 4. Ativa os controles
    setupEventListeners();
  } catch (error) {
    console.error("Falha ao iniciar o jogo:", error);
  }
}

function setupEventListeners() {
  const keyboard = document.querySelector(".keyboard");

  keyboard.addEventListener("click", (e) => {
    const buttonClicked = e.target;
    if (buttonClicked.classList.contains("kbd__backspace")) {
      removeLetter();
    } else if (buttonClicked.classList.contains("kbd__enter")) {
      handleEnterAction();
    } else {
      console.log("cade a letra");
      addLetter(buttonClicked.textContent);
    }
  });
}

async function fetchJSONData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    globalWordList = data;
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

async function randomWord() {
  const wordList = await fetchJSONData("./words.json"); // Espera a lista
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const word = wordList[randomIndex];

  return word;
}

function findEmptySquare() {
  // Busca apenas dentro da linha ATIVA
  for (let i = 1; i <= 5; i++) {
    const square = activeRow.querySelector(`.grid_letter_${i}`);
    if (square.textContent === "") return i;
  }
  return 0; // Linha cheia
}

function addLetter(char) {
  const emptySquareIndex = findEmptySquare();
  if (emptySquareIndex !== 0) {
    const square = activeRow.querySelector(`.grid_letter_${emptySquareIndex}`);
    square.textContent = char;
  }
}

function removeLetter() {
  const emptySquareIndex = findEmptySquare();
  // Se o próximo vazio é o 0, significa que a linha está cheia, então apagamos o 5
  // Se não, apagamos o anterior ao vazio
  const indexToDelete = emptySquareIndex === 0 ? 5 : emptySquareIndex - 1;

  if (indexToDelete > 0) {
    const square = activeRow.querySelector(`.grid_letter_${indexToDelete}`);
    square.textContent = "";
  }
}

function handleEnterAction() {
  let typedWord = "";
  const squares = activeRow.querySelectorAll(".grid_letter");

  squares.forEach((s) => (typedWord += s.textContent));

  if (typedWord.length < 5) {
    shakeAnimation(activeRow);
    return;
  }

  if (validateWord(typedWord)) {
    const colors = compareWords(pickWord, typedWord);
    keyboardPainter(typedWord, colors);

    // Pinta os quadrados
    squares.forEach((sq, i) => {
      sq.classList.add(`grid__letter-color_${colors[i]}`);
    });

    // --- ATUALIZAÇÃO DE ESTADO ---
    activeRow.classList.remove("grid__row_active");
    rowIndex++;
    activeRow = document.querySelector(`.grid__${rowIndex}_row`);
    activeRow.classList.add("grid__row_active");

    if (!activeRow) {
      console.log("Fim de jogo ou limite de linhas atingido");
    }
  } else {
    shakeAnimation(activeRow);
  }
}

function compareWords(secret, guess) {
  const size = secret.length;
  const result = new Array(size).fill("gray");
  const secretLetterCount = {};

  // palavra secreta
  for (let letter of secret) {
    secretLetterCount[letter] = (secretLetterCount[letter] || 0) + 1;
  }

  // achar os verdes
  for (let i = 0; i < size; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "green";
      secretLetterCount[guess[i]]--; // Tira do estoque
    }
  }

  // achar os amarelos
  for (let i = 0; i < size; i++) {
    if (result[i] !== "green") {
      const letter = guess[i];

      if (secretLetterCount[letter] > 0) {
        result[i] = "yellow";
        secretLetterCount[letter]--; // Tira do estoque para a próxima não pegar
      }
    }
  }

  return result;
}

function validateWord(word) {
  const valuesArray = Object.values(globalWordList);
  if (valuesArray.some((user) => user === word)) {
    return true;
  } else {
    return false;
  }
}

function shakeAnimation(activeRow) {
  activeRow.classList.add("shake");
  const animation = document.querySelector(".shake");
  animation.addEventListener("animationend", () => {
    activeRow.classList.remove("shake");
  });
}

function keyboardPainter(typedWord, colors) {
  typedWord = typedWord.toUpperCase();
  for (let letter of typedWord) {
    const letterToPaint = document.querySelector(`.kbd__${letter}`);
    letterToPaint.classList.add(`kbd__color_${colors[0]}`);
    colors = colors.slice(1);
  }
}
