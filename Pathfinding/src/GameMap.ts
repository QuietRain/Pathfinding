class GameMap {
    public Stage: any;
    public _map: any;
    public Cols = 10;
    public Rows = 10;
    public Boxsize = 100;
    public constructor(stage: any) {
        this.Stage = stage;

        this._map = [
            //第0行
            { image: "Ground_png", node: new _Node(0, 0, true) },
            { image: "Ground_png", node: new _Node(1, 0, true) },
            { image: "Wall_png", node: new _Node(2, 0, false) },
            { image: "Wall_png", node: new _Node(3, 0, false) },
            { image: "Wall_png", node: new _Node(4, 0, false) },
            { image: "Wall_png", node: new _Node(5, 0, false) },
            { image: "Wall_png", node: new _Node(6, 0, false) },
            { image: "Wall_png", node: new _Node(7, 0, false) },
            { image: "Wall_png", node: new _Node(8, 0, false) },
            { image: "Wall_png", node: new _Node(9, 0, false) },

            //第1行
            { image: "Wall_png", node: new _Node(0, 1, false) },
            { image: "Ground_png", node: new _Node(1, 1, true) },
            { image: "Wall_png", node: new _Node(2, 1, false) },
            { image: "Ground_png", node: new _Node(3, 1, true) },
            { image: "Ground_png", node: new _Node(4, 1, true) },
            { image: "Ground_png", node: new _Node(5, 1, true) },
            { image: "Ground_png", node: new _Node(6, 1, true) },
            { image: "Ground_png", node: new _Node(7, 1, true) },
            { image: "Ground_png", node: new _Node(8, 1, true) },
            { image: "Wall_png", node: new _Node(9, 1, false) },

            //第2行
            { image: "Wall_png", node: new _Node(0, 2, false) },
            { image: "Ground_png", node: new _Node(1, 2, true) },
            { image: "Wall_png", node: new _Node(2, 2, false) },
            { image: "Ground_png", node: new _Node(3, 2, true) },
            { image: "Ground_png", node: new _Node(4, 2, true) },
            { image: "Ground_png", node: new _Node(5, 2, true) },
            { image: "Ground_png", node: new _Node(6, 2, true) },
            { image: "Ground_png", node: new _Node(7, 2, true) },
            { image: "Ground_png", node: new _Node(8, 2, true) },
            { image: "Wall_png", node: new _Node(9, 2, false) },

            //第3行
            { image: "Wall_png", node: new _Node(0, 3, false) },
            { image: "Ground_png", node: new _Node(1, 3, true) },
            { image: "Wall_png", node: new _Node(2, 3, false) },
            { image: "Ground_png", node: new _Node(3, 3, true) },
            { image: "Ground_png", node: new _Node(4, 3, true) },
            { image: "Ground_png", node: new _Node(5, 3, true) },
            { image: "Wall_png", node: new _Node(6, 3, false) },
            { image: "Ground_png", node: new _Node(7, 3, true) },
            { image: "Ground_png", node: new _Node(8, 3, true) },
            { image: "Wall_png", node: new _Node(9, 3, false) },

            //第4行
            { image: "Wall_png", node: new _Node(0, 4, false) },
            { image: "Ground_png", node: new _Node(1, 4, true) },
            { image: "Ground_png", node: new _Node(2, 4, true) },
            { image: "Ground_png", node: new _Node(3, 4, true) },
            { image: "Ground_png", node: new _Node(4, 4, true) },
            { image: "Ground_png", node: new _Node(5, 4, true) },
            { image: "Wall_png", node: new _Node(6, 4, false) },
            { image: "Ground_png", node: new _Node(7, 4, true) },
            { image: "Ground_png", node: new _Node(8, 4, true) },
            { image: "Wall_png", node: new _Node(9, 4, false) },

            //第5行
            { image: "Wall_png", node: new _Node(0, 5, false) },
            { image: "Ground_png", node: new _Node(1, 5, true) },
            { image: "Ground_png", node: new _Node(2, 5, true) },
            { image: "Ground_png", node: new _Node(3, 5, true) },
            { image: "Ground_png", node: new _Node(4, 5, true) },
            { image: "Ground_png", node: new _Node(5, 5, true) },
            { image: "Wall_png", node: new _Node(6, 5, false) },
            { image: "Ground_png", node: new _Node(7, 5, true) },
            { image: "Ground_png", node: new _Node(8, 5, true) },
            { image: "Wall_png", node: new _Node(9, 5, false) },

            //第6行
            { image: "Wall_png", node: new _Node(0, 6, false) },
            { image: "Wall_png", node: new _Node(1, 6, false) },
            { image: "Wall_png", node: new _Node(2, 6, false) },
            { image: "Wall_png", node: new _Node(3, 6, false) },
            { image: "Wall_png", node: new _Node(4, 6, false) },
            { image: "Ground_png", node: new _Node(5, 6, true) },
            { image: "Wall_png", node: new _Node(6, 6, false) },
            { image: "Ground_png", node: new _Node(7, 6, true) },
            { image: "Ground_png", node: new _Node(8, 6, true) },
            { image: "Wall_png", node: new _Node(9, 6, false) },

            //第7行
            { image: "Wall_png", node: new _Node(0, 7, false) },
            { image: "Ground_png", node: new _Node(1, 7, true) },
            { image: "Ground_png", node: new _Node(2, 7, true) },
            { image: "Ground_png", node: new _Node(3, 7, true) },
            { image: "Ground_png", node: new _Node(4, 7, true) },
            { image: "Ground_png", node: new _Node(5, 7, true) },
            { image: "Wall_png", node: new _Node(6, 7, false) },
            { image: "Ground_png", node: new _Node(7, 7, true) },
            { image: "Ground_png", node: new _Node(8, 7, true) },
            { image: "Wall_png", node: new _Node(9, 7, false) },

            //第8行
            { image: "Wall_png", node: new _Node(0, 8, false) },
            { image: "Ground_png", node: new _Node(1, 8, true) },
            { image: "Ground_png", node: new _Node(2, 8, true) },
            { image: "Ground_png", node: new _Node(3, 8, true) },
            { image: "Ground_png", node: new _Node(4, 8, true) },
            { image: "Ground_png", node: new _Node(5, 8, true) },
            { image: "Wall_png", node: new _Node(6, 8, false) },
            { image: "Ground_png", node: new _Node(7, 8, true) },
            { image: "Ground_png", node: new _Node(8, 8, true) },
            { image: "Wall_png", node: new _Node(9, 8, false) },

            //第9行
            { image: "Wall_png", node: new _Node(0, 9, false) },
            { image: "Wall_png", node: new _Node(1, 9, false) },
            { image: "Wall_png", node: new _Node(2, 9, false) },
            { image: "Wall_png", node: new _Node(3, 9, false) },
            { image: "Wall_png", node: new _Node(4, 9, false) },
            { image: "Wall_png", node: new _Node(5, 9, false) },
            { image: "Wall_png", node: new _Node(6, 9, false) },
            { image: "Wall_png", node: new _Node(7, 9, false) },
            { image: "Ground_png", node: new _Node(8, 9, true) },
            { image: "Wall_png", node: new _Node(9, 9, false) },
        ]

        //var grid = new aster.Grid(8,8);
        var container = new egret.DisplayObjectContainer();
        for (var i = 0; i < this._map.length; i++) {
            var tile = this._map[i];
            var bm = new egret.Bitmap();
            bm.texture = RES.getRes(tile.image);
            bm.x = tile.node.x * this.Boxsize;
            bm.y = tile.node.y * this.Boxsize;
            bm.touchEnabled = tile.node.walkable;
            this.Stage.addChild(bm);
        }
    }
    public getNode(x: number, y: number): _Node {
        var result: _Node = this._map[y * this.Rows + x].node;
        return result;
    }
}