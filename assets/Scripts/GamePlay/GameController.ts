import {
  _decorator,
  Component,
  instantiate,
  Prefab,
  Sprite,
  Node,
  randomRangeInt,
  director,
  Label,
  PolygonCollider2D,
  Animation,
  UIOpacity,
  Camera,
  Color,
  Collider2D,
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
  private scoreNode: Node | null = null;

  @property({ type: Label })
  private scoreLabel: Label | null = null;

  @property({ type: Node })
  private dinoFlyNodes: Node = null;

  @property({ type: Camera })
  private cameraCanvas: Camera | null = null;

  private spawnTimerCactus: number = 0;
  private spawnTimerDino: number = 0;
  private score: number = 100;
  private isDay: boolean = true;

  protected onLoad(): void {
    director.resume();
    this.startGame();
    this.getElapsedTime();
  }

  // Calculate time form playing
  getElapsedTime(): void {
    this.scoreLabel.string = this.model.StartTime.toString();

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

    this.getCheckSpawn(deltaTime);

    this.groundMoving(deltaTime);
    this.cloudMoving(deltaTime);

    this.cactusMoving(deltaTime);
    this.dinoFlyMoving(deltaTime);

    //check collider
    if (this.model.IsOver === false) {
      this.getDinoStruck();
    }
  }

  startGame() {
    this.view.getHideResult();
  }

  gameOver() {
    this.audio.onAudioQueue(1);
    this.model.IsOver = true;
    this.result.showResult();
    this.view.getShowGameOver();

    director.pause();
  }

  resetGame() {
    this.score = 100;
    this.model.StartTime = 0;
    this.model.IsOver = false;
    this.model.Speed = 400;
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

        if (pos.x <= -900) {
          cactus.removeFromParent();
          i--;
        } else {
          cactus.setPosition(pos);
        }

        cactus.getComponent(Collider2D).apply();
      }
    }
  }

  spawnDinoFly() {
    const dinoFlyNode = instantiate(this.dinoFlyPrefab);
    this.dinoFlyNodes.addChild(dinoFlyNode);
  }

  dinoFlyMoving(value: number) {
    const dinoFlyPool = this.dinoFlyNodes?.children;

    if (dinoFlyPool) {
      for (let i = 0; i < dinoFlyPool.length; i++) {
        const dinoFly = dinoFlyPool[i];

        const pos = dinoFly.getPosition();

        pos.x -= this.model.Speed * value;

        if (pos.x <= -700) {
          // pos.x = 750;
          dinoFly.removeFromParent();
          i--;
        } else {
          // dinoFly.position = pos;
          dinoFly.setPosition(pos);
        }

        dinoFly.getComponent(PolygonCollider2D).apply();
      }
    }
  }

  getCheckSpawn(value: number) {
    // Time for cactus spawn
    this.spawnTimerCactus += value;
    if (this.spawnTimerCactus >= this.model.SpawnIntervalForCactus) {
      this.spawnCactus();
      this.spawnTimerCactus = 0;
    }

    // time for dino spawn
    this.spawnTimerDino += value;
    if (this.spawnTimerDino >= this.model.SpawnIntervalForDinoFly) {
      this.spawnDinoFly();
      this.spawnTimerDino = 0;
    }
  }

  getDinoStruck() {
    this.dino.getContactCactus();

    if (this.dino.hit === true) {
      this.gameOver();
    }
  }

  onClickRestartBtn() {
    director.resume();
    this.resetAllPos();

    this.resetGame();
    this.startGame();
  }

  resetAllPos() {
    this.dino.resetDino();

    this.cactusNodes.removeAllChildren();

    this.dinoFlyNodes.removeAllChildren();

    this.spawnTimerCactus = 0;
    this.spawnTimerDino = 0;
  }

  getIncreaseLevel() {
    this.model.Speed += 20;
    // this.spawnTimerCactus += 2.0;
    // this.model.SpawnIntervalForCactus -= randomRangeInt(1, 2);
  }

  getScoreSparkle() {
    const scoreAnim = this.scoreNode.getComponent(Animation);
    const scoreUIOpacity = this.scoreNode.getComponent(UIOpacity);

    if (this.isDay) {
      setTimeout(() => {
        this.cameraCanvas.clearColor = new Color(0, 0, 0, 255);
        this.view.changeColorAtNight();
        this.isDay = false;
      }, 50000);
    } else {
      setTimeout(() => {
        this.cameraCanvas.clearColor = new Color(223, 223, 223, 255);
        this.view.changeColorAtMorning();
        this.isDay = true;
      }, 50000);
    }

    if (this.model.StartTime === this.score) {
      this.score += 100;
      console.log("check speed", this.model.Speed);
      console.log("check SpawnIntervalForCactus", this.spawnTimerCactus);

      this.audio.onAudioQueue(2);
      scoreAnim.play("ScoreAnim");

      this.getIncreaseLevel();

      //set condition to play anim
      setTimeout(() => {
        scoreAnim.stop();
      }, 2000);
    } else {
      scoreUIOpacity.opacity = 255;
    }
  }
}
