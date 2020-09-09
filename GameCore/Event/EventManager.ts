import { Singleton } from "../../GameBase/Base/Singleton";
import Handler from "../../GameBase/Event/Handler";

export default class EventManager extends Singleton {
  public static get Instance() {
    return this.getInstance<EventManager>();
  }

  //public On(key: string, handler: Handler) {}
}
