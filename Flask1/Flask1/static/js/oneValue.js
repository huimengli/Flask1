//修改内容框样式,改变内容框的背景颜色
!function () {
    /**内容框 */
    var back = lt_code.getClass("back");
    //把对象转化为动态数组
    back = Array.prototype.slice.call(back);
    /**当前页面的高度 */
    var height = window.innerHeight;
    /**内容框的高度 */
    var back_height = back[0].offsetHeight;
    /**相差高度 */
    var change_height = height - back_height;
    //change_height = change_height < 0 ? 0 : change_height;
    /**不透明度 */
    var backs = ["rgba(0,0,255,0)"];
    //内容框垂直居中
    if (change_height >= 0) {
        back.forEach(function (each) {
            each.style.margin = lt_code.getNum(change_height / 2) + "px auto";
        });
    } else {
        back.forEach(function (e) {
            e.style.height = height + "px";
            e.style.margin = "0 auto";
        });
    }

    lt_code.variable.addRun(setInterval(function () {
        //height = window.innerHeight;
        if (height != window.innerHeight) {
            height = window.innerHeight;
            change_height = height - back_height;
            if (change_height >= 0) {
                back.forEach(function (each) {
                    each.style.margin = lt_code.getNum(change_height / 2) + "px auto";
                    each.style.height = back_height + "px";
                });
            } else {
                back.forEach(function (e) {
                    //e.style.height = height + "px";
                    e.style.margin = "0 auto";
                });
            }
        }
    }, 200), "动态修改back块垂直状态");

    //修改内容框的颜色
    for (var i = 0; i < back.length; i++) {
        back[i].style.background = backs[i];
    }
}();

