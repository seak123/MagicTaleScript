import * as G from "../../G";
import MGame from "../../GameCore/MGame";
import BattleSession from "../../GameCore/Battle/BattleSession";


export default class GameUtil {
  static AddChild(parent: G.Ett, child: G.Ett) {
    parent.transform.addChild(child.transform);
  }

  static AddChild2D(parent: G.Ett, child: G.Ett) {
    parent.transform2D.addChild(child.transform2D);
  }

  static IsTouchOverUI(pos: G.v2) {
    const checkTouchFunc = function (node: G.Ett, pos: G.v2) {
      if (!node || !node.active) {
        return false;
      } else {
        // check self
        const touchInputComponent = node.getComponent(
          G.E.TouchInputComponent
        ) as G.TouchInputComponent;
        if (touchInputComponent) {
          const canvasWorldPos = MGame.game.rootUICamera.convertEventPositionToUICanvas(
            pos
          );
          if (node.transform2D.hitTest(canvasWorldPos)) {
            return true;
          }
        }
        // check children recur
        const children = node.transform2D.children;
        if (children) {
          for (let i = 0; i < children.length; ++i) {
            if (checkTouchFunc(children[i].entity, pos)) {
              return true;
            }
          }
        }

        return false;
      }
    };
    const node = MGame.game.rootUICanvas.entity;

    return checkTouchFunc(node, pos);
  }
}
