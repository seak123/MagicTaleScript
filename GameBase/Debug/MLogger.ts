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
}
