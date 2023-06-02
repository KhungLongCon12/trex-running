import { _decorator, Component, Label, UIOpacity, Animation, sys } from "cc";
import { GameModel } from "./GameModel";
const { ccclass, property } = _decorator;

@ccclass("ResultController")
export class ResultController extends Component {
  @property({ type: GameModel })
  private model: GameModel;

  @property({ type: Label })
  private highScoreLabel: Label;

  private highScore: number = 0;

  private scoreArr: number[] = [];

  protected start(): void {
    let scoreArr1 = localStorage.getItem("keyScore");
    if (scoreArr1) {
      this.scoreArr = JSON.parse(scoreArr1);
      localStorage.setItem("keyScore", JSON.stringify(this.scoreArr));
      this.highScore = Math.max(...this.scoreArr);
    } else {
      this.highScore = 1;
    }
    this.highScoreLabel.string = `HI  ${this.highScore - 1}`;
  }

  showResult() {
    this.scoreArr.push(this.model.StartTime);
    localStorage.setItem("keyScore", JSON.stringify(this.scoreArr));

    this.highScore = Math.max(...this.scoreArr);

    this.highScoreLabel.string = `HI  ${this.highScore - 1}`;
  }
}
