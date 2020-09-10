import * as G from "../../G";

export default class AssetManager {
    static async LoadAssetAsync(path: string) {
        return G.Loader.load(path).promise
    }
}
