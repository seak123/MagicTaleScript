export default class AssetManager {
    static async LoadAssetAsync(path:string){
        return engine.loader.load(path).promise
    }
}