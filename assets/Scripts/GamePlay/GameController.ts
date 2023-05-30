import {
  _decorator,
  Component,
  instantiate,
  Prefab,
  Sprite,
  Node,
  randomRangeInt,
  director,
  Collider2D,
  Label,
  PolygonCollider2D,
  Animation,
  Contact2DType,
  IPhysics2DContact,
} from "cc";
import { GameModel } from "./GameModel";
import { ResultController } from "./ResultController";
import { DinoController } from "./DinoControl";
import { GameAudio } from "./GameAudio";
import { GameView } from "./GameView";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: GameModel })
  private model: GameModel;

  @property({ type: GameView })
  private view: GameView;

  @property({ type: GameAudio })
  private audio: GameAudio;

  @property({ type: Sprite })
  private spGround: Sprite[] = [null, null];

  @property({ type: Sprite })
  private spCloud: Sprite[] = [null, null];

  @property({ type: DinoController })
  private dino: DinoController;

  @property({ type: ResultController })
  private result: ResultController;

  @property({ type: Prefab })
  private cactusPrefabs: Prefab | null = null;

  @property({ type: Prefab })
  private dinoFlyPrefab: Prefab | null = null;

  @property({ type: Node })
  private cactusNodes: Node = null;

  @property({ type: Node })
  private scoreLabel: Node | null = null;

  @property({ type: Node })
  private dinoFlyNodes: Node = null;

  private spawnTimerCactus: number = 0;
  private spawnTimerDino: number = 0;
  private score: number = 100;

  protected onLoad(): void {
    this.view.getHideResult();
  }

  protected start(): void {
    this.getElapsedTime();
  }

  // Calculate time form playing
  getElapsedTime(): void {
    const scoreLabel = this.scoreLabel.getComponent(Label);
    scoreLabel.string = this.model.StartTime.toString();

    if (this.model.IsOver === true) {
      this.model.StartTime = 0;
    } else {
      this.model.StartTime += 1;
      this.scheduleOnce(function () {
        this.getElapsedTime();
      }, 0.1);
    }
  }

  protected update(deltaTime: number): void {
    this.getScoreSparkle();

    this.groundMoving(deltaTime);
    this.cloudMoving(deltaTime);

    // Time for cactus spawn
    this.spawnTimerCactus += deltaTime;

    if (this.spawnTimerCactus >= this.model.SpawnIntervalForCactus) {
      this.spawnCactus();
      this.spawnTimerCactus = 0;
    }

    // time for dino spawn
    this.spawnTimerDino += deltaTime;

    if (this.spawnTimerDino >= this.model.SpawnIntervalForDinoFly) {
      this.spawnDinoFly();
      this.spawnTimerDino = 0;
    }

    this.cactusMoving(deltaTime);
    this.dinoFlyMoving(deltaTime);

    // update time when playing
    if (this.model.IsOver === true) {
      this.model.StartTime = 0;
    }

    //check collider
    if (this.model.IsOver === false) {
      this.getDinoStruck();
    }
  }

  startGame() {
    this.view.getHideResult();
    director.resume();
  }

  gameOver() {
    this.audio.onAudioQueue(1);
    this.result.showResult();
    this.view.getShowGameOver();

    // this.dino.getImageWhenDie()

    this.model.IsOver = true;

    director.pause();
  }

  resetGame() {
    this.view.getResetScore();
    this.startGame();
  }

  groundMoving(value: number) {
    for (let i = 0; i < this.spGround.length; i++) {
      const ground = this.spGround[i].node.getPosition();
      ground.x -= this.model.Speed * value;

      if (ground.x <= -1500) {
        ground.x = 1500;
      }

      this.spGround[i].node.setPosition(ground);
    }
  }

  cloudMoving(value: number) {
    for (let i = 0; i < this.spCloud.length; i++) {
      const cloud = this.spCloud[i].node.getPosition();

      cloud.x -= (this.model.Speed / 4) * value;

      if (cloud.x <= -320) {
        cloud.x = 780;
        cloud.y = randomRangeInt(-150, 15);
      }

      this.spCloud[i].node.setPosition(cloud);
    }
  }

  spawnCactus() {
    const cactusNode = instantiate(this.cactusPrefabs);
    this.cactusNodes.addChild(cactusNode);
  }

  cactusMoving(value: number) {
    const cactusPool = this.cactusNodes?.children;
    if (cactusPool) {
      for (let i = 0; i < cactusPool.length; i++) {
        const cactus = cactusPool[i];
        const pos = cactus.getPosition();

        pos.x -= this.model.Speed * value;

        if (pos.x <= -1500) {
          cactus.removeFromParent();
          i--;
        } else {
          cactus.position = pos;
        }

        cactus.getComponent(Collider2D).apply();
      }
    }
  }

  spawnDinoFly() {
    const dinoFlyNode = instantiate(this.dinoFlyPrefab);
    this.dinoFlyNodes.addChild(dinoFlyNode);
    this.dinoFlyNodes
      .getChildByName("DinoFly")
      .getComponent(PolygonCollider2D)
      .apply();
  }

  dinoFlyMoving(value: number) {
    const dinoFlyPool = this.dinoFlyNodes?.children;

    if (dinoFlyPool) {
      for (let i = 0; i < dinoFlyPool.length; i++) {
        const dinoFly = dinoFlyPool[i];

        const pos = dinoFly.getPosition();
        pos.x -= this.model.Speed * value;

        if (pos.x <= -700) {
          pos.x = 750;
        } else {
          dinoFly.position = pos;
        }

        dinoFly.getComponent(PolygonCollider2D).apply();
      }
    }
  }

  getContactCactus() {
    let collider = this.dino.getComponent(Collider2D);

    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    console.log("hit");
    this.dino.hit = true;
  }

  getDinoStruck() {
    this.getContactCactus();

    if (this.dino.hit == true) {
      this.model.IsOver = true;

      this.gameOver();
    }
  }

  onClickRestartBtn() {
    director.resume();
    this.view.getResetScore();
    this.resetAllPos();
  }

  resetAllPos() {
    this.dino.resetDino();

    this.cactusNodes.removeAllChildren();

    this.dinoFlyNodes.removeAllChildren();

    this.spawnTimerCactus = 0;
    this.spawnTimerDino = 0;

    this.model.StartTime = 0;
    this.model.IsOver = false;
  }

  getIncreaseLevel() {
    this.model.Speed += 100;
    this.model.SpawnIntervalForCactus -= 0.5;
    this.model.SpawnIntervalForDinoFly -= 0.1;
  }

  getScoreSparkle() {
    const scoreAnim = this.scoreLabel.getComponent(Animation);

    if (this.model.StartTime === this.score) {
      this.score += 100;
      this.audio.onAudioQueue(2);
      scoreAnim.play("ScoreAnim");
      this.getIncreaseLevel();

      //set condition to play anim
      setTimeout(() => {
        console.log("ScoreAnim");
        scoreAnim.stop();
      }, 2000);
    }
  }
}
