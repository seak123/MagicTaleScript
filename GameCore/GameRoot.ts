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

  async onStart() {
    // let scene = await AssetManager.LoadAssetAsync("Assets/Resources/Scene/Battle.scene");
    // let sceneEtt:G.Ett = this.m_game.playScene(scene);
   
    // 没有相机则创建一个
    // let cameraTrans = this.m_game.createEntity3D("MainCamera").transform;
    // this.m_game.activeScene.root.transform.addChild(cameraTrans.entity.transform);
    // this.cameraNode = cameraTrans.entity.addComponent(G.E.Camera);
    // this.cameraNode.aspect = G.E.device.screenWidth / G.E.device.screenHeight;
    // let entity: G.Ett = this.m_game.createEntity3D("Monster");
    // nodeRoot.transform.addChild(entity.transform);
    // AssetManager.LoadAssetAsync("Assets/Resources/Modle/Monster_1/Prefab/Monster_1.prefab").then((prefab: G.Prefab) => {
    //   let p = prefab.instantiate();
    //   nodeRoot.transform.addChild(p.transform);
    // });
  }
}
