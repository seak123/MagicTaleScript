
import { EventEmitter } from "eventemitter3";
import * as G from "../../G";
import { TouchInputEvent } from "engine/input/touch";
import MLogger from "../../GameBase/Debug/MLogger";

export default class EventManager extends EventEmitter {
    private static _instance: EventManager;
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    public eventNames(): Array<any> {
        return super.eventNames();
    }

    public listeners(event: any): Array<any> {
        return super.listeners(event);
    }

    public listenerCount(event: any): number {
        return super.listenerCount(event);
    }

    public emit(event: any, ...args: Array<any>): boolean {
        return super.emit(event, ...args);
    }

    public on(event: any, fn: any, context?: any): this {
        return super.on(event, fn, context);
    }

    public once(event: any, fn: any, context?: any): this {
        return super.once(event, fn, context);
    }

    public off(event: any, fn: any, context?: any, once?: boolean): this {
        return super.off(event, fn, context, once);
    }

    public offAll(event: any) {
        return super.removeAllListeners(event);
    }
}

/**
* 引擎TouchManager.onEventTrigger点击事件的EventManager封装
* 1、防止多处使用，导致G.TouchManager.onEventTrigger被注册了过多的事件
* 2、避免要先注销再注册，否则会多次注册的问题
*/
export type TouchEventCallback = (sender: G.Component, touchEvent: TouchInputEvent) => void;
export class TouchEventManager {
    // touch event事件名常量
    public static readonly TouchEventManager_TouchEvent_Name = "TouchEventManager_TouchEvent_Name";
    // 所有注册的touch listener
    private static touchListeners: Map<(sender: G.Component, touchEvent: TouchInputEvent) => void, any> =
        new Map<TouchEventCallback, any>();
    // TouchManager.onEventTrigger的handler
    private static touchEventHandler: TouchEventCallback = null;
    // 检查是否需要注册
    private static checkInit(): void {
        if (null == TouchEventManager.touchEventHandler) {
            TouchEventManager.touchEventHandler = (sender: G.Component, touchE: TouchInputEvent) => {
                const allKeys: IterableIterator<TouchEventCallback> = TouchEventManager.touchListeners.keys();
                let it: IteratorResult<TouchEventCallback>;
                while (it = allKeys.next(), !it.done) {
                    const context: any = TouchEventManager.touchListeners.get(it.value);
                    if (context) {
                        it.value.call(context, sender, touchE);
                    } else {
                        it.value(sender, touchE);
                    }
                }
            };
            G.TouchManager.onEventTrigger.add(TouchEventManager.touchEventHandler);
        }
    }

    // 点击事件的注册 -- 控件点击，只有点击到控件的时候才有回调
    public static on(fn: TouchEventCallback, context?: any): boolean {
        if (TouchEventManager.touchListeners.has(fn) &&
            TouchEventManager.touchListeners.get(fn) == context) {
            MLogger.Log("[TouchEventManager] on: CAN ONLY add listener for one context once!");
            return false;
        }

        TouchEventManager.touchListeners.set(fn, context);
        TouchEventManager.checkInit();
        return true;
    }
    // 点击事件的注销 -- 控件点击，只有点击到控件的时候才有回调
    public static off(fn: TouchEventCallback): void {
        if (TouchEventManager.touchListeners.has(fn)) {
            TouchEventManager.touchListeners.delete(fn);
            if (TouchEventManager.touchListeners.size <= 0) {
                G.TouchManager.onEventTrigger.remove(TouchEventManager.touchEventHandler);
                TouchEventManager.touchEventHandler = null;
            }
        }
    }

    // ------------------------------------------- touch on screen -----------------------------------------
    // touch screen常量
    public static readonly TouchEventManager_TouchScreen_Name = "TouchEventManager_TouchScreen_Name";
    // 所有注册的touch listener
    private static touchScreens: Array<{ fn: (touchEvent: TouchEvent) => void, context: any }> =
        new Array<{ fn: (touchEvent: TouchEvent) => void, context: any }>();
    // G.E.canvas.addEventListener的handler
    private static touchScreenHandler: (touchEvent: TouchEvent) => void = null;
    // 检查是否需要注册
    private static checkInitTouchScreen(): void {
        if (null == TouchEventManager.touchScreenHandler) {
            TouchEventManager.touchScreenHandler = (touchEvent: TouchEvent) => {
                for (let i: number = 0; i < TouchEventManager.touchScreens.length; ++i) {
                    const item: { fn: (touchEvent: TouchEvent) => void, context: any } = TouchEventManager.touchScreens[i];
                    if (item.context) {
                        item.fn.call(item.context, touchEvent);
                    } else {
                        item.fn(touchEvent);
                    }
                }
            };
            G.E.canvas.addEventListener("touchstart", TouchEventManager.touchScreenHandler);
        }
    }

    // 点击事件的注册 -- 控件点击，只有点击到控件的时候才有回调
    public static onScreen(fn: (touchEvent: TouchEvent) => void, context?: any): boolean {
        for (let i: number = 0; i < TouchEventManager.touchScreens.length; ++i) {
            const item: { fn: (touchEvent: TouchEvent) => void, context: any } = TouchEventManager.touchScreens[i];
            if (item.fn == fn && item.context == context) {
                MLogger.Log("[TouchEventManager] onScreen: CAN ONLY add listener for one context once!");
                return false;
            }
        }

        TouchEventManager.touchScreens.push({ fn: fn, context: context });
        TouchEventManager.checkInitTouchScreen();
        return true;
    }
    // 点击事件的注销 -- 控件点击，只有点击到控件的时候才有回调
    public static offScreen(fn: (touchEvent: TouchEvent) => void, context?: any): void {
        for (let i: number = TouchEventManager.touchScreens.length - 1; i >= 0; --i) {
            const item: { fn: (touchEvent: TouchEvent) => void, context: any } = TouchEventManager.touchScreens[i];
            if (item.fn == fn && item.context == context) {
                TouchEventManager.touchScreens.splice(i, 1);
                break;
            }
        }
        if (TouchEventManager.touchScreens.length <= 0) {
            G.E.canvas.removeEventListener("touchstart", TouchEventManager.touchScreenHandler);
            TouchEventManager.touchScreenHandler = null;
        }
    }
}
