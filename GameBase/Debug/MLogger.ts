import * as G from "../../G";
export default class MLogger {
  static Log(
    param0?: any,
    param1?: any,
    param2?: any,
    param3?: any,
    param4?: any,
    param5?: any,
    param6?: any
  ) {
    const args = Array.from(arguments);
    console.log("[log]", ...args);
  }

  static Warn(
    param0?: any,
    param1?: any,
    param2?: any,
    param3?: any,
    param4?: any,
    param5?: any,
    param6?: any
  ) {
    const args = Array.from(arguments);
    console.warn("[warning]", ...args);
  }

  static Error(
    param0?: any,
    param1?: any,
    param2?: any,
    param3?: any,
    param4?: any,
    param5?: any,
    param6?: any
  ) {
    const args = Array.from(arguments);
    console.error("[error]", ...args);
  }

  static ToStringV2(v: G.v2) {
    return "( x = " + v.x + ", y = " + v.y + " )";
  }
}
