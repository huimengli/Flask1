////居中显示登录框
//!function () {
//    var height = window.innerHeight;

//    //console.log(height);

//    var loadIn = lt_code.getAll(".loadIn");

//    var margin_top_value = (height - loadIn.offsetHeight) / 2;

//    loadIn.style.margin = margin_top_value + "px auto";
//}();

//网页背景
//!function () {
//    /**网页背景图片 */
//    var background = lt_code.getAll("#background");

//    background.style.position = "absolute";
//    background.style.float = "left";
//    /**图片距离左边的距离 */
//    var backgroundLeft = 0;
//    /**图片距离头部的距离 */
//    var backgroundTop = 0;
//    /**图片的缩放比 */
//    var Scaling = null;

//    if (Scaling) {
//        background.style.width = background.offsetWidth * Scaling + "px";
//        background.style.height = background.offsetHeight * Scaling + "px";
//    } else {
//        background.style.width = window.innerWidth + "px";
//        background.style.height = window.innerHeight + "px";
//    }

//    background.style.top = backgroundTop + "px";
//    background.style.left = backgroundLeft + "px";
//    background.style.zIndex = "-1";

//}();

//登录框背景
!function () {
    /**登录框 */
    var loadIn = lt_code.getAll(".loadIn");
    /**登录框背景 */
    var father = lt_code.getDomFather(loadIn);
    //父类的样式赋值
    father.style.height = (loadIn.offsetHeight + 70) + "px";
    father.style.position = "relative";
    father.style.top = "calc((100vh - 365px)/2)";
    father.style.left = "calc((100vw - 444px)/2)";
    father.style.width = (loadIn.offsetWidth + 40) + "px";
    //father.style.margin = (lt_code.getNum(loadIn.style.margin.replace(/[^\d\.]/ig, "")) - 20) + "px auto";
    father.style.backgroundColor = "rgba(255,255,255,0.6)";
    //子类的样式赋值
    loadIn.style.position = "absolute";
    loadIn.style.margin = "";
    loadIn.style.top = 20 + "px";
    loadIn.style.left = 20 + "px";

}();

////如果改变分辨率
//!function () {
//    /**之前的高度 */
//    var old_height = height | 0;
//    /**之前的宽度 */
//    var old_width = width | 0;
//    /**现在的高度 */
//    var height = window.innerHeight;
//    /**现在的宽度 */
//    var width = window.innerWidth;
//    //开始判读
//    setInterval(function () {
//        if (old_height !== height || old_width !== width) {
//            change_background();
//        }
//    }, 200);

//    /**改变背景的函数 */
//    var change_background = function () {
//        /**网页背景图片 */
//        var background = lt_code.getAll("#background");

//        background.style.position = "absolute";
//        background.style.float = "left";
//        /**图片距离左边的距离 */
//        var backgroundLeft = 0;
//        /**图片距离头部的距离 */
//        var backgroundTop = 0;
//        /**图片的缩放比 */
//        var Scaling = null;

//        if (Scaling) {
//            background.style.width = background.offsetWidth * Scaling + "px";
//            background.style.height = background.offsetHeight * Scaling + "px";
//        } else {
//            background.style.width = window.innerWidth + "px";
//            background.style.height = window.innerHeight + "px";
//        }

//        background.style.top = backgroundTop + "px";
//        background.style.left = backgroundLeft + "px";
//        background.style.zIndex = "-1";
//    }

//}();

//如果改变分辨率
!function () {
    /**网页背景图片 */
    var background = lt_code.getAll("#background");

    var changeBackground = function (w, h) {
        if (w / h < t) {
            background.style.height = h + "px";
            background.style.top = "0";
            background.style.width = lt_code.getNum(h * t) + "px";
            background.style.left = "calc((100vw - " + lt_code.getNum(h * t) + "px)/2)";
        } else if (w / h > t) {
            background.style.width = w + "px";
            background.style.left = "0";
            background.style.height = lt_code.getNum(w / t) + "px";
            background.style.top = "calc((100vh - " + lt_code.getNum(w / t) + "px)/2)";
        } else {
            background.style.left = "0";
            background.style.top = "0";
            background.style.width = w + "px";
            background.style.height = h + "px";
        }
    }

    background.style.position = "absolute";
    background.style.float = "left";
    background.style.zIndex = "-1";

    var oldW = lt_code.variable.width;
    var oldH = lt_code.variable.height;

    const imgW = 1920;
    const imgH = 1080;

    const t = imgW / imgH;

    changeBackground(oldW, oldH);

    lt_code.variable.addRun(setInterval(function () {
        var width = lt_code.variable.Width();
        var height = lt_code.variable.Height();

        if (oldW != width || oldH != height) {
            oldH = height;
            oldW = width;
            changeBackground(width, height);
        }

    }, 100), "背景动态适配")
}()

//废弃
!function () {
    ////输入框调整
    ///**是否是第一次点击 */
    //var IsFirst = new Array();
    ////调整
    //!function () {
    //    /**输入框 */
    //    var input_box = new Array;
    //    /**存放输入框 */
    //    var line_right = lt_code.getAll(".line_right");
    //    //录入输入框
    //    for (var i = 0; i < line_right.length; i++) {
    //        input_box[input_box.length] = lt_code.getAll2("input", line_right[input_box.length],0);
    //    }
    //    for (var i = 0; i < input_box.length; i++) {
    //        IsFirst[i] = true;
    //    }
    //    //给输入框录入类
    //    for (var i = 0; i < input_box.length; i++) {
    //        input_box[i].className = "input";
    //    }
    //    //废弃方式
    //    !function () {
    //        //$(".input").click(function () {
    //        //    var index = $(this).index();
    //        //    console.log(index);
    //        //    if (IsFirst[index]) {
    //        //        IsFirst[index] = false;
    //        //        this.value = "";
    //        //    }
    //        //})
    //    };
    //    //重写
    //    $(".line").mouseenter(function () {
    //        var index = $(this).index() - 1;
    //        //console.log(index);

    //        var line_right = $(this).children(".line_right");
    //        //var input = $(line_right).children(".input");
    //        if (index < 3) {
    //            lt_code.getAll(".input", index).onmousedown = function () {
    //                if (IsFirst[index]) {
    //                    IsFirst[index] = false;
    //                    //console.log(this);
    //                    this.value = "";
    //                }
    //            }
    //        }
    //    });
    //}();
};

//没有输入的时候报错
!function () {
    //废弃
    !function () {
        //$(".input").blur(function () {
        //    //废弃
        //    !function () {
        //        //var input = function () {
        //        //    var input = lt_code.getAll(".input");
        //        //    var ref = new Array();
        //        //    for (var i = 0; i < input.length; i++) {
        //        //        ref[i] = input[i];
        //        //    }
        //        //    return ref;
        //        //}();
        //        //var index = function () {
        //        //    var ref = input.indexOf(this);
        //        //    return ref;
        //        //}();
        //    }();
        //    console.log(index);
        //    if (!this.value && index >= 0) {
        //        lt_code.getAll(".alert", index).style.opacity = "1";
        //    }
        //});
    };
    //可用方式
    $(".loadIn").on("click", ".line", function () {
        var index = $(this).index()-1;
        var child = $(this).children();
        var input_box = $(child[1]).children()[0];
        $(input_box).blur(function () {
            if (!this.value) {
                lt_code.getAll(".alert", index).style.opacity = "1";
            } else {
                lt_code.getAll(".alert", index).style.opacity = "0";
            }
        });
    });
}();

//验证码输入上限限制
!function () {
    var input = lt_code.getAll(".input", lt_code.getAll(".input").length - 1);
    input.onkeyup = function () {
        //console.log(this.value);
        if (this.value.length > 4) {
            this.value = /(.{4})/.exec(this.value)[1];
        }
    }
}();

//改变lina行的样式
!function () {
    var lina = lt_code.getAll(".lina", 1);
    lina.style.borderTop = "3px double black";
    lina.style.paddingTop = "10px";
}();

//注册和登录按钮
!function () {
    lt_code.getAll(".loadIn").onkeyup = function () {
        var input = lt_code.getAll(".input");
        var value = new Array();
        var isOk = true;
        for (var i = 0; i < input.length; i++) {
            value[i] = !input[i].value ? false : true;
        }
        value.forEach(function (each) {
            if (!each) {
                isOk = false;
            }
        });
        if (isOk) {
            lt_code.getAll(".change_page", 0).style.color = "black";
        }
    };
}();
