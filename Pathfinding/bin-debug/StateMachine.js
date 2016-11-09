var StateMachine = (function () {
    function StateMachine(_player, rongqi, stand, move) {
        this.timeOnEnterFrame = 0;
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
        }
        this.player = _player;
        this.currentState = this.StandState;
        this._move.alpha = 0;
        this.onEnter();
    }
    var d = __define,c=StateMachine,p=c.prototype;
    p.onEnter = function () {
        this.currentState.onEnter();
    };
    p.setState = function (state) {
        if (this.currentState.getname() != state) {
            this.currentState.onExit();
            this.currentState.onEnter();
        }
    };
    return StateMachine;
}());
egret.registerClass(StateMachine,'StateMachine');
////////////////////////////////////////////移动状态
var PlayerMoveState = (function () {
    function PlayerMoveState(player, stateMachine, name) {
        this._statename = name;
        //    console.log("PlayerMoveState constructor");
        this._StateMachine = stateMachine;
        this._player = player;
    }
    var d = __define,c=PlayerMoveState,p=c.prototype;
    p.onEnter = function () {
        //    console.log(this._statename + "onEnter");
        this._StateMachine._move.alpha = 1;
    };
    p.onExit = function () {
        //    console.log(this._statename + "onExit");
        this._StateMachine._move.alpha = 0;
        this._StateMachine.currentState = this._StateMachine.StandState;
    };
    p.getname = function () {
        return this._statename;
    };
    return PlayerMoveState;
}());
egret.registerClass(PlayerMoveState,'PlayerMoveState',["State"]);
////////////////////////////////////站立状态
var PlayerStandState = (function () {
    function PlayerStandState(player, stateMachine, name) {
        this._statename = name;
        //  console.log("PlayerStandState constructor");
        this._StateMachine = stateMachine;
        this._player = player;
    }
    var d = __define,c=PlayerStandState,p=c.prototype;
    p.onEnter = function () {
        //  console.log(this._statename + "onEnter");
        this._StateMachine._stand.alpha = 1;
    };
    p.onExit = function () {
        // console.log(this._statename + "onExit");
        this._StateMachine._stand.alpha = 0;
        this._StateMachine.currentState = this._StateMachine.MoveState;
    };
    p.getname = function () {
        return this._statename;
    };
    return PlayerStandState;
}());
egret.registerClass(PlayerStandState,'PlayerStandState',["State"]);
//# sourceMappingURL=StateMachine.js.map