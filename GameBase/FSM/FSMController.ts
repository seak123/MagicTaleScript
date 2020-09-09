import MLogger from "../Debug/MLogger";

export abstract class FSMState {
  protected mctrl: FSMController;
  constructor(ctr: FSMController) {
    this.mctrl = ctr;
  }
  public abstract OnEnter(pre?: FSMState);
  public abstract OnUpdate(dt?: number);
  public abstract OnLeave();
}

export default class FSMController {
  protected curState: FSMState;
  protected states;
  constructor() {
    this.states = {};
  }
  public SignState(key: string, state: FSMState) {
    this.states[key] = state;
  }
  public OnUpdate(dt?: number) {
    if (this.curState) this.curState.OnUpdate(dt);
  }
  public SwitchState(next: string) {
    let nextState = this.states[next];
    if (!nextState) {
      MLogger.Error("FSMController tried to switch a unvalid state");
      return;
    }
    if (this.curState) this.curState.OnLeave();
    let preState = this.curState;
    this.curState = nextState;
    if (this.curState) this.curState.OnEnter(preState);
  }
}
