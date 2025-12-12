import { Ship } from "./models/Ship";

export class BoardView {
  constructor(boardContainer) {
    this.boardContainer = boardContainer;
    this.boardEle = boardContainer.querySelector(".board");
    this.initalizeBoard();

    this.boardContainer.addEventListener("click", (e) => {
      const cell = e.target;
      if (!cell.classList.contains("cell")) {
        return;
      }
      const row = cell.dataset.row;
      const col = cell.dataset.col;

      this.handleTapCell?.(row, col);
    });
  }

  initalizeBoard() {
    this.boardEle.replaceChildren();
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 11; col++) {
        if (row === 0 && col === 0) {
          const cell = document.createElement("div");
          this.boardEle.appendChild(cell);
          continue;
        }

        if (row === 0) {
          const cell = document.createElement("div");
          cell.classList.add("grid-label");

          cell.textContent = `${String.fromCharCode("A".charCodeAt(0) + col - 1)}`;
          this.boardEle.appendChild(cell);
          continue;
        }

        if (col === 0) {
          const cell = document.createElement("div");
          cell.classList.add("grid-label");

          cell.textContent = `${row}`;
          this.boardEle.appendChild(cell);
          continue;
        }

        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row - 1;
        cell.dataset.col = col - 1;
        this.boardEle.appendChild(cell);
      }
    }
  }

  updateUI(board) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.updateCell(board, i, j);
      }
    }
  }

  updateCell(board, row, col) {
    const cell = this.boardEle.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );
    if (board[row][col] instanceof Ship) {
      cell.classList.add("ship");
    } else if (board[row][col] === true) {
      cell.classList.add("hit");
    } else if (board[row][col] === false) {
      cell.classList.add("miss");
    }
  }

  clearBoard() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = this.boardEle.querySelector(
          `.cell[data-row="${i}"][data-col="${j}"]`
        );
        cell.classList.remove("ship");
        cell.classList.remove("hit");
        cell.classList.remove("miss");
        cell.classList.remove("sunk");
      }
    }
  }

  updateSunkUI(ship) {
    for (let [row, col] of ship.coordinates) {
      const cell = this.boardEle.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      cell.classList.add("sunk");
    }

    const shipId = ship.shipId;
    const shipRemainEle = this.boardContainer.querySelector(
      `[data-ship-id=${shipId}]`
    );
    shipRemainEle.remove();
  }

  restoreShipPieces() {
    const shipsContainer = document.querySelector(".ships-container");
    shipsContainer.replaceChildren();

    const shipPieces = {
      "ship-5": 5,
      "ship-4": 4,
      "ship-3-1": 3,
      "ship-3-2": 3,
      "ship-2": 2,
    };

    for (const [shipId, shipLength] of Object.entries(shipPieces)) {
      const shipPiece = document.createElement("div");
      shipPiece.classList.add("ship-piece");
      shipPiece.draggable = true;
      shipPiece.dataset.horizontal = true;
      shipPiece.dataset.shipId = shipId; // automatically converts to "ship-id"

      for (let i = 0; i < shipLength; i++) {
        const shipPart = document.createElement("div");
        shipPiece.appendChild(shipPart);
      }

      shipsContainer.appendChild(shipPiece);
    }
  }

  restoreShipRemainingPieces() {
    const shipsRemainingContainer = this.boardContainer.querySelector(
      ".ships-remaining-container"
    );
    shipsRemainingContainer.replaceChildren();

    const shipPieces = {
      "ship-5": 5,
      "ship-4": 4,
      "ship-3-1": 3,
      "ship-3-2": 3,
      "ship-2": 2,
    };

    for (const [shipId, shipLength] of Object.entries(shipPieces)) {
      const shipPiece = document.createElement("div");
      shipPiece.classList.add("ship-remaining-piece");
      shipPiece.draggable = true;
      shipPiece.dataset.horizontal = true;
      shipPiece.dataset.shipId = shipId; // automatically converts to "ship-id"

      for (let i = 0; i < shipLength; i++) {
        const shipPart = document.createElement("div");
        shipPiece.appendChild(shipPart);
      }

      shipsRemainingContainer.appendChild(shipPiece);
    }
  }
}

// <div
//   class="ship-piece"
//   draggable="true"
//   data-horizontal="true"
//   data-ship-id="ship-5"
// >
//   <div></div>
//   <div></div>
//   <div></div>
//   <div></div>
//   <div></div>
// </div>
