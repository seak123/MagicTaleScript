import { Singleton } from "../../GameBase/Base/Singleton";
import ISystem from "../../GameBase/Base/ISystem";
import * as G from "../../G";
import WindowManager from "./WindowManager";
import UIConst from "../../GameCore/Constant/UIConst";
import MainMenu from "../UI/MainMenu";

export enum MainWindowMode {
  MainMenu = 1,
  Battle,
}

export default class MainWindowMgr extends Singleton implements ISystem {
  public static get Instance() {
    return this.getInstance<MainWindowMgr>();
  }

  private _mainMenu: MainMenu;
  Init() {
    WindowManager.Instance.AddWindow(UIConst.UI_MainMenu, MainMenu).then(
      (script) => {
        this._mainMenu = script as MainMenu;
      }
    );
  }
  Release() {}

  SwitchMode(mode: MainWindowMode) {
    switch (mode) {
      case MainWindowMode.Battle:
        break;
      case MainWindowMode.MainMenu:
        break;
    }
  }
}
