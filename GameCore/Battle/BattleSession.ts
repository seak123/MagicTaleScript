import BattleScene from "../../GameLogic/Battle/BattleScene";

export default class BattleSession {
  private _scene: BattleScene;

  //开启战斗
  public EnterSession() {}

  public OnUpdate(dt: number) {}

  //结束战斗
  public LeaveSession() {
    if (this._scene) {
      this._scene.OnLeave();
    }
  }

  private LoadScene(sceneId: number) {
    const cfg = {
      bornPos: { x: 5, y: 5 },
    };
    this._scene = new BattleScene(this);
    this._scene.Load(cfg);
  }
}
