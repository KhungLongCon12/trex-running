import {
  _decorator,
  Component,
  EventKeyboard,
  input,
  Input,
  KeyCode,
  tween,
  Vec3,
  Animation,
  SpriteFrame,
  Sprite,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
} from "cc";
import { GameAudio } from "./GameAudio";
const { ccclass, property } = _decorator;

@ccclass("DinoController")
export class DinoController extends Component {
  @property({ type: GameAudio })
  private audio: GameAudio;

  @property({ type: SpriteFrame })
  private dinoFrames: SpriteFrame[] = [];

  @property({ type: SpriteFrame })
  private dinoSprite: Sprite | null = null;

  private jumpingGap: number = 200;
  private jumpDuration: number = 0.5;
  private isJump: boolean = false;
  private dinoAnim: Animation | null = null;
  private dinoLocation: Vec3;
  private _hit: boolean;

  public get hit(): boolean {
    return this._hit;
  }
  public set hit(value: boolean) {
    this._hit = value;
  }

  protected onLoad(): void {
    this.dinoAnim = this.getComponent(Animation);

    this.initListener();

    this.resetDino();
  }

  initListener() {
    input.on(Input.EventType.KEY_DOWN, this.onClickJump, this);
  }

  onClickJump(event: EventKeyboard) {
    if (event.keyCode === KeyCode.SPACE && !this.isJump) {
      this.isJump = true;
      this.getJumping();
    }
  }

  getJumping() {
    const startPosition = this.node.getPosition();
    this.audio.onAudioQueue(0);

    const targetPosition = new Vec3(
      startPosition.x,
      startPosition.y + this.jumpingGap,
      0
    );

    this.dinoAnim.stop();

    tween(this.node)
      .to(
        this.jumpDuration / 2,
        { position: targetPosition },
        { easing: "sineOut" }
      )
      .call(() => {
        tween(this.node)
          .to(this.jumpDuration / 2, { position: startPosition })
          .call(() => {
            this.isJump = false;
          })
          .start();
        this.dinoAnim.play();
      })
      .start();
  }

  getContactCactus() {
    let collider = this.node.getComponent(Collider2D);

    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    this.hit = true;
  }

  resetDino() {
    this.dinoLocation = new Vec3(-394, -75, 0);
    this.node.setPosition(this.dinoLocation);
    this.hit = false;
  }
}
