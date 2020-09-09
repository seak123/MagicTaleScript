import MLogger from "../Debug/MLogger";

export default class Handler {
  private static _uid: number = 1;
  private static _pool: Handler[] = [];

  private _id: number = 0;
  private _method: Function;
  private _owner: any;
  private _args: any[] = [];
  private _once: boolean = false;

  constructor(owner: any, func: Function, args?: Array<any>, once?: boolean) {
    this.Inject(owner, func, args, once);
  }

  public Inject(owner: any, func: Function, args?: Array<any>, once?: boolean) {
    this._id = ++Handler._uid;
    this._owner = owner;
    this._method = func;
    this._args = args == null ? [] : args;
    this._once = once == null ? false : once;
  }

  public Create(owner: any, func: Function, args?: Array<any>, once?: boolean) {
    if (Handler._pool.length > 0) {
      Handler._pool.pop().Inject(owner, func, args, once);
    }
  }

  public Call(): any {
    if (this._id == 0 || this._method == null || this._owner == null) {
      MLogger.Warn("try to call a invalid handler");
      return null;
    }
    let result = this._method.apply(this._owner, this._args);
    if (this._once) {
      this.Clear();
    }
    return result;
  }

  public CallWith(
    param0: any,
    param1?: any,
    param2?: any,
    param3?: any,
    param4?: any,
    param5?: any,
    param6?: any
  ): any {
    if (this._id == 0 || this._method == null || this._owner == null) {
      MLogger.Warn("try to call a invalid handler");
      return null;
    }
    let result = null;
    let m_args = Array.from(arguments);
    if (this._args == null || this._args.length == 0) {
      result = this._method.apply(this._owner, m_args);
    } else {
      result = this._method.apply(this._owner, this._args.concat(m_args));
    }
    if (this._once) {
      this.Clear();
    }
    return result;
  }

  public Clear() {
    this._id = 0;
    this._method = null;
    this._owner = null;
    this._args = null;
    this._once = false;
    Handler._pool.push(this);
  }
}
