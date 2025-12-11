import { Ship } from "./Ship.js";

// Invariants
// - Board cell is 4 possible values
//   - null, true (hit), false (miss), ship
// - If a ship is hit, the ship's cell becomes true
export class GameBoard {
  constructor() {
    this.board = [];

    this.rows = 10;
    this.cols = 10;
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(null);
      }
      this.board.push(row);
    }
  }

  // Row, col represents top-left ship
  placeShip(ship) {
    // Check if there is space available
    if (!this.#spaceAvailable(ship)) {
      return false;
    }

    if (ship.isHorizontal) {
      for (let i = 0; i < ship.length; i++) {
        this.board[ship.row][ship.col + i] = ship;
        ship.coordinates.push([ship.row, ship.col + i]);
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        this.board[ship.row + i][ship.col] = ship;
        ship.coordinates.push([ship.row + i, ship.col]);
      }
    }

    return true;
  }

  #spaceAvailable(ship) {
    if (ship.isHorizontal) {
      for (let i = 0; i < ship.length; i++) {
        if (this.#isOutOfBounds(ship.row, ship.col + i)) {
          return false;
        }

        if (this.board[ship.row][ship.col + i] !== null) {
          return false;
        }
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        if (this.#isOutOfBounds(ship.row + i, ship.col)) {
          return false;
        }
        if (this.board[ship.row + i][ship.col] !== null) {
          return false;
        }
      }
    }

    return true;
  }

  #isOutOfBounds(row, col) {
    return row < 0 || row >= this.rows || col < 0 || col >= this.cols;
  }

  receiveAttack(row, col) {
    if (this.board[row][col] === true || this.board[row][col] === false) {
      throw new Error(`Already used cell: [${row}, ${col}] `);
    }

    if (this.board[row][col] === null) {
      this.board[row][col] = false;
      return;
    }

    if (this.board[row][col] instanceof Ship) {
      const ship = this.board[row][col];

      this.board[row][col] = true;
      ship.hit();
      return ship;
    }
  }

  getMissedAttacks() {
    const misses = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.board[i][j] === false) {
          misses.push([i, j]);
        }
      }
    }
    return misses;
  }

  hasShips() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.board[i][j] instanceof Ship) {
          return true;
        }
      }
    }

    return false;
  }

  getAvailableCoordinates() {
    const coordinates = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const isAvailable =
          this.board[i][j] === null || this.board[i][j] instanceof Ship;
        if (isAvailable) {
          coordinates.push([i, j]);
        }
      }
    }
    return coordinates;
  }

  placeRandomShips() {
    const shipLengths = [5, 4, 3, 3, 2];
    let i = 0;
    while (i < 5) {
      const row = Math.floor(Math.random() * this.board.length);
      const col = Math.floor(Math.random() * this.board[0].length);
      const shipLength = shipLengths[i];
      const isHorizontal = Math.random() < 0.5;
      const ship = new Ship(row, col, shipLength, isHorizontal);
      if (this.placeShip(ship)) {
        i += 1;
      }
    }
  }

  clear() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = null;
      }
    }
  }
}
