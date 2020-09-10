import { TransformBase, Component } from "engine/engine";
import * as G from "../../G";
import BaseWindow from "../../GameLogic/Window/BaseWindow";

export default class EntityUtil {
    public static FindChildByPath(nodeTran: TransformBase, path: string, spliteChar: string = "/"): TransformBase {
        if (null == nodeTran) {
            return null;
        }
        const pathSplits: string[] = path.split(spliteChar);
        let curNodeTran = nodeTran;
        for (let i = 0; i < pathSplits.length; i++) {
            if (pathSplits[i] != ".") {
                curNodeTran = curNodeTran.findChildByName(pathSplits[i]);
                if (curNodeTran == null) {
                    return null;
                }
            }
        }
        return curNodeTran;
    }

    public static AddSingleComponent<T extends Component>(entity: G.Ett, c: typeof Component): T {
        let com = entity.getComponent(c) as T;
        if (com == null) {
            com = entity.addComponent(c) as T;
        }

        if (com instanceof BaseWindow) {
            com.BindElements();
        }

        return com;
    }
}