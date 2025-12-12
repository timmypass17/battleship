import "./styles.css";
import { GameView } from "./GameView";
import { BoardView } from "./BoardView";
import { GameController } from "./GameController";
import { Player } from "./models/Player";
import { GameBoard } from "./models/GameBoard";

const playerContainer = document.querySelector(".player-container");
const computerContainer = document.querySelector(".computer-container");

let playerBoardView = new BoardView(playerContainer);
let computerBoardView = new BoardView(computerContainer);

let gameView = new GameView(playerBoardView, computerBoardView);

let playerBoard = new GameBoard();
let player = new Player(playerBoard);

let computerBoard = new GameBoard();
let computer = new Player(computerBoard);

let gameController = new GameController(player, computer, gameView);
