import BattleSession from "../../GameCore/Battle/BattleSession";
import ResourceManager from "../../GameCore/Resource/ResourceManager";
import GameUtil from "../Utils/GameUtil";
import Creature from "../../GameCore/Battle/Unit/Entity/Creature";

export default class BattleScene {
  private _sess: BattleSession;
  private player: Creature;

  constructor(sess: BattleSession) {
    this._sess = sess;
  }

  Load(config) {
  }

  OnEnter() { }

  OnLeave() { }
}
