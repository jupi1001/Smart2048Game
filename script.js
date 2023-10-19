window.onload = function () {
  buildGridOverlay(); //Generates grid-overlay
  cellCreator(2, 0);
  directions();
  score(0);
};

/* GENERATE GRID */
function buildGridOverlay() {
  var game = document.getElementsByClassName("game");
  var grid = document.getElementsByClassName("grid");
  var size = 4;
  var table = document.createElement("DIV");

  table.className += "grid";
  table.id = " ";
  table.dataset.value = 0;

  for (var i = 0; i < size; i++) {
    var tr = document.createElement("DIV");
    table.appendChild(tr);
    tr.id = "row_" + (i + 1);
    tr.className += "grid_row";

    for (var j = 0; j < size; j++) {
      var td = document.createElement("DIV");
      td.id = "" + (i + 1) + (j + 1); //ID with x y
      td.className += "grid_cell";
      tr.appendChild(td);
    }
    document.body.appendChild(table);
  }

  return table;
}

/* RANDOM TILE CREATOR */
function cellCreator(c, timeOut) {
  /* do 2 times for 2 new tiles */
  for (var i = 0; i < c; i++) {
    var count = 0;
    /* search for an empty cell to create a tile */

    for (var value = 1; value < 2; value++) {
      var randomX = Math.floor(Math.random() * 4 + 1);
      var randomY = Math.floor(Math.random() * 4 + 1);
      var checker = document.getElementById("" + randomX + randomY);
      if (checker.innerHTML != "") {
        value = 0;
      }
    }

    var randomValue = Math.floor(Math.random() * 4 + 1); //create value 1, 2, 3 or 4
    if (randomValue == 3) {
      randomValue = 4;
    } //3 --> 4
    if (randomValue == 1) {
      randomValue = 2;
    } //1 --> 2
    var position = document.getElementById("" + randomX + randomY);
    var tile = document.createElement("DIV"); //create div at x, y
    position.appendChild(tile); //tile becomes child of grid cell
    tile.innerHTML = "" + randomValue; //tile gets value 2 or 4

    colorSet(randomValue, tile);
    tile.data = "" + randomValue;
    tile.id = "tile_" + randomX + randomY;
    position.className += " active";
    var tileValue = tile.dataset.value;
    tile.dataset.value = "" + randomValue;

    //console.info("" + timeOut);
    if (timeOut == 0) {
      tile.className = "tile " + randomValue;
    } else {
      setTimeout(function () {
        tile.className = "tile " + randomValue;
      }, 10);
    }
  }
}

/* MOVE TILES */
document.onkeydown = directions;

function directions(e) {
  e = e || window.event;
  var d = 0;
  // ----- KEY UP ----- //
  if (e.keyCode == "38") {
    var count = 2;

    for (var x = 2; x > 1; x--) {
      for (var y = 1; y < 5; y++) {
        moveTilesMain(x, y, -1, 0, 1, 0);
        //console.info("" + x + y);
      }
      if (x == 2) {
        x += count;
        count++;
      }
      if (count > 4) {
        break;
      }
    }
    cellReset();
  }

  // ----- KEY DOWN ----- //
  else if (e.keyCode == "40") {
    // down
    var count = -2;
    var test = 1;
    for (var x = 3; x < 4; x++) {
      for (var y = 1; y < 5; y++) {
        moveTilesMain(x, y, 1, 0, 4, 0);
      }
      if (x == 3) {
        x += count;
        count--;
      }
      if (count < -4) {
        break;
      }
    }
    cellReset();
  }

  // ----- KEY LEFT ----- //
  else if (e.keyCode == "37") {
    // left

    var count = 2;
    var test = 1;
    for (var x = 2; x > 1; x--) {
      for (var y = 1; y < 5; y++) {
        moveTilesMain(y, x, 0, -1, 0, 1);
      }
      if (x == 2) {
        x += count;
        count++;
      }
      if (count > 4) {
        break;
      }
    }
    cellReset();
  }

  // ----- KEY RIGHT ----- //
  else if (e.keyCode == "39") {
    // right

    var count = -2;
    var noCell = 0;
    var c = 1;
    var d = 0;

    for (var x = 3; x < 4; x++) {
      for (var y = 1; y < 5; y++) {
        moveTilesMain(y, x, 0, 1, 0, 4, c, d);
      }
      if (x == 3) {
        x += count;
        count--;
      }
      if (count < -4) {
        break;
      }
    }
    cellReset();
  }
}

//--------------------------------------------------------

function moveTilesMain(x, y, X, Y, xBorder, yBorder, c, d) {
  var tile = document.getElementById("tile_" + x + y);
  var checker = document.getElementById("" + x + y);
  var xAround = x + X;
  var yAround = y + Y;

  if (xAround > 0 && xAround < 5 && yAround > 0 && yAround < 5 && checker.className == "grid_cell active") {
    var around = document.getElementById("" + xAround + yAround);

    //________

    if (around.className == "grid_cell active") {
      //catching
      var aroundTile = document.getElementById("tile_" + xAround + yAround);
      if (aroundTile.innerHTML == tile.innerHTML) {
        //same
        var value = tile.dataset.value * 2;
        aroundTile.dataset.value = "" + value;
        aroundTile.className = "tile " + value;
        aroundTile.innerHTML = "" + value;
        colorSet(value, aroundTile);
        checker.removeChild(tile);
        checker.className = "grid_cell";
        around.className = "grid_cell active merged";
        document.getElementsByClassName("grid").id = "moved";
        document.getElementsByClassName("grid").className = "grid " + value;
        var grid = document.getElementById(" ");
        var scoreValue = parseInt(grid.dataset.value);
        var newScore = value + scoreValue;

        grid.dataset.value = newScore;
        var score = document.getElementById("value");

        score.innerHTML = "" + newScore;
      }
    } else if (around.className == "grid_cell") {
      //not catching
      around.appendChild(tile);
      around.className = "grid_cell active";
      tile.id = "tile_" + xAround + yAround;
      checker.className = "grid_cell";
      document.getElementsByClassName("grid").id = "moved";
    }

    //________
  }
}

//-------------------------------------------------------

function cellReset() {
  var count = 0;
  var a = document.getElementsByClassName("grid").id;
  //console.log("" + a);

  for (var x = 1; x < 5; x++) {
    for (var y = 1; y < 5; y++) {
      var resetter = document.getElementById("" + x + y);
      if (resetter.innerHTML != "") {
        count++;
      }

      if (resetter.innerHTML == "") {
        resetter.className = "grid_cell";
      }

      if (resetter.className == "grid_cell active merged") {
        resetter.className = "grid_cell active";
      }
    }
  }
  if (count == 16) {
    document.getElementById("status").className = "lose";
  } else if (document.getElementsByClassName("grid").id == "moved") {
    cellCreator(1, 1);
  }
  document.getElementsByClassName("grid").id = " ";
}

function score() {
  var grid = document.getElementById(" ");
  var value = grid.dataset.value;
  document.getElementById("value").innerHTML = "" + value;
}

/* ----- STYLE ----- */
function colorSet(value, tile) {
  switch (value) {
    case 2:
      tile.style.background = "#fbfced";
      tile.style.color = "black";
      break;
    case 4:
      tile.style.background = "#ecefc6";
      tile.style.color = "black";
      break;
    case 8:
      tile.style.background = "#ffb296";
      tile.style.color = "black";
      break;
    case 16:
      tile.style.background = "#ff7373";
      tile.style.color = "black";
      break;
    case 32:
      tile.style.background = "#f6546a";
      tile.style.color = "white";
      break;
    case 64:
      tile.style.background = "#8b0000";
      tile.style.color = "white";
      break;
    case 128:
      tile.style.background = "#794044";
      tile.style.color = "white";
      tile.style.fontSize = "50px";
      break;
    case 256:
      tile.style.background = "#31698a";
      tile.style.color = "white";
      tile.style.fontSize = "50px";
      break;
    case 512:
      tile.style.background = "#297A76";
      tile.style.color = "white";
      tile.style.fontSize = "50px";
      break;
    case 1024:
      tile.style.background = "#2D8A68";
      tile.style.color = "white";
      tile.style.fontSize = "40px";
      break;
    case 2048:
      tile.style.background = "#1C9F4E";
      tile.style.color = "white";
      tile.style.fontSize = "40px";
      document.getElementById("status").className = "won";
      break;
    case 4096:
      tile.style.background = "#468499";
      tile.style.color = "white";
      tile.style.fontSize = "40px";
      break;
    case 8192:
      tile.style.background = "#0E2F44";
      tile.style.color = "white";
      tile.style.fontSize = "40px";
      break;
  }
}

function info() {
  setTimeout(function () {
    document.getElementById("description").classList.toggle("show");
  }, 10);
}

function reset() {
  for (var x = 1; x < 5; x++) {
    for (var y = 1; y < 5; y++) {
      var resetter = document.getElementById("" + x + y);
      if (resetter.className == "grid_cell active") {
        var tile = document.getElementById("tile_" + x + y);
        resetter.removeChild(tile);
      }
    }
  }
  document.getElementById("status").className = "";
  document.getElementById(" ").dataset.value = 0;
  score();
  cellReset();
  cellCreator(2, 0);
}

const possibleMoves = [38, 40, 37, 39];
let oldBoard = getBoardState();
let oldMove = getBestMove(oldBoard, possibleMoves);

function startAI() {
  //for (let index = 0; index < 50; index++) {
  var board = getBoardState();
  var bestMove = getBestMove(board, possibleMoves);

  if (board == oldBoard && bestMove == oldMove) {
    var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    bestMove = randomMove;
  }

  console.log("Best move: " + bestMove);

  if (bestMove !== null) {
    simulateKeyPress(bestMove);
  }
  oldBoard = board;
  oldMove = bestMove;
  //}
}

function getBoardState() {
  var board = [];
  for (var i = 1; i <= 4; i++) {
    var row = [];
    for (var j = 1; j <= 4; j++) {
      var tile = document.getElementById("tile_" + i + j);
      row.push(tile ? parseInt(tile.innerHTML) : 0);
    }
    board.push(row);
  }
  return board;
}

function getBestMove(board, possibleMoves) {
  var bestMove = null;
  var bestScore = -Infinity;

  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    var newBoard = simulateMove(board, move);
    if (newBoard !== null) {
      var score = evaluateBoard(newBoard);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

function simulateMove(board, move) {
  // Implement code to simulate the given move on the board
  var tempBoard = board.map(function (arr) {
    return arr.slice();
  });

  var xStart = 1,
    xEnd = 5,
    xStep = 1,
    yStart = 1,
    yEnd = 5,
    yStep = 1;

  if (move == 38) {
    xStart = 1;
    xEnd = 5;
    xStep = 1;
    yStart = 1;
    yEnd = 5;
    yStep = 1;
  } else if (move == 40) {
    xStart = 4;
    xEnd = 0;
    xStep = -1;
    yStart = 1;
    yEnd = 5;
    yStep = 1;
  } else if (move == 37) {
    xStart = 1;
    xEnd = 5;
    xStep = 1;
    yStart = 1;
    yEnd = 5;
    yStep = 1;
  } else if (move == 39) {
    xStart = 1;
    xEnd = 5;
    xStep = 1;
    yStart = 4;
    yEnd = 0;
    yStep = -1;
  }

  var moved = false;

  for (var x = xStart; x != xEnd; x += xStep) {
    for (var y = yStart; y != yEnd; y += yStep) {
      if (board[x - 1][y - 1] != 0) {
        var newX = x,
          newY = y;
        while (newX + xStep >= 1 && newX + xStep <= 4 && newY + yStep >= 1 && newY + yStep <= 4) {
          var nextTile = tempBoard[newX + xStep - 1][newY + yStep - 1];
          var currentTile = tempBoard[newX - 1][newY - 1];
          if (nextTile == 0) {
            tempBoard[newX + xStep - 1][newY + yStep - 1] = currentTile;
            tempBoard[newX - 1][newY - 1] = 0;
            newX += xStep;
            newY += yStep;
            moved = true;
          } else if (nextTile == currentTile) {
            tempBoard[newX + xStep - 1][newY + yStep - 1] *= 2;
            tempBoard[newX - 1][newY - 1] = 0;
            moved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return moved ? tempBoard : null;
}

function evaluateBoard(board) {
  // Implement your scoring function here
  var score = 0;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      score += board[i][j];
    }
  }
  return score;
}

function simulateKeyPress(keyCode) {
  var event = new Event("keydown");
  event.keyCode = keyCode;
  document.dispatchEvent(event);
}
