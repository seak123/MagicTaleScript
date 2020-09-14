import { Pool } from "../../../GameBase/Pool/Pool";
import Transform from "../Component/Transform";
import BaseSystem from "./BaseSystem";

export default class TransformSystem extends BaseSystem {
  private _pool: Pool<Transform>;

  constructor(capacity: number = 100) {
    super();
    this._pool = new Pool<Transform>(capacity);
  }

  Fetch(): Transform {
    return this._pool.Fetch(Transform);
  }

  onUpdate(dt:number){
    
  }
}
