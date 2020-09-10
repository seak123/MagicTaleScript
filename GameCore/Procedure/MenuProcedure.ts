import FSMController, { FSMState } from "../../GameBase/FSM/FSMController";
import MainWindowMgr, {
  MainWindowMode,
} from "../../GameLogic/Window/MainWindowMgr";

export default class MenuProcedure extends FSMState {
  constructor(ctrl: FSMController) {
    super(ctrl);
  }

  OnEnter(pre?: FSMState) {
    MainWindowMgr.Instance.SwitchMode(MainWindowMode.MainMenu);
  }

  OnUpdate() {}

  OnLeave() {}
}
