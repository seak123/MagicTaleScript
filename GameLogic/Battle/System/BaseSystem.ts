import { Pool, IPoolItem } from "../../../GameBase/Pool/Pool";
import BaseComponent from "../Component/BaseComponent";

export interface IBattleSystem {
  Fetch(): BaseComponent;
  Recycle(item: BaseComponent);
  onUpdate(dt:number);
}

export default class BaseSystem<T extends BaseComponent> implements IBattleSystem {
  protected _pool: Pool<T>;
  protected _array: T[];
  Fetch(): BaseComponent {
    return null;
  }

  Recycle(item: BaseComponent) {

  }

  onUpdate(dt: number) {

  }

  protected ForeachComp(func: (comp: T) => void) {
    for (let i = 0; i < this._array.length; ++i) {
      func(this._array[i]);
    }
  }
}
