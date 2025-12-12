import { Ship } from "./models/Ship";

export class GameController {
  constructor(player, computer, view) {
    this.player = player;
    this.computer = computer;
    this.view = view;
    this.gameOver = false;

    this.playerTurn = true;

    this.gameResultEle = document.querySelector("#game-result");
    this.playBtn = document.querySelector("#play-btn");

    this.init();
    this.addEventListeners();

    this.stack = [];
  }

  init() {}

  addEventListeners() {
    let shipsContainer = document.querySelector(".ships-container");

    this.view.computerBoardView.handleTapCell = (row, col) => {
      this.handlePlayerAttack(row, col);
    };

    this.view.playerBoardView.boardContainer.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
      }
    );

    // Drag and drop only accepts/returns strings
    this.view.playerBoardView.boardContainer.addEventListener("drop", (e) => {
      e.preventDefault();

      const cell = e.target.closest(".cell"); // safer!
      if (!cell) return;

      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const data = JSON.parse(e.dataTransfer.getData("application/json"));

      let ship = new Ship(row, col, data.shipLength, data.horizontal);
      const placedShip = this.player.gameBoard.placeShip(ship);
      if (placedShip) {
        this.view.playerBoardView.updateUI(this.player.gameBoard.board);
        const shipEle = document.querySelector(
          `[data-ship-id="${data.shipId}"]`
        );
        shipEle.remove();

        if (shipsContainer.children.length === 0) {
          this.startGame();
        }
      }
    });

    shipsContainer.addEventListener("dragstart", (e) => {
      const shipEle = e.target.closest(".ship-piece"); // safer
      if (!shipEle) return;

      const shipLength = shipEle.children.length;
      const horizontal = shipEle.dataset.horizontal === "true";
      const shipId = shipEle.dataset.shipId;

      const data = { shipLength, horizontal, shipId };
      e.dataTransfer.setData("application/json", JSON.stringify(data));
      e.dataTransfer.setDragImage(shipEle, 15, 15);
    });

    shipsContainer.addEventListener("click", (e) => {
      const shipEle = e.target.closest(".ship-piece"); // safer
      if (!shipEle) return;
      const horizontal = shipEle.dataset.horizontal === "true";

      shipEle.dataset.horizontal = horizontal ? "false" : "true";
    });

    this.playBtn = document.querySelector("#play-btn");
    this.playBtn.addEventListener("click", (e) => {
      this.reset();
    });
  }

  handlePlayerAttack(row, col) {
    if (this.gameOver) {
      return;
    }

    if (!this.playerTurn) {
      return;
    }

    try {
      const ship = this.computer.gameBoard.receiveAttack(row, col);

      if (ship?.isSunk()) {
        this.view.computerBoardView.updateSunkUI(ship.coordinates);

        if (!this.computer.gameBoard.hasShips()) {
          this.gameOver = true;
          this.gameResultEle.textContent = "Player Won!";
          this.playBtn.style.display = "";
          return;
        }
      }

      this.view.computerBoardView.updateCell(
        this.computer.gameBoard.board,
        row,
        col
      );

      this.playerTurn = false;
      this.handleComputerAttack();
    } catch (e) {
      console.error(`Error handle player attack ${e.message}`);
    }
  }

  // DFS
  handleComputerAttack() {
    let row;
    let col;

    if (this.stack.length) {
      const coordinates = this.stack.pop();
      row = coordinates[0];
      col = coordinates[1];
    } else {
      const coordinates = this.player.gameBoard.getAvailableCoordinates();

      const randomCoordinate =
        coordinates[Math.floor(Math.random() * coordinates.length)];
      row = randomCoordinate[0];
      col = randomCoordinate[1];
    }

    const ship = this.player.gameBoard.receiveAttack(row, col);

    this.view.playerBoardView.updateCell(this.player.gameBoard.board, row, col);

    if (ship) {
      if (ship?.isSunk()) {
        this.view.playerBoardView.updateSunkUI(ship.coordinates);

        if (!this.player.gameBoard.hasShips()) {
          this.gameOver = true;
          this.gameResultEle.textContent = "Computer Won!";
          this.playBtn.style.display = "";
          return;
        }
      }

      const directions = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ];

      for (const [r, c] of directions) {
        if (row + r < 0 || row + r >= 10 || col + c < 0 || col + c >= 10) {
          continue;
        }

        if (
          typeof this.player.gameBoard.board[row + r][col + c] === "boolean"
        ) {
          continue;
        }

        this.stack.push([row + r, col + c]);
      }
    }

    this.playerTurn = true;
  }

  reset() {
    this.playerTurn = true;
    this.playBtn.style.display = "none";

    this.view.playerBoardView.restoreShipPieces();

    this.player.gameBoard.clear();
    this.view.playerBoardView.clearBoard();

    this.computer.gameBoard.clear();
    this.view.computerBoardView.clearBoard();
    this.computer.gameBoard.placeRandomShips();
    this.view.computerBoardView.updateUI(this.computer.gameBoard.board);

    this.gameResultEle.textContent = "";

    const computerContainer = document.querySelector(".computer-container");
    computerContainer.classList.add("disabled");
  }

  startGame() {
    const computerContainer = document.querySelector(".computer-container");
    computerContainer.classList.remove("disabled");
    this.gameOver = false;
  }

  endGame() {}
}
