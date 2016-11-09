class StateMachine {
    player: any;
    currentState: State;
    currentX: number;
    currentY: number;
    endX:number;
    endY:number;
    
    StandState: PlayerStandState;
    MoveState: PlayerMoveState;
    _rongqi: egret.DisplayObjectContainer;
    _stand: egret.MovieClip;
    _move: egret.MovieClip
    timeOnEnterFrame: number = 0;
    Ratiox: number;
    Ratioy: number;
    public _statename: string;

    constructor(_player: any, rongqi: egret.DisplayObjectContainer,
        stand: egret.MovieClip, move: egret.MovieClip) {
        this._stand = stand;
        this._move = move;
        this._move.gotoAndPlay(1, -1);
        this._stand.gotoAndPlay(1, -1);
      //  console.log("StateMachine constructor");
        this._rongqi = rongqi;
        this._rongqi.addChild(this._stand);
        this._rongqi.addChild(this._move);
        this.StandState = new PlayerStandState(_player, this, "stand");
        this.MoveState = new PlayerMoveState(_player, this, "move");
        if (_player == null) {
      //      console.log("No picture,StateMachine");
        }
        this.player = _player;
        this.currentState = this.StandState;
        this._move.alpha = 0;
        this.onEnter();
    }
    onEnter() {

        this.currentState.onEnter();
    }
    setState(state: String) {
        if (this.currentState.getname() != state) {
            this.currentState.onExit();
            this.currentState.onEnter();
        }

    }
}


////////////////////////////////////////////移动状态
class PlayerMoveState implements State {
    _player: any;
    _StateMachine: StateMachine;
    public _statename: string;

    constructor(player: any, stateMachine: StateMachine, name: string) {
        this._statename = name;
    //    console.log("PlayerMoveState constructor");
        this._StateMachine = stateMachine;
        this._player = player;
    }
    onEnter() {
    //    console.log(this._statename + "onEnter");
        this._StateMachine._move.alpha = 1;
    }
    onExit() {
    //    console.log(this._statename + "onExit");
        this._StateMachine._move.alpha = 0;
        this._StateMachine.currentState = this._StateMachine.StandState;
    }
    getname() {
        return this._statename;
    }

}

////////////////////////////////////站立状态
class PlayerStandState implements State {
    _player: any;
    _StateMachine: StateMachine;
    public _statename: string;
    constructor(player: any, stateMachine: StateMachine, name: string) {
        this._statename = name;
      //  console.log("PlayerStandState constructor");
        this._StateMachine = stateMachine;
        this._player = player;
    }

    onEnter() {
      //  console.log(this._statename + "onEnter");
        this._StateMachine._stand.alpha = 1;

    }
    onExit() {
       // console.log(this._statename + "onExit");
        this._StateMachine._stand.alpha = 0;
        this._StateMachine.currentState = this._StateMachine.MoveState;
    }
    getname() {
        return this._statename;
    }
}
interface State {
    onEnter();
    onExit();
    getname();
}
