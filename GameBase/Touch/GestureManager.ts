// desc gesture manager for easy touch event handling
// maintainer hugoyu
// NOTE 1. exclude UI elements(by using over UI checker)
//      2. can simulate pinch gestures by ctrl key press
//      3. do not support other gestures now(twist, > 2 fingers gestures etc.)
//      4. wx do not support keyboard input ... just use script codes to simulate pinch ...
// TODO improve


import * as G from "../../G";
import MLogger from "../Debug/MLogger";
import { Singleton } from "../Base/Singleton";
import GameUtil from "../../GameLogic/Utils/GameUtil";
import EventManager from "../../GameCore/Event/EventManager";
import EventConst from "../../GameCore/Constant/EventConst";
import ISystem from "../Base/ISystem";

export enum GestureType {
    SingleTap = "SingleTap", // need touch up
    DoubleTap = "DoubleTap", // need touch up
    LongTap = "LongTap", // no need touch up ?
    Swipe = "Swipe", // no need touch up
    Pinch = "Pinch", // no need touch up
};

export class GestureData {
    readonly Type: GestureType; // gesture type
    readonly TapPos: G.v2; // tap position : clinetX, clientY
    readonly SwipeDir: G.v2; // swipe direction
    readonly PinchVal: number; // < 0 means pinch in, > 0 means pinch out (do not consider = 0), numerical value means pinch degree

    constructor(type: GestureType, tapPos?: G.v2, swipeDir?: G.v2, pinchVal?: number) {
        this.Type = type;
        this.TapPos = tapPos || G.v2.ZERO;
        this.SwipeDir = swipeDir || G.v2.ZERO;
        this.PinchVal = pinchVal || 0;
    }

    toString(): string {
        return `[GestureData] { 
                Type : ${this.Type}, 
                TapPos : ${MLogger.ToStringV2(this.TapPos)}, 
                SwipeDir : ${MLogger.ToStringV2(this.SwipeDir)}, 
                PinchVal : ${this.PinchVal} }`;
    }
}

export interface GestureOverUIChecker {
    (touchPos: G.v2): boolean;
}

// gesture touch info
class GestureTouch {
    ID: number;
    X: number;
    Y: number;

    constructor(id: number, x: number, y: number) {
        this.ID = id;
        this.X = x;
        this.Y = y;
    }

    toString(): string {
        return `[GestureTouch] { 
                ID : ${this.ID}, 
                X : ${this.X}, 
                Y : ${this.Y} }`;
    }
}

// internal data used by GestureManager
class GestureTraceData {
    ID: number;
    StartPos: G.v2;
    StartTime: number;
    PrePos: G.v2;
    Status: string;

    constructor(id: number, startPos: G.v2, startTime: number, prePos: G.v2, status?: string) {
        this.ID = id;
        this.StartPos = startPos;
        this.StartTime = startTime;
        this.PrePos = prePos;
        this.Status = status || ""; // "" means init status
    }

    toString(): string {
        return `[GestureTraceData] { 
                ID : ${this.ID}, 
                StartPos : ${MLogger.ToStringV2(this.StartPos)}, 
                StartTime : ${this.StartTime}, 
                PrePos : ${MLogger.ToStringV2(this.PrePos)},
                Status : ${this.Status} }`;
    }
}

// most for handling double tap
class GestureHistoryData {
    StartPos: G.v2;
    StartTime: number;
    EndTime: number;

    constructor(startPos: G.v2, startTime: number, endTime: number) {
        this.StartPos = startPos;
        this.StartTime = startTime;
        this.EndTime = endTime;
    }

    toString(): string {
        return `[GestureHistoryData] { 
                StartPos : ${MLogger.ToStringV2(this.StartPos)}, 
                StartTime : ${this.StartTime}, 
                Endtime : ${this.EndTime} }`;
    }
}

// most for handling pinch
class GesturePairData {
    ID1: number;
    ID2: number;
    Status: string;

    constructor(id1: number, id2: number, status: string) {
        this.ID1 = id1;
        this.ID2 = id2;
        this.Status = status;
    }

    toString(): string {
        return `[GesturePairData] { 
                ID1 : ${this.ID1}, 
                ID2 : ${this.ID2}, 
                Status : ${this.Status} }`;
    }
}

export class GestureManager extends Singleton implements ISystem {
    static get Instance(): GestureManager {
        return this.getInstance<GestureManager>();
    }

    // stationary tolerance during 1 tap
    private m_tapStationaryTolerance: number = 5;

    public get TapStationaryTolerance(): number {
        return this.m_tapStationaryTolerance;
    }

    public set TapStationaryTolerance(tolerance: number) {
        this.m_tapStationaryTolerance = tolerance;
    }

    // stationary tolerance between 2 taps
    // TODO make a better name ?
    private m_doubleTapStationaryTolerance: number = 10;

    public get DoubleTapStationaryTolerance(): number {
        return this.m_doubleTapStationaryTolerance;
    }

    public set DoubleTapStationaryTolerance(tolerance: number) {
        this.m_doubleTapStationaryTolerance = tolerance;
    }

    // double time interval in milliseconds between 2 taps
    private m_doubleTapMaxInterval: number = 300;

    public get DoubleTapMaxInterval(): number {
        return this.m_doubleTapMaxInterval;
    }

    public set DoubleTapMaxInterval(interval: number) {
        this.m_doubleTapMaxInterval = interval;
    }

    // long time interval in milliseconds
    private m_longTapMinInterval: number = 1500;

    public get LongTapMinInterval(): number {
        return this.m_longTapMinInterval;
    }

    public set LongTapMinInterval(interval: number) {
        this.m_longTapMinInterval = interval;
    }

    private m_pinchSimulationEnable: boolean = false;

    public get PinchSimulationEnable(): boolean {
        return this.m_pinchSimulationEnable;
    }

    public set PinchSimulationEnable(enable: boolean) {
        this.m_pinchSimulationEnable = enable;
    }

    // implementation detail, pinch simulation touch id offset
    private readonly PINCH_SIMULATION_TOUCH_ID_OFFSET: number = 100;

    // over UI checker for cooperating with UI
    private m_overUIChecker: GestureOverUIChecker = GameUtil.IsTouchOverUI.bind(GameUtil);

    public get OverUIChecker(): GestureOverUIChecker {
        return this.m_overUIChecker;
    }

    public set OverUIChecker(checker: GestureOverUIChecker) {
        this.m_overUIChecker = checker;
    }

    // internal data
    private m_historyData: GestureHistoryData[] = [];
    private m_traceData: { [ID: number]: GestureTraceData } = {};
    private m_pairData: GesturePairData[] = [];
    private m_historyDataBuffer: GestureHistoryData[] = [];
    private m_traceDataBuffer: GestureTraceData[] = [];

    // event listeners, ugly ...
    private m_keyDownListener: EventListener = null;
    private m_keyPressListener: EventListener = null;
    private m_keyUpListener: EventListener = null;
    private m_touchStartListener: EventListener = null;
    private m_touchMoveListener: EventListener = null;
    private m_touchEndListener: EventListener = null;
    private m_touchCancelListener: EventListener = null;

    constructor() {
        super();

        this.m_keyDownListener = this.OnKeyDown.bind(this);
        this.m_keyPressListener = this.OnKeyPress.bind(this);
        this.m_keyUpListener = this.OnKeyUp.bind(this);
        this.m_touchStartListener = this.OnTouchStart.bind(this);
        this.m_touchMoveListener = this.OnTouchMove.bind(this);
        this.m_touchEndListener = this.OnTouchEnd.bind(this);
        this.m_touchCancelListener = this.OnTouchCancel.bind(this);

        G.E.canvas.addEventListener("keydown", this.m_keyDownListener);
        G.E.canvas.addEventListener("keypress", this.m_keyPressListener);
        G.E.canvas.addEventListener("keyup", this.m_keyUpListener);
        G.E.canvas.addEventListener("touchstart", this.m_touchStartListener);
        G.E.canvas.addEventListener("touchmove", this.m_touchMoveListener);
        G.E.canvas.addEventListener("touchend", this.m_touchEndListener);
        G.E.canvas.addEventListener("touchcancel", this.m_touchCancelListener);
    }

    Init(){
        
    }

    Release() {

        G.E.canvas.removeEventListener("keydown", this.m_keyDownListener);
        G.E.canvas.removeEventListener("keypress", this.m_keyPressListener);
        G.E.canvas.removeEventListener("keyup", this.m_keyUpListener);
        G.E.canvas.removeEventListener("touchstart", this.m_touchStartListener);
        G.E.canvas.removeEventListener("touchmove", this.m_touchMoveListener);
        G.E.canvas.removeEventListener("touchend", this.m_touchEndListener);
        G.E.canvas.removeEventListener("touchcancel", this.m_touchCancelListener);

        // clear trace data
        this.m_historyData.length = 0;
        this.m_traceData = {};
        this.m_pairData.length = 0;
        this.m_historyDataBuffer.length = 0;
        this.m_traceDataBuffer.length = 0;
    }

    private IsTouchOverUI(touchPos: G.v2): boolean {
        if (this.m_overUIChecker) {
            return this.m_overUIChecker(touchPos);
        }

        // default return false
        return false;
    }

    private OnKeyDown(e: KeyboardEvent) {
        // TODO implement
    }

    private OnKeyPress(e: KeyboardEvent) {
        // TODO implement
    }

    private OnKeyUp(e: KeyboardEvent) {
        // TODO implement
    }

    private GetPairData(id1: number, id2?: number): GesturePairData {
        for (let pairData of this.m_pairData) {
            if (pairData.ID1 === id1 || pairData.ID2 === id1) {
                if (!id2) {
                    // when no second param, just check first param
                    return pairData;
                }
                else {
                    if (pairData.ID1 === id2 || pairData.ID2 === id2) {
                        return pairData;
                    }
                }
            }
        }

        return null;
    }

    private RemovePairData(id1: number, id2?: number): boolean {
        let pairData = this.GetPairData(id1, id2);
        if (pairData) {
            // update trace status
            let traceData1 = this.m_traceData[pairData.ID1];
            if (traceData1) {
                traceData1.Status = "pc";
            }
            let traceData2 = this.m_traceData[pairData.ID2];
            if (traceData2) {
                traceData2.Status = "pc";
            }
            // remove pair data
            this.m_pairData.splice(this.m_pairData.indexOf(pairData), 1);
            return true;
        }

        return false;
    }

    private CancelPairGesture(touchCount: number): boolean {
        // when raw touch count >= 3 (change to real touch count >= 3 ?)
        if (touchCount >= 3) {
            // clear trace status
            for (let pairData of this.m_pairData) {
                let traceData1 = this.m_traceData[pairData.ID1];
                if (traceData1) {
                    traceData1.Status = "pc";
                }
                let traceData2 = this.m_traceData[pairData.ID2];
                if (traceData2) {
                    traceData2.Status = "pc";
                }
            }
            // clear pair data
            this.m_pairData.length = 0;
            return true;
        }

        return false;
    }

    private IsValidGestureTouch(touch: GestureTouch): boolean {
        if (touch) {
            let touchID = touch.ID;
            let traceData = this.m_traceData[touchID];
            if (traceData) {
                // touch is old, check ui status
                return traceData.Status != "ui";
            }
            else {
                // touch is new, check ui touch
                let touchPos = G.v2.createFromNumber(touch.X, touch.Y);
                return !this.IsTouchOverUI(touchPos);
            }
        }

        return false;
    }

    private HandlePairGestureStart(touches: GestureTouch[]): boolean {
        if (touches.length == 2) {
            let touch1 = touches[0];
            let touch2 = touches[1];
            if (this.IsValidGestureTouch(touch1) &&
                this.IsValidGestureTouch(touch2)) {
                if (!this.GetPairData(touch1.ID, touch2.ID)) {
                    // just support pinch now
                    this.m_pairData.push(new GesturePairData(touch1.ID, touch2.ID, "pi"));
                }
            }
        }

        return false;
    }

    private HandlePairGestureMove(touches: GestureTouch[]): boolean {
        // NOTE now we just support one pinch at a time (when there is >= 3 touch, pair gesture will be canceled, see CancelPairGesture)
        for (let i = 0; i < touches.length; ++i) {
            let touch = touches[i];
            let touchID = touch.ID;
            let pairData = this.GetPairData(touchID);
            if (pairData) {
                let traceData1 = this.m_traceData[pairData.ID1];
                let traceData2 = this.m_traceData[pairData.ID2];
                if (touchID === pairData.ID2) {
                    traceData1 = this.m_traceData[pairData.ID2];
                    traceData2 = this.m_traceData[pairData.ID1];
                }

                let touchAnother = null;
                for (let j = i + 1; j < touches.length; ++j) {
                    if (touches[j].ID == traceData2.ID) {
                        touchAnother = touches[j];
                        break;
                    }
                }

                let preDistance = traceData2.PrePos.sub(traceData1.PrePos).length();
                traceData1.PrePos = G.v2.createFromNumber(touch.X, touch.Y);
                if (touchAnother) {
                    traceData2.PrePos = G.v2.createFromNumber(touchAnother.X, touchAnother.Y);
                }
                let curDistance = traceData2.PrePos.sub(traceData1.PrePos).length();

                // emit pinch when distance change ?
                if (curDistance != preDistance) {
                    EventManager.Instance.emit(GestureType.Pinch, new GestureData(GestureType.Pinch, G.v2.ZERO, G.v2.ZERO, curDistance - preDistance));
                    // can return now, since we just support one pinch at a time
                    return true;
                }
                else {
                    return false;
                }
            }
        }

        return false;
    }

    // just clear pair data here
    private HandlePairGestureEnd(touches: GestureTouch[]): boolean {
        let result = false;

        for (let i = 0; i < touches.length; ++i) {
            let touch = touches[i];
            let touchID = touch.ID;
            result = result || this.RemovePairData(touchID);
        }

        return result;
    }

    private GetSimulationTouch(touch: Touch): GestureTouch {
        let simTouchID = touch.identifier + this.PINCH_SIMULATION_TOUCH_ID_OFFSET;
        let halfWidth = G.E.canvas.width * 0.5;
        let halfHeight = G.E.canvas.height * 0.5;
        let offsetX = touch.clientX - halfWidth;
        let offsetY = touch.clientY - halfHeight;
        let simClientX = halfWidth - offsetX;
        let simClientY = halfHeight - offsetY;

        return new GestureTouch(simTouchID, simClientX, simClientY);
    }

    // most for pinch simulation
    private ProcessTouch(touches: TouchList, event: TouchEvent, phase: string): GestureTouch[] {
        let processTouch: GestureTouch[] = [];
        //touch event notify
        EventManager.Instance.emit(EventConst.ON_TOUCH_NOTIFY);

        for (let i = 0; i < touches.length; ++i) {
            processTouch.push(new GestureTouch(touches[i].identifier, touches[i].clientX, touches[i].clientY));
        }

        if (phase === "end") {
            // when touch end, we always try to add pinch simulation touch
            for (let i = 0; i < touches.length; ++i) {
                let touch = touches[i];
                let touchID = touch.identifier;
                let simTouchID = touchID + this.PINCH_SIMULATION_TOUCH_ID_OFFSET;
                if (this.m_traceData[simTouchID]) {
                    processTouch.push(this.GetSimulationTouch(touch));
                }
            }
        }
        else {
            if (this.m_pinchSimulationEnable) {
                // try simulate pinch
                if (touches.length == 1) {
                    processTouch.push(this.GetSimulationTouch(touches[0]));
                }
            }
        }

        return processTouch;
    }

    private OnTouchStart(e: TouchEvent) {
        //let touches = e.touches;
        let touches = this.ProcessTouch(e.touches, e, "start");

        if (!this.CancelPairGesture(touches.length)) {
            // cancel fail, means touch count <= 2
            this.HandlePairGestureStart(touches);
        }

        for (let i = 0; i < touches.length; ++i) {
            let touch = touches[i];
            let touchID = touch.ID;
            let traceData = this.m_traceData[touchID];
            if (!traceData) {
                // touch is new
                let touchPos = G.v2.createFromNumber(touch.X, touch.Y);
                if (!this.IsTouchOverUI(touchPos)) {
                    let touchPairData = this.GetPairData(touchID);
                    let touchStatus = touchPairData ? touchPairData.Status : "";
                    let touchTime = Date.now();
                    this.m_traceData[touchID] = new GestureTraceData(touchID, touchPos, touchTime, touchPos, touchStatus);
                }
                else {
                    let touchTime = Date.now();
                    // set touch status to "ui" when touch is over UI
                    this.m_traceData[touchID] = new GestureTraceData(touchID, touchPos, touchTime, touchPos, "ui");
                }
            }
            else {
                // touch is in trace
                let touchPairData = this.GetPairData(touchID);
                if (touchPairData) {
                    traceData.Status = touchPairData.Status;
                }
            }
        }
    }

    private OnTouchMove(e: TouchEvent) {
        //let touches = e.changedTouches;
        let touches = this.ProcessTouch(e.changedTouches, e, "move");

        // handle pair gesture move here
        this.HandlePairGestureMove(touches);

        for (let i = 0; i < touches.length; ++i) {
            let touch = touches[i];
            let touchID = touch.ID;
            if (this.m_traceData[touchID]) {
                // this touch is in tracing
                let traceData = this.m_traceData[touchID];
                let curPos = G.v2.createFromNumber(touch.X, touch.Y);
                if (traceData.Status === "") {
                    // touch is in init status
                    let dir = curPos.sub(traceData.StartPos);
                    let dist = dir.length();
                    if (dist > this.m_tapStationaryTolerance) {
                        // do not keep stationary, should be swipe
                        traceData.PrePos = curPos;
                        traceData.Status = "sw";

                        EventManager.Instance.emit(GestureType.Swipe, new GestureData(GestureType.Swipe, G.v2.ZERO, dir, 0));
                    }
                    else {
                        // touch keep stationary, check time
                        let curTime = Date.now();
                        let elapsed = curTime - traceData.StartTime;
                        if (elapsed >= this.m_longTapMinInterval) {
                            // long tap do not need touch up ?
                            traceData.PrePos = curPos;
                            traceData.Status = "lt";

                            EventManager.Instance.emit(GestureType.LongTap, new GestureData(GestureType.LongTap, traceData.StartPos, G.v2.ZERO, 0));
                        }
                        // no need handle other situations
                    }
                }
                else if (traceData.Status === "sw") {
                    let dir = curPos.sub(traceData.PrePos);
                    traceData.PrePos = curPos;

                    EventManager.Instance.emit(GestureType.Swipe, new GestureData(GestureType.Swipe, G.v2.ZERO, dir, 0));
                }
            }
        }
    }

    private HandleSingleTap(): boolean {
        let curTime = Date.now();
        this.m_historyDataBuffer.length = 0;

        for (const historyData of this.m_historyData) {
            let historyStartPos = historyData.StartPos;
            let historyEndTime = historyData.EndTime;
            let elapsed = curTime - historyEndTime;
            if (elapsed > this.m_doubleTapMaxInterval) {
                // seems out of double tap time, single tap emit
                EventManager.Instance.emit(GestureType.SingleTap, new GestureData(GestureType.SingleTap, historyStartPos));
            }
            else {
                // add to history data buffer
                this.m_historyDataBuffer.push(historyData);
            }
        }

        // when there is data handled, we update history data
        if (this.m_historyDataBuffer.length != this.m_historyData.length) {
            this.m_historyData = this.m_historyDataBuffer.slice();
        }

        return this.m_historyDataBuffer.length > 0;
    }

    private HandleDoubleTap(curData: GestureTraceData): boolean {
        for (const historyData of this.m_historyData) {
            let historyStartPos = historyData.StartPos;
            let historyEndTime = historyData.EndTime;
            let curTouchStartPos = curData.StartPos;
            let curTouchStartTime = curData.StartTime;
            let touchDiffTime = curTouchStartTime - historyEndTime;
            if (touchDiffTime > 0 && touchDiffTime <= this.m_doubleTapMaxInterval) {
                let touchDiffPos = curTouchStartPos.sub(historyStartPos);
                if (touchDiffPos.length() <= this.m_doubleTapStationaryTolerance) {
                    // seems double tap
                    EventManager.Instance.emit(GestureType.DoubleTap, new GestureData(GestureType.DoubleTap, curTouchStartPos));

                    // clear trace data here
                    this.m_traceData[curData.ID] = null;
                    // NOTE not so sure about this ...
                    this.m_historyData.splice(this.m_historyData.indexOf(historyData), 1);
                    return true;
                }
            }
        }

        return false;
    }

    private HandleLongTap(): boolean {
        let curTime = Date.now();
        this.m_traceDataBuffer.length = 0;

        for (const touchID in this.m_traceData) {
            let traceData = this.m_traceData[touchID];
            if (traceData && traceData.Status === "") {
                let lastTouchStartPos = traceData.StartPos;
                let lastTouchStartTime = traceData.StartTime;
                let elapsed = curTime - lastTouchStartTime;
                if (elapsed >= this.m_longTapMinInterval) {
                    // long tap, do not need check stationary here since OnTouchMove handles it
                    EventManager.Instance.emit(GestureType.LongTap, new GestureData(GestureType.LongTap, traceData.StartPos, G.v2.ZERO, 0));
                    // add to delete buffer
                    this.m_traceDataBuffer.push(traceData);
                }
            }
        }

        for (let traceData of this.m_traceDataBuffer) {
            this.m_traceData[traceData.ID] = null;
        }

        return this.m_traceDataBuffer.length > 0;
    }

    private OnTouchEnd(e: TouchEvent) {
        //let touches = e.changedTouches;
        let touches = this.ProcessTouch(e.changedTouches, e, "end");

        // handle pair gesture end here
        this.HandlePairGestureEnd(touches);

        for (let i = 0; i < touches.length; ++i) {
            let touch = touches[i];
            let touchID = touch.ID;
            if (this.m_traceData[touchID]) {
                // this touch is in tracing
                let traceData = this.m_traceData[touchID];
                if (traceData.Status === "") {
                    // touch up pos should in stationary tolerance, otherwise touch should be in "sw(swipe)" status
                    if (!this.HandleDoubleTap(traceData)) {
                        // update end time and move to last trace data
                        let touchEndTime = Date.now();
                        this.m_historyData.push(new GestureHistoryData(traceData.StartPos, traceData.StartTime, touchEndTime));
                        this.m_traceData[touchID] = null;
                    }
                    // HandleDoubleTap will handle trace data when success
                }
                else {
                    // just clear trace data
                    this.m_traceData[touchID] = null;
                }
            }
        }
    }

    private OnTouchCancel(e: TouchEvent) {
        // just use touch end to handle touch cancel ?
        this.OnTouchEnd(e);
    }

    Update(dt: number) {
        // handle long tap & single tap in Update
        this.HandleLongTap();
        this.HandleSingleTap();
    }

    // EventListenerObject, seems wx do not support this ...
    handleEvent(e: Event) {
        switch (e.type) {
            case "keydown":
                this.OnKeyDown(e as KeyboardEvent);
                break;
            case "keypress":
                this.OnKeyPress(e as KeyboardEvent);
                break;
            case "keyup":
                this.OnKeyUp(e as KeyboardEvent);
                break;
            case "touchstart":
                this.OnTouchStart(e as TouchEvent);
                break;
            case "touchmove":
                this.OnTouchMove(e as TouchEvent);
                break;
            case "touchend":
                this.OnTouchEnd(e as TouchEvent);
                break;
            case "touchcancel":
                this.OnTouchCancel(e as TouchEvent);
                break;
        }
    }

    // debug interface
    Dump(): string {
        let buffer: string[] = [];

        buffer.push("HistoryData :");
        for (let historyData of this.m_historyData) {
            buffer.push(historyData.toString());
        }

        buffer.push("TraceData :");
        for (let traceID in this.m_traceData) {
            let traceData = this.m_traceData[traceID];
            if (traceData) {
                buffer.push(traceData.toString());
            }
        }

        buffer.push("PairData :");
        for (let pairData of this.m_pairData) {
            buffer.push(pairData.toString());
        }

        return buffer.join('\n');
    }
}


