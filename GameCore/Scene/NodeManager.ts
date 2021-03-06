import { Singleton } from "../../GameBase/Base/Singleton";
import ISystem from "../../GameBase/Base/ISystem";
import MGame from "../MGame";
import * as G from "../../G";

export default class NodeManager extends Singleton implements ISystem {
  public static get Instance(): NodeManager {
    return this.getInstance() as NodeManager;
  }

  private node2DRoot: G.Ett;
  private node3DRoot: G.Ett;

  public normal1Node: G.Ett;
  public normal2Node: G.Ett;
  public normal3Node: G.Ett;
  public noticeNode: G.Ett;

  public entityNode: G.Ett;

  public Init() {
    this.create2DRoot();
    this.create3DRoot();
  }

  public Release() { }

  private create2DRoot() {
    this.node2DRoot = MGame.game.createEntity2D("Node2DRoot");
    MGame.game.rootUICanvas.entity.transform2D.addChild(
      this.node2DRoot.transform2D
    );
    this.normal1Node = this.create2DNode("Normal1");
    this.normal2Node = this.create2DNode("Normal2");
    this.normal3Node = this.create2DNode("Normal3");
    this.noticeNode = this.create2DNode("Notice")
  }

  private create3DRoot() {
    this.node3DRoot = MGame.game.createEntity3D("Node3DRoot");
    MGame.game.activeScene.root.transform.addChild(this.node3DRoot.transform);
    MGame.game.markAsPersist(this.node3DRoot);

    this.entityNode = this.create3DNode("Entity");
  }

  public create2DNode(name: string) {
    const entity = MGame.game.createEntity2D(name);
    this.node2DRoot.transform2D.addChild(entity.transform2D);
    return entity;
  }

  public create3DNode(name: string) {
    const entity = MGame.game.createEntity3D(name);
    this.node3DRoot.transform.addChild(entity.transform);
    return entity;
  }
}
