import { _decorator, Component, Label, UIOpacity, Animation } from "cc";
import { GameModel } from "./GameModel";
const { ccclass, property } = _decorator;

@ccclass("ResultController")
export class ResultController extends Component {
  @property({ type: GameModel })
  private model: GameModel;

  @property({ type: Label })
  private highScoreLabel: Label;

  private highScore: number = 0;

  // resetScore() {
  //   this.hideResult();

  // }

  showResult() {
    this.highScore = Math.max(this.highScore, this.model.StartTime);

    this.highScoreLabel.string = `HI ${this.highScore - 1}`;

    // this.node.active = true;
  }

  // hideResult() {
  //   this.node.active = false;
  // }
}
