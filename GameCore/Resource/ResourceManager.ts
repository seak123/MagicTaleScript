import { Singleton } from "../../GameBase/Base/Singleton";
import AssetManager from "../../GameBase/Asset/AssetManager";
import GameConst from "../../GameBase/Constant/GameConst";
import * as G from "../../G";

export default class ResourceManager {
  public static async LoadUIPrefab(path: string) {
    return this.LoadPrefab(
      GameConst.RES_ROOT +
      GameConst.RES_PATH.UI +
      path +
      GameConst.RES_TYPE.Prefab
    );
  }

  public static async LoadPrefab(path: string, instance: boolean = true) {
    const promise = AssetManager.LoadAssetAsync(path);
    if (instance == false) {
      return promise;
    } else {
      return new Promise((resolve, reject) => {
        promise.then((prefab: G.Prefab) => {
          resolve(prefab.instantiate());
        })
      })
    }
  }
}
