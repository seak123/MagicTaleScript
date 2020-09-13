import FSMController, { FSMState } from "../../GameBase/FSM/FSMController";
import BattleSession from "../Battle/BattleSession";

export default class BattleProcedure extends FSMState {
  constructor(ctrl: FSMController) {
    super(ctrl);
  }

  private curSession: BattleSession;

  OnEnter() {
    this.curSession = new BattleSession();
    this.curSession.EnterSession();
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
