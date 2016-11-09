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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        var gamemap = new GameMap(this);

        //////////////////////////////////动画
        var data = RES.getRes("Archer_Idle_json");
        var txtr = RES.getRes("Archer_Idle_png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        var mc1: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData("Archer_Idle"));


        var data = RES.getRes("Archer_Move_json");
        var txtr = RES.getRes("Archer_Move_png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        var mc2: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData("Archer_Move"));
        var rongqi: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        /////////////////////////////////开始
        mc1.scaleX = 0.5;
        mc1.scaleY = 0.5;
        mc2.scaleX = 0.5;
        mc2.scaleY = 0.5;

        this.addChild(rongqi);
        var _statemachine = new StateMachine(this, rongqi, mc1, mc2);

        var interval: any;

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {//找格子
            egret.stopTick(moveFunction, this);
            clearInterval(interval);

            var endXpos = Math.floor(e.stageX / gamemap.Boxsize);            //终点的x和y值（行和列数）
            var endYpos = Math.floor(e.stageY / gamemap.Boxsize);
            _statemachine.currentX = _statemachine._rongqi.x;
            _statemachine.currentY = _statemachine._rongqi.y;
            var startXpos = Math.floor(_statemachine.currentX / gamemap.Boxsize);//起点的x和y值（行和列数）
            var startYpos = Math.floor(_statemachine.currentY / gamemap.Boxsize);

            var astar: AStar = new AStar(gamemap);

            ////////////////////////////////////////////////
            console.log("startXpos " + startXpos);
            console.log("startYpos " + startYpos);

            if (astar.findPath(gamemap.getNode(startXpos, startYpos), gamemap.getNode(endXpos, endYpos))) { //传入起点和终点

                astar._path.map((tile) => {                    //console正确数组
                    console.log(`x:${tile.x},y:${tile.y}`)
                });

                var pathLength = astar._path.length - 1;
                var i = 0;
                astar._path.shift();
                interval = setInterval(() => {
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
                    egret.startTick(moveFunction, this);
                    i++;
                    if (i == pathLength) {
                        clearInterval(interval);
                        i = 0;
                    }
                }, 400)
                /*   for (var i = 0; i < pathLength; i++) {
   
                   }*/
            }

        }, this)
        ////////////////////////////////////////////////

        function moveFunction(): boolean {
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
                return true

            }
            return false;
        }
    }
}


