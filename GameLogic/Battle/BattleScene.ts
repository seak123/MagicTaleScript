import BattleSession from "../../GameCore/Battle/BattleSession";
import ResourceManager from "../../GameCore/Resource/ResourceManager";

export default class BattleScene {
  private _sess: BattleSession;

  constructor(sess: BattleSession) {
    this._sess = sess;
  }

  Load(config) {
    //load player
    //ResourceManager.LoadPrefab()
  }

  OnEnter() {}

  OnLeave() {}
}
