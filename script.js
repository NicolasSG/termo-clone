let rowIndex = 1;
let pickWord = "";
let pickWordDueto1 = "";
let pickWordDueto2 = "";
let globalWordList = [];
let activeRow = null;
let activeRow2 = [];
let activeSquare = document.querySelector(".grid__letter_active");
let gameType = "termo";

await initGame();

async function initGame() {
  try {
    // 1. Carrega os dados
    const data = await fetchJSONData("./words.json");
    globalWordList = data;

    // 2. Sorteia a palavra
    pickWord = await randomWord();
    pickWordDueto1 = await randomWord();
    pickWordDueto2 = await randomWord();

    // 3 Define a linha inicial - termo
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
  const duetoButton = document.querySelector(".header__nav_game_dueto");

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

  termoButton.addEventListener("click", () => {
    resetGameState();
    gameType = "dueto";
    const container = document.querySelector(".main__grid");
    const template = document.querySelector("#dueto__template");
    container.innerHTML = "";
    container.appendChild(template.content.cloneNode(true));

    // Define as linhas iniciais - dueto
    activeRow2.push(
      document.querySelector(`.main__grid_dueto_1 > .grid__${rowIndex}_row`),
    );
    activeRow2.push(
      document.querySelector(`.main__grid_dueto_2 > .grid__${rowIndex}_row`),
    );
  });

  duetoButton.addEventListener("click", () => {
    resetGameState();
    gameType = "dueto";
    const container = document.querySelector(".main__grid");
    const template = document.querySelector("#dueto__template");
    container.innerHTML = "";
    container.appendChild(template.content.cloneNode(true));

    // Define as linhas iniciais - dueto
    activeRow2.push(
      document.querySelector(`.main__grid_dueto_1 > .grid__${rowIndex}_row`),
    );
    activeRow2.push(
      document.querySelector(`.main__grid_dueto_2 > .grid__${rowIndex}_row`),
    );
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
  const grid = document.querySelector(".main__grid");
  if (gameType === "termo") {
    for (let i = 1; i <= 5; i++) {
      const square = activeRow.querySelector(`.grid_letter_${i}`);
      if (square.classList.contains("grid__letter_active")) {
        return i;
      }
    }
  } else if (gameType === "dueto") {
    const indexes = [];
    for (let i = 1; i <= 5; i++) {
      const square1 = activeRow2[0].querySelector(`.grid_letter_${i}`);
      if (square1.classList.contains("grid__letter_active")) {
        indexes[0] = i;
      }

      const square2 = activeRow2[1].querySelector(`.grid_letter_${i}`);
      if (square2.classList.contains("grid__letter_active")) {
        indexes[1] = i;
      }
    }
    return indexes;
    console.log(indexes[0]);
  }

  return null;
}

function addLetter(char) {
  if (char.length < 2) {
    const currentIndex = findActiveSquare();

    if (currentIndex[1] === undefined) {
      // se tiver undefined no segundo index, quer dizer que é "termo"
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
    } else if (currentIndex[2] === undefined) {
      // se tiver undefined no terceiro index, quer dizer que é "dueto"

      const currentSquare1 = activeRow2[0].querySelector(
        `.grid_letter_${currentIndex[0]}`,
      );
      currentSquare1.textContent = char; // preenche primeiro grid

      const currentSquare2 = activeRow2[1].querySelector(
        `.grid_letter_${currentIndex[1]}`,
      );
      currentSquare2.textContent = char; // preenche segundo grid

      if (currentIndex[0] < 5) {
        currentSquare1.classList.remove("grid__letter_active");
        const nextSquare1 = activeRow2[0].querySelector(
          `.grid_letter_${currentIndex[0] + 1}`,
        );
        nextSquare1.classList.add("grid__letter_active");

        currentSquare2.classList.remove("grid__letter_active");
        const nextSquare2 = activeRow2[1].querySelector(
          `.grid_letter_${currentIndex[1] + 1}`,
        );
        nextSquare2.classList.add("grid__letter_active");
      }
    }
  }
}

function removeLetter() {
  const currentIndex = findActiveSquare();
  if (currentIndex[1] === undefined) {
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
  } else if (currentIndex[2] === undefined) {
    const currentSquare1 = activeRow2[0].querySelector(
      `.grid_letter_${currentIndex[0]}`,
    );

    const currentSquare2 = activeRow2[1].querySelector(
      `.grid_letter_${currentIndex[1]}`,
    );

    // Tem uma letra? Apaga a letra e mantém o foco nele.
    if (currentSquare1.textContent !== "") {
      currentSquare1.textContent = "";
    }
    if (currentSquare2.textContent !== "") {
      currentSquare2.textContent = "";
    }

    // O quadrado atual está vazio? Volta para o anterior e apaga.
    else if (currentIndex[0] > 1) {
      currentSquare1.classList.remove("grid__letter_active");
      currentSquare2.classList.remove("grid__letter_active");

      const prevIndex = currentIndex[0] - 1;
      const prevSquare1 = activeRow2[0].querySelector(
        `.grid_letter_${prevIndex}`,
      );
      const prevSquare2 = activeRow2[1].querySelector(
        `.grid_letter_${prevIndex}`,
      );

      prevSquare1.classList.add("grid__letter_active");
      prevSquare1.textContent = "";
      prevSquare2.classList.add("grid__letter_active");
      prevSquare2.textContent = "";
    }
  }
}

async function handleEnterAction() {
  let typedWord = "";
  if (gameType === "termo") {
    //mudar para termo
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
  } else {
    const squares1 = activeRow2[0].querySelectorAll(".grid_letter");
    const squares2 = activeRow2[1].querySelectorAll(".grid_letter");

    // 1. Captura a palavra e garante que está em minúscula para o JSON
    squares1.forEach((s) => (typedWord += s.textContent.trim().toUpperCase()));

    if (typedWord.length < 5) {
      shakeAnimation(activeRow2[0]);
      shakeAnimation(activeRow2[1]);
      return;
    }

    const isValid = validateWord(typedWord);
    let colors = "";

    if (isValid) {
      if (gameType === "termo") {
        colors = compareWords(pickWord.toUpperCase(), typedWord.toUpperCase());
      } else {
        let pickWords = [pickWordDueto1, pickWordDueto2];

        colors = compareWords(pickWords, typedWord.toUpperCase());
      }

      // Pinta o teclado e os quadrados
      keyboardPainter(typedWord, colors);
      let squaresDueto = [squares1, squares2];
      await revealSequence(squaresDueto, colors);

      // Troca de Linha
      activeRow2[0].classList.remove("grid__row_active");
      activeRow2[1].classList.remove("grid__row_active");
      squares1.forEach((sq) => sq.classList.remove("grid__letter_active"));
      squares2.forEach((sq) => sq.classList.remove("grid__letter_active"));

      rowIndex++;
      const nextRow1 = document.querySelector(
        `.main__grid_dueto_1 > .grid__${rowIndex}_row`,
      );
      const nextRow2 = document.querySelector(
        `.main__grid_dueto_2 > .grid__${rowIndex}_row`,
      );

      if (nextRow1) {
        activeRow2[0] = nextRow1;
        activeRow2[0].classList.add("grid__row_active");
        activeRow2[0]
          .querySelector(".grid_letter_1")
          .classList.add("grid__letter_active");

        activeRow2[1] = nextRow2;
        activeRow2[1].classList.add("grid__row_active");
        activeRow2[1]
          .querySelector(".grid_letter_1")
          .classList.add("grid__letter_active");
      }
    } else {
      shakeAnimation(activeRow2[0]);
      shakeAnimation(activeRow2[1]);
    }
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function revealSequence(squares, colors) {
  if (gameType === "termo") {
    for (let i = 0; i < squares.length; i++) {
      squares[i].classList.add(`grid__letter-color_${colors[i]}`);
      squares[i].classList.add("letter__transition");
      // Efeito cascata
      await sleep(200);
    }
  } else {
    for (let i = 0; i < squares[0].length; i++) {
      squares[0][i].classList.add(`grid__letter-color_${colors[0][i]}`);
      squares[0][i].classList.add("letter__transition");

      squares[1][i].classList.add(`grid__letter-color_${colors[1][i]}`);
      squares[1][i].classList.add("letter__transition");
      // Efeito cascata
      await sleep(200);
    }
  }
}

function compareWords(secret, guess) {
  if (gameType === "termo") {
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
  } else {
    const size1 = secret[0].length;
    const size2 = secret[1].length;
    const secret1 = secret[0];
    const secret2 = secret[1];
    const result1 = new Array(size1).fill("gray");
    const result2 = new Array(size2).fill("gray");
    const secretLetterCount1 = {};
    const secretLetterCount2 = {};

    // palavra secreta
    for (let letter of secret1) {
      secretLetterCount1[letter] = (secretLetterCount1[letter] || 0) + 1;
    }

    for (let letter of secret2) {
      secretLetterCount2[letter] = (secretLetterCount2[letter] || 0) + 1;
    }

    // achar os verdes
    for (let i = 0; i < size1; i++) {
      if (guess[i] === secret1[i]) {
        result1[i] = "green";
        secretLetterCount1[guess[i]]--; // Tira do estoque
      }
    }

    for (let i = 0; i < size1; i++) {
      if (guess[i] === secret2[i]) {
        result2[i] = "green";
        secretLetterCount2[guess[i]]--; // Tira do estoque
      }
    }

    // achar os amarelos
    for (let i = 0; i < size1; i++) {
      if (result1[i] !== "green") {
        const letter = guess[i];

        if (secretLetterCount1[letter] > 0) {
          result1[i] = "yellow";
          secretLetterCount1[letter]--; // Tira do estoque para a próxima não pegar
        }
      }
    }

    for (let i = 0; i < size2; i++) {
      if (result2[i] !== "green") {
        const letter = guess[i];

        if (secretLetterCount2[letter] > 0) {
          result2[i] = "yellow";
          secretLetterCount2[letter]--; // Tira do estoque para a próxima não pegar
        }
      }
    }
    const results = [result1, result2];

    return results;
  }
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
  if (gameType === "termo") {
    activeRow.classList.add("shake");
    const animation = document.querySelector(".shake");
    animation.addEventListener("animationend", () => {
      activeRow.classList.remove("shake");
    });
  } else {
    activeRow2[0].classList.add("shake");
    activeRow2[1].classList.add("shake");
    const animation = document.querySelector(".shake");
    animation.addEventListener("animationend", () => {
      activeRow2[0].classList.remove("shake");
      activeRow2[1].classList.remove("shake");
    });
  }
}

function keyboardPainter(typedWord, colors) {
  let colors1 = colors[0];

  let colors2 = colors[1];
  typedWord = typedWord.toUpperCase();
  if (gameType === "termo") {
    for (let letter of typedWord) {
      const letterToPaint = document.querySelector(`.kbd__${letter}`);
      letterToPaint.classList.add(`kbd__color_${colors[0]}`);
      colors = colors.slice(1);
    }
  } else {
    for (let letter of typedWord) {
      const letterToPaint = document.querySelector(`.kbd__${letter}`);
      letterToPaint.classList.add(`kbd__color_${colors1[0]}`);
      colors1 = colors1.slice(1);

      letterToPaint.classList.add(`kbd__color_${colors2[0]}`);
      colors2 = colors2.slice(1);
    }
  }
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function resetGameState() {
  rowIndex = 1;
  activeRow = null;
  activeRow2 = [];

  const allKeys = document.querySelectorAll(".kbd__letter");
  allKeys.forEach((key) => {
    key.classList.remove(
      "kbd__color_green",
      "kbd__color_yellow",
      "kbd__color_gray",
      "kbd__color_undefined", // Caso alguma cor fique como undefined
    );
  });
}
