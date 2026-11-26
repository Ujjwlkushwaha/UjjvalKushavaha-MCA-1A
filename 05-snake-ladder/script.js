// start square -> end square
const ladders = { 2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98, 87: 94 };
const snakes  = { 16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 92: 73, 95: 75, 99: 54 };

const boardDiv = document.getElementById("board");
const diceBox = document.getElementById("diceBox");
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const turnText = document.getElementById("turnText");
const message = document.getElementById("message");

let positions = [0, 0];   // 0 means "not on the board yet"
let current = 0;          // 0 = Player 1 (red), 1 = Player 2 (blue)
let gameOver = false;

// Build the 10x10 board. Numbering starts at the bottom-left and
// zig-zags: bottom row goes left->right, next row right->left, and so on.
function createBoard() {
  boardDiv.innerHTML = "";

  for (let row = 9; row >= 0; row--) {        // top row first on screen
    for (let col = 0; col < 10; col++) {
      let number;
      if (row % 2 === 0) {
        number = row * 10 + col + 1;          // left to right
      } else {
        number = row * 10 + (10 - col);       // right to left
      }

      const cell = document.createElement("div");
      cell.id = "cell-" + number;
      cell.className = "cell " + (number % 2 === 0 ? "even" : "odd");
      cell.innerHTML = number;

      if (ladders[number]) {
        cell.classList.add("ladder");
        cell.innerHTML += '<span class="note">🪜 to ' + ladders[number] + "</span>";
      }
      if (snakes[number]) {
        cell.classList.add("snake");
        cell.innerHTML += '<span class="note">🐍 to ' + snakes[number] + "</span>";
      }

      boardDiv.appendChild(cell);
    }
  }
}

// Remove old tokens and draw them at the current positions
function drawTokens() {
  document.querySelectorAll(".token").forEach(function (t) { t.remove(); });

  for (let i = 0; i < 2; i++) {
    if (positions[i] === 0) continue;
    const token = document.createElement("div");
    token.className = "token p" + (i + 1);
    document.getElementById("cell-" + positions[i]).appendChild(token);
  }
}

function showTurn() {
  turnText.textContent = "Turn: Player " + (current + 1) + (current === 0 ? " (Red)" : " (Blue)");
}

function rollDice() {
  if (gameOver) return;

  const dice = Math.floor(Math.random() * 6) + 1;
  diceBox.textContent = dice;
  let text = "Player " + (current + 1) + " rolled " + dice + ". ";

  let newPos = positions[current] + dice;

  if (newPos > 100) {
    text += "Need exact number to reach 100.";
  } else {
    positions[current] = newPos;

    if (ladders[newPos]) {
      text += "Ladder! Climbed to " + ladders[newPos] + ".";
      positions[current] = ladders[newPos];
    } else if (snakes[newPos]) {
      text += "Snake! Slid down to " + snakes[newPos] + ".";
      positions[current] = snakes[newPos];
    }
  }

  drawTokens();

  if (positions[current] === 100) {
    message.textContent = "Player " + (current + 1) + " wins! 🎉";
    gameOver = true;
    rollBtn.disabled = true;
    return;
  }

  message.textContent = text;

  // a 6 gives another turn, otherwise pass to the other player
  if (dice !== 6) {
    current = 1 - current;
  } else {
    message.textContent += " Rolled a 6, roll again!";
  }
  showTurn();
}

function newGame() {
  positions = [0, 0];
  current = 0;
  gameOver = false;
  rollBtn.disabled = false;
  diceBox.textContent = "-";
  message.textContent = "";
  createBoard();
  drawTokens();
  showTurn();
}

rollBtn.addEventListener("click", rollDice);
resetBtn.addEventListener("click", newGame);

newGame();
