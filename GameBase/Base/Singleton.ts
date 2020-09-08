export class Singleton {
    protected static _instance: Singleton;

    private static _instanceKey: Map<Function, boolean> = new Map<Function, boolean>();

    protected constructor() {
        if (Singleton._instanceKey.has(this.constructor)) {
            console.error("[Singleton] Singleton class CAN ONLY instantiate once!");
            return;
        }
        Singleton._instanceKey.set(this.constructor, true);        
    }

    protected InitSingleton(): void {}

    public static getInstance<T extends Singleton>(Type?: { new(): T; }): T {
        if (!this._instance) {
            if (undefined == Type) {
                this._instance = new this();
            } else {
                this._instance = new Type();
            }
            this._instance.InitSingleton();
        }

        return <T>this._instance;
    }

    public static get instance() { return this.getInstance(); }
}
