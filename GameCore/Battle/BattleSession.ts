import BattleScene from "../../GameLogic/Battle/BattleScene";
import EntitySystem from "../../GameLogic/Battle/System/EntitySystem";
import TransformSystem from "../../GameLogic/Battle/System/TransformSystem";
import BaseComponent from "../../GameLogic/Battle/Component/BaseComponent";
import { IBattleSystem } from "../../GameLogic/Battle/System/BaseSystem";
import Transform from "../../GameLogic/Battle/Component/Transform";

export default class BattleSession {
  private _scene: BattleScene;

  private _systems: Map<Function, IBattleSystem>;
  public entitySystem: EntitySystem;

  constructor() {
    this._systems = new Map<Function, IBattleSystem>();
  }

  //开启战斗
  public EnterSession() {
    this.entitySystem = new EntitySystem(this);
    this.LoadSystem(Transform, new TransformSystem());
  }

  public OnUpdate(dt: number) {
    this._systems.forEach((s: IBattleSystem) => {
      s.onUpdate(dt);
    });
  }

  //结束战斗
  public LeaveSession() {
    if (this._scene) {
      this._scene.OnLeave();
    }
  }

  public GetSystem(ctor: typeof BaseComponent) {
    return this._systems.get(ctor);
  }

  private LoadScene(sceneId: number) {
    const cfg = {
      bornPos: { x: 5, y: 5 },
    };
    this._scene = new BattleScene(this);
    this._scene.Load(cfg);
  }

  private LoadSystem(ctor: typeof BaseComponent, system: IBattleSystem) { }
}
