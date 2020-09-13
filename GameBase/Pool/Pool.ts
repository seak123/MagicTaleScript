type PoolInitFunc<T> = (item: T) => void;
type PoolCreateFunc<T> = () => T;

export class Pool<T extends IPoolItem> {
    public initFunc: PoolInitFunc<T>;
    public createFunc: PoolCreateFunc<T>;
    protected _list: Array<T> = [];
    protected _capacity: number = 100;

    constructor(capacity: number = 100) {
        this._capacity = capacity;
    }

    public Fetch(C: new () => T): T {
        if (this._list.length > 0) {
            return this._list.shift();
        } else {
            let newItem: T;
            // create a new T object
            if (this.createFunc) {
                newItem = this.createFunc();
            } else {
                newItem = new C();
            }
            // initialize the new T object
            if (this.initFunc) {
                this.initFunc(newItem);
            }
            return newItem;
        }
    }

    public Recycle(instance: T): void {
        if (instance != null) {
            if (this._list.length >= this._capacity) {
                instance.Release();
                instance = null;
            } else {
                instance.Reset();
                this._list.push(instance);
            }
        }
    }

    public getPoolItems(): Array<T> {
        return this._list;
    }
}

export interface IPoolItem {
    Reset();
    Release();
}

/**
 * entity对象缓存池，T为挂载在entity上的组件
 * 注意：template 是2d对象预设体时，parentTrans 必须是Transform2D；
 *      反之 template 3d 对应 parentTrans Transform
 */
export class EntityPool<T extends G.Script & IPoolItem> extends Pool<T> {
    private template: G.Prefab;
    private parentTrans: engine.TransformBase;
    private poolRoot: engine.TransformBase;
    // tag: if true means template is a Entity2D prefab, parentTrans is type of Transform2D; false means 3d instead.
    private is2D: boolean = false;

    /**
     * 设置参数
     * @param t template prefab
     * @param pTrans 创建出来的entity需要挂载的父节点
     * @param pRoot 被回收的entity需要挂载的父节点
     */
    public SetPrefabAndParent(t: G.Prefab, pTrans: engine.TransformBase, pRoot?: engine.TransformBase): void {
        this.template = t;
        this.parentTrans = pTrans;
        this.poolRoot = pRoot ? pRoot : pTrans;
        this.is2D = null != (pTrans as engine.Transform2D);
    }

    // obsolete function
    public Fetch(C: new () => T): T {
        return null;
    }

    /**
     * 从pool中获取缓存对象，或使用设置的 template Prefab.instantiate() / createFunc()，并挂载/获取组件 C
     * 必须要在创建EntityPool对象后指定 模板预设体 或 创建委托方法 用于创建 Eitity对象
     * @param C 需要挂载的组件类型
     */
    public FetchEntity(C: typeof G.Script): T {
        let newComponent: T;
        if (this._list.length > 0) {
            newComponent = this._list.shift();
            newComponent.entity.active = true;
            newComponent.Reset();
        } else {
            // create a new T object
            if (this.createFunc) {
                newComponent = this.createFunc();
            } else {
                if (!this.template || !this.parentTrans) {
                    return null;
                }
                const newEntity: G.Ett = this.template.instantiate() as G.Ett;
                if (this.is2D) {
                    (this.parentTrans as engine.Transform2D).addChild(newEntity.transform2D);
                } else {
                    (this.parentTrans as engine.Transform3D).addChild(newEntity.transform);
                }
                newComponent = EntityUtil.AddSingleComponent(newEntity, C);
            }
            // initialize the new T object
            if (this.initFunc) {
                this.initFunc(newComponent);
            }
        }
        return newComponent;
    }

    /**
     * 释放一个挂载了组件T的entity对象及
     * @param component T类型的组件
     */
    public RecycleEntity(component: T): void {
        if (component != null) {
            if (this._list.length >= this._capacity) {
                component.Release();
                component.entity.destroy();
                component = null;
            } else {
                component.entity.active = false;
                component.Release();
                if (component.entity.transform2D.parent != this.poolRoot) {
                    if (this.is2D) {
                        (component.entity.transform2D.parent as engine.Transform2D).removeChild(component.entity.transform2D);
                        (this.poolRoot as engine.Transform2D).addChild(component.entity.transform2D);
                    } else {
                        (component.entity.transform.parent as engine.Transform3D).removeChild(component.entity.transform);
                        (this.poolRoot as engine.Transform3D).addChild(component.entity.transform);
                    }
                }
                this._list.push(component);
            }
        }
    }
}
import * as G from "../../G";
import engine from "engine/engine";import EntityUtil from "../UI/EntityUtil";

