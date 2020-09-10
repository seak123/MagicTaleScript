import { Singleton } from "../../GameBase/Base/Singleton";
import AssetManager from "../../GameBase/Asset/AssetManager";
import GameConst from "../../GameBase/Constant/GameConst";

export default class ResourceManager {
  public static async LoadPrefab(path: string) {
    return AssetManager.LoadAssetAsync(
      GameConst.RES_ROOT +
        GameConst.RES_PATH.UI +
        path +
        GameConst.RES_TYPE.Prefab
    );
  }
}
