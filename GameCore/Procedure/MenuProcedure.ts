import FSMController, { FSMState } from "../../GameBase/FSM/FSMController";

export default class MenuProcedure extends FSMState {
  constructor(ctrl: FSMController) {
    super(ctrl);
  }

  OnEnter() {}

  OnUpdate() {}

  OnLeave() {}
}
