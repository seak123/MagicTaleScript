import { Singleton } from "../../GameBase/Base/Singleton";
import ISystem from "../../GameBase/Base/ISystem";
import * as G from "../../G";
import WindowManager from "./WindowManager";
import UIConst from "../../GameCore/Constant/UIConst";
import MainMenu from "../UI/MainMenu";
import { Joystick } from "../../GameCore/Joystick/Joystick";

export enum MainWindowMode {
  MainMenu = 1,
  Battle,
}

export default class MainWindowMgr extends Singleton implements ISystem {
  public static get Instance() {
    return this.getInstance<MainWindowMgr>();
  }

  private _mainMenu: MainMenu;

  async Init() {
    const script = await WindowManager.Instance.AddWindow(UIConst.UI_MainMenu, MainMenu)
    this._mainMenu = script as MainMenu;

    await Joystick.Instance.Init();
    Joystick.Instance.hide();
  }
  Release() {
    Joystick.Instance.release();
  }

  OnUpdate(dt: number) {
    Joystick.Instance.Update(dt);
  }

  SwitchMode(mode: MainWindowMode) {
    switch (mode) {
      case MainWindowMode.Battle:
        Joystick.Instance.show();
        if (this._mainMenu)
          this._mainMenu.Hide();
        break;
      case MainWindowMode.MainMenu:
        Joystick.Instance.hide();
        if (this._mainMenu)
          this._mainMenu.Show();
        break;
    }
  }
}
