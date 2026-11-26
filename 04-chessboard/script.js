// Everything (elements + styles) is created with JavaScript.

const SIZE = 8;          // 8 x 8 board
const SQUARE = 60;       // each square is 60px

// Starting position, row by row (top = black side)
const startPosition = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

let selectedSquare = null;   // the square the user clicked first

// ----- page styling -----
document.body.style.margin = "0";
document.body.style.height = "100vh";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.backgroundColor = "#2c2c2c";
document.body.style.fontFamily = "Arial, sans-serif";

// ----- heading -----
const heading = document.createElement("h1");
heading.textContent = "Chessboard";
heading.style.color = "white";
document.body.appendChild(heading);

// ----- board container -----
const board = document.createElement("div");
board.style.display = "grid";
board.style.gridTemplateColumns = "repeat(" + SIZE + ", " + SQUARE + "px)";
board.style.gridTemplateRows = "repeat(" + SIZE + ", " + SQUARE + "px)";
board.style.border = "6px solid #8b5a2b";
document.body.appendChild(board);

// ----- build the squares -----
for (let row = 0; row < SIZE; row++) {
  for (let col = 0; col < SIZE; col++) {
    const square = document.createElement("div");

    // light and dark squares alternate: (row + col) even => light
    const isLight = (row + col) % 2 === 0;
    square.dataset.color = isLight ? "#f0d9b5" : "#b58863";

    square.style.backgroundColor = square.dataset.color;
    square.style.display = "flex";
    square.style.justifyContent = "center";
    square.style.alignItems = "center";
    square.style.fontSize = "40px";
    square.style.cursor = "pointer";
    square.style.userSelect = "none";
    square.textContent = startPosition[row][col];

    square.addEventListener("click", function () {
      handleClick(square);
    });

    board.appendChild(square);
  }
}

// ----- click logic: 1st click selects a piece, 2nd click moves it -----
function handleClick(square) {
  // nothing selected yet -> select this square if it has a piece
  if (selectedSquare === null) {
    if (square.textContent === "") return;
    selectedSquare = square;
    square.style.backgroundColor = "#f6f669";   // highlight
    return;
  }

  // clicking the same square again -> deselect
  if (selectedSquare === square) {
    square.style.backgroundColor = square.dataset.color;
    selectedSquare = null;
    return;
  }

  // otherwise move the piece (chess rules are not checked)
  square.textContent = selectedSquare.textContent;
  selectedSquare.textContent = "";
  selectedSquare.style.backgroundColor = selectedSquare.dataset.color;
  selectedSquare = null;
}
