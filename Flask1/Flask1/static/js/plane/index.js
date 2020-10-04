!function () {
    /**本地工程模块 */
    var myglobal = {};

    /**基类 */
    myglobal.base = window;

    /**图形模块 */
    myglobal.image = {};

    /**类型模块 */
    myglobal.class = {};

    /**模块所在路径 */
    myglobal.currentSrc = document.currentScript.src;

    /**模块所在文件夹 */
    myglobal.currentDir = myglobal.currentSrc.slice(0,this.length-8);

    /**游戏玩家 */
    myglobal.player = null;

    /**敌人列表 */
    myglobal.foes = [];

    /**道具列表 */
    myglobal.items = [];

    /**子弹列表 */
    myglobal.bullet = [];

    /**游戏模块 */
    myglobal.games = {};

    /**调用的js文件 */
    myglobal.js = ["class.js", "image.js"];

    /**最大血量 */
    myglobal.MAXHP = 100;

    /**最大护盾时间(单位:毫秒) */
    myglobal.MAXEP = 20000;

    /**最大武器上限 */
    myglobal.MAXWP = 5;

    /**初始清除弹数量 */
    myglobal.STARTCL = 0;

    /**最大清除弹上限 */
    myglobal.MAXCL = 3;

    /**分数 */
    myglobal.POINT = 0;

    /**删除此模块 */
    myglobal.disable = function () {
        lt_code.clearAll(1);
        window.myglobal = null;
    };

    /**清除游戏的数据 */
    myglobal.clearGame = function () {
        /**清空玩家数据 */
        myglobal.player = null;
        /**清空敌人 */
        myglobal.foes = [];
        /**清空道具 */
        myglobal.items = [];
        /**清空子弹 */
        myglobal.bullet = [];
    };
    
    /**本地工程模块 */
    window.myglobal = myglobal;

    /**
     * 添加js文件
     * @param {any} jsName
     */
    myglobal.addJs = function (jsName) {
        var newJs = lt_code.newDom("script", { src: jsName });
        lt_code.addChild(newJs);
    }

    /**启动追加内容 */
    window.onload = function () {
        myglobal.js.forEach(function (e) {
            myglobal.addJs(myglobal.currentDir + e);
        });
    };
}();
