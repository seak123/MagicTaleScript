import { Singleton } from "../../GameBase/Base/Singleton";
import BaseWindow from "./BaseWindow";
import AssetManager from "../../GameBase/Asset/AssetManager";
import GameConst from "../../GameBase/Constant/GameConst";
import * as G from "../../G";
import NodeManager from "../../GameCore/Scene/NodeManager";

export default class WindowManager extends Singleton {
  public static get Instance() {
    return this.getInstance<WindowManager>();
  }
  public AddWindow(path: string, ctor: typeof BaseWindow): Promise<BaseWindow> {
    return new Promise<any>((resolve, reject) => {
      AssetManager.LoadAssetAsync(GameConst.RES_ROOT + GameConst.RES_PATH.UI + path + GameConst.RES_TYPE.Prefab).then((prefab: G.Prefab) => {
        const entity = prefab.instantiate();
        NodeManager.Instance.normal1Node.transform2D.addChild(entity.transform2D);
        const comp = entity.addComponent(ctor);
        resolve(comp);
      });
    })
  }
}
