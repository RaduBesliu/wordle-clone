// Global vars
const gameBoard = document.querySelector(".main__board");
const gameBoardRows = document.getElementsByClassName("main__board__row");
const gameBoardItems = document.getElementsByClassName(
  "main__board__row__item"
);

let currentCharacterPosition = 0;
let currentRowPosition = 0;

const keyboard = document.querySelector(".main__keyboard");
const keyboardItems = document.querySelectorAll(".main__keyboard__row__item");

// returns random word from words_list.txt
async function getRandomWord() {
  return await fetch("words_list.txt")
    .then((response) => response.text())
    .then((data) => {
      data = data.split("\r\n").slice(0, -1);
      return (data = data[Math.floor(Math.random() * data.length)]);
    });
}

// returns all random words from words_list.txt
async function getWordList() {
  return await fetch("words_list.txt")
    .then((response) => response.text())
    .then((data) => (data = data.split("\r\n").slice(0, -1)));
}

// async function used to get random word from file async.
(async () => {
  // Reuse getwordlist in getrandomword
  const randomWord = await getRandomWord();
  const wordList = await getWordList();
  console.log(randomWord);
  console.log(wordList);

  // check if key pressed is a letter, backspace or enter
  const checkPressedKey = (pressedKey) => {
    return (
      (pressedKey.length === 1 &&
        pressedKey.charCodeAt(0) >= 97 &&
        pressedKey.charCodeAt(0) <= 122) ||
      pressedKey === "backspace" ||
      pressedKey === "enter"
    );
  };

  // process game board based on key pressed
  const processPressedKey = (pressedKey) => {
    if (pressedKey === "enter") {
      if (currentCharacterPosition >= 5) {
        // TODO verify if word is in wordlist
        currentCharacterPosition = 0;
        currentRowPosition++;
      } else {
        console.log("Not enough letters.");
        if (
          !gameBoardRows[currentRowPosition].classList.contains(
            "main__keyboard__row--shake"
          )
        ) {
          gameBoardRows[currentRowPosition].classList.toggle(
            "main__keyboard__row--shake"
          );
          setTimeout(() => {
            gameBoardRows[currentRowPosition].classList.toggle(
              "main__keyboard__row--shake"
            );
          }, 750);
        }
      }
    } else if (pressedKey === "backspace") {
      if (currentCharacterPosition !== 0 && currentRowPosition < 6) {
        currentCharacterPosition--;
        const selectedItem =
          gameBoardItems[5 * currentRowPosition + currentCharacterPosition];
        selectedItem.textContent = "";
        selectedItem.classList.toggle("main__board__row__item__filled");
      }
    } else {
      if (currentCharacterPosition < 5 && currentRowPosition < 6) {
        // row * 5 + row_index to get current element from array
        const selectedItem =
          gameBoardItems[5 * currentRowPosition + currentCharacterPosition];
        selectedItem.textContent = pressedKey;
        selectedItem.classList.toggle("main__board__row__item__filled");
        currentCharacterPosition++;
      }
    }
  };

  document.addEventListener("keydown", (e) => {
    const pressedKey = e.key.toLowerCase();
    if (checkPressedKey(pressedKey)) {
      processPressedKey(pressedKey);
    }
  });

  keyboardItems.forEach((keyboardKey) => {
    keyboardKey.addEventListener("click", (e) => {
      if (checkPressedKey(keyboardKey.dataset.key)) {
        processPressedKey(keyboardKey.dataset.key);
      }
    });
  });
})();
