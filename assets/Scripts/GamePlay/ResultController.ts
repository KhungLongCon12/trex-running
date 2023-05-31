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
  private keyScore: string = "keyScore";

  protected start(): void {
    const getScore = sys.localStorage.getItem(this.keyScore);

    if (getScore) {
      this.scoreArr = JSON.parse(getScore);
      localStorage.setItem(this.keyScore, JSON.stringify(this.scoreArr));
    }
  }

  showResult() {
    this.scoreArr.push(this.model.StartTime);

    sys.localStorage.setItem(this.keyScore, JSON.stringify(this.scoreArr));
    const getScore = JSON.parse(sys.localStorage.getItem(this.keyScore));

    // this.highScore = Math.max(this.highScore, this.model.StartTime);
    this.highScore = Math.max(...getScore);

    this.highScoreLabel.string = `HI  ${this.highScore - 1}`;
  }
}
