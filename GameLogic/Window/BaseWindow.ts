import * as G from "../../G";

export enum WindowDepth {
  Normal1 = 1,
  Normal2,
  Notice,
}

export default class BaseWindow extends G.Script {
  public windowDepth = WindowDepth.Normal1;
}
