import engine from "engine";
import MLogger from "../GameBase/Debug/MLogger";
import AssetManager from "../GameBase/Asset/AssetManager";
import * as G from "../G";
import MGame from "./MGame";

declare const wx;

@engine.decorators.serialize("GameRoot")
export default class GameRoot extends engine.Script {
  private cameraNode: G.Cam;
  onAwake() {
    //init
    MGame.Init();
  }
}

if (undefined !== engine.UIGrid["useChildAnchor"]) {
  engine.UIGrid["useChildAnchor"] = false;
}

// 关闭引擎中相应触摸事件必须要求所在节点挂有Renderable
engine.game.rootUICamera.touchManager.enableTouchForRenderableOnly = false;
