let rowIndex = 1;
let pickWord = "";
let globalWordList = [];
let activeRow = null;
let activeSquare = document.querySelector(".grid__letter_active");

await initGame();

async function initGame() {
  try {
    // 1. Carrega os dados
    const data = await fetchJSONData("./words.json");
    globalWordList = data;

    // 2. Sorteia a palavra
    pickWord = await randomWord();

    // 3. Define a linha inicial
    activeRow = document.querySelector(`.grid__${rowIndex}_row`);
    activeRow.classList.add("grid__row_active");
    activeRow
      .querySelector(".grid_letter_1")
      .classList.add("grid__letter_active");

    // 4. Ativa os controles
    setupEventListeners();
  } catch (error) {
    console.error("Falha ao iniciar o jogo:", error);
  }
}

function setupEventListeners() {
  const keyboard = document.querySelector(".keyboard");
  const hideMenuButton = document.querySelector(".header__hide");
  const gridContainer = document.querySelector(".main__grid");

  keyboard.addEventListener("click", (e) => {
    const buttonClicked = e.target;
    if (buttonClicked.classList.contains("kbd__backspace")) {
      removeLetter();
    } else if (buttonClicked.classList.contains("kbd__enter")) {
      handleEnterAction();
    } else {
      addLetter(buttonClicked.textContent);
    }
  });

  hideMenuButton.addEventListener("click", (e) => {
    hideAnimation();
  });

  gridContainer.addEventListener("click", (e) => {
    // Verifica se o que foi clicado é um quadrado da linha ATIVA
    if (
      e.target.classList.contains("grid_letter") &&
      e.target.parentElement === activeRow
    ) {
      changeActiveSquare(e);
    }
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (key === "Enter") {
      handleEnterAction();
    } else if (key === "Backspace") {
      removeLetter();
    } else if (key.length === 1 && isLetter(key)) {
      addLetter(key.toUpperCase());
    }
  });
}

function hideAnimation() {
  const headerGames = document.querySelector(".header__nav_games");
  const headerMenus = document.querySelector(".header__nav_menus");
  const hideButton = document.querySelector(".header__hide");
  headerGames.classList.toggle("open");
  headerMenus.classList.toggle("open");
  hideButton.classList.toggle("rotate");
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
  const wordList = await fetchJSONData("./words.json");
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const word = wordList[randomIndex];
  console.log(word);
  return word;
}

function changeActiveSquare(e) {
  const clickedSquare = e.target;
  for (let i = 1; i <= 5; i++) {
    const square = activeRow.querySelector(`.grid_letter_${i}`);
    square.classList.remove("grid__letter_active");
  }
  clickedSquare.classList.add("grid__letter_active");
  return clickedSquare;
}

function findActiveSquare() {
  for (let i = 1; i <= 5; i++) {
    const square = activeRow.querySelector(`.grid_letter_${i}`);
    if (square.classList.contains("grid__letter_active")) {
      return i;
    }
  }
  return null;
}

function addLetter(char) {
  if (char.length < 2) {
    const currentIndex = findActiveSquare();

    if (currentIndex !== null) {
      const currentSquare = activeRow.querySelector(
        `.grid_letter_${currentIndex}`,
      );
      currentSquare.textContent = char;

      if (currentIndex < 5) {
        currentSquare.classList.remove("grid__letter_active");
        const nextSquare = activeRow.querySelector(
          `.grid_letter_${currentIndex + 1}`,
        );
        nextSquare.classList.add("grid__letter_active");
      }
    }
  }
}

function removeLetter() {
  const currentIndex = findActiveSquare();

  if (currentIndex !== null) {
    const currentSquare = activeRow.querySelector(
      `.grid_letter_${currentIndex}`,
    );

    // Tem uma letra? Apaga a letra e mantém o foco nele.
    if (currentSquare.textContent !== "") {
      currentSquare.textContent = "";
    }
    // O quadrado atual está vazio? Volta para o anterior e apaga.
    else if (currentIndex > 1) {
      currentSquare.classList.remove("grid__letter_active");

      const prevIndex = currentIndex - 1;
      const prevSquare = activeRow.querySelector(`.grid_letter_${prevIndex}`);

      prevSquare.classList.add("grid__letter_active");
      prevSquare.textContent = "";
    }
  }
}

async function handleEnterAction() {
  let typedWord = "";
  const squares = activeRow.querySelectorAll(".grid_letter");

  // 1. Captura a palavra e garante que está em minúscula para o JSON
  squares.forEach((s) => (typedWord += s.textContent.trim().toUpperCase()));

  if (typedWord.length < 5) {
    shakeAnimation(activeRow);
    return;
  }

  const isValid = validateWord(typedWord);

  if (isValid) {
    const colors = compareWords(
      pickWord.toUpperCase(),
      typedWord.toUpperCase(),
    );

    // Pinta o teclado e os quadrados
    keyboardPainter(typedWord, colors);
    await revealSequence(squares, colors);

    // Troca de Linha
    activeRow.classList.remove("grid__row_active");
    squares.forEach((sq) => sq.classList.remove("grid__letter_active"));

    rowIndex++;
    const nextRow = document.querySelector(`.grid__${rowIndex}_row`);

    if (nextRow) {
      activeRow = nextRow;
      activeRow.classList.add("grid__row_active");
      activeRow
        .querySelector(".grid_letter_1")
        .classList.add("grid__letter_active");
    }
  } else {
    shakeAnimation(activeRow);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function revealSequence(squares, colors) {
  for (let i = 0; i < squares.length; i++) {
    squares[i].classList.add(`grid__letter-color_${colors[i]}`);
    squares[i].classList.add("letter__transition");
    // Efeito cascata
    await sleep(200);
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

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
