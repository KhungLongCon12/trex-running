import { _decorator, Component, CCFloat, randomRangeInt } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameModel")
export class GameModel extends Component {
  @property({ type: CCFloat })
  private _spawnIntervalForCactus: number;

  @property({ type: CCFloat })
  private _spawnIntervalForDinoFly: number;

  private _speed: number = 400.0;
  private startTime: number = 0;
  private _isOver: boolean = false;

  public get Speed(): number {
    return this._speed;
  }
  public set Speed(value: number) {
    this._speed = value;
  }

  public get SpawnIntervalForCactus(): number {
    this._spawnIntervalForCactus = randomRangeInt(1.0, 2.5);
    return this._spawnIntervalForCactus;
  }
  public set SpawnIntervalForCactus(value: number) {
    this._spawnIntervalForCactus = value;
  }

  public get SpawnIntervalForDinoFly(): number {
    this._spawnIntervalForDinoFly = randomRangeInt(15.0, 16.0);
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
    return this.startTime;
  }
  public set StartTime(value: number) {
    this.startTime = value;
  }
}
