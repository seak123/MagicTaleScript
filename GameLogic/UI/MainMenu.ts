import BaseWindow from "../Window/BaseWindow";
import * as G from "../../G";
import MLogger from "../../GameBase/Debug/MLogger";
import Mprocedure from "../../GameCore/Procedure/MProcedure";
import MGame from "../../GameCore/MGame";

export default class MainMenu extends BaseWindow {
  protected static settings = {
    Elements: [
      {
        Name: ".",
        Alias: "root"
      },
      {
        Name: "MenuContent/AnchorCenter/BattleBtn",
        Alias: "battleBtn",
        Type: G.E.UIButton,
        Handler: {
          onClick: "ReqBattle"
        }
      }
    ]
  }
  private root: G.Ett;
  ReqBattle() {
    Mprocedure.Instance.StartBattle();
  }

  Hide() {
    this.root.active = false;
  }

  Show() {
    this.root.active = true;
  }
}
