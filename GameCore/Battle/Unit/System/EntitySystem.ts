import Creature from "../Entity/Creature";

export default class EntitySystem{

    private _mainPlayer:Creature;

    public get MainPlayer():Creature{
        if(this._mainPlayer){
            return this._mainPlayer;
        }else{
            this._mainPlayer = new Creature();
        }
    }
    
    public CreateCreature(){
        
    }

}