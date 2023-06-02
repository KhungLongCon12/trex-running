import { _decorator, Color, Component, Label, Node, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameView")
export class GameView extends Component {
  @property({ type: Sprite })
  private gameOver: Sprite | null = null;

  @property({ type: Sprite })
  private restartBtn: Sprite | null = null;

  @property({ type: Label })
  private highScore: Label | null = null;

  @property({ type: Label })
  private score: Label | null = null;

  getHideResult() {
    this.gameOver.node.active = false;
    this.restartBtn.node.active = false;
  }

  getShowGameOver() {
    this.gameOver.node.active = true;
    setTimeout(() => {
      this.restartBtn.node.active = true;
    }, 1000);
  }

  changeColorAtNight() {
    this.score.color = new Color(223, 223, 223, 255);
    this.highScore.color = new Color(223, 223, 223, 255);
  }
  changeColorAtMorning() {
    this.score.color = new Color(0, 0, 0, 255);
    this.highScore.color = new Color(0, 0, 0, 255);
  }
}
