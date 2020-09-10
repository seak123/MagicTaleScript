import * as G from "../../G";

export default class GameUtil{
    static AddChild(parent:G.Ett,child:G.Ett){
        parent.transform.addChild(child.transform);
    }

    static AddChild2D(parent:G.Ett,child:G.Ett){
        parent.transform2D.addChild(child.transform2D);
    }
}