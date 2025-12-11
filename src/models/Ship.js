export class Ship {
  constructor(row, col, length, isHorizontal) {
    this.row = row;
    this.col = col;
    this.length = length;
    this.health = length;
    this.coordinates = []; // uncessary, we could calculate coordinates from row, col, length, horizontal..
    this.isHorizontal = isHorizontal;
  }

  hit() {
    this.health = Math.max(this.health - 1, 0);
  }

  isSunk() {
    return this.health === 0;
  }

  toString() {
    return `Ship (${this.length})`;
  }
}
