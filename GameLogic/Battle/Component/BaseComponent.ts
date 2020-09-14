import MEntity from "../Entity/MEntity";
import { IPoolItem } from "../../../GameBase/Pool/Pool";

export default class BaseComponent implements IPoolItem {
  private _entity: MEntity;

  SetEntity(entity: MEntity) {
    this._entity = entity;
  }
  Reset() {
    throw new Error("Method not implemented.");
  }
  Release() {
    throw new Error("Method not implemented.");
  }
}
