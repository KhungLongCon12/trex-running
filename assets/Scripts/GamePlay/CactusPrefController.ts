import {
  _decorator,
  BoxCollider2D,
  Component,
  randomRangeInt,
  Size,
  Sprite,
  SpriteFrame,
  UITransform,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("CactusPrefController")
export class CactusPrefController extends Component {
  @property({ type: SpriteFrame })
  private cactusSprites: SpriteFrame[] = [];

  @property({ type: Sprite })
  private cactus: Sprite | null = null;

  private randomNumber: number = null;

  protected start(): void {
    this.getRandomCactus();
  }

  getRandomCactus() {
    const setting = this.cactus.node.getComponent(UITransform);
    const editingCollider = this.cactus.node.getComponent(BoxCollider2D);

    this.randomNumber = randomRangeInt(0, 5);
    this.cactus.spriteFrame = this.cactusSprites[this.randomNumber];

    switch (this.randomNumber) {
      case (this.randomNumber = 0):
        setting.setContentSize(70, 70); // for large Double
        editingCollider.size = new Size(53, 56);
        break;

      case (this.randomNumber = 1):
        setting.setContentSize(40, 70); // for large Single
        editingCollider.size = new Size(30, 70);
        break;

      case (this.randomNumber = 2):
        setting.setContentSize(68, 70); // for small double
        editingCollider.size = new Size(50, 70);
        break;

      case (this.randomNumber = 3):
        setting.setContentSize(34, 50); // for small single
        editingCollider.size = new Size(24, 45);
        break;

      case (this.randomNumber = 4):
        setting.setContentSize(70, 50); // for small triple
        editingCollider.size = new Size(60, 47);
        break;

      case (this.randomNumber = 5):
        setting.setContentSize(75, 70); // for large triple
        editingCollider.size = new Size(110, 80);
        break;
    }
  }
}
