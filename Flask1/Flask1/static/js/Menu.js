//网页背景
!function () {
    /**网页背景图片 */
    var background = lt_code.getAll("#background");

    /**图片距离左边的距离 */
    var backgroundLeft = 0;
    /**图片距离头部的距离 */
    var backgroundTop = 0;
    /**图片的缩放比 */
    var Scaling = null;

    lt_code.variable.addRun(setInterval(function () {
        background.style.position = "absolute";
        background.style.float = "left";

        if (Scaling) {
            background.style.width = background.offsetWidth * Scaling + "px";
            background.style.height = background.offsetHeight * Scaling + "px";
        } else {
            background.style.width = window.innerWidth + "px";
            background.style.height = window.innerHeight + "px";
        }

        background.style.top = backgroundTop + "px";
        background.style.left = backgroundLeft + "px";
        background.style.zIndex = "-10";
    }, 200), "动态修改网页背景大小");
}();

//导航菜单
!function () {
    /**每一个导航 */
    var li = lt_code.getAll2("li",
        lt_code.getAll2("ul", lt_code.getAll(".menu")));
    for (var i = 0; i < li.length; i++) {
        li[i].style.backgroundColor = "rgba(0,0,0,0)";
        li[i].style.borderColor = "rgba(0,0,0,0)";
        eval(
            "li[" + i + "].onmousedown = function () {" +
            "lt_code.test.fullpage.change_page(" + i + ");" +
            "};"
        );
    }
    li[0].style.backgroundColor = "#999";
    li[0].style.borderColor =
        lt_code.getAll(".lt_for_page", 0).style.backgroundColor ||
        "white";
    /**检查li的样式 */
    var chackLi = index => {
        for (var i = 0; i < li.length; i++) {
            if (i === index) {
                li[i].style.backgroundColor = "#999";
                li[i].style.borderColor =
                    lt_code.getAll(".lt_for_page", i).style.backgroundColor ||
                    "white";
            } else {
                li[i].style.backgroundColor = "transparent";
                li[i].style.borderColor = "transparent";
            }
        }
    };
    $(".menu ul").on("click", "li", function () {
        var index = $(this).index();
        //console.log($(this));
        chackLi(index);
    });
    //目录检查
    lt_code.getAll(".background").onmousewheel = function () {
        setTimeout(() => {
            chackLi(lt_code.test.fullpage.now_page);
        }, 100);
    };
    !function () {
        var canChange = true;
        window.onkeydown = e => {
            if (canChange) {
                canChange = false;
                e = e || window.event;
                //console.log(e.keyCode);
                if (e.keyCode === 38) {
                    li[lt_code.test.fullpage.now_page > 0 ?
                        lt_code.test.fullpage.now_page - 1 : 0].click();
                    lt_code.test.fullpage.change_page(lt_code.test.fullpage.now_page > 0 ?
                        lt_code.test.fullpage.now_page - 1 : 0);
                } else if (e.keyCode === 40) {
                    li[lt_code.test.fullpage.now_page < li.length - 1 ?
                        lt_code.test.fullpage.now_page + 1 : li.length - 1].click();
                    lt_code.test.fullpage.change_page(lt_code.test.fullpage.now_page < li.length - 1 ?
                        lt_code.test.fullpage.now_page + 1 : li.length - 1);
                }
                downPower();
                setTimeout(() => {
                    canChange = true;
                }, 1000);
            }
        };
    }();
}();

//目录开关
!function () {
    /**关闭/打开菜单按钮 */
    var close_menu = lt_code.getAll(".close_menu");
    /**菜单是否开启着 */
    var isOpen = 0;
    /**开关的等待时间 */
    var waitTime = 1;
    /**是否能改变状态 */
    var canChange = true;

    lt_code.getAll(".menu").style.left = "-150px";

    var x = document.createElement("canvas");
    x.className = "x";
    x.width = 16;
    x.height = 16;
    x.style.paddingTop = "12px";

    var exit = lt_code.getAll(".exitUser");

    var exitFirst = lt_code.getAll("div", 0, exit);

    var changeExit = function () {
        if (isOpen) {
            exitFirst.style.marginLeft = "40px";
        } else {
            exitFirst.style.marginLeft = "110px";
        }
    }

    close_menu.onmousedown = function () {
        //console.log(isOpen);
        if (canChange) {
            canChange = false;
            isOpen = isOpen == 0 ? 1 : 0;
            if (isOpen) {
                lt_code.moveBoxTo2(lt_code.getAll(".menu"), 0);
                lt_code.getAll(".close_menu").innerHTML = "";
                lt_code.getAll(".close_menu").appendChild(x);
                var ctx = x.getContext("2d");
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(16, 16);
                ctx.moveTo(16, 0);
                ctx.lineTo(0, 16);
                ctx.strokeStyle = "white";
                ctx.stroke();
                ctx.closePath();
                lt_code.getAll(".close_menu").style.backgroundColor = "red";
            } else {
                lt_code.moveBoxTo2(lt_code.getAll(".menu"), -150);
                lt_code.getAll(".close_menu").style.backgroundColor = "";
                lt_code.getAll(".close_menu").innerHTML = "三";
            }
            changeExit();
            setTimeout(() => {
                canChange = true;
            }, waitTime * 1000);
        }
    };
}();

/**内容框的背景颜色 */
var backColors = [];

//修改内容框样式,改变内容框的背景颜色
!function () {
    /**内容框 */
    var back = lt_code.getAll(".back");
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
    var alpha = 0.7;
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

    /**
     * 读取rgba颜色
     * @param {string} color 颜色
     * @param {number} alpha 不透明度
     */
    var readRgba = function (color, alpha) {
        var readColor = /\((\d+)\,(\d+)\,(\d+)\,[\d.]+\)/;
        var value = readColor.exec(color);
        //console.log(value);
        var ret = "rgba(" + value[1] +
            "," + value[2] + "," + value[3] +
            "," + alpha + ")";
        return ret;
    };
    //获取页面颜色
    backgroundcolors.forEach(function (color) {
        backColors.push(readRgba(color, alpha));
    });
    //修改内容框的颜色
    for (var i = 0; i < back.length; i++) {
        back[i].style.backgroundColor = backColors[i];
    }

}();

//是否登录,如果没有登录跳转到登录界面
/**使用者类 */
class User {
    /**使用者的id */
    id;
    /**使用者的姓名*/
    name;

}

//个人中心
!function () {
    var zhongxing = lt_code.getAll(".zhongxing");
    zhongxing.style.height = "50px";
    var isOpen = false;
    zhongxing.onmousedown = function () {
        isOpen = !isOpen;
        if (isOpen) {
            zhongxing.style.height = "150px";
        } else {
            zhongxing.style.height = "50px";
        }
    }
}();

//修改内容
lt_code.getAll(".changeValue").onmousedown = function () {
    window.location.href = "/changeValue/";
}

/**减缓浏览器压力 */
var downPower = null;

/**初始化函数 */
var innit = null;

//第二屏的三维标签云
!function () {
    //主要变量
    /**所有标签 */
    var tagEle;

    /**标签盒 */
    var paper = lt_code.getAll(".tagBall");

    /**集散程度 */
    var RADIUS = 300;

    /**景深 */
    var fallLength = 500;

    /**标签对象数组 */
    var tags = [];

    var angleX = Math.PI / 500;

    var angleY = Math.PI / 500;

    /**标签盒一半的宽度 */
    var CX = paper.offsetWidth / 2;

    /**标签盒一半的高度 */
    var CY = paper.offsetHeight / 2;

    var EX = paper.offsetLeft + lt_code.getAll().scrollLeft + document.documentElement.scrollLeft;

    var EY = paper.offsetTop + lt_code.getAll().scrollTop + document.documentElement.scrollTop;

    /**运动挂载 */
    var run = null;

    /**初始化 */
    innit = function () {
        tagEle = lt_code.getAll(".tag");
        tags = [];
        for (var i = 0; i < tagEle.length; i++) {
            var a, b;
            var k = (2 * (i + 1) - 1) / tagEle.length - 1;
            var a = Math.acos(k);
            var b = a * Math.sqrt(tagEle.length * Math.PI);
            var x = RADIUS * Math.sin(a) * Math.cos(b);
            var y = RADIUS * Math.sin(a) * Math.sin(b);
            var z = RADIUS * Math.cos(a);
            var t = new tag(tagEle[i], x, y, z);
            tagEle[i].style.color = lt_code.variable.roundColor(155);
            tags.push(t);
            t.move();
        }
    };

    lt_code.innerConsole = function (str) {
        eval("console.log(" + str + ")");
    };

    /**
     * 每一个
     * @param {Array} callback
     */
    Array.prototype.forEach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i]);
        }
    };

    /**旋转x轴 */
    var rotateX = () => {
        var cos = Math.cos(angleX);
        var sin = Math.sin(angleX);
        tags.forEach(function () {
            var y1 = this.y * cos - this.z * sin;
            var z1 = this.z * cos + this.y * sin;
            this.y = y1;
            this.z = z1;
        });
    };

    /**旋转y轴 */
    var rotateY = () => {
        var cos = Math.cos(angleY);
        var sin = Math.sin(angleY);
        tags.forEach(function () {
            var x1 = this.x * cos - this.z * sin;
            var z1 = this.z * cos + this.x * sin;
            this.x = x1;
            this.z = z1;
        });
    };

    /**
     * 标签
     */
    class tag {
        /**
         * 构造函数
         * @param {HTMLElement} ele 标签对象
         * @param {number} x 标签x值
         * @param {number} y 标签y值
         * @param {number} z 标签z值
         */
        constructor(ele, x, y, z) {
            /**标签对象 */
            this.ele = ele;
            this.x = x;
            this.y = y;
            this.z = z;
        };

        /**移动函数 */
        move() {
            var scale = fallLength / (fallLength - this.z);
            var alpha = (this.z + RADIUS) / (2 * RADIUS);
            this.ele.style.fontSize = 15 * scale + "px";
            this.ele.style.opacity = alpha + 0.5;
            this.ele.style.filter = "alpha(opacity = " + (alpha + 0.5) * 100 + ")";
            this.ele.style.zIndex = parseInt(scale * 100);
            this.ele.style.left = this.x + CX - this.ele.offsetWidth / 2 + "px";
            this.ele.style.top = this.y + CY - this.ele.offsetHeight / 2 + "px";
        };
    };

    if ("addEventListener" in window) {
        paper.addEventListener("mousemove", function (event) {
            event = event || window.event;
            var x = event.clientX - EX - CX;
            //由于是在fullpage的第二页,所以需要加上一个屏幕的高度
            var y = event.clientY - EY - CY+window.innerHeight;
            angleY = x * 0.0001;
            angleX = y * 0.0001;
        });
    } else {
        paper.attachEvent("onmousemove", function (event) {
            event = event || window.event;
            var x = event.clientX - EX - CX;
            var y = event.clientY - EY - CY+window.innerHeight;
            angleY = x * 0.0001;
            angleX = y * 0.0001;
        });
    }

    //开始运行
    //innit();
    //run = setInterval(() => {
    //    rotateX();
    //    rotateY();
    //    tags.forEach(function () {
    //        this.move();
    //    });
    //}, 17);

    //减缓浏览器压力负载
    lt_code.getAll().addEventListener("mousewheel", function () {
        downPower();
    });
    lt_code.getAll().addEventListener("mousedown", function () {
        downPower();
    });
    paper.addEventListener("mouseenter", function () {
        downPower();
    });

    downPower = function () {
        setTimeout(() => {
            if (lt_code.test.fullpage.now_page === 1) {
                clearInterval(run);
                run = setInterval(() => {
                    rotateX();
                    rotateY();
                    tags.forEach(function () {
                        this.move();
                    });
                }, 17);
            } else {
                clearInterval(run);
            }
        }, 100);
    };

    //downPower();
}();

