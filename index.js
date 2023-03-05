"use strict";
const proto = {
  makeMove(index) {
    gameBoard.updateBoard(this.mark, index);
    gameBoard.checkForWinner();
  },
};

function playerFactory(mark) {
  return Object.assign(Object.create(proto), { mark });
}

const gameBoard = (function () {
  const gameBoard = ["", "", "", "", "", "", "", "", ""];
  const gameBoardNode = document.querySelector("#board");
  const displayBoard = () => {
    gameBoard.forEach((el, i) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.textContent = el;
      gameBoardNode.appendChild(cell);
    });
  };
  const clearBoard = () => {
    gameBoardNode.innerHTML = "";
  };
  const updateBoard = (mark, index) => {
    if (index < 0 || index > 8) return;
    gameBoard[index] = mark;
    clearBoard();
    displayBoard();
    flowController.updateEventListeners();
  };

  const getFreeSpots = () => {
    const freeSpots = [];
    gameBoard.forEach((el, i) => {
      if (el === "") freeSpots.push(i);
    });
    return freeSpots;
  };

  const checkForWinner = () => {
    let winner = false;
    //first row
    if (
      gameBoard[0] === gameBoard[1] &&
      gameBoard[1] === gameBoard[2] &&
      gameBoard[2] !== ""
    )
      winner = true;
    //second row
    if (
      gameBoard[3] === gameBoard[4] &&
      gameBoard[4] === gameBoard[5] &&
      gameBoard[5] !== ""
    )
      winner = true;
    //third row
    if (
      gameBoard[6] === gameBoard[7] &&
      gameBoard[7] === gameBoard[8] &&
      gameBoard[8] !== ""
    )
      winner = true;
    //first column
    if (
      gameBoard[0] === gameBoard[3] &&
      gameBoard[3] === gameBoard[6] &&
      gameBoard[6] !== ""
    )
      winner = true;
    //second column
    if (
      gameBoard[1] === gameBoard[4] &&
      gameBoard[4] === gameBoard[7] &&
      gameBoard[7] !== ""
    )
      winner = true;
    //third column
    if (
      gameBoard[2] === gameBoard[5] &&
      gameBoard[5] === gameBoard[8] &&
      gameBoard[8] !== ""
    )
      winner = true;
    //digonal left to right
    if (
      gameBoard[0] === gameBoard[4] &&
      gameBoard[4] === gameBoard[8] &&
      gameBoard[8] !== ""
    )
      winner = true;
    //diagonal right to left
    if (
      gameBoard[2] === gameBoard[4] &&
      gameBoard[4] === gameBoard[6] &&
      gameBoard[6] !== ""
    )
      winner = true;
    if (winner) {
      alert("We got the winner");
    }
  };
  return {
    displayBoard,
    updateBoard,
    getFreeSpots,
    checkForWinner,
  };
})();

const flowController = (function () {
  let multyplayer = false;
  let player1;
  let player2;
  let currentPlayer;
  const marks = document.querySelectorAll(".mark");
  marks.forEach((mark, i) => {
    mark.addEventListener("click", function () {
      player1 = playerFactory(mark.dataset.mark);
      player2 = playerFactory(player1.mark === "x" ? "o" : "x");
      currentPlayer = player1;
    });
  });

  const modes = document.querySelectorAll(".mode");
  modes.forEach((mode) => {
    mode.addEventListener("click", function () {
      multyplayer = mode.dataset.mode === "multyplayer" ? true : false;
    });
  });

  const cpuMove = (mark) => {
    const freeSpots = gameBoard.getFreeSpots();
    console.log(freeSpots);
    const max = freeSpots.length;
    const min = 0;
    const randomIndex = Math.floor(Math.random() * (max - min) + min);
    console.log(randomIndex);
    gameBoard.updateBoard(mark, freeSpots[randomIndex]);
    gameBoard.checkForWinner();
  };

  const updateEventListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", function () {
        currentPlayer.makeMove(cell.dataset.index);
        if (multyplayer) {
          currentPlayer =
            currentPlayer.mark === player1.mark ? player2 : player1;
        } else {
          cpuMove("o");
        }
      });
    });
  };

  return {
    updateEventListeners,
  };
})();

gameBoard.displayBoard();
flowController.updateEventListeners();
