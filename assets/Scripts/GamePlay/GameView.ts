import { _decorator, Component, Node, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameView")
export class GameView extends Component {
  @property({ type: Sprite })
  private gameOver: Sprite | null = null;

  @property({ type: Sprite })
  private restartBtn: Sprite | null = null;

  getHideResult() {
    this.gameOver.node.active = false;
    this.restartBtn.node.active = false;
  }

  getResetScore() {
    this.getHideResult();
  }

  getShowGameOver() {
    this.gameOver.node.active = true;
    this.restartBtn.node.active = true;
  }
}
