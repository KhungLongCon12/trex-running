import { _decorator, Component, CCFloat, CCInteger, randomRangeInt } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameModel")
export class GameModel extends Component {
  @property({ type: CCFloat, slide: true, max: 1000.0, min: 300.0 })
  private _speed: number = 300.0;

  @property({ type: CCFloat })
  private _spawnIntervalForCactus: number = 3.0;

  @property({ type: CCFloat })
  private _spawnIntervalForDinoFly: number = 10.0;

  @property({ type: CCFloat })
  private _startTime: number = 0;

  private _isOver: boolean = false;

  public get Speed(): number {
    return this._speed;
  }
  public set Speed(value: number) {
    this._speed = value;
  }

  public get SpawnIntervalForCactus(): number {
    this._spawnIntervalForCactus = randomRangeInt(1.0, 20.0);
    return this._spawnIntervalForCactus;
  }
  public set SpawnIntervalForCactus(value: number) {
    this._spawnIntervalForCactus = value;
  }

  public get SpawnIntervalForDinoFly(): number {
    this._spawnIntervalForDinoFly = randomRangeInt(15.0, 20.0);
    return this._spawnIntervalForDinoFly;
  }
  public set SpawnIntervalForDinoFly(value: number) {
    this._spawnIntervalForDinoFly = value;
  }

  public get IsOver(): boolean {
    return this._isOver;
  }
  public set IsOver(value: boolean) {
    this._isOver = value;
  }

  public get StartTime(): number {
    return this._startTime;
  }
  public set StartTime(value: number) {
    this._startTime = value;
  }
}
