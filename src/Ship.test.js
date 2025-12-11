import { Ship } from "./models/Ship.js";
import { GameBoard } from "./models/GameBoard.js";

describe("Ship functions", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(0, 0, 4, true);
  });

  test("hit", () => {
    const results = [];

    for (let i = 0; i < 5; i++) {
      ship.hit();
      results.push(ship.health);
    }

    expect(results).toEqual([3, 2, 1, 0, 0]);
  });

  test("isSunk", () => {
    const results = [];

    for (let i = 0; i < 4; i++) {
      ship.hit();
      results.push(ship.isSunk());
    }

    expect(results).toEqual([false, false, false, true]);
  });
});

describe("Board functions", () => {
  let gameBoard;
  let ship;

  beforeEach(() => {
    gameBoard = new GameBoard();
    ship = new Ship(1, 1, 3, true);
    gameBoard.placeShip(ship);
  });

  test("placeShip", () => {
    const coords = [
      gameBoard.board[1][1],
      gameBoard.board[1][2],
      gameBoard.board[1][3],
    ];

    for (const shipPart of coords) {
      expect(shipPart).toBe(ship);
    }
    expect(gameBoard.board[0][0]).toBe(null);

    let overlapShip = new Ship(1, 0, 4, true);
    const overlapShipResult = gameBoard.placeShip(overlapShip);
    expect(overlapShipResult).toBe(false);

    let outOfBoundsShip = new Ship(0, 9, 4, true);
    const outOfBoundsResult = gameBoard.placeShip(outOfBoundsShip);
    expect(outOfBoundsResult).toBe(false);
  });

  test("receiveAttack hit", () => {
    gameBoard.receiveAttack(1, 1);
    expect(ship.health).toBe(2);
    expect(gameBoard.board[1][1]).toBe(true);
  });

  test("receiveAttack miss", () => {
    expect(gameBoard.board[0][0]).toBe(null);
    gameBoard.receiveAttack(0, 0);
    expect(gameBoard.board[0][0]).toBe(false);
  });

  test("getMissedAttacks", () => {
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(9, 9);
    expect(gameBoard.getMissedAttacks().length).toBe(2);
    expect(gameBoard.getMissedAttacks()).toEqual([
      [0, 0],
      [9, 9],
    ]);
  });

  test("hasShips", () => {
    gameBoard.receiveAttack(1, 1);
    gameBoard.receiveAttack(1, 2);
    gameBoard.receiveAttack(1, 3);
    expect(gameBoard.hasShips()).toBe(false);

    const ship = new Ship(4, 4, 3, true);
    gameBoard.placeShip(ship);
    expect(gameBoard.hasShips()).toBe(true);
  });

  test("getAvailableCoordinates", () => {
    expect(gameBoard.getAvailableCoordinates().length).toBe(10 * 10);
    gameBoard.receiveAttack(0, 0);
    expect(gameBoard.getAvailableCoordinates().length).toBe(10 * 10 - 1);
    expect(gameBoard.getAvailableCoordinates()[0]).toEqual([0, 1]);
  });
});

// More confident change existing code when doing TDD
// - Code is more modular, indepedent.
// This is good because if I need to modify my code to match new specifications,
// I can modify parts of my code without worrying about breaking rest of app because
// they aren't tightly coupled (the explosion radius is contained)
