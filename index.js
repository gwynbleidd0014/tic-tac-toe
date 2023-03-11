"use strict";
//PROTOTYPE OBJECT FOR PLAYERS
const proto = {
  makeMove(index) {
    gameBoard.updateBoard(this.mark, index);
    return gameBoard.checkForWinner();
  },
  ties: 0,
};

//PLAYER FACTORY FUNCTION
function playerFactory(mark) {
  return Object.assign(Object.create(proto), { mark, wins: 0 });
}

//GAMEBOARD MODULE
const gameBoard = (function () {
  //Gameboard as array
  const gameBoard = ["", "", "", "", "", "", "", "", ""];
  //Gameboard node from dom
  const gameBoardNode = document.querySelector("#board");
  //Function to display board on ui
  const displayBoard = () => {
    gameBoard.forEach((el, i) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.innerHTML =
        el !== ""
          ? `
        <img src="./assets/${el}.svg" alt="Mark logo" class="mark-in-cell"/>
      `
          : "";
      gameBoardNode.appendChild(cell);
    });
  };
  //Function to clear the ui board
  const clearBoard = () => {
    gameBoardNode.innerHTML = "";
  };
  //Function to update ui board according to gameBoard array
  const updateBoard = (mark, index) => {
    if (index < 0 || index > 8) return;
    gameBoard[index] = mark;
    clearBoard();
    displayBoard();
    flowController.updateEventListeners();
  };
  //Function toGet indexies of free spots in gameBoard array
  const getFreeSpots = () => {
    const freeSpots = [];
    gameBoard.forEach((el, i) => {
      if (el === "") freeSpots.push(i);
    });
    return freeSpots;
  };
  //Function to clear gameboard array and set default values as empty strings
  const clearGameBoard = () => {
    gameBoard.forEach((el, i) => {
      gameBoard[i] = "";
    });
  };
  //Function to Check if we have winner and if we have one or it's tie take according actions
  const checkForWinner = () => {
    let winner = "";
    //first row
    if (
      gameBoard[0] === gameBoard[1] &&
      gameBoard[1] === gameBoard[2] &&
      gameBoard[2] !== ""
    )
      winner = gameBoard[2];
    //second row
    if (
      gameBoard[3] === gameBoard[4] &&
      gameBoard[4] === gameBoard[5] &&
      gameBoard[5] !== ""
    )
      winner = gameBoard[5];
    //third row
    if (
      gameBoard[6] === gameBoard[7] &&
      gameBoard[7] === gameBoard[8] &&
      gameBoard[8] !== ""
    )
      winner = gameBoard[8];
    //first column
    if (
      gameBoard[0] === gameBoard[3] &&
      gameBoard[3] === gameBoard[6] &&
      gameBoard[6] !== ""
    )
      winner = gameBoard[6];
    //second column
    if (
      gameBoard[1] === gameBoard[4] &&
      gameBoard[4] === gameBoard[7] &&
      gameBoard[7] !== ""
    )
      winner = gameBoard[7];
    //third column
    if (
      gameBoard[2] === gameBoard[5] &&
      gameBoard[5] === gameBoard[8] &&
      gameBoard[8] !== ""
    )
      winner = gameBoard[8];
    //digonal left to right
    if (
      gameBoard[0] === gameBoard[4] &&
      gameBoard[4] === gameBoard[8] &&
      gameBoard[8] !== ""
    )
      winner = gameBoard[8];
    //diagonal right to left
    if (
      gameBoard[2] === gameBoard[4] &&
      gameBoard[4] === gameBoard[6] &&
      gameBoard[6] !== ""
    )
      winner = gameBoard[6];
    if (winner) {
      flowController.getWinner(winner);
      flowController.displayWinner(winner);
    } else {
      const filteredGameBorad = gameBoard.filter((el) => el === "");
      if (filteredGameBorad.length === 0) {
        flowController.displayTie();
      }
    }
    if (winner) return true;
    return false;
  };
  //DISPLAY BOARD ON UI FOR FIRST TIME
  displayBoard();
  //
  return {
    clearGameBoard,
    updateBoard,
    getFreeSpots,
    checkForWinner,
  };
})();

//GAME FLOW CONTROLLING MODULE
const flowController = (function () {
  //DEFINE PRIVATE VARIABLES
  let multyplayer = false;
  let player1 = playerFactory("x");
  let player2 = playerFactory("o");
  let currentPlayer = player1;
  let cpu;
  let winnerPlayer;
  //GET ALL NECCESARY NODES FROM DOM
  const marks = document.querySelectorAll(".mark");
  const newGameView = document.querySelector(".new-game-screen");
  const activeGameView = document.querySelector(".active-game-screen");
  const winnerScreen = document.querySelector(".display-winner-screen");
  const modes = document.querySelectorAll(".mode");
  const currentPlayerNode = document.querySelector(".current-player");
  const roundNotification = document.querySelector(".notification");
  const winnerMark = document.querySelector(".winner-mark");
  const winnerAnnounce = document.querySelector(".winner-announce");
  const styles = getComputedStyle(document.documentElement);
  const quit = document.querySelector(".quit");
  const nextRound = document.querySelector(".next-round");
  const redo = document.querySelector(".redo");
  const scores = document.querySelectorAll(".score");
  const restart = document.querySelector(".restart");
  const cancell = document.querySelector(".cancell");
  const redoScreen = document.querySelector(".redo-screen");
  //Function to display who's trun it's now
  const displayTurn = () => {
    currentPlayerNode.innerHTML = `
      <img src="./assets/${currentPlayer.mark}.svg" alt="player icon" class="current-player-icon"><span>TURN</span>
      `;
  };
  //ADD EVENT LISTNER TO BOTH MARKS
  marks.forEach((mark, i) => {
    mark.addEventListener("click", function () {
      marks.forEach((marks) => {
        marks.classList.remove("chosen");
      });
      mark.classList.add("chosen");
      player1.mark = mark.dataset.mark;
      player2.mark = player1.mark === "x" ? "o" : "x";
    });
  });
  //ADD EVENT LISTENER TO MODE BUTTONS
  modes.forEach((mode) => {
    mode.addEventListener("click", function () {
      multyplayer = mode.dataset.mode === "multyplayer" ? true : false;
      if (!multyplayer) {
        currentPlayer = player1;
        cpu = player2;
        newGameView.classList.toggle("hidden");
        activeGameView.classList.toggle("hidden");
        displayTurn();
      } else {
        currentPlayer = player1.mark === "x" ? player1 : player2;
        newGameView.classList.toggle("hidden");
        activeGameView.classList.toggle("hidden");
        displayTurn();
      }
    });
  });

  //FUNCTION TO DISPLAY THE WINNER
  const displayWinner = (winner) => {
    winnerScreen.classList.remove("hidden");
    if (!multyplayer && winner !== player1.mark) {
      roundNotification.textContent = "OH NO, YOU LOST…";
    } else if (!multyplayer && winner === player1.mark) {
      roundNotification.textContent = "YOU WON!";
    } else {
      const winnerName = player1.mark === winner ? "PLAYER 1" : "PLAYER 2";
      roundNotification.textContent = `${winnerName} WINS!`;
    }

    winnerMark.setAttribute("src", `./assets/${winner}.svg`);
    if (winner === "o") {
      winnerAnnounce.style.color = styles.getPropertyValue("--y-cl").trim();
    } else {
      winnerAnnounce.style.color = styles.getPropertyValue("--bl-cl").trim();
    }
  };
  //FUNCTION TO DISPLAY THE TIE
  const displayTie = () => {
    roundNotification.textContent = "";
    winnerAnnounce.textContent = "ROUND TIED";
    winnerAnnounce.style.color = styles.getPropertyValue("--gr-cl").trim();
    winnerMark.classList.add("hidden");
    player1.ties++;
    winnerScreen.classList.remove("hidden");
  };
  //FUNCTION TO DETERMINE THE WINNER
  const getWinner = (winner) => {
    winnerPlayer = player1.mark === winner ? player1 : player2;
  };

  //FUNCTION TO UPDATE STATS OF PLAYER AND DISPLAY THEM ON UI
  const updateStats = (winner) => {
    if (winner === "tie") {
      player1.ties += 1;
      const stat = document.querySelector(`.score-${winner}`);
      stat.innerHTML = `
      <span>TIES</span>${player1.ties}
      `;
    } else {
      winnerPlayer.wins += 1;
      const stat = document.querySelector(`.score-${winnerPlayer.mark}`);
      stat.innerHTML = `
      <span>${winnerPlayer.mark.toUpperCase()}</span>${winnerPlayer.wins}
      `;
    }
  };
  //FUNCTION TO RESET ALL STATS AS VARIABLES AND ON UI AS WELL
  const resetStats = () => {
    player1 = playerFactory("x");
    player2 = playerFactory("o");
    multyplayer = false;
    currentPlayer = player1;
    cpu = null;
    winnerPlayer = null;
    scores.forEach((score) => {
      const mark = score.querySelector("span").textContent.trim();
      score.innerHTML = `
        <span>${mark}</span>
          0
      `;
    });
  };
  //FUNCTION TO RESET GAME
  const resetGame = () => {
    gameBoard.clearGameBoard();
    gameBoard.updateBoard();
    resetStats();
    console.log(winnerScreen, newGameView);
    winnerScreen.classList.add("hidden");
    activeGameView.classList.add("hidden");
    newGameView.classList.remove("hidden");
  };
  //FUNCTION TO START NEW ROUND
  const startNextRound = () => {
    gameBoard.clearGameBoard();
    gameBoard.updateBoard();
    updateStats(winnerPlayer ? winnerPlayer.makr : "tie");
    winnerScreen.classList.add("hidden");
  };
  //ADD EVENT LISTENER TO QUIT BUTTON
  quit.addEventListener("click", (e) => {
    resetGame();
    winnerPlayer = null;
  });
  //ADD EVENT LISTENER TO NEXROUND BUTTON
  nextRound.addEventListener("click", (e) => {
    startNextRound();
    winnerPlayer = 0;
  });
  //ADD EVENT LISTENER TO REDO BUTTON
  redo.addEventListener("click", (e) => {
    redoScreen.classList.remove("hidden");
  });

  //ADD EVEMT LISTENER TO RESTART BUTTON
  restart.addEventListener("click", () => {
    gameBoard.clearGameBoard();
    gameBoard.updateBoard();
    redoScreen.classList.add("hidden");
  });
  //ADD EVENT LISTENER TO CANCELL BUTTON
  cancell.addEventListener("click", () => {
    redoScreen.classList.add("hidden");
  });
  //FUNCTION FOR CPU TO MAKE MOVE
  const cpuMove = (mark) => {
    const freeSpots = gameBoard.getFreeSpots();
    const max = freeSpots.length;
    const min = 0;
    const randomIndex = Math.floor(Math.random() * (max - min) + min);
    gameBoard.updateBoard(mark, freeSpots[randomIndex]);
    displayTurn();
    gameBoard.checkForWinner();
  };
  //UPDATE EVENT LISTENERS ON NEWLY CREATED CELLS
  const updateEventListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", function (e) {
        if (!cell?.firstChild?.firstChild && cell?.firstChild) return;
        const cond = currentPlayer.makeMove(cell.dataset.index);
        console.log(cond);
        if (cond) return;
        if (multyplayer) {
          currentPlayer =
            currentPlayer.mark === player1.mark ? player2 : player1;
          displayTurn();
        } else {
          cpuMove(player2.mark);
        }
      });
      cell.addEventListener("mouseover", function () {
        if (cell.firstElementChild) {
          return;
        } else {
          cell.style.background = `url(./assets/${currentPlayer.mark}-background.svg) no-repeat center, var(--dr-gr-cl)`;
          cell.style.backgroundSize = "50%";
        }
      });
      cell.addEventListener("mouseout", function () {
        cell.style.background = styles.getPropertyValue("--dr-gr-cl");
      });
    });
  };
  //EXPORT ALL NECCECARY FUNCTIONS
  return {
    displayTie,
    getWinner,
    displayWinner,
    updateEventListeners,
  };
})();

// gameBoard.displayBoard();
flowController.updateEventListeners();
