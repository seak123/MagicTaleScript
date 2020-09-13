import FSMController from "../../GameBase/FSM/FSMController";
import MenuProcedure from "./MenuProcedure";
import BattleProcedure from "./BattleProcedure";
import MainWindowMgr from "../../GameLogic/Window/MainWindowMgr";
import NodeManager from "../Scene/NodeManager";
import { GestureManager } from "../../GameBase/Touch/GestureManager";

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

    public async Init() {
        this.SignState(Mprocedure.StateDefine.Menu, new MenuProcedure(this));
        this.SignState(Mprocedure.StateDefine.Battle, new BattleProcedure(this));
        await this.InnerInit();
    }

    public StartBattle() {
        this.SwitchState(Mprocedure.StateDefine.Battle);
    }

    public Update(dt: number) {
        GestureManager.Instance.Update(dt);
        MainWindowMgr.Instance.OnUpdate(dt);
        super.OnUpdate(dt);
    }

    private async InnerInit() {
        NodeManager.Instance.Init();
        GestureManager.Instance.Init();
        await MainWindowMgr.Instance.Init();
    }
}
