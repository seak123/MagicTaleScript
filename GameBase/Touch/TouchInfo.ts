export default class TouchInfo {
    private static _infos: {[identifier: string]: TouchEvent} = {};

    static syncTouchInfoByTouches(touches: any[]) {
        const visited = [];
        touches.forEach(touch => {
            const id = touch.identifier.toString();
            visited.push(id);
            this.updateTouchInfo(touch);
        });

        Object.keys(this._infos).forEach(id => {
            if (visited.indexOf(id) === -1) {
                delete this._infos[id];
            }
        });
    }

    static updateTouchInfo(touch: any) {
        const id = touch.identifier.toString();
        if (this._infos[id]) {
            this._infos[id].clientX = touch.clientX;
            this._infos[id].clientY = touch.clientY;
        } else {
            const newTouch = new TouchEvent();
            newTouch.identifier = id;
            newTouch.clientX = touch.clientX;
            newTouch.clientY = touch.clientY;
            this._infos[id] = newTouch;
        }
    }

    static getTouchesByController(controller: string): TouchEvent[] {
        if (!controller) return null;

        let ret = [];

        Object.keys(this._infos).forEach(id => {
            if (this._infos[id].controller === controller) {
                ret.push(this._infos[id]);
            }
        });

        return ret;
    }

    static getTouchInfo(touch) {
        return this._infos[touch.identifier.toString()];
    }

    static clearAllTouchInfo() {
        Object.keys(this._infos).forEach(id => {
            delete this._infos[id];
        });
    }
}

export class TouchEvent {
    identifier: string;
    clientX: number;
    clientY: number;
    controller: string;
}