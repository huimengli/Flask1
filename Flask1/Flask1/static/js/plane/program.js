
/**对象盒子 */
myglobal.box = lt_code.getAll(".box");

/** canvas对象 */
myglobal.cas = lt_code.getAll("canvas", 0, myglobal.box);

/** 画布对象 */
myglobal.ctx = lt_code.getCtx(myglobal.cas);

/**刷新值:毫秒 30帧 */
myglobal.refresh30 = 33;

/**刷新值:毫秒 50帧 */
myglobal.refresh50 = 20;

/**清空画布 */
myglobal.clearCtx = function () {
    this.ctx.clearRect(0, 0, this.cas.width, this.cas.height);
}

//设置canvas对象参数
myglobal.cas.width = lt_code.getDomFather(myglobal.cas).clientWidth;
myglobal.cas.height = lt_code.getDomFather(myglobal.cas).clientHeight;

//设置盒子样式
lt_code.variable.addRun(setInterval(function () {
    var top = lt_code.getNum((lt_code.variable.height - myglobal.box.clientHeight) / 2);
    var left = lt_code.getNum((lt_code.variable.width - myglobal.box.clientWidth) / 2);
    myglobal.box.style.top = top;
    myglobal.box.style.left = left;
    if (top<0||left<0) {
        alert("游戏最小需要" + myglobal.box.clientWidth + "x" + myglobal.box.clientHeight + "的分辨率!");
    }
}, 100), "动态盒子居中");

//开始游戏
myglobal.games.rounds.begin.start();