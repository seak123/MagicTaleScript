import { IPoolItem } from "../../../GameBase/Pool/Pool";
import BaseComponent from "./BaseComponent";
import * as G from "../../../G";

export default class Transform extends BaseComponent {

    public position: G.v2;
    public speed: number;

    Reset() {
        this.position = G.v2.ZERO;
        this.speed = 0;
    }
    Release() {

    }

}