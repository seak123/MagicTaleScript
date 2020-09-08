import FSMController from "../../GameBase/FSM/FSMController";
import MenuProcedure from "./MenuProcedure";
import BattleProcedure from "./BattleProcedure";

export default class Mprocedure extends FSMController {
  private static _instance: Mprocedure;
  public static StateDefine = {
    Menu: "Menu",
    Battle: "Battle",
  };
  public static get Instance() {
    if (!this._instance) this._instance = new Mprocedure();
    return this._instance;
  }

  public Init() {
    this.SignState(Mprocedure.StateDefine.Menu, new MenuProcedure(this));
    this.SignState(Mprocedure.StateDefine.Battle, new BattleProcedure(this));
  }
}
