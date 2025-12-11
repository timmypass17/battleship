import { Ship } from "./models/Ship";

export class BoardView {
  constructor(boardContainer) {
    this.boardContainer = boardContainer;
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
    this.boardContainer.replaceChildren();
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 11; col++) {
        if (row === 0 && col === 0) {
          const cell = document.createElement("div");
          this.boardContainer.appendChild(cell);
          continue;
        }

        if (row === 0) {
          const cell = document.createElement("div");
          cell.classList.add("grid-label");

          cell.textContent = `${String.fromCharCode("A".charCodeAt(0) + col - 1)}`;
          this.boardContainer.appendChild(cell);
          continue;
        }

        if (col === 0) {
          const cell = document.createElement("div");
          cell.classList.add("grid-label");

          cell.textContent = `${row}`;
          this.boardContainer.appendChild(cell);
          continue;
        }

        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row - 1;
        cell.dataset.col = col - 1;
        this.boardContainer.appendChild(cell);
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
    console.log(board);
    console.log(row, col);
    console.log(board[row]);
    console.log(board[row][col]);
    const cell = this.boardContainer.querySelector(
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

  updateSunkUI(coordinates) {
    for (let [row, col] of coordinates) {
      const cell = this.boardContainer.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      cell.classList.add("sunk");
    }
  }
}
