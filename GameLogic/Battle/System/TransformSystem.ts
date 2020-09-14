import { Pool } from "../../../GameBase/Pool/Pool";
import Transform from "../Component/Transform";
import BaseSystem from "./BaseSystem";
import * as G from "../../../G";
import MGame from "../../../GameCore/MGame";

export default class TransformSystem extends BaseSystem<Transform> {

  constructor(capacity: number = 100) {
    super();
    this._pool = new Pool<Transform>(capacity);
    this._array = [];
  }

  Fetch(): Transform {
    const comp = this._pool.Fetch(Transform);
    this._array.push(comp);
    return comp;
  }

  onUpdate(dt: number) {
    this.ForeachComp(this.DoMove);
  }

  DoMove(comp: Transform) {
    comp.position = comp.position.add(G.v2.createFromNumber(MGame.deltaTime * comp.speed, MGame.deltaTime * comp.speed));
  }
}
