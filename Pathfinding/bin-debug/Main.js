//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var _this = this;
        var gamemap = new GameMap(this);
        //////////////////////////////////动画
        var data = RES.getRes("Archer_Idle_json");
        var txtr = RES.getRes("Archer_Idle_png");
        var mcFactory = new egret.MovieClipDataFactory(data, txtr);
        var mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("Archer_Idle"));
        var data = RES.getRes("Archer_Move_json");
        var txtr = RES.getRes("Archer_Move_png");
        var mcFactory = new egret.MovieClipDataFactory(data, txtr);
        var mc2 = new egret.MovieClip(mcFactory.generateMovieClipData("Archer_Move"));
        var rongqi = new egret.DisplayObjectContainer();
        /////////////////////////////////开始
        mc1.scaleX = 0.5;
        mc1.scaleY = 0.5;
        mc2.scaleX = 0.5;
        mc2.scaleY = 0.5;
        this.addChild(rongqi);
        var _statemachine = new StateMachine(this, rongqi, mc1, mc2);
        var interval;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            egret.stopTick(moveFunction, _this);
            clearInterval(interval);
            var endXpos = Math.floor(e.stageX / gamemap.Boxsize); //终点的x和y值（行和列数）
            var endYpos = Math.floor(e.stageY / gamemap.Boxsize);
            _statemachine.currentX = _statemachine._rongqi.x;
            _statemachine.currentY = _statemachine._rongqi.y;
            var startXpos = Math.floor(_statemachine.currentX / gamemap.Boxsize); //起点的x和y值（行和列数）
            var startYpos = Math.floor(_statemachine.currentY / gamemap.Boxsize);
            var astar = new AStar(gamemap);
            ////////////////////////////////////////////////
            console.log("startXpos " + startXpos);
            console.log("startYpos " + startYpos);
            if (astar.findPath(gamemap.getNode(startXpos, startYpos), gamemap.getNode(endXpos, endYpos))) {
                astar._path.map(function (tile) {
                    console.log("x:" + tile.x + ",y:" + tile.y);
                });
                var pathLength = astar._path.length - 1;
                var i = 0;
                astar._path.shift();
                interval = setInterval(function () {
                    var pos = astar._path.shift();
                    //        console.log("posX: " + pos.x + " posy " + pos.y);
                    ////////////////////////////////
                    var maxlength = 0;
                    _statemachine.endX = pos.x * gamemap.Boxsize;
                    _statemachine.endY = pos.y * gamemap.Boxsize;
                    var dx = _statemachine.endX - _statemachine._rongqi.x;
                    var dy = _statemachine.endY - _statemachine._rongqi.y;
                    maxlength = Math.pow(dx * dx + dy * dy, 1 / 2);
                    var Ratiox = dx / maxlength;
                    var Ratioy = dy / maxlength;
                    _statemachine.Ratiox = Ratiox;
                    _statemachine.Ratioy = Ratioy;
                    _statemachine.timeOnEnterFrame = egret.getTimer();
                    egret.startTick(moveFunction, _this);
                    i++;
                    if (i == pathLength) {
                        clearInterval(interval);
                        i = 0;
                    }
                }, 400);
            }
        }, this);
        ////////////////////////////////////////////////
        function moveFunction() {
            var now = Math.floor(egret.getTimer());
            var pass = now - _statemachine.timeOnEnterFrame;
            var speed = 0.3;
            _statemachine.setState("move");
            console.log("pass * speed * _statemachine.Ratiox " + pass * speed * _statemachine.Ratiox);
            console.log("pass * speed * _statemachine.Ratioy " + pass * speed * _statemachine.Ratioy);
            _statemachine._rongqi.x += pass * speed * _statemachine.Ratiox;
            _statemachine._rongqi.y += pass * speed * _statemachine.Ratioy;
            _statemachine.timeOnEnterFrame = egret.getTimer();
            //      console.log("_statemachine._rongqi.y - _statemachine.endY " + (_statemachine._rongqi.y - _statemachine.endY));
            //      console.log("_statemachine._rongqi.x - _statemachine.endX " + (_statemachine._rongqi.x - _statemachine.endX));
            if (_statemachine._rongqi.y - _statemachine.endY < 6 && _statemachine._rongqi.y - _statemachine.endY > -6 &&
                _statemachine._rongqi.x - _statemachine.endX < 6 && _statemachine._rongqi.x - _statemachine.endX > -6) {
                _statemachine._rongqi.x = _statemachine.endX;
                _statemachine._rongqi.y = _statemachine.endY;
                console.log("endX: " + _statemachine.endX + " endY: " + _statemachine.endY);
                egret.stopTick(moveFunction, this);
                _statemachine.setState("stand");
                console.log("run true");
                return true;
            }
            return false;
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map