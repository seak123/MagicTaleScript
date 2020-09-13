import { Singleton } from "../../GameBase/Base/Singleton";
import ResourceManager from "../Resource/ResourceManager";
import ISystem from "../../GameBase/Base/ISystem";
import * as G from "../../G";
import { EventEmitter } from "eventemitter3";
import EventManager from "../Event/EventManager";
import MathUtil from "../Utils/MathUtil";
import NodeManager from "../Scene/NodeManager";
import TouchInfo from "../../GameBase/Touch/TouchInfo";
import MLogger from "../../GameBase/Debug/MLogger";
import { TouchInputEvent } from "engine/input/touch";
import MGame from "../MGame";



export class Joystick extends Singleton implements ISystem {
    public static KEYBOARD_MOVE: boolean = false;
    private static readonly MOVE_RADIUS: number = 94;

    public readonly ON_TOUCH_DOWN = "JoystickTouchDown";
    public readonly ON_TOUCH_UP = "JoystickTouchUp";
    public readonly ON_TOUCH_MOVE = "JoystickTouchMove";

    static get Instance() { return this.getInstance<Joystick>() }

    private _texture: Texture;
    private _startPos: { x: number; y: number } = { x: 0, y: 0 };
    private _lastPos: { x: number; y: number } = { x: 0, y: 0 };
    private _degree: number;
    private _dirty: boolean;
    private _touching: boolean;
    private _touchMovingParam: any = null;
    get degree() { return this._degree }
    get dirty() { return this._dirty }
    get touching() { return this._touching }
    SetDirty(value: boolean) { this._dirty = value; }

    public hide() { if (this._texture) this._texture.hide(); }
    public show() { if (this._texture) this._texture.show(); }
    public moveTexturePos(offsetX: number) { this._texture.moveOffsetPos(offsetX); }
    public resetTexturePos() { this._texture.resetOffsetPos(); }

    public Init() {
        if (!this._texture) {
            ResourceManager.LoadUIPrefab("UI_Joystick").then((tex: G.Ett) => {
                const container = tex.transform2D.children[0].entity;
                this._texture = new Texture(container);
                this._texture.on(ON_TOUCH_TEXTURE, this.onTouchDown, this);
                this._texture.addedToStage(NodeManager.Instance.normal1Node);
            });
        } else {
            this._texture.addedToStage(NodeManager.Instance.normal1Node);
        }
    }

    public Release() {

    }

    private onAppShow() {
        this.reset();
    }

    private onAppHide() {
        this.removeCanvasListener();
        TouchInfo.clearAllTouchInfo();
    }

    public reset() {
        this._dirty = false;
        this._touching = false;
        this._touchMovingParam = null;
        this._degree = Number.NaN;
        if (this._texture) {
            this._texture.endTouch();
        }
    }

    public release() {
        this._texture.destroy();
        this._texture = null;
    }

    public Update(dt: number) {
        this.updateTouchMoving();
    }

    public move(offsetX, offsetY) {
        let rad: number = Math.atan2(offsetY, offsetX);
        let maxX: number = Joystick.MOVE_RADIUS * Math.abs(Math.cos(rad));
        let maxY: number = Joystick.MOVE_RADIUS * Math.abs(Math.sin(rad));
        offsetX = MathUtil.clamp(offsetX, -maxX, maxX);
        offsetY = MathUtil.clamp(offsetY, -maxY, maxY);

        this._degree = -rad * MathUtil.rad2Deg;

        if (this._texture) {
            this._texture.updateMove(this._degree, this._startPos.x + offsetX, this._startPos.y + offsetY);
        }

        this._dirty = true;
        EventManager.Instance.emit(this.ON_TOUCH_MOVE, this._degree);
    }

    public keyboardMove(offsetX, offsetY) {
        this._startPos.x = this._startPos.y = 0;
        this.move(offsetX, offsetY);
    }
    private onTouchDown(e: TouchInputEvent) {
        MLogger.Log("joystick touch down", e);
        if (!this._touching) {
            const touch = e.touches[0];

            // DebugUtil.Error("hens==========joystick", touch)
            //DebugUtil.Log("joystick touch down: touch id> ",touch.identifier.toString());

            TouchInfo.updateTouchInfo(touch);
            TouchInfo.getTouchInfo(touch).controller = 'joystick';

            this._touching = true;

            const worldPos = MGame.game.rootUICamera.convertEventPositionToUICanvas(G.v2.createFromNumber(touch.clientX, touch.clientY));

            this._startPos.x = worldPos.x;
            this._startPos.y = worldPos.y;
            this._lastPos.x = worldPos.x;
            this._lastPos.y = worldPos.y;

            this._texture.startTouch(this._startPos);
            G.E.canvas.addEventListener('touchmove', this.onTouchMove);
            G.E.canvas.addEventListener('touchend', this.onTouchUp);
            G.E.canvas.addEventListener('touchcancel', this.onTouchCancel);

            EventManager.Instance.emit(this.ON_TOUCH_DOWN);
        }
    }

    private onTouchUp(e: any) {
        const joystickTouch = TouchInfo.getTouchesByController('joystick')[0];
        for (const touch of e.changedTouches) {
            if (joystickTouch.identifier === touch.identifier.toString()) {
                //DebugUtil.Log("joystick touch up", e);
                TouchInfo.syncTouchInfoByTouches(e.touches);

                if (Joystick.Instance._touching) {
                    const joystickTouch = TouchInfo.getTouchesByController('joystick');

                    if (!joystickTouch || joystickTouch.length === 0) {
                        Joystick.Instance.reset();

                        Joystick.Instance.removeCanvasListener();

                        EventManager.Instance.emit(Joystick.Instance.ON_TOUCH_UP);
                    }
                }
                break;
            }
        }
    }

    private onTouchCancel(e: any) {
        const joystickTouch = TouchInfo.getTouchesByController('joystick')[0];
        for (const touch of e.changedTouches) {
            if (joystickTouch.identifier === touch.identifier.toString()) {
                //DebugUtil.Log("joystick touch up", e);
                TouchInfo.syncTouchInfoByTouches(e.touches);

                if (Joystick.Instance._touching) {
                    const joystickTouch = TouchInfo.getTouchesByController('joystick');

                    if (!joystickTouch || joystickTouch.length === 0) {
                        Joystick.Instance.reset();

                        Joystick.Instance.removeCanvasListener();

                        EventManager.Instance.emit(Joystick.Instance.ON_TOUCH_UP);
                    }
                }
                break;
            }
        }
    }

    private removeCanvasListener() {
        G.E.canvas.removeEventListener('touchmove', Joystick.Instance.onTouchMove);
        G.E.canvas.removeEventListener('touchend', Joystick.Instance.onTouchUp);
        G.E.canvas.removeEventListener('touchcancel', Joystick.Instance.onTouchCancel);
    }

    private onTouchMove(e: any) {
        Joystick.Instance._touchMovingParam = e;
    }

    private updateTouchMoving() {
        if (this._touchMovingParam) {

            if (!Joystick.Instance._touching) {
                //this.showCannotMovingReason("摇杆并没有被按下");
                return;
            }

            const joystickTouch = TouchInfo.getTouchesByController('joystick')[0];
            let isJoyTouch = false;

            for (const touch of this._touchMovingParam.changedTouches) {
                if (joystickTouch.identifier === touch.identifier.toString()) {
                    isJoyTouch = true;
                    const worldPos = MGame.game.rootUICamera.convertEventPositionToUICanvas(G.v2.createFromNumber(touch.clientX, touch.clientY));
                    let deltaX: number = worldPos.x - Joystick.Instance._lastPos.x;
                    let deltaY: number = worldPos.y - Joystick.Instance._lastPos.y;

                    //DebugUtil.Log("joystick touch moving: touch pos> x= ", worldPos.x," y=",worldPos.y);

                    Joystick.Instance._lastPos.x = worldPos.x;
                    Joystick.Instance._lastPos.y = worldPos.y;

                    let curTouchGlobalPos = Joystick.Instance._texture.getCurTouchGlobalPos();
                    let touchX = curTouchGlobalPos.x + deltaX;
                    let touchY = curTouchGlobalPos.y + deltaY;

                    let offsetX = touchX - Joystick.Instance._startPos.x;
                    let offsetY = touchY - Joystick.Instance._startPos.y;
                    Joystick.Instance.move(offsetX, offsetY);
                    break;
                }
            }
            if (!isJoyTouch && this._touching) {
                let curTouchGlobalPos = Joystick.Instance._texture.getCurTouchGlobalPos();
                Joystick.Instance.move(curTouchGlobalPos.x - Joystick.Instance._startPos.x, curTouchGlobalPos.y - Joystick.Instance._startPos.y);
            }
        }
    }

    private _lastShowCannotMovingTime: number = 0;
    private showCannotMovingReason(content: string) {
        let nowTime = Date.now();
        if (nowTime - this._lastShowCannotMovingTime >= 10 * 1000) {
            this._lastShowCannotMovingTime = nowTime;
        }
    }
}

const ON_TOUCH_TEXTURE = "TouchTexture";

class Texture extends EventEmitter {
    private _joyStick: G.Ett;
    private _touchArea: G.Ett;
    private _background: G.Sp;
    private _direction: G.Sp;
    private _touch: G.Sp;
    private _touchInput: G.TouchInputComponent;

    private _joyStickInitPosX: number;
    private _originPos: G.v2;

    constructor(tex) {
        super();
        this._joyStick = tex;
        this._joyStick.transform2D.travelChild(child => {
            if (child.entity.name === "Background") {
                this._background = child.entity.getComponent(G.E.UISprite);
            } else if (child.entity.name === "Foreground") {
                this._direction = child.entity.getComponent(G.E.UISprite);
            } else if (child.entity.name === "Touch") {
                this._touch = child.entity.getComponent(G.E.UISprite);
            } else if (child.entity.name === "JoystickContainer") {
                this._touchArea = child.entity;
            }
        });

        this._originPos = G.v2.createFromNumber(this._background.entity.transform2D.position.x, this._background.entity.transform2D.position.y);

        this._background.entity.active = true;
        this._direction.entity.active = false;
        this._touch.entity.active = true;

        // this._touchArea.addComponent(G.E.UISprite);
        // this._touchArea.addComponent(G.E.UIButton);
        this._touchInput = this._touchArea.getComponent(G.E.TouchInputComponent) as G.TouchInputComponent;
        // // touchInput.hitArea = new G.Rect(-185, -121, 370, 242);
        // touchInput.hitArea = new G.Rect(-150, -150, 400, 300);
        this._touchInput.onTouchStart.add((sender, e) => {
            this.emit(ON_TOUCH_TEXTURE, e);
        });
        // touchInput["onTouchStart"] = e => {
        //     this.emit(ON_TOUCH_TEXTURE, e);
        // };

    }

    public hide() { this._touchArea.active = false }
    public show() { this._touchArea.active = true }
    public moveOffsetPos(offset: number) { this._joyStick.transform2D.position.x = offset + this._joyStickInitPosX; }
    public resetOffsetPos() { this._joyStick.transform2D.position.x = this._joyStickInitPosX; }
    public addedToStage(joyStickNode: G.Ett) {
        joyStickNode.transform2D.addChild(this._joyStick.transform2D);
        this._joyStickInitPosX = this._joyStick.transform2D.position.x;
        // 摇杆放到最底层
        this._joyStick.transform2D.setSiblingIndex(0);
        this._touchArea.active = true;
    }

    public getCurTouchGlobalPos() {
        return this._touch.entity.transform2D.worldPosition.clone();
    }

    public startTouch(stagePos: { x: number; y: number }) {
        let localPos = this._touchArea.transform2D.convertWorldPositionToLocal(G.v2.createFromNumber(stagePos.x, stagePos.y));
        //logger.error("startTouch pos:", localPos.x, " ", localPos.y);
        this._touch.entity.transform2D.position = localPos;
        this._background.entity.transform2D.position = localPos;
        this._direction.entity.transform2D.position = localPos;
        this._direction.entity.active = true;
    }

    public endTouch() {
        this._touch.entity.transform2D.position = this._originPos;
        this._background.entity.transform2D.position = this._originPos;
        this._direction.entity.transform2D.position = this._originPos;
        this._direction.entity.active = false;
    }

    public updateMove(degree: number, touchPosX: number, touchPosY: number) {
        this._direction.entity.transform2D.rotation = (90 + degree) * MathUtil.deg2Rad;
        let localTouchPos = this._touchArea.transform2D.convertWorldPositionToLocal(G.v2.createFromNumber(touchPosX, touchPosY));
        this._touch.entity.transform2D.position = localTouchPos;
    }

    public destroy() {
        this._joyStick.destroy();
    }
}


