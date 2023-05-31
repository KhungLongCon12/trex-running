import { EventMouse, Sprite, director, randomRangeInt } from "cc";
import {
  _decorator,
  Component,
  input,
  Input,
  KeyCode,
  EventKeyboard,
  Animation,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameMenuController")
export class GameMenuController extends Component {
  @property({ type: Animation })
  private dinoAnim: Animation;

  @property({ type: Animation })
  private groundAnim: Animation;

  @property({ type: Sprite })
  private spBird: Sprite[] = [null, null];

  private startGame: boolean = false;

  protected onLoad(): void {
    this.initListener();
  }

  protected update(dt: number): void {
    this.getBirdMenuMoving(dt);
  }

  initListener() {
    input.on(Input.EventType.KEY_DOWN, this.onSpacePlay, this);
    input.on(Input.EventType.MOUSE_UP, this.onClickPlay, this);
  }

  onSpacePlay(event: EventKeyboard) {
    if (event.keyCode === KeyCode.SPACE) {
      this.playAnim();
    }
  }

  onClickPlay(event: EventMouse) {
    if (event.getButton() === 0) {
      this.playAnim();
    }
  }

  playAnim() {
    if (this.startGame === false) {
      this.dinoAnim.play();
      this.groundAnim.play();

      setTimeout(() => {
        director.loadScene("GamePlay");
      }, 1000);
      this.startGame = true;
    }
  }

  getBirdMenuMoving(value: number) {
    for (let i = 0; i < this.spBird.length; i++) {
      const bird = this.spBird[i].node.getPosition();
      bird.x -= 400 * value;

      if (bird.x <= -750) {
        bird.x = 750;
        bird.y = randomRangeInt(20, 210);
      }

      this.spBird[i].node.setPosition(bird);
    }
  }
}
