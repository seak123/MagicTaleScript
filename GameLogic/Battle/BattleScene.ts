import BattleSession from "../../GameCore/Battle/BattleSession";
import ResourceManager from "../../GameCore/Resource/ResourceManager";
import MEntity from "./Entity/MEntity";
import GameUtil from "../Utils/GameUtil";

export default class BattleScene {
  private _sess: BattleSession;
  private player: MEntity;

  constructor(sess: BattleSession) {
    this._sess = sess;
  }

  Load(config) {
    //load player
    //ResourceManager.LoadPrefab()
    this.player = GameUtil.CreateBasicUnit(this._sess);
  }

  OnEnter() { }

  OnLeave() { }
}
