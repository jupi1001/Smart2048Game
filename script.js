document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("value");
  let gameOver = false;
  let won = false;
  let score = 0;
  let squares = [];
  const width = 4;

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }
  createBoard();

  function generate() {
    const availableSpaces = squares.filter((square) => square.innerHTML === "0");
    if (availableSpaces.length > 0) {
      const randomNumber = Math.floor(Math.random() * availableSpaces.length);
      availableSpaces[randomNumber].innerHTML = "2";
    } else {
      checkForGameOver();
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      moveUp();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  });

  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 !== 3) {
        let current = squares[i].innerHTML;
        let right = squares[i + 1].innerHTML;

        if (current !== "0") {
          if (right === "0") {
            squares[i + 1].innerHTML = current;
            squares[i].innerHTML = "0";
          } else if (current === right) {
            let combined = parseInt(current) * 2;
            squares[i + 1].innerHTML = combined.toString();
            squares[i].innerHTML = "0";
            score += combined; // Update score
            scoreDisplay.innerHTML = score; // Update score display
          }
        }
      }
    }
    generate();
  }

  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 !== 0) {
        let current = squares[i].innerHTML;
        let left = squares[i - 1].innerHTML;

        if (current !== "0") {
          if (left === "0") {
            squares[i - 1].innerHTML = current;
            squares[i].innerHTML = "0";
          } else if (current === left) {
            let combined = parseInt(current) * 2;
            squares[i - 1].innerHTML = combined.toString();
            squares[i].innerHTML = "0";
            score += combined; // Update score
            scoreDisplay.innerHTML = score; // Update score display
          }
        }
      }
    }
    generate();
  }

  function moveUp() {
    for (let i = 4; i < 16; i++) {
      let current = squares[i].innerHTML;
      let up = squares[i - width].innerHTML;

      if (current !== "0") {
        if (up === "0" || up === current) {
          let combined = parseInt(current) + parseInt(up);
          squares[i - width].innerHTML = combined.toString();
          squares[i].innerHTML = "0";
          score += combined; // Update score
          scoreDisplay.innerHTML = score; // Update score display
        }
      }
    }
    generate();
  }

  function moveDown() {
    for (let i = 11; i >= 0; i--) {
      let current = squares[i].innerHTML;
      let down = squares[i + width].innerHTML;

      if (current !== "0") {
        if (down === "0" || down === current) {
          let combined = parseInt(current) + parseInt(down);
          squares[i + width].innerHTML = combined.toString();
          squares[i].innerHTML = "0";
          score += combined; // Update score
          scoreDisplay.innerHTML = score; // Update score display
        }
      }
    }
    generate();
  }

  function checkForGameOver() {
    gameOver = true;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML === "0") {
        gameOver = false;
        return;
      }
      if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
        gameOver = false;
        return;
      }
      if (i < 12 && squares[i].innerHTML === squares[i + width].innerHTML) {
        gameOver = false;
        return;
      }
    }
    if (!gameOver) return;

    for (let i = 0; i < squares.length; i++) {
      if (parseInt(squares[i].innerHTML) === 2048) {
        won = true;
        return;
      }
    }
  }

  document.getElementById("resetBoardButton").addEventListener("click", resetBoard);

  function resetBoard() {
    // Clear all squares
    squares.forEach((square) => (square.innerHTML = "0"));

    // Generate two new random tiles
    generate();
    generate();

    // Reset the score
    score = 0;
    scoreDisplay.innerHTML = score;

    // Reset the game over flag
    gameOver = false;
    won = false;
  }

  document.getElementById("startAIButton").addEventListener("click", startAI);

  //------------------AI
  function startAI() {
    let bestMove;
    let bestScore = -Infinity;

    // Simulate each possible move and evaluate the resulting board
    for (let move of ["up", "down", "left", "right"]) {
      let tempSquares = squares.slice(); // Create a copy of the current board
      let tempScore = score; // Copy the current score

      if (move === "up") {
        moveUp(tempSquares, tempScore);
      } else if (move === "down") {
        moveDown(tempSquares, tempScore);
      } else if (move === "left") {
        moveLeft(tempSquares, tempScore);
      } else if (move === "right") {
        moveRight(tempSquares, tempScore);
      }

      // Evaluate the resulting board after the simulated move
      let evaluation = evaluateBoard(tempSquares, tempScore);

      // Keep track of the move that leads to the best evaluation
      if (evaluation > bestScore) {
        bestScore = evaluation;
        bestMove = move;
      }
    }

    // Execute the best move
    if (bestMove === "up") {
      moveUp();
    } else if (bestMove === "down") {
      moveDown();
    } else if (bestMove === "left") {
      moveLeft();
    } else if (bestMove === "right") {
      moveRight();
    }

    // Check if the game is over
    if (!gameOver) {
      // Start the next AI turn
      startAI();
    }
  }

  function evaluateBoard(squares, score) {
    let evaluation = 0;

    // Reward for higher numbers
    for (let square of squares) {
      let value = parseInt(square.innerHTML);
      evaluation += value * value;
    }

    // Reward for empty squares
    evaluation += squares.filter((square) => square.innerHTML === "0").length;

    // Reward for higher score
    evaluation += score * 10;

    // Reward for creating combos
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (squares[i * 4 + j].innerHTML === squares[i * 4 + j + 1].innerHTML) {
          evaluation += 10;
        }
        if (squares[i * 4 + j].innerHTML === squares[(i + 1) * 4 + j].innerHTML) {
          evaluation += 10;
        }
      }
    }

    return evaluation;
  }
});
