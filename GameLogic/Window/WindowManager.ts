import { Singleton } from "../../GameBase/Base/Singleton";
import BaseWindow, { WindowDepth } from "./BaseWindow";
import AssetManager from "../../GameBase/Asset/AssetManager";
import GameConst from "../../GameBase/Constant/GameConst";
import * as G from "../../G";
import NodeManager from "../../GameCore/Scene/NodeManager";
import ResourceManager from "../../GameCore/Resource/ResourceManager";
import GameUtil from "../Utils/GameUtil";

export default class WindowManager extends Singleton {
  public static get Instance() {
    return this.getInstance<WindowManager>();
  }
  public AddWindow(path: string, ctor: typeof BaseWindow): Promise<BaseWindow> {
    return new Promise<any>((resolve, reject) => {
      ResourceManager.LoadUIPrefab(path).then((entity: G.Ett) => {
        const comp:BaseWindow = entity.addComponent(ctor);
        this.InitWindow(comp);
        resolve(comp);
      });
    });
  }

  private InitWindow(window: BaseWindow) {
    const entity = window.entity;
    let parent;
    switch (window.windowDepth) {
      case WindowDepth.Normal1:
        parent = NodeManager.Instance.normal1Node;
        break;
      case WindowDepth.Normal2:
        parent = NodeManager.Instance.normal2Node;
        break;
      case WindowDepth.Notice:
        parent = NodeManager.Instance.noticeNode;
        break;
      default:
        parent = NodeManager.Instance.normal1Node;
    }
    GameUtil.AddChild2D(parent, entity);
  }
}
