import engine from "engine";
import Mprocedure from "./Procedure/MProcedure";

export default class MGame extends engine.Script {
  public static game: engine.Game;
  public static deltaTime: number;
  private static appEntity;

  public static Init() {
    this.game = engine.game;

    this.InitWAEngine();
    //create dont destory-instance
    this.CreateAppObject();
  }

  private static InitWAEngine(){
    this.game = window["game"] as engine.Game;
  }

  private static CreateAppObject() {
    this.appEntity = MGame.game.createEntity3D("AppEntity");
    this.game.activeScene.root.transform.addChild(this.appEntity.transform);
    this.game.markAsPersist(this.appEntity);
    this.appEntity.addComponent(MGame);
  }

  public async onAwake() {
    //init game procedure
    await Mprocedure.Instance.Init();
    Mprocedure.Instance.SwitchState(Mprocedure.StateDefine.Menu);
  }

  public onUpdate(dt?: number) {
    // engine dt单位是秒，而游戏里用的是毫秒
    dt *= 1000;
    MGame.deltaTime = dt;
    Mprocedure.Instance.Update(dt);
  }

  public onLateUpdate(dt) { }
}
