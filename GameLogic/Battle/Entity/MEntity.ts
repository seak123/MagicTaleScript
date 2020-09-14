import { IPoolItem } from "../../../GameBase/Pool/Pool";
import * as G from "../../../G";
import BaseComponent from "../Component/BaseComponent";
import BattleSession from "../../../GameCore/Battle/BattleSession";
import Transform from "../Component/Transform";

export default class MEntity extends G.Script implements IPoolItem {
  private uid: number;
  private _sess: BattleSession;
  private components: Map<Function, BaseComponent>;

  Init(uid, sess: BattleSession) {
    this.uid = uid;
    this._sess = sess;
  }

  Reset() { }
  Release() {
    this.components.forEach((comp: BaseComponent, ctor: typeof BaseComponent) => {
      this._sess.GetSystem(ctor).Recycle(comp);
    });
  }

  AddComponent<T extends BaseComponent>(ctor: typeof BaseComponent): T {
    if (this.components.has(ctor)) {
      const comp = this.components.get(ctor);
      comp.Reset();
      return comp as T;
    }
    const comp = this._sess.GetSystem(ctor).Fetch();
    this.components.set(ctor, comp);
    return comp as T;
  }

  GetComponent<T extends BaseComponent>(ctor: typeof BaseComponent): T {
    if (this.components.has(ctor)) {
      return this.components.get(ctor) as T;
    }
    return null;
  }
}
