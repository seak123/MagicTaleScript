import { IPoolItem } from "../../../GameBase/Pool/Pool";
import * as G from "../../../G";

export default class MEntity extends G.Script implements IPoolItem {

    private uid: number;

    Init(uid) {
        this.uid = uid;
    }

    Reset() {

    }
    Release() {

    }

}