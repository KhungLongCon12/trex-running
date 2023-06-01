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
  UITransform,
} from "cc";
import { GameAudio } from "./GameAudio";
const { ccclass, property } = _decorator;

@ccclass("DinoController")
export class DinoController extends Component {
  @property({ type: GameAudio })
  private audio: GameAudio;

  @property({ type: SpriteFrame })
  private dinoFrames: SpriteFrame[] = [];

  private jumpingGap: number = 200;
  private jumpDuration: number = 0.5;
  private isJump: boolean = false;
  private canInput: boolean = true;
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

  protected start(): void {
    this.dinoAnim.play("DinoRunnerAnimation");
  }

  initListener() {
    input.on(Input.EventType.KEY_DOWN, this.onClickJump, this);
    input.on(Input.EventType.KEY_DOWN, this.onClickDuck, this);
    input.on(Input.EventType.KEY_DOWN, this.onClickStand, this);
  }

  onClickJump(event: EventKeyboard) {
    if (event.keyCode === KeyCode.SPACE && !this.isJump) {
      this.isJump = true;
      this.getJumping();
    }
  }

  onClickStand(event: EventKeyboard) {
    if (!this.canInput) {
      return;
    }

    if (event.keyCode === KeyCode.ARROW_UP && !this.isJump) {
      this.resetDuck();
    }
  }

  onClickDuck(event: EventKeyboard) {
    if (!this.canInput) {
      return;
    }

    if (event.keyCode === KeyCode.ARROW_DOWN && !this.isJump) {
      console.log("duck");
      this.getDinoCrouch();
    }
  }

  getDinoCrouch() {
    this.dinoAnim.stop();
    this.node.getComponent(UITransform).setContentSize(80, 55);
    this.node.getComponent(Sprite).spriteFrame = this.dinoFrames[1];
    this.dinoAnim.play("DinoDuckAnim");
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
        this.jumpDuration / 1.5,
        { position: targetPosition },
        { easing: "sineOut" }
      )
      .call(() => {
        tween(this.node)
          .to(this.jumpDuration / 1.5, { position: startPosition })
          .call(() => {
            this.isJump = false;
          })
          .start();
        this.node.getComponent(UITransform).setContentSize(68, 75);
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
    this.canInput = false;
    this.dinoAnim.stop();
    this.node.getComponent(UITransform).setContentSize(68, 75);
    this.node.getComponent(Sprite).spriteFrame = this.dinoFrames[2];
  }

  resetDino() {
    this.dinoLocation = new Vec3(-394, -75, 0);
    this.node.setPosition(this.dinoLocation);
    this.canInput = true;
    this.hit = false;
    this.dinoAnim.play();
  }

  resetDuck() {
    this.dinoAnim.stop();
    this.node.getComponent(UITransform).setContentSize(68, 75);
    this.node.getComponent(Sprite).spriteFrame = this.dinoFrames[0];
    this.dinoAnim.play("DinoRunnerAnimation");
  }
}
