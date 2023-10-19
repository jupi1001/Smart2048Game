let squares = [];
const width = 4;
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const resultDisplay = document.getElementById("result");

  //create the playing board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      let square = document.createElement("div");
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }
  createBoard();

  //generate a new number
  function generate() {
    randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].innerHTML == 0) {
      squares[randomNumber].innerHTML = 2;
      checkForGameOver();
    } else generate();
  }

  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML;
        let totalTwo = squares[i + 1].innerHTML;
        let totalThree = squares[i + 2].innerHTML;
        let totalFour = squares[i + 3].innerHTML;
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = zeros.concat(filteredRow);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML;
        let totalTwo = squares[i + 1].innerHTML;
        let totalThree = squares[i + 2].innerHTML;
        let totalFour = squares[i + 3].innerHTML;
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = filteredRow.concat(zeros);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + width].innerHTML;
      let totalThree = squares[i + width * 2].innerHTML;
      let totalFour = squares[i + width * 3].innerHTML;
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
  }

  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + width].innerHTML;
      let totalThree = squares[i + width * 2].innerHTML;
      let totalFour = squares[i + width * 3].innerHTML;
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
  }

  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if (squares[i].innerHTML === squares[i + 1].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + 1].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + width].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  //assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      keyLeft();
    } else if (e.keyCode === 38) {
      keyUp();
    } else if (e.keyCode === 39) {
      keyRight();
    } else if (e.keyCode === 40) {
      keyDown();
    }
  }
  document.addEventListener("keyup", control);

  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generate();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generate();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generate();
  }

  //check for the number 2048 in the squares to win
  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = "You WIN";
        document.removeEventListener("keyup", control);
        setTimeout(() => clear(), 3000);
      }
    }
  }

  //check if there are no zeros on the board to lose
  function checkForGameOver() {
    let zeros = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++;
      }
    }
    if (zeros === 0) {
      resultDisplay.innerHTML = "You LOSE";
      document.removeEventListener("keyup", control);
      setTimeout(() => clear(), 3000);
    }
  }

  //clear timer
  function clear() {
    clearInterval(myTimer);
  }

  //add colours
  function addColours() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = "#afa192";
      else if (squares[i].innerHTML == 2) squares[i].style.backgroundColor = "#eee4da";
      else if (squares[i].innerHTML == 4) squares[i].style.backgroundColor = "#ede0c8";
      else if (squares[i].innerHTML == 8) squares[i].style.backgroundColor = "#f2b179";
      else if (squares[i].innerHTML == 16) squares[i].style.backgroundColor = "#ffcea4";
      else if (squares[i].innerHTML == 32) squares[i].style.backgroundColor = "#e8c064";
      else if (squares[i].innerHTML == 64) squares[i].style.backgroundColor = "#ffab6e";
      else if (squares[i].innerHTML == 128) squares[i].style.backgroundColor = "#fd9982";
      else if (squares[i].innerHTML == 256) squares[i].style.backgroundColor = "#ead79c";
      else if (squares[i].innerHTML == 512) squares[i].style.backgroundColor = "#76daff";
      else if (squares[i].innerHTML == 1024) squares[i].style.backgroundColor = "#beeaa5";
      else if (squares[i].innerHTML == 2048) squares[i].style.backgroundColor = "#d7d4f0";
    }
  }
  addColours();

  var myTimer = setInterval(addColours, 50);
});

//-----AI part

const possibleMoves = [37, 38, 39, 40];
function startAI() {
  const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  const bestMove = findBestMove(squares);
  if (bestMove) {
    simulateKeyPress(bestMove);
  } else {
    simulateKeyPress(randomMove);
  }
}

function findBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let move of [37, 38, 39, 40]) {
    let newBoard = simulateMove(board, move);
    if (newBoard) {
      let score = minimax(newBoard, 3, -Infinity, Infinity, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }
}

function simulateMove(board, move) {
  let newBoard = JSON.parse(JSON.stringify(board)); // Create a copy of the board

  // Implement the logic for the move (similar to your existing move functions)
  if (move === 37) moveLeft(newBoard);
  else if (move === 38) moveUp(newBoard);
  else if (move === 39) moveRight(newBoard);
  else if (move === 40) moveDown(newBoard);
  else return null;

  // Check if the move resulted in any changes
  if (JSON.stringify(board) !== JSON.stringify(newBoard)) return newBoard;
  else return null; // Invalid move, return null
}

function minimax(board, depth, alpha, beta, isMaximizing) {
  if (depth === 0) {
    return evaluateBoard(board);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let move of [37, 38, 39, 40]) {
      let newBoard = simulateMove(board, move);
      if (newBoard) {
        let eval = minimax(newBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of [37, 38, 39, 40]) {
      let newBoard = simulateMove(board, move);
      if (newBoard) {
        let eval = minimax(newBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

function evaluateBoard(board) {
  let emptyCells = 0;
  let smoothness = 0;
  let monotonicity = 0;
  let maxTile = 0;

  // Loop through the board and calculate evaluation metrics
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const tile = board[i][j];
      maxTile = Math.max(maxTile, tile);

      if (tile === 0) {
        emptyCells++;
      } else {
        // Calculate smoothness (difference between adjacent tiles)
        if (i < board.length - 1) smoothness -= Math.abs(tile - board[i + 1][j]);
        if (j < board[i].length - 1) smoothness -= Math.abs(tile - board[i][j + 1]);

        // Calculate monotonicity (tendency of tiles to increase in a certain direction)
        if (i > 0) monotonicity += Math.max(0, Math.log2(tile) - Math.log2(board[i - 1][j]));
        if (j > 0) monotonicity += Math.max(0, Math.log2(tile) - Math.log2(board[i][j - 1]));
      }
    }
  }

  // Add more evaluation metrics as needed

  // Define weights for different metrics (you can adjust these)
  const weights = {
    maxTile: 1,
    emptyCells: 1,
    smoothness: 0.1,
    monotonicity: 1,
    // Add more weights for additional metrics
  };

  // Calculate the overall score based on the weighted sum of metrics
  const score =
    weights.maxTile * Math.log2(maxTile) +
    weights.emptyCells * emptyCells +
    weights.smoothness * smoothness +
    weights.monotonicity * monotonicity;

  return score;
}

function simulateKeyPress(keyCode) {
  const event = new Event("keyup");
  event.keyCode = keyCode;
  document.dispatchEvent(event);
}
