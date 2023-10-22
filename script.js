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

  document.getElementById("startAIButton").addEventListener("click", startAI);

  //------------------AI
  function startAI() {
    if (gameOver || won) return;
    let bestMove = findBestMove(squares, 3, -Infinity, Infinity, true);
    console.log("Best move: " + bestMove.score + ", " + bestMove.move);
    if (bestMove.move) {
      let newBoard = makeMove(squares, bestMove.move, 2);
      console.log(squares);
      squares = newBoard;

      console.log(squares);

      //generate();
    }
  }

  function findBestMove(board, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || gameOver || won) {
      return { score: evaluateBoard(board) };
    }

    if (maximizingPlayer) {
      let maxEval = { score: -Infinity, move: null };

      let moves = ["left", "up", "right", "down"];

      for (let move of moves) {
        let newBoard = makeMove([...board], move, 2);

        if (!arraysEqual(newBoard, board)) {
          let eval = findBestMove(newBoard, depth - 1, alpha, beta, false);

          if (eval.score > maxEval.score) {
            maxEval.score = eval.score;
            maxEval.move = move;
          }

          alpha = Math.max(alpha, eval.score);

          if (beta <= alpha) break;
        }
      }

      return maxEval;
    } else {
      let minEval = { score: Infinity, move: null };
      let emptyCells = getEmptyCells(board);

      for (let cell of emptyCells) {
        let newBoard2 = makeMove([...board], cell, 2);
        let eval = findBestMove(newBoard2, depth - 1, alpha, beta, true);

        if (eval.score < minEval.score) {
          minEval.score = eval.score;
          minEval.move = cell;
        }

        beta = Math.min(beta, eval.score);

        if (beta <= alpha) break;
      }

      return minEval;
    }
  }

  function makeMove(board, direction, value) {
    let newBoard = [];
    for (let i = 0; i < 4; i++) {
      newBoard.push(board.slice(i * 4, i * 4 + 4));
    }

    switch (direction) {
      case "left":
        for (let i = 0; i < 4; i++) {
          newBoard[i] = moveLeft(newBoard[i], value);
        }
        break;

      case "up":
        for (let i = 0; i < 4; i++) {
          let col = [newBoard[0][i], newBoard[1][i], newBoard[2][i], newBoard[3][i]];
          col = moveUp(col, value);
          for (let j = 0; j < 4; j++) {
            newBoard[j][i] = col[j];
          }
        }
        break;

      case "right":
        for (let i = 0; i < 4; i++) {
          newBoard[i] = moveRight(newBoard[i], value);
        }
        break;

      case "down":
        for (let i = 0; i < 4; i++) {
          let col = [newBoard[0][i], newBoard[1][i], newBoard[2][i], newBoard[3][i]];
          col = moveDown(col, value);
          for (let j = 0; j < 4; j++) {
            newBoard[j][i] = col[j];
          }
        }
        break;

      default:
        break;
    }

    return [].concat(...newBoard);
  }

  function evaluateBoard(board) {
    let emptyCells = getEmptyCells(board);
    let smoothWeight = 0.1;
    let monoWeight = 1.0;
    let maxWeight = 1.0;

    let smoothness = getSmoothness(board);
    let monotonicity = getMonotonicity(board);
    let maxTile = getMaxTile(board);

    return smoothWeight * smoothness + monoWeight * monotonicity + maxWeight * maxTile;
  }

  function getEmptyCells(board) {
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  }

  function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  function getSmoothness(board) {
    let smoothness = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== 0) {
          let value = Math.log2(board[i][j]);
          let neighbors = getNeighbors(board, i, j);
          for (let neighbor of neighbors) {
            if (neighbor.value !== 0) {
              let neighborValue = Math.log2(neighbor.value);
              smoothness -= Math.abs(value - neighborValue);
            }
          }
        }
      }
    }
    return smoothness;
  }

  function getMonotonicity(board) {
    let totals = [0, 0, 0, 0];

    // Left and Right
    for (let i = 0; i < 4; i++) {
      let current = 0;
      let next = current + 1;
      while (next < 4) {
        while (next < 4 && board[i][next] === 0) {
          next++;
        }
        if (next >= 4) {
          next--;
        }
        let currentValue = board[i][current] !== 0 ? Math.log2(board[i][current]) : 0;
        let nextValue = board[i][next] !== 0 ? Math.log2(board[i][next]) : 0;
        if (currentValue > nextValue) {
          totals[0] += nextValue - currentValue;
        } else if (nextValue > currentValue) {
          totals[1] += currentValue - nextValue;
        }
        current = next;
        next++;
      }
    }

    // Up and Down
    for (let i = 0; i < 4; i++) {
      let current = 0;
      let next = current + 1;
      while (next < 4) {
        while (next < 4 && board[next][i] === 0) {
          next++;
        }
        if (next >= 4) {
          next--;
        }
        let currentValue = board[current][i] !== 0 ? Math.log2(board[current][i]) : 0;
        let nextValue = board[next][i] !== 0 ? Math.log2(board[next][i]) : 0;
        if (currentValue > nextValue) {
          totals[2] += nextValue - currentValue;
        } else if (nextValue > currentValue) {
          totals[3] += currentValue - nextValue;
        }
        current = next;
        next++;
      }
    }

    return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
  }

  function getMaxTile(board) {
    let maxTile = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] > maxTile) {
          maxTile = board[i][j];
        }
      }
    }
    return Math.log2(maxTile);
  }

  function getNeighbors(board, i, j) {
    let neighbors = [];
    if (i > 0) neighbors.push({ row: i - 1, col: j, value: board[i - 1][j] });
    if (i < 3) neighbors.push({ row: i + 1, col: j, value: board[i + 1][j] });
    if (j > 0) neighbors.push({ row: i, col: j - 1, value: board[i][j - 1] });
    if (j < 3) neighbors.push({ row: i, col: j + 1, value: board[i][j + 1] });
    return neighbors;
  }
});
