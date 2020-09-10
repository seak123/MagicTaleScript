import * as G from "../../G";
import { settings, Component } from "engine/engine";
import EntityUtil from "../../GameBase/UI/EntityUtil";
import StringUtil from "../../GameBase/UI/StringUtil";
import MLogger from "../../GameBase/Debug/MLogger";


export enum WindowDepth {
  Normal1 = 1,
  Normal2,
  Notice,
}

export default class BaseWindow extends G.Script {
  public windowDepth = WindowDepth.Normal1;

  protected static settings;
  private hasBindElements: boolean = false;

  private getSettings() {
    return (<typeof BaseWindow>this.constructor).settings;
  }

  onAwake() {
    this.BindElements();
  }

  public BindElements() {
    if (this.hasBindElements) return;
    this.hasBindElements = true;
    const settings = this.getSettings().Elements;
    if (settings) {
      for (let i = 0; i < settings.length; ++i) {
        const fieldName = settings[i].Alias ? settings[i].Alias : settings[i].Name;
        if (settings[i].Count == null) {
          const com = this.BindElement(settings[i]);
          this[fieldName] = com;
        } else {
          const count = settings[i].Count;
          this[fieldName] = [];
          for (let i = 0; i < count; ++i) {
            const com = this.BindElement(settings[i], i + 1);
            this[fieldName].push(com);
          }
        }
      }
    }
  }

  private BindElement(setting, index?: number) {
    const root = this.entity.transform2D;
    const path = index ? `${setting.Name}${index}` : setting.Name;
    const child = EntityUtil.FindChildByPath(root, path).entity;

    const type = setting.Type;
    const script = setting.Script;
    const handler = setting.Handler;
    const count = setting.Count;

    let com;
    if (type) {
      com = child.getComponent(type);
    } else if (script) {
      com = EntityUtil.AddSingleComponent(child, script);
    }

    if (handler) {
      this.BindElementHandler(com, handler, index);
    }

    return com;
  }

  private BindElementHandler(component: Component, handler, index?: number) {
    for (const key in handler) {
      const funcName = handler[key];

      if (StringUtil.IsNullOrEmpty(funcName)) {
        MLogger.Error("【UI】bindElementHandler: Handler为空");
        continue;
      }
      if (!this[funcName]) {
        MLogger.Error(`【UI】bindElementHandler: 缺少'${funcName}'方法 in script `, this.owner.name);
      }
    }
    if (handler.onClick) {
      this.AddBtnClick(<G.Touchable>component, this, this[handler.onClick], index);
    }
  }

  protected AddBtnClick(component: G.Touchable, caller: any, handler: Function, ...args: any[]) {
    BaseWindow.AddBtnClickStatic(component, caller, handler, ...args);
  }

  static AddBtnClickStatic(component: G.Touchable, caller: any, handler: Function, ...args: any[]) {
    if (null == component) {
      MLogger.Error("[BaseView] AddBtnClickStatic for a null component!");
      return;
    }
    if (null == component.onClick) {
      MLogger.Error("[BaseView] AddBtnClickStatic get a none touchable component!!", component.entity.name);
      return;
    }
    component.onClick.add((sender: G.Touchable, eventArgs: any) => {
      handler.call(caller, ...args /*, sender, eventArgs*/);
    });
  }
}
