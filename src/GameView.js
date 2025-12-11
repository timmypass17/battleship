export class GameView {
  constructor(playerBoardView, computerBoardView) {
    this.playerBoardView = playerBoardView;
    this.computerBoardView = computerBoardView;
    this.init();
  }

  init() {
    this.playerBoardView.initalizeBoard();
    this.computerBoardView.initalizeBoard();
  }
}
