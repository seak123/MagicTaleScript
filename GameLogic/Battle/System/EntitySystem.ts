import { Pool, EntityPool } from "../../../GameBase/Pool/Pool";
import MEntity from "../Entity/MEntity";
import EntityUtil from "../../../GameBase/UI/EntityUtil";
import * as G from "../../../G";
import GameUtil from "../../Utils/GameUtil";
import NodeManager from "../../../GameCore/Scene/NodeManager";
import BattleSession from "../../../GameCore/Battle/BattleSession";

export default class EntitySystem {
  private entityId;
  private entityPool: EntityPool<MEntity>;
  private _sess: BattleSession;

  constructor(sess: BattleSession) {
    this.entityId = 0;
    this.entityPool = new EntityPool<MEntity>();
    this._sess = sess;
    this.entityPool.createFunc = () => {
      const newEntity: G.Ett = EntityUtil.CreateEntity3D("Entity");
      GameUtil.AddChild(NodeManager.Instance.entityNode, newEntity);
      const newComponent = EntityUtil.AddSingleComponent(
        newEntity,
        MEntity
      ) as MEntity;
      return newComponent;
    };
    this.entityPool.initFunc = (entity: MEntity) => {
      entity.Init(++this.entityId, this._sess);
    };
  }

  public GetEntity() {
    return this.entityPool.FetchEntity(MEntity);
  }
}
