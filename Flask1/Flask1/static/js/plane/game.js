/**基类 */
myglobal.games.base = myglobal;

/**关卡模块 */
myglobal.games.rounds = {};

/**所有的按钮 */
myglobal.games.bottoms = [];

/**敌人出现的间隔时间:秒 */
myglobal.games.INTERVEL = 2;

/**场上最多出现多少敌人 */
myglobal.games.MAXFOE = 5;

/**游戏系统挂载 */
myglobal.games.run = 0;

/**游戏刷新挂载 */
myglobal.games.gameRun = 0;

/**捕获的按键 */
myglobal.games.keys = [];

/**删除所有的按钮 */
myglobal.games.clearBottoms = function () {
    myglobal.games.bottoms.forEach(function (e) {
        e.display();
    });
    myglobal.games.bottoms = [];
};

/**
 * 开始关卡
 * @param {number} foes 敌人数量
 * @param {Array} foeType 敌人类型
 */
myglobal.games.startRound = function (foes,foeType) {
    /**已经出现过的敌人 */
    var i = 0;

    /**创建玩家 */
    myglobal.player = new myglobal.class.player(200, 700, 50, 60, myglobal.MAXHP, 1000, myglobal.class.bullet.line, myglobal.image.image.plane[0])

    /**
     * 返回按钮
     * (并且清空游戏数据)
     */
    var returnBottom = myglobal.class.bottom(40, 40, 40, 40, "←", function () {
        myglobal.games.clearBottoms();
        myglobal.games.rounds.menu.start();
        clearInterval(myglobal.games.run);
        clearInterval(myglobal.games.gameRun);
        myglobal.foes = [];
        myglobal.player = null;
        myglobal.item = [];
        myglobal.bullet = [];
        myglobal.clearCtx();
    });
    var pointDiv = myglobal.class.bottom(330, 40, 100, 40, "分数:" + myglobal.POINT, null, null, "transparent", "transparent");
    returnBottom.title = "返回菜单";
    returnBottom.style.opacity = "0.4";
    returnBottom.onmousemove = function () {
        this.style.opacity = "1";
    };
    returnBottom.onmouseout = function () {
        this.style.opacity = "0.4";
    };
    pointDiv.className = "bottom point";

    //添加返回按钮
    myglobal.games.bottoms.push(returnBottom);
    myglobal.games.bottoms.push(pointDiv);
    
    //开始挂载
    myglobal.games.run = setInterval(function () {

        //增加敌人
        if (i<foes&&myglobal.foes.length<myglobal.games.MAXFOE) {
            //myglobal.foes.push(new myglobal.class.foe())
            /**确定飞机的子弹类型 */
            var bullet = foeType[lt_code.variable.random(foeType.length,0,true)];
            /**确定飞机的大小 */
            var size = myglobal.class.foe.size(bullet);
            myglobal.foes.push(new myglobal.class.foe(
                lt_code.variable.random(myglobal.cas.width - 100, 100, true),
                0, size.x, size.y, myglobal.MAXHP, bullet
            ));

        }

        //结束游戏
        if (i == foes&&myglobal.foes.length == 0) {
            alert("过关!");

        }

    }, myglobal.games.INTERVEL * 1000);

    //以30帧运行游戏
    myglobal.games.gameRun = setInterval(function () {

        //清空屏幕
        myglobal.clearCtx();

        //敌人动作
        myglobal.foes.forEach(function (e) {
            e.move(myglobal.cas);
            e.draw(myglobal.ctx);
            e.fire();
            e.touch(myglobal.player);
        });

        //玩家绘制
        myglobal.player.update(myglobal.ctx);

        //玩家控制
        myglobal.player.checkKey(myglobal.cas, myglobal.games.keys);

        //子弹移动
        myglobal.bullet.forEach(function (e) {
            e.move(myglobal.cas);
            e.draw(myglobal.ctx);
            if (e.isFoe) {
                e.touch(myglobal.player);
            } else {
                e.touch(myglobal.foes);
            }
        });

        //玩家死亡游戏结束
        if (myglobal.player.l<0) {
            myglobal.games.rounds.over.start();
        }

    }, myglobal.refresh30);

    //按键捕获
    window.onkeydown = function (e) {
        myglobal.games.keys = myglobal.games.keys.add(e.keyCode);
    };
    //按键释放
    window.onkeyup = function (e) {
        myglobal.games.keys = myglobal.games.keys.ree(e.keyCode);
    }

}

/**如果没有则增加 */
Array.prototype.add = function (e) {
    var ret = Array.prototype.slice.call(this);
    if (this.indexOf(e) == -1) {
        ret.push(e);
        return ret;
    } else {
        return this;
    }
};

/**如果有则删除 */
Array.prototype.ree = function (e) {
    if (this.indexOf(e) >= 0) {
        return this.delete(e);
    } else {
        return this;
    }
};

/**基类 */
myglobal.games.rounds.base = myglobal.games;

/**游戏开始界面 */
myglobal.games.rounds.begin = {
    /**基类 */
    base: myglobal.games.rounds,
    /**启动 */
    start: function () {
        /**开始游戏按钮 */
        var startBottom = myglobal.class.bottom(200, 400, 120, 40, "开始游戏",
            function () {
                myglobal.games.clearBottoms()
                myglobal.games.rounds.menu.start();
            });
        /**结束游戏按钮 */
        var exitBottom = myglobal.class.bottom(200, 460, 100, 40, "退出游戏",
            function () {
                lt_code.close();
            });
        /**所谓的图标 */
        var icon = myglobal.class.bottom(200, 200, 300, 300, "飞机大战", null, "40px", "white", "white", null);
        icon.style.cursor = "auto";
        /**制作者信息 */
        var auther = myglobal.class.bottom(300, 760, 160, 40, "制作者:绘梦璃", function () {
            window.location.href = "https://github.com/huimengli";
        }, null, "white", "white", null);
        auther.title = "制作者信息";
        //添加进按钮数组,为了方便删除...
        myglobal.games.bottoms.push(startBottom);
        myglobal.games.bottoms.push(exitBottom);
        myglobal.games.bottoms.push(icon);
        myglobal.games.bottoms.push(auther);
    },
};

/**游戏菜单界面 */
myglobal.games.rounds.menu = {
    /**基类 */
    base: myglobal.games.rounds,
    /**最大关卡数量 */
    MAXROUND:28,
    /**启动 */
    start: function () {
        /**基类 */
        var base = this;
        /**返回按钮 */
        var returnBottom = myglobal.class.bottom(40, 40, 40, 40, "←", function () {
            myglobal.games.clearBottoms();
            myglobal.games.rounds.begin.start();
        });
        returnBottom.title = "返回主界面";

        //开始根据关卡添加关卡按钮
        myglobal.games.rounds.rounds.forEach(function (e,i) {
            if (i<base.MAXROUND) {
                /**关卡按钮 */
                var round = myglobal.class.bottom(90 * (i % 4) + 65, 40 + 100 + 90 * lt_code.getNum(i / 4), 80, 80, i.toString(), function () {
                    myglobal.games.clearBottoms();
                    e.start();
                });
                round.title = "关卡:" + round.innerText;
                //添加按钮进入按钮数组
                myglobal.games.bottoms.push(round);
            }
        })

        //添加进按钮数组
        myglobal.games.bottoms.push(returnBottom);
    },
}

/**游戏结束界面 */
myglobal.games.rounds.over = {
    /**基类 */
    base: myglobal.games.rounds,

    /**结束界面 */
    start: function () {
        //游戏结束
        myglobal.games.clearBottoms();
        //myglobal.games.rounds.menu.start();
        clearInterval(myglobal.games.run);
        clearInterval(myglobal.games.gameRun);
        myglobal.foes = [];
        myglobal.player = null;
        myglobal.item = [];
        myglobal.bullet = [];
        myglobal.clearCtx();

        /**重新开始游戏按钮 */
        var startBottom = myglobal.class.bottom(200, 400, 120, 40, "回到主界面",
            function () {
                myglobal.games.clearBottoms()
                myglobal.games.rounds.begin.start();
            });
        /**结束游戏按钮 */
        //var exitBottom = myglobal.class.bottom(200, 460, 100, 40, "退出游戏",
        //    function () {
        //        lt_code.close();
        //    });
        /**所谓的图标 */
        var icon = myglobal.class.bottom(200, 200, 300, 300, "游戏结束!\n你的分数:"+myglobal.POINT, null, "40px", "white", "white", null);
        icon.style.cursor = "auto";
        /**制作者信息 */
        var auther = myglobal.class.bottom(300, 760, 160, 40, "制作者:绘梦璃", function () {
            window.location.href = "https://github.com/huimengli";
        }, null, "white", "white", null);
        auther.title = "制作者信息";
        //添加进按钮数组,为了方便删除...
        myglobal.games.bottoms.push(startBottom);
        //myglobal.games.bottoms.push(exitBottom);
        myglobal.games.bottoms.push(icon);
        myglobal.games.bottoms.push(auther);
    }
}

/**关卡 */
myglobal.games.rounds.rounds = [];

/**关卡1 */
myglobal.games.rounds.rounds[0] = {
    /**基类 */
    base: myglobal.games.rounds,
    /**敌人数量 */
    foes: 15,
    /**敌人种类 */
    foeType: [myglobal.class.bullet.noBullet],
    /**开始关卡 */
    start: function () {
        //this.base.base.base.clearGame();
        //this.base.base.base.clearCtx();
        myglobal.games.startRound(this.foes, this.foeType);
    },
}
/**关卡1 */
myglobal.games.rounds.rounds[1] = {
    /**基类 */
    base: myglobal.games.rounds,
    /**敌人数量 */
    foes: 20,
    /**敌人种类 */
    foeType: [myglobal.class.bullet.noBullet,myglobal.class.bullet.slow],
    /**开始关卡 */
    start: function () {
        myglobal.games.startRound(this.foes, this.foeType);
    },
}
/**关卡2 */
myglobal.games.rounds.rounds[2] = {
    /**基类 */
    base: myglobal.games.rounds,
    /**敌人数量 */
    foes: 20,
    /**敌人种类 */
    foeType: [myglobal.class.bullet.slow,myglobal.class.bullet.line],
    /**开始关卡 */
    start: function () {
        myglobal.games.startRound(this.foes, this.foeType);
    },
}
//myglobal.games.rounds.rounds[3] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[4] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[5] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[6] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[7] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[8] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[9] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[10] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[11] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[12] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[13] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[14] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[15] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[16] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[17] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[18] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[19] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[20] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[21] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[22] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[23] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[24] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[25] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[26] = { start: function () { alert("关卡尚未制作!"); },};
//myglobal.games.rounds.rounds[27] = { start: function () { alert("关卡尚未制作!"); },};



//把工程文件加入网站
myglobal.addJs(myglobal.currentDir+"program.js");