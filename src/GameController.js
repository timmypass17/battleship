import { Ship } from "./models/Ship";

export class GameController {
  constructor(player, computer, view) {
    this.player = player;
    this.computer = computer;
    this.view = view;
    this.gameOver = false;

    this.init();
    this.addEventListeners();
  }

  init() {
    let ship2 = new Ship(3, 2, 4, true);
    this.computer.gameBoard.placeShip(ship2);
    this.view.computerBoardView.updateUI(this.computer.gameBoard.board);
  }

  addEventListeners() {
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
      // Placeship
      const placedShip = this.player.gameBoard.placeShip(ship);
      if (placedShip) {
        // Update board
        this.view.playerBoardView.updateUI(this.player.gameBoard.board);

        // remove ship from container
        const shipEle = document.querySelector(
          `[data-ship-id="${data.shipId}"]`
        );
        shipEle.remove();
      }
    });

    let shipsContainer = document.querySelector(".ships-container");
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

    // shipsContainer.addEventListener("click", (e) => {
    //   const shipEle = e.target.closest(".ship-piece"); // safer
    //   if (!shipEle) return;
    // });
  }

  handlePlayerAttack(row, col) {
    if (this.gameOver) {
      return;
    }

    try {
      const ship = this.computer.gameBoard.receiveAttack(row, col);

      if (ship?.isSunk()) {
        console.log(`${ship} sunk!`);
        this.view.computerBoardView.updateSunkUI(ship.coordinates);

        if (!this.computer.gameBoard.hasShips()) {
          console.log("Game over! Player Won!");
          this.gameOver = true;

          return;
        }
      }

      this.view.computerBoardView.updateCell(
        this.computer.gameBoard.board,
        row,
        col
      );

      // Computer's turn
      this.handleComputerAttack();
    } catch (e) {
      console.error(`${e.message}`);
    }
  }

  handleComputerAttack() {
    const coordinates = this.player.gameBoard.getAvailableCoordinates();
    const randomCoordinate =
      coordinates[Math.floor(Math.random() * coordinates.length)];
    const [row, col] = randomCoordinate;

    this.player.gameBoard.receiveAttack(row, col);
    this.view.playerBoardView.updateCell(this.player.gameBoard.board, row, col);

    if (!this.player.gameBoard.hasShips()) {
      console.log("Game over! Computer Won!");
      this.gameOver = true;
      return;
    }
  }

  placeShip(row, col, shipLength, horizontal) {}
}
