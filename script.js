// Global vars
const gameBoard = document.querySelector(".main__board");
const gameBoardRows = document.getElementsByClassName("main__board__row");
const gameBoardItems = document.getElementsByClassName(
  "main__board__row__item"
);

const alertsContainer = document.querySelector(".alerts");

let currentCharacterPosition = 0;
let currentRowPosition = 0;
const keyboard = document.querySelector(".main__keyboard");
const keyboardItems = document.querySelectorAll(".main__keyboard__row__item");

let randomWord = "";
let wordList = [];

// Returns a Promise that resolves after "ms" Milliseconds
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// Alert div
const showAlert = async (text) => {
  const alert = document.createElement("div");
  if (!alertsContainer.getElementsByTagName("div").length) {
    alert.textContent = text;
    alertsContainer.append(alert);
    setTimeout(async () => {
      alertsContainer.removeChild(alert);
    }, 2000);
  }
};

// returns random word from words_list.txt
async function getRandomWordAndList() {
  const data = await getWordList();
  return [data[Math.floor(Math.random() * data.length)], data];
}

// returns all random words from words_list.txt
async function getWordList() {
  return await fetch("./words-list.txt")
    .then((response) => response.text())
    .then((data) => {
      data = data.split("\n");
      data = data.map((str) => str.trim());
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

// async function used to get random word from file async.
(async () => {
  [randomWord, wordList] = await getRandomWordAndList();
  // console.log(wordList);

  // returns a list of all indexes of an item in an array
  const indexOfAll = (arr, item) => {
    return arr.reduce(
      (acc, val, index) => (item === val ? [...acc, index] : acc),
      []
    );
  };

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

  // check if there are enough letters and if the word
  // is in the list
  const checkWord = (totalLetters, currentRow) => {
    if (totalLetters >= 5) {
      let wordString = "";
      for (let i = 0; i < 5; ++i) {
        wordString +=
          gameBoardItems[currentRow * 5 + i].dataset.key.toUpperCase();
      }
      if (wordList.includes(wordString)) {
        return [1, wordString]; // word is in list
      }
      return [0, ""]; // word is not in list
    }
    return [-1, ""]; // not enough letters
  };

  // animate and check letters
  const animateAndCheckLetters = (row, position, letter, goodLetters) => {
    setTimeout(() => {
      gameBoardItems[row * 5 + position].style.border = "none";
      const positionFound = indexOfAll(Array.from(randomWord), letter);
      // console.log(goodLetters);
      // if the letter is already good somewhere else, dont make it yellow
      if (
        positionFound.length &&
        !positionFound.includes(position) &&
        !goodLetters.includes(letter)
      ) {
        gameBoardItems[row * 5 + position].style.backgroundColor =
          document.getElementsByClassName(
            `letter-${letter.toLowerCase()}`
          )[0].style.backgroundColor = "var(--clr-yellow)";
      } else if (
        positionFound.includes(position) ||
        randomWord[position] === letter
      ) {
        gameBoardItems[row * 5 + position].style.backgroundColor =
          document.getElementsByClassName(
            `letter-${letter.toLowerCase()}`
          )[0].style.backgroundColor = "var(--clr-green)";
        if (!goodLetters.includes(letter)) goodLetters.push(letter);
      } else {
        gameBoardItems[row * 5 + position].style.backgroundColor =
          document.getElementsByClassName(
            `letter-${letter.toLowerCase()}`
          )[0].style.backgroundColor = "var(--clr-separator-dark)";
      }
    }, 250);
    setTimeout((j) => {
      gameBoardItems[row * 5 + position].classList.toggle(
        "main__board__row__item--flip"
      );
      gameBoardItems[row * 5 + position].style.animation = "none";
    }, 1000);
  };

  // process game board based on key pressed
  const processPressedKey = async (pressedKey) => {
    if (currentRowPosition >= 6) return;
    if (pressedKey === "enter") {
      const [verificationReturn, word] = checkWord(
        currentCharacterPosition,
        currentRowPosition
      );
      if (verificationReturn === 1) {
        let goodLetters = [];
        for (let i = 0; i < 5; ++i) {
          gameBoardItems[currentRowPosition * 5 + i].classList.toggle(
            "main__board__row__item--flip"
          );
          animateAndCheckLetters(currentRowPosition, i, word[i], goodLetters);
          await timer(300);
        }
        if (word === randomWord) {
          await timer(500);
          showAlert("Good job");
          currentRowPosition = 6;
          currentCharacterPosition = 0;
          return;
        }
        currentCharacterPosition = 0;
        currentRowPosition++;
        if (currentRowPosition >= 6) {
          await timer(500);
          showAlert(`Unlucky. Word : ${randomWord}`);
        }
      } else {
        if (verificationReturn === 0) {
          showAlert("Not in word list");
        } else {
          showAlert("Not enough letters");
        }
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
        selectedItem.classList.toggle("main__board__row__item--filled");
        selectedItem.dataset.key = "";
      }
    } else {
      if (currentCharacterPosition < 5 && currentRowPosition < 6) {
        // row * 5 + row_index to get current element from array
        const selectedItem =
          gameBoardItems[5 * currentRowPosition + currentCharacterPosition];
        selectedItem.textContent = pressedKey;
        selectedItem.classList.toggle("main__board__row__item--filled");
        selectedItem.dataset.key = pressedKey;
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
