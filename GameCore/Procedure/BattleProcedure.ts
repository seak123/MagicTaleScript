import FSMController, { FSMState } from "../../GameBase/FSM/FSMController";

export default class BattleProcedure extends FSMState {
  constructor(ctrl: FSMController) {
    super(ctrl);
  }

  OnEnter() {}

  OnUpdate() {}

  OnLeave() {}
}
