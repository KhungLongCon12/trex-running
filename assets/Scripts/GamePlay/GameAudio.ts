import { _decorator, AudioClip, AudioSource, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameAudio")
export class GameAudio extends Component {
  @property({ type: [AudioClip] })
  private clips: AudioClip[] = [];

  @property(AudioSource)
  private audioSourceMenu: AudioSource = null!;

  onAudioQueue(index: number) {
    let clip: AudioClip = this.clips[index];
    this.audioSourceMenu.playOneShot(clip);
  }
}
