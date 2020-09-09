import { Singleton } from "../../GameBase/Base/Singleton";
import BaseWindow from "./BaseWindow";

export default class WindowManager extends Singleton {
  public static get Instance() {
    return this.getInstance<WindowManager>();
  }
  public AddWindow(path: string, ctor: typeof BaseWindow): Promise<BaseWindow> {
    return null;
  }
}
