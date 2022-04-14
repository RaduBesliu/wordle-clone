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
  } else if (pressedKey.length === 1) {
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
