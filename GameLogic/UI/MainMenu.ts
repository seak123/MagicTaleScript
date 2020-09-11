import BaseWindow from "../Window/BaseWindow";
import * as G from "../../G";
import MLogger from "../../GameBase/Debug/MLogger";
import Mprocedure from "../../GameCore/Procedure/MProcedure";

export default class MainMenu extends BaseWindow {
  protected static settings = {
    Elements: [
      {
        Name: "MenuContent/AnchorCenter/BattleBtn",
        Alias: "BattleBtn",
        Type: G.E.UIButton,
        Handler: {
          onClick: "ReqBattle",
        },
      },
    ],
  };

  ReqBattle() {
    Mprocedure.Instance.StartBattle();
  }
}
