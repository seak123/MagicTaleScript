/* eslint-disable spaced-comment */
// eslint-disable-next-line @typescript-eslint/no-triple-slash-reference
import engine from "engine";

const _window: any = window;

export const E = engine;
export const Loader = E.loader;
// export const loader = Enginengine.engineInstancengine.loader;
export const TouchManager = engine.game.rootUICamera.touchManager;

export class Ett extends engine.Entity { }
export class Prefab extends engine.Prefab { }
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class v2 extends engine.Vector2 {
    // static readonly ONE = v2.createFromNumber(1, 1);
    static readonly UP = v2.createFromNumber(0, 1);
    static readonly DOWN = v2.createFromNumber(0, -1);
    static readonly LEFT = v2.createFromNumber(-1, 0);
    static readonly RIGHT = v2.createFromNumber(1, 0);
}
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class v3 extends engine.Vector3 {
    /*
    static readonly ONE = v3.createFromNumber(1, 1, 1);
    static readonly FORWARD = v3.createFromNumber(0, 0, -1);
    static readonly BACK = v3.createFromNumber(0, 0, 1);
    static readonly UP = v3.createFromNumber(0, 1, 0);
    static readonly DOWN = v3.createFromNumber(0, -1, 0);
    static readonly LEFT = v3.createFromNumber(-1, 0, 0);
    static readonly RIGHT = v3.createFromNumber(1, 0, 0);
    */
}
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class v4 extends engine.Vector4 {
    /*
    static readonly ONE = v4.createFromNumber(1, 1, 1, 1);
    */
}

export type DelegateHandler<S, E> = (sender: S, eventArgs: E) => any;
export interface IKeyboardEventRes { value: string; }

export type Component = engine.Component;
export class Point extends v2 { }
export class Quat extends engine.Quaternion { }
export class M4 extends engine.Matrix4 { }
export class SP3D extends engine.Entity { }
// export class Tb extends engine.TransformBase { }
export class Tf2D extends engine.Transform2D { }
export class Tf3D extends engine.Transform3D { }
export class Mask extends engine.UIMask { }
export class Button extends engine.UIButton { }
export class Toggle extends engine.UIToggle { }
export class ToggleGroup extends engine.UIToggleGroup { }
export class Input extends engine.UITextInput { }
export class RichText extends engine.UIRichText { }
export class Game extends engine.Game { }
export class MeshRenderer extends engine.MeshRenderer { }
export class SkinnedMeshRenderer extends engine.SkinnedMeshRenderer { }
export class LineRenderer extends engine.LineRenderer { }
export class Particle extends engine.Particle { }
export class SpFrame extends engine.SpriteFrame { }
export class Tex2D extends engine.Texture2D { }
export class Rect extends engine.Rect { }
export class Animator extends engine.Animator { }
export class AnimationClip extends engine.AnimationClip { }
export class Animation extends engine.Animation {}
export class AnimatorController extends engine.AnimatorController { }
export class Material extends engine.Material { }
export class Effect extends engine.Effect { }
export class Anchor extends engine.UIAnchor { }
export class PostProcessComponent extends engine.PostProcessComponent { }
// export class Scene extends engine.Scene {}
export class Color extends engine.Color {
    static readonly RED = new Color(255, 0, 0, 255);
    static readonly GREEN: Color = new Color(0, 255, 0, 255);
    static readonly BLUE: Color = new Color(0, 0, 255, 255);
    //static readonly WHITE: Color = new Color(255, 255, 255, 255);
    //static readonly BLACK: Color = new Color(0, 0, 0, 255);
    static readonly YELLOW: Color = new Color(255, 235, 4, 255);
    static readonly CYAN: Color = new Color(0, 255, 255, 255);
    static readonly MAGENTA: Color = new Color(255, 0, 255, 255);
    static readonly PURPLE: Color = new Color(255, 192, 203, 255);
    static readonly ORANGE: Color = new Color(255, 97, 0, 255);
    static readonly GRAY: Color = new Color(128, 128, 128, 255);
    static readonly GREY: Color = new Color(128, 128, 128, 255);
    static readonly CLEAR: Color = new Color(0, 0, 0, 0);

    static readonly QUALITY_COLOR: Color[] =
        [
            Color.WHITE,
            new Color(19, 232, 50, 255),
            new Color(15, 174, 255, 255),
            new Color(204, 59, 239, 255),
            new Color(255, 129, 0, 255),
            new Color(255, 255, 2, 255)
        ];
}

export enum UISpriteFlipType {
    Nothing,
    Horizontally,
    Vertically,
    Both,
}

export class Script extends engine.Script {
    public get owner(): Ett {
        return this.entity;
    }
}
export class Wgt extends engine.UIWidget { }
export class Sp extends engine.UISprite {
    public atlasName: string;
    public spriteName: string;
}
export class Font extends engine.Font {}
export class Label extends engine.UILabel { }
export class ScrollView extends engine.UIScrollView { }
export class Grid extends engine.UIGrid { }
export class RenderTexture extends engine.RenderTexture { }
export class Graphic extends engine.UIGraphic { }

// export class Canvas extends engine.UICanvas {}
export class Cam extends engine.Camera { }
export class Dl extends engine.DirectionalLight { }
export class Touchable extends engine.Touchable { }
export class TouchInputComponent extends engine.TouchInputComponent { }
export class KeyboardInputComponent extends engine.KeyboardInputComponent { }
export class RayCaster extends engine.Raycaster { }
export class ColorUtils {
    public static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // TODO improve ...
    public static HexToColor(hex: string) {
        // hex should begin with "#"
        const hexStr = hex.slice(1);
        const red = hexStr.slice(0, 2);
        const green = hexStr.slice(2, 4);
        const blue = hexStr.slice(4, 6);
        let alpha = "FF";
        if (hexStr.length > 6) {
            alpha = hexStr.slice(6, 8);
        }

        // ABGR format
        const hexNum = parseInt(alpha + blue + green + red, 16);
        return engine.Color.fromHex(hexNum);

        // NOTE RGBA format
        // let hexStr = hex.slice(1);
        // if (hexStr.length > 6) {
        //     let hexNum = parseInt(hexStr, 16);
        //     return engine.Color.fromHex(hexNum);
        // } else {
        //     let hexNum = parseInt(hexStr + "FF", 16);
        //     return engine.Color.fromHex(hexNum);
        // }
    }

    public static Grayscale(color: Color): number {
        if (color) {
            return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
        }

        return 0;
    }
}

export function ScreenPosToGlob(screenPos: Point, createNewPoint?: boolean) {
    const stageX = screenPos.x;
    const stageY = screenPos.y;

    let result = screenPos;
    if (createNewPoint) {
        result = new Point();
    }
    result.x = stageX;
    result.y = stageY;
    return result;
}

// export function FindChildByPath(root:Tb, path:string):Tb{
//     if(path == ".") return root;

//     let names = path.split("/");
//     let node = root;
//     names.forEach(name => {
//         if(!node) return;

//         node = nodengine.findChildByName(name);
//     });

//     return node;
// }

export function getComponentsIncludeChild(node: Ett, clas: any): Array<any> {
    if (!node) return;

    const result = [];
    const components = node.getComponents(clas);

    if (components) {
        components.forEach((component) => {
            result.push(component);
        });
    }

    if (node.transform && node.transform.childrenCount > 0) {
        node.transform.travelChild((child: Tf3D) => {
            if (child !== node.transform) {
                const childComponents = getComponentsIncludeChild(child.entity, clas);
                if (childComponents && childComponents.length) {
                    childComponents.forEach((component) => {
                        result.push(component);
                    });
                }
            }
        });
    }

    return result;
}

export function getComponentsIncludeChild2D(node: Ett, clas: any): Array<any> {
    const result = [];
    if (!node) return result;

    const components = node.getComponents(clas);

    if (components) {
        components.forEach((component) => {
            result.push(component);
        });
    }

    if (node.transform2D && node.transform2D.childrenCount > 0) {
        node.transform2D.travelChild((child: Tf2D) => {
            if (child !== node.transform2D) {
                const childComponents = getComponentsIncludeChild2D(child.entity, clas);
                if (childComponents && childComponents.length) {
                    childComponents.forEach((component) => {
                        result.push(component);
                    });
                }
            }
        });
    }

    return result;
}

export function getComponentInParent(node: Ett, clas: any) {
    const component = node.getComponent(clas);

    if (component) {
        return component;
    } else {
        const parent = node.transform.parent;
        if (parent) {
            return getComponentInParent(parent.entity, clas);
        } else {
            return null;
        }
    }
}

export class LoopIndicator {
    public t: number;
}

/**
 * 开启一个循环
 * @param caller 调用者
 * @param method 执行方法
 */
export function StartLoop(caller: any, method: Function): LoopIndicator {
    const localCaller = caller;
    const indicator: LoopIndicator = new LoopIndicator();
    const loopFunc = () => {
        const inkey = window.requestAnimationFrame(loopFunc); //  这一句要放在回调之前，否则不能取消循环
        indicator.t = inkey;
        method.apply(localCaller);
    };
    const outKey = window.requestAnimationFrame(loopFunc);
    indicator.t = outKey;
    return indicator;
}

/**
 * 结束一个循环
 * @param loopIndicator 由StartLoop方法返回的循环句柄
 */
export function EndLoop(loopIndicator: LoopIndicator) {
    if (loopIndicator) {
        window.cancelAnimationFrame(loopIndicator.t);
        loopIndicator = null;
    }
}

let BaseUrl: string;
