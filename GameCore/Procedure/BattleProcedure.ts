import FSMController, { FSMState } from "../../GameBase/FSM/FSMController";
import BattleSession from "../Battle/BattleSession";
import MainWindowMgr, { MainWindowMode } from "../../GameLogic/Window/MainWindowMgr";

export default class BattleProcedure extends FSMState {
  constructor(ctrl: FSMController) {
    super(ctrl);
  }

  private curSession: BattleSession;

  OnEnter() {
    this.curSession = new BattleSession();
    this.curSession.EnterSession();
    MainWindowMgr.Instance.SwitchMode(MainWindowMode.Battle);
  }

  OnUpdate(dt) {
    if (this.curSession) {
      this.curSession.OnUpdate(dt);
    }
  }

  OnLeave() {
    this.curSession.LeaveSession();
  }
}
