﻿/**文件系统功能目录 */
var title = lt_code.getAll(".menu");
/**目录表头模块 */
var icon = lt_code.getAll(".icon", 0);
/**文件表头图片 */
var iconImg = lt_code.getAll2(".icon", icon);
/**表头内容 */
var iconVal = lt_code.getAll2("div", icon);
/**网页主体 */
var body = lt_code.getAll();
/**目录列表 */
var list = lt_code.getAll(".list");
/**按钮块 */
var mouseBox = lt_code.getAll2(".title", lt_code.getAll(".main"));
/**文件夹列表 */
var lists = [];
/**文件盒子 */
var mainBox = lt_code.getAll2(".showBox");
/**所有按钮 */
var mouseBottoms = lt_code.getAll2(".bottom", mouseBox);
/**post请求地址 */
var postUrl = window.location.href;
/**历史记录 */
lt_code.history = {
    /** 当前搜索的文件夹 */
    now: "",
    /** 上一级文件夹 */
    back: "",
    /** 历史记录 */
    history: [],
    /**最大记录条数 */
    maxHistory: 30,
    /**搜索目录*/
    searchDir: function (dir) {

        //清空主盒子
        clearMainBox();

        /**上传数据 */
        var up = {
            n: "list",
            isdir: "True",
            dir: dir,
        };


        $(function () {
            $.ajax({
                type: "post",
                url: postUrl,
                data: JSON.stringify(up),
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (data) {
                    eval("data = " + data);
                    //console.log(data);
                    //清空内容数据
                    clearMainBox();
                    newEachFile("/..", 0, 0, false, "", dir);
                    for (var j = 0; j < data.length; j++) {
                        //console.log(data[j]);
                        for (var x in data[j]) {
                            if (data[j][x] == "False") {
                                file_project.pushLine(newEachFile(x.slice(dir.length), 0, 0, false, x));
                            } else {
                                newFileInfo(x);
                            }
                        }
                    }
                },
                error: function (err) {
                    lt_code.history.clear();
                    console.trace(err);
                }
            });
        });
    },
    /**
     * 获取上一级
     * @param {string} dir 当前路径
     */
    getBack: function (dir) {
        var all = dir.split("/");
        var ret = "";
        if (all.length >= 2) {
            for (var i = 0; i < all.length - 2; i++) {
                ret += all[i] + "/";
            }
            ret += all[all.length - 2];
        } else {
            ret = "";
        }
        return ret;
    },
    /**
     * 新的搜索
     * @param {string} dir 新的文件夹路径
     */
    newSearch: function (dir) {
        this.history.push(this.now);
        this.now = dir;
        this.searchDir(dir);
        dirSpan.innerText = "root" + this.now;
        this.back = this.getBack(dir);
    },
    /**返回上一次搜索 */
    lastSearch: function () {
        if (this.history.length > 0) {
            this.now = this.history[this.history.length - 1];
            this.history.pop();
            this.searchDir(this.now);
            dirSpan.innerText = "root" + this.now;
            this.back = this.getBack(this.now);
        } else {
            this.searchDir("");
        }
    },
    /**返回上一级搜索 */
    backSearch: function () {
        this.newSearch(this.back);
    },
    /**保存cookie */
    save: function () {
        //console.log(this.now);
        //this.history.push(this.now);
        var history = this.history;
        history.push(this.now);
        var ret = "";
        for (var i = history.length - this.maxHistory < 0 ? 0 : history.length - this.maxHistory; i < history.length - 1; i++) {
            ret += history[i] + ",";
        }
        ret += history[history.length - 1];
        ret = lt_code.base64.encode(ret);
        lt_code.cookie.saveCookie("history", ret, 7);
    },
    /**读取cookie */
    load: function () {
        var history = lt_code.cookie.getCookie("history");
        history = lt_code.base64.decode(history);
        this.history = history.split(",");
        this.lastSearch();
    },
    /**清空记录 */
    clear: function () {
        lt_code.cookie.removeCookie("history");
        this.history = [];
        this.now = "";
        this.back = "";
        this.newSearch("");
    }
};
/**显示当前目录 */
var dirSpan = lt_code.getAll("#spanDir");

/**清除主盒子 */
var clearMainBox = function () {
    mainBox.innerHTML = "";
    file_project.lines = [];
};

/**
 * 新弹窗
 * @param {string} title
 * @param {string} title
 * @param {Function} [yesFuc] 确认执行的函数
 * @param {Function} [noFuc] 取消执行的函数
 * @param {Function} [elseFuc] 其他按钮需要执行的函数(感觉用不上了)
 * @param {number} [selectType] 选择类型:1.文件选择,2.输入选择
 *
 */
var newAlert = function (title, value, yesFuc, noFuc, selectType, elseFuc) {
    /**弹窗背景 */
    var alertBack = document.getElementById("alertBack") ? lt_code.getAll("#alertBack") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "alertBack",
                class: selectType > 0 ? "alertSelect" : "",

            });

            lt_code.addChild(ret);

            return ret;
        }();
    /**弹窗内容容器 */
    var alertBox = document.getElementById("alertBox") ? lt_code.getAll("#alertBox") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "alertBox",

            });

            lt_code.addChild(ret, alertBack);

            return ret;
        }();
    /**弹窗标题 */
    var alertTitle = document.getElementById("alertTitle") ? lt_code.getAll("#alertTitle") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "alertTitle",

            });

            ret.innerText = title;

            lt_code.addChild(ret, alertBox);

            return ret;
        }();
    /**弹窗内容框 */
    var alertValue = document.getElementById("alertValue") ? lt_code.getAll("#alertValue") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "alertValue",

            });

            ret.innerText = value ? value : "";

            lt_code.addChild(ret, alertBox);

            return ret;
        }();
    /**确认按钮 */
    var alertYesBottom = document.getElementById("alertYesBottom") ? lt_code.getAll("#alertYesBottom") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "alertYesBottom",
                style: {
                    "background-color": yesFuc ? "snow" : "#ccc",
                    cursor: yesFuc ? "pointer" : "default",

                },

            });

            ret.innerText = "确认";

            lt_code.addChild(ret, alertBox);

            return ret;
        }();
    /**取消按钮 */
    var alertNoBottom = document.getElementById("alertNoBottom") ? lt_code.getAll("#alertNoBottom") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "alertNoBottom",
                style: {
                    "background-color": "snow",
                    cursor: "pointer",

                },

            });

            ret.onmousedown = noFuc ? noFuc : function () {
                lt_code.getDomFather(alertBack).removeChild(alertBack);
            };

            ret.innerText = "取消";

            lt_code.addChild(ret, alertBox);

            return ret;
        }();
    /**其他按钮 */
    var alertElseBottom = document.getElementById("alertElseBottom") ? lt_code.getAll("#alertYesBottom") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "alertElseBottom",
                style: {
                    "background-color": "snow",
                    cursor: "pointer",

                },
            });

            ret.onmousedown = elseFuc ? elseFuc : function () { };

            ret.innerText = "其他";

            if (!!elseFuc) {
                lt_code.addChild(ret, alertBox);
            }

            return ret;
        }();


    alertBack.style.display = "";
    alertTitle.innerText = title;
    alertValue.innerText = value ? value : "";
    alertYesBottom.onmousedown = yesFuc ? yesFuc : null;
    alertNoBottom.onmousedown = noFuc ? noFuc : function () {
        lt_code.getDomFather(alertBack).removeChild(alertBack);
    };
    if (selectType > 0) {
        var alertInputBox = document.getElementById("alertInputBox") ? lt_code.getAll("#alertInputBox") :
            function () {
                var ret = lt_code.newDom("div", {
                    id: "alertInputBox",
                    class: "alertSelect",


                });

                lt_code.addChild(ret, alertBox);

                return ret;
            }();
        var alertInput = document.getElementById("alertInput") ? lt_code.getAll("#alertInput") :
            function () {
                var ret = lt_code.newDom("input", {
                    id: "alertInput",
                    type: selectType == 1 ? "file" :
                        selectType == 2 ? "input" : "",
                    style: selectType == 1 ? {} :
                        selectType == 2 ? {
                            height: "30px",
                            border: "1px solid #999",
                            'border-radius': "5px",
                            'padding-left': '10px',
                            'padding-right': "10px",
                        } : {},
                });

                lt_code.addChild(ret, alertInputBox);

                return ret;
            }();
        alertBack.className = "alertSelect";
    } else {
        document.getElementById("alertInputBox") ? function () {
            var alertInputBox = lt_code.getAll("#alertInputBox");
            lt_code.getDomFather(alertInputBox).removeChild(alertInputBox);
        } : null;
        alertBack.className = "";
    }

};

/**
 * 新文件行
 * @param {string} fileName 文件名
 * @param {number} size 文件大小
 * @param {number} create 创建时间
 * @param {boolean} isFile 是否是文件
 * @param {string} dir 文件路径
 * @param {number} [pag] 文件包数量
 * @param {number} [level] 文件权限级别
 * @param {number} [isDelete] 文件是否删除
 */
var newEachFile = function (fileName, size, create, isFile, dir, pag, level, isDelete) {
    isFile = isFile == null ? true : isFile;
    pag = pag ? pag : 0;
    level = level ? level : 1;
    isDelete = typeof (isDelete) == "undefined" ? 1 : isDelete;

    /**每个文件行 */
    var eachFile = lt_code.newDom("div", {
        class: "eachFile",
        "data-fileName": fileName,
        "data-dir": dir,
        "data-isFile": isFile,
    });

    /**文件行文件名 */
    var newEachFileValue = lt_code.newDom("div", {
        class: "eachFileValue",

    });

    /**文件创建时间 */
    var newEachFileCreate = lt_code.newDom("div", {
        class: "eachFileCreate",

    });

    /**文件大小 */
    var newEachFileSize = lt_code.newDom("div", {
        class: "eachFileSize",

    });

    /**文件下载按钮所在 */
    var newEachFileBottom = lt_code.newDom("div", {
        class: "eachFileBottom",

    });

    /**文件下载按钮 */
    var newEachFileBottomBottom = lt_code.newDom("div", {
        class: "eachFileBottomBottom",
        title: "下载",
    });

    /**删除文件按钮 */
    var newEachFileBottomBottom2 = lt_code.newDom("div", {
        class: "eachFileBottomBottom",
        title: "删除",
    });

    newEachFileBottomBottom.innerText = "下载";
    newEachFileBottomBottom2.innerText = "删除";
    newEachFileValue.innerText = fileName;
    if (isFile) {
        lt_code.addChild(newEachFileBottomBottom, newEachFileBottom);
        lt_code.addChild(newEachFileBottomBottom2, newEachFileBottom);
        newEachFileSize.innerText = size;
        newEachFileCreate.innerText = new Date(create).format("yyyy-MM-dd hh:mm:ss");
        newEachFileBottomBottom.onmouseup = function () {
            downFile(eachFile);
        }
        newEachFileBottomBottom2.onmouseup = function () {
            deleteFile(eachFile);
        }
        if (isSafari()) {
            // 苹果浏览器不需要title提示
        } else {
            eachFile.title = "文件名称 : " + fileName;
            eachFile.title += "\n创建时间 : " + new Date(create).format("yyyy年MM月dd hh时mm分ss秒");
            eachFile.title += "\n文件大小 : " + (size < 1024 ? size + "字节" :
                size < 1024 * 1024 ? Math.floor(size / 1024 * 100) / 100 + "KB" :
                    size < 1024 * 1024 * 1024 ? Math.floor(size / 1024 / 1024 * 100) / 100 + "MB" :
                        Math.floor(size / 1024 / 1024 / 1024 * 100) / 100 + "GB");
            eachFile.title += "\n文件路径 : root" + dir;
            var l = "普通用户";
            switch (level) {
                case 0: l = "错误文件"; break;
                case 1:
                case 10: l = "普通用户"; break;
                case 11:
                case 50: l = "高级用户"; break;
                case 51:
                case 100: l = "管理员"; break;
                default: l = "最高管理员"; break;
            }
            eachFile.title += "\n权限需求 : " + l;
            eachFile.title += "\n文件包数 : " + pag;
            eachFile.title += "\n是否存在 : " + (isDelete == 0 ? "文件存在" : isDelete == 1 ? "文件已删除,可以找回" : "文件已彻底删除");
        }
    } else {
        newEachFileBottom.innerText = "文件夹";
        newEachFileSize.innerText = "/";
        newEachFileCreate.innerText = "/";
        newEachFileValue.style.cursor = "pointer";
        newEachFileValue.onmousedown = function () {
            var dir = lt_code.getDomFather(this).dataset.dir;
            lt_code.history.newSearch(dir);
        }
        eachFile.title = "文件夹\n路径 : root" + dir;
    }

    if (fileName == "/..") {
        eachFile.title = "返回上一级";
        //father = father.slice(0,father.length - fileName.length);
        //eachFile.dataset.father = father;
        newEachFileValue.onmousedown = function () {
            lt_code.history.backSearch();
        }
    }

    lt_code.addChild(newEachFileValue, eachFile);
    lt_code.addChild(newEachFileCreate, eachFile);
    lt_code.addChild(newEachFileSize, eachFile);
    lt_code.addChild(newEachFileBottom, eachFile);
    lt_code.addChild(eachFile, mainBox);

    return eachFile;
};

/**文件信息查询并创建 */
var newFileInfo = function (filename) {

    /**上传信息 */
    var info = {
        n: "list",
        isdir: "False",
        dir: filename,
    };

    $.ajax({
        type: "post",
        url: postUrl,
        data: JSON.stringify(info),
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (data) {
            eval("data = " + data);
            //console.log(data);
            data.forEach(function (i) {
                eval("window.temp = " + i);
                var x = window.temp;
                window.temp = "";
                //console.log(x);
                file_project.pushLine(newEachFile(x.name, x.size, lt_code.getNum(x.create), true, x.path, x.package, x.level, x.delete));
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
};

/**
 * 新文件夹行
 * @param {string} value 文件夹名称
 * @param {string} isfile 是否是文件
 * @param {HTMLElement} father 父类结点
 */
var newListBlock = function (value, isfile, father) {
    //console.log(father);

    var newBottom = lt_code.newDom("div", {
        class: "listBottom",

    });

    var newValue = lt_code.newDom("div", {
        class: "listValue",

    });

    newBottom.onmousedown = function () {
        var fatherDOM = lt_code.getDomFather(lt_code.getDomFather(this));
        fatherDOM.className = fatherDOM.classList.length > 1 ? "listBlock" : "listBlock listSelect";
        //console.log(father.classList);
    };

    //显示文件夹内容在右边屏幕上
    newValue.onmousedown = function () {

    };

    var newBlock = lt_code.newDom("div", {
        "data-listBlock": isfile,
        "data-dir": value,
        class: "listBlock",

    });

    value = father.dataset.dir == "root" ? value : value.slice(father.dataset.dir.length);

    newValue.innerHTML = value;
    newValue.onmousedown = function () {
        var dir = lt_code.getDomFather(this).dataset.dir;
        lt_code.history.newSearch(dir);
    };

    lt_code.addChild(newBottom, newValue);
    lt_code.addChild(newValue, newBlock);
    lt_code.addChild(newBlock, father);
    lists.push(newBlock);

};

/**
 * 是否是 Safari 浏览器
 */
var isSafari = function() {
    var userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1;
}

/**
 * 下载文件
 * @param {HTMLDivElement} fileLine 文件行
 */
var downFile = function (fileLine) {
    if (fileLine.dataset.isfile == "true") {
        /**上传数据 */
        var up = {
            n: "downFile",
            uid: UID,
            dir: fileLine.dataset.dir,
            uptime: new Date().getTime(),
        };

        var run = setInterval(function () {
            newAlert("稍等", "正在下载中...");
        }, 100);

        $(function () {
            $.ajax({
                type: "post",
                url: postUrl,
                data: JSON.stringify(up),
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (data) {
                    clearInterval(run);
                    var alertBack = document.getElementById("alertBack");
                    if (alertBack) {
                        lt_code.getDomFather(alertBack).removeChild(alertBack);
                    }
                    //console.log(data);
                    var x = {};
                    if (data.length > 10) {
                        eval("x = " + data);
                        if (!x.value) {
                            alert("下载失败\n后台没有传出数据!");
                            console.error("后台没有传出数据");
                            return;
                        }
                        let value = x.value.split(",");
                        let key = /([^\+]+)\+/.exec(value[1]);
                        let down = value[1].substring(key[1].length + 1);
                        key = lt_code.base64.else.getCode(x.uptime, key[1]);
                        down = lt_code.base64.change.getCode(down, key);
                        value = value[0] + "," + down;
                        if (x.md5 == lt_code.md5(value)) {
                            if (isSafari()) {
                                newAlert("Safari下载", "Safari请求权限弹窗\n是否将 " + x.name + " 下载到本地?", function () {
                                    lt_code.test.downFile(value, x.name);
                                });
                            } else {
                                lt_code.test.downFile(value, x.name);
                                alert("下载成功!");
                            }
                        } else {
                            newAlert("校检失败", "签名校检失败\n文件可能被篡改\n是否继续下载?", function () {
                                lt_code.test.downFile(value, x.name);
                                alert("下载成功!");
                            });
                        }
                    } else {
                        //console.assert(data);
                        if (data == "False") {
                            alert("下载失败!");
                        } else if (data == "Alive") {
                            alert("文件不存在!");
                        } else if (data == "Error") {
                            alert("没有下载权限!");
                        }
                    }
                },
                error: function (err) {
                    console.log(err);
                    alert("未知错误,下载失败!");
                }
            });
        });
        //console.log(up);
    } else {
        alert("暂不支持下载文件夹!");
    }
};

/**
 * 删除文件
 * @param {HTMLDivElement} fileLine
 */
var deleteFile = function (fileLine) {
    if (fileLine.dataset.isfile == "true") {
        /**上传数据 */
        var up = {
            n: "deleteFile",
            uid: UID,
            dir: fileLine.dataset.dir,
        };

        newAlert("警告!", "是否要删除文件:\n\"" + up.dir + "\"", function () {
            $(function () {
                $.ajax({
                    type: "post",
                    url: postUrl,
                    data: JSON.stringify(up),
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (data) {
                        console.log(data);
                        if (data == "False") {
                            alert("删除失败!");
                        } else if (data == "True") {
                            alert("删除成功!");
                            window.location.href = window.location.href;
                        } else if (data == "Error") {
                            alert("没有权限!");
                        } else if (data == "Alive") {
                            alert("文件不存在!");
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            });
        });

    } else {
        alert("不允许删除目录!");
    }
};

/**上传头像 */
var upTheHeadPhoto = function () {
    //所有部件
    /**上传头像的框 */
    var box = lt_code.newDom("div", {
        id: "upHeadPhoto",

    });
    /**关闭按钮 */
    var close = lt_code.newDom("div", {
        id: "upHeadPhotoClose",

    });
    /**上传头像的真实按钮 */
    var input = lt_code.newDom("input", {
        id: "upHeadPhotoInput",
        type: "file",
        style: {
            display: "none",
        }
    });
    /**上传头像的虚假按钮 */
    var inputDiv = lt_code.newDom("div", {
        class: "upHeadPhotoBottom",

    });
    /**裁切图片的盒子 */
    var cutBox = lt_code.newDom("div", {
        id: "upHeadPhotoCutBox",
        title: "移动滑块来裁切\n滚轮调整大小",
        style: {
            display: "none",
            width: "80px",
            height: "80px",
            border: "1px solid #999",
            left: "50px",
            top: "50px",
        }
    });
    /**显示上传图片并裁剪的画布 */
    var inputCanvas = lt_code.newDom("canvas", {
        class: "upHeadPhotoCanvas",
        id: "upHeadPhotoCanvasIn",
        width: 200,
        height: 200,
        style: {

        }
    });
    /**输出图片显示框 */
    var outBox = lt_code.newDom("div", {
        id: "upHeadPhotoCanvasOutBox",
        style: {

        }
    });
    /**输出图片显示框内容 */
    var outBoxValue = lt_code.newDom("span", {

    });
    /**显示裁剪完图片的画布 */
    var outputImg = lt_code.newDom("img", {
        class: "upHeadPhotoCanvas",
        id: "upHeadPhotoCanvasOut",
        width: 80,
        height: 80,

    });
    /**上传头像 */
    var upBottom = lt_code.newDom("div", {
        class: "upHeadPhotoBottom",
        style: {
            left: "350px",
        },
    });

    //画布
    /**裁切用画布 */
    var ctx = lt_code.getCtx(inputCanvas);
    /**头像预览画布 */
    //var ctx2 = lt_code.getCtx(outputCanvas);

    //预设值设定
    /**左边界 */
    const LEFT = 51;
    /**顶部边界 */
    const TOP = 51;
    /**右边界 */
    const RIGHT = 251;
    /**底部边界 */
    const BOTTOM = 251;

    //添加框在body中
    lt_code.addChild(box);
    lt_code.addChild(close, box);
    lt_code.addChild(input, box);
    lt_code.addChild(inputCanvas, box);
    lt_code.addChild(outBox, box);
    lt_code.addChild(outputImg, outBox);
    lt_code.addChild(outBoxValue, outBox);
    lt_code.addChild(inputDiv, box);
    lt_code.addChild(upBottom, box);
    lt_code.addChild(cutBox, box);

    //修改一些内容
    //close.innerText = "X";
    close.onmousedown = function () {
        lt_code.removeChild(box);
    };
    inputDiv.innerText = "上传图片";
    upBottom.innerText = "保存头像";
    outBoxValue.innerText = "头像预览";

    //功能性函数
    /**
     * 获取切割图片的数据
     * @param {CanvasRenderingContext2D} ctx 第一块画布
     */
    var getCut = function (ctx) {
        /**左距离 */
        var left = cutBox.offsetLeft - LEFT;
        /**右距离 */
        var width = cutBox.offsetWidth;
        /**顶部距离 */
        var top = cutBox.offsetTop - TOP;
        /**底部距离 */
        var height = cutBox.offsetHeight;
        /**裁切数据 */
        var data = ctx.getImageData(left, top, width, height);
        //console.log(data);
        /**临时canvas画布 */
        var tempCas = lt_code.newDom("canvas", {
            id: "upHeadPhotoTempCanvas",
            width: data.width,
            height: data.height,
            style: {
                opacity: "1",
            },
        });
        lt_code.addChild(tempCas);
        /**临时画布对象 */
        var tempCtx = lt_code.getCtx(tempCas);
        tempCtx.putImageData(data, 0, 0);
        data = tempCas.toDataURL();
        lt_code.removeChild(tempCas);
        //console.log(data);
        outputImg.src = data;
    }
    inputDiv.onmousedown = function () {
        input.click();
    };
    input.onchange = function () {
        if (this.value.length > 0) {
            lt_code.test.fileToBase(this);
            var run = setInterval(function () {
                var ret = lt_code.test.fileToBase.getReturn() || "";
                //删除裁剪框
                cutBox.style.display = "none";
                if (ret.length > 0 && ret.length < 10) {
                    clearInterval(run);
                    alert("上传文件为空");
                } else if (ret.length > 10) {
                    clearInterval(run);
                    //显示裁剪
                    cutBox.style.display = "block";
                    var imgDom = lt_code.newDom("img", {
                        src: ret,
                        style: {
                            opacity: 0,
                        },
                    });
                    lt_code.addChild(imgDom);
                    setTimeout(function () {
                        /**图片的宽度 */
                        var imgW = imgDom.offsetWidth;
                        /**图片的高度 */
                        var imgH = imgDom.offsetHeight;
                        lt_code.removeChild(imgDom);

                        //console.log(imgW);
                        //console.log(imgH);

                        /**图片查看宽度 */
                        var nowW = 0;
                        /**图片查看高度 */
                        var nowH = 0;

                        if (imgW == 0 || imgH == 0) {
                            alert("图片宽高识别失败...");
                            nowH = 200;
                            nowW = 200;
                        } else {
                            if (imgH > imgW) {
                                nowH = 200;
                                nowW = lt_code.getNum(imgW / imgH * 200);
                            } else if (imgH < imgW) {
                                nowW = 200;
                                nowH = lt_code.getNum(imgH / imgW * 200);
                            } else {
                                nowH = 200;
                                nowW = 200;
                            }
                        }

                        /**图片距离左边的距离 */
                        var left = lt_code.getNum((200 - nowW) / 2);
                        /**图片距离顶部的距离 */
                        var top = lt_code.getNum((200 - nowH) / 2);

                        //开始绘制图片
                        ctx.clearRect(0, 0, 200, 200);
                        ctx.beginPath();
                        ctx.drawImage(imgDom, left, top, nowW, nowH);
                        ctx.closePath();

                        //裁切一部分到显示框上去
                        getCut(ctx);
                    }, 100);
                }
            }, 40);
        }
    };
    cutBox.onmousedown = function (e) {
        cutBox.onmousemove = function (me) {
            /**鼠标移动的x */
            var moveX = me.offsetX - e.offsetX;
            /**鼠标移动的y */
            var moveY = me.offsetY - e.offsetY;

            //e = me;

            //console.log("x:" + moveX + ";y:" + moveY);

            /**框距离左边的距离 */
            var left = lt_code.getNum(this.style.left);
            /**框距离右边的距离 */
            var top = lt_code.getNum(this.style.top);
            /**框的宽度 */
            var width = lt_code.getNum(this.offsetWidth);
            /**框的高度 */
            var height = lt_code.getNum(this.offsetHeight);

            this.style.left = left + moveX > RIGHT - width ? (RIGHT - width) + "px" : left + moveX < LEFT ? LEFT + "px" : (left + moveX).toString() + "px";
            this.style.top = top + moveY > BOTTOM - height ? (BOTTOM - height) + "px" : top + moveY < TOP ? TOP + "px" : (top + moveY).toString() + "px";
        }
    };
    cutBox.onmouseup = function () {
        cutBox.onmousemove = function () { };
        getCut(ctx);
    };
    box.onmouseout = function () {
        cutBox.onmousemove = function () { };
    };
    cutBox.onwheel = function (e) {
        //console.log(e);
        /**框距离左边的距离 */
        var L = this.offsetLeft;
        /**框距离顶部的距离 */
        var T = this.offsetTop;
        /**框的宽度(2是边框占长) */
        var W = this.offsetWidth - 2;
        /**框的高度(2是边框占长) */
        var H = this.offsetHeight - 2;
        if (e.wheelDelta > 0) {
            W = W + 2 > 198 ? 198 : W + 2;
            H = H + 2 > 198 ? 198 : H + 2;
            L = L - 1 < LEFT ? LEFT : L - 1;
            T = T - 1 < TOP ? TOP : T - 1;
        }
        if (e.wheelDelta < 0) {
            W = W - 2 < 20 ? 20 : W - 2;
            H = H - 2 < 20 ? 20 : H - 2;
            L = L + 1 < LEFT ? LEFT : L + 1;
            T = T + 1 < TOP ? TOP : T + 1;
        }
        if (L < LEFT) {
            L = LEFT;
        }
        if (L + W > RIGHT) {
            L = RIGHT - W - 2;
        }
        if (T < TOP) {
            T = TOP;
        }
        if (T + H > BOTTOM) {
            T = BOTTOM - H - 2;
        }
        this.style.top = T + "px";
        this.style.left = L + "px";
        this.style.width = W + "px";
        this.style.height = H + "px";
        getCut(ctx);
    };

    //上传头像
    upBottom.onmousedown = function () {
        //console.log(outputImg.src);
        /**上传数据 */
        var up = {
            n: "upHeadPhoto",
            uid: UID,
            value: outputImg.src,
        };

        $(function () {
            $.ajax({
                type: "post",
                url: postUrl,
                data: JSON.stringify(up),
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (data) {
                    console.log(data);
                    if (data == "True") {
                        alert("头像上传成功!");
                        window.location.href = window.location.href;
                    } else if (data == "Error") {
                        alert("用户尚未登录!");
                        window.location.href = "/signOn/";
                    } else if (data == "False") {
                        alert("上传头像失败!");
                    }
                },
                error: function (err) {
                    console.error(err);
                }
            });
        });

    };
};

/**
 * 文件比较
 * @param {object} file1
 * @param {object} file2
 * @param {Function} file1Fuc
 * @param {Function} file2Fuc
 * @param {Function} allFuc
 * @param {Function} noFuc
 */
var fileCompare = function (file1, file2, file1Fuc, file2Fuc, allFuc, noFuc) {
    /**弹窗背景 */
    var alertBack = document.getElementById("alertBack") ? lt_code.getAll("#alertBack") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "alertBack",
                //class: selectType > 0 ? "alertSelect" : "",

            });

            lt_code.addChild(ret);

            return ret;
        }();
    /**弹窗内容框 */
    var fileBox = document.getElementById("fileBox") ? lt_code.getAll("#fileBox") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "fileBox",

            });

            lt_code.addChild(ret, alertBack);

            return ret;
        }();
    /**弹窗标题 */
    var fileTitle = document.getElementById("fileTitle") ? lt_code.getAll("#fileTitle") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "fileTitle",

            });

            ret.innerText = "文件比对";

            lt_code.addChild(ret, fileBox);

            return ret;
        }();
    /**弹窗内容框1 */
    var fileValue1 = document.getElementById("fileValue1") ? lt_code.getAll("#fileValue1") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "fileValue1",
                class: "fileValue",
            });

            ret.innerText = file1 ? file1 : "";

            lt_code.addChild(ret, fileBox);

            return ret;
        }();
    /**弹窗内容框2 */
    var fileValue2 = document.getElementById("fileValue2") ? lt_code.getAll("#fileValue2") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "fileValue2",
                class: "fileValue",
            });

            ret.innerText = file2 ? file2 : "";

            lt_code.addChild(ret, fileBox);

            return ret;
        }();
    /**文件1按钮 */
    var file1Bottom = document.getElementById("file1Bottom") ? lt_code.getAll("#file1Bottom") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "file1Bottom",
                class: "fileBottom",
                style: {
                    "background-color": "snow",
                    cursor: "pointer",

                },

            });

            ret.onmousedown = file1Fuc ? file1Fuc : function () { };

            ret.innerText = "保存老文件";

            lt_code.addChild(ret, fileBox);

            return ret;
        }();
    /**文件2按钮 */
    var file2Bottom = document.getElementById("file2Bottom") ? lt_code.getAll("#file2Bottom") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "file2Bottom",
                class: "fileBottom",
                style: {
                    "background-color": "snow",
                    cursor: "pointer",

                },

            });

            ret.onmousedown = file2Fuc ? file2Fuc : function () { };

            ret.innerText = "保存新文件";

            lt_code.addChild(ret, fileBox);

            return ret;
        }();
    /**文件全部保存按钮 */
    var fileAllBottom = document.getElementById("fileAllBottom") ? lt_code.getAll("#fileAllBottom") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "fileAllBottom",
                class: "fileBottom",
                style: {
                    "background-color": "snow",
                    cursor: "pointer",

                },

            });

            ret.onmousedown = allFuc ? allFuc : function () { };

            ret.innerText = "保存全部文件";

            lt_code.addChild(ret, fileBox);

            return ret;
        }();
    /**取消按钮 */
    var fileNoBottom = document.getElementById("fileNoBottom") ? lt_code.getAll("#fileNoBottom") :
        function () {
            var ret = lt_code.newDom("div", {
                id: "fileNoBottom",
                class: "fileBottom",
                style: {
                    "background-color": "snow",
                    cursor: "pointer",

                },

            });

            ret.onmousedown = noFuc ? noFuc : function () {
                lt_code.getDomFather(alertBack).removeChild(alertBack);
            };

            ret.innerText = "取消";

            lt_code.addChild(ret, fileBox);

            return ret;
        }();

    /**
     * 文件展示
     * @param {object} file 文件
     * @param {HTMLDivElement} valuebox 文件盒
     * @param {boolean} isold 是否是老文件
     */
    var showFile = function (file, valuebox, isold) {
        //清空内容框
        valuebox.innerHTML = "";
        /**新标题 */
        var valueTitle = lt_code.newDom("div", {
            class: "valueTitle",

        });
        valueTitle.innerText = isold ? "老文件:" + file.name : "新文件:" + file.name;
        /**
         * 新内容行
         * @param {string} title
         * @param {string} value
         * @param {HTMLDivElement} valuebox
         * @param {boolean} [haveLine]
         */
        var newValueLine = function (title, value, valuebox, haveLine) {
            /**内容行 */
            var line = lt_code.newDom("div", {
                class: "valueLine",
            });
            /**内容行标题 */
            var lineTitle = lt_code.newDom("div", {
                class: "valueLineTitle",
            });
            /**内容行值 */
            var lineValue = lt_code.newDom("div", {
                class: "valueLineValue",
                style: {
                    "font-size": value.length >= 30 ? "12px" : "",
                }
            });

            lineTitle.innerHTML = title.toString();
            lineValue.innerHTML = value.toString();

            if (haveLine) {
                line.style.borderBottom = "1px dashed #999";
            }

            lt_code.addChild(lineTitle, line);
            lt_code.addChild(lineValue, line);
            lt_code.addChild(line, valuebox);
        };

        lt_code.addChild(valueTitle, valuebox);

        //for (var x in file) {
        //    newValueLine(x, file[x], valuebox);
        //}
        isold ? function () {
            newValueLine("文件ID&nbsp;:&nbsp;", file.id, valuebox);
            newValueLine("文件名&nbsp;:&nbsp;", file.name, valuebox);
            newValueLine("文件大小&nbsp;:&nbsp;", file.size.toString() + "字节", valuebox);
            newValueLine("文件包大小&nbsp;:&nbsp;", file.eachSize.toString() + "字节", valuebox);
            newValueLine("文件包数量&nbsp;:&nbsp;", file.package.toString(), valuebox);
            newValueLine("文件路径&nbsp;:&nbsp;", file.path, valuebox);
            newValueLine("文件等级&nbsp;:&nbsp;", file.level, valuebox);
            newValueLine("创建时间&nbsp;:&nbsp;", new Date(lt_code.getNum(file.create)).format("yyyy-MM-dd hh:mm:ss"), valuebox);
            newValueLine("文件签名&nbsp;:&nbsp;", file.md5, valuebox);

        }() : function () {
            newValueLine("文件名&nbsp;:&nbsp;", file.name, valuebox);
            newValueLine("文件大小&nbsp;:&nbsp;", file.size.toString() + "字节", valuebox);
            newValueLine("文件路径&nbsp;:&nbsp;", file.path, valuebox);
            newValueLine("创建时间&nbsp;:&nbsp;", new Date(file.create).format("yyyy-MM-dd hh:mm:ss"), valuebox);
            newValueLine("文件签名&nbsp;:&nbsp;", file.md5, valuebox, true);
            newValueLine("文件体积&nbsp;:&nbsp;", file1.size > file2.size ? "老文件大" : file1.size < file2.size ? "新文件大" : "大小相同", valuebox);
            newValueLine("签名比较&nbsp;:&nbsp;", file1.md5 == file2.md5 ? "文件没有区别" : "文件内容不同", valuebox);
            newValueLine("时间比较&nbsp;:&nbsp;", file1.create > file2.create ? "老文件更新" : file1.create < file2.create ? "新文件更新" : "创建时间相同", valuebox, true);
            newValueLine("请注意&nbsp;:&nbsp;", "可能会由于权限不够无法覆盖", valuebox);
        }();
    }

    alertBack.style.display = "";
    fileNoBottom.onmousedown = noFuc ? noFuc : function () {
        lt_code.getDomFather(alertBack).removeChild(alertBack);
    };
    file1Bottom.onmousedown = file1Fuc ? file1Fuc : function () {
        lt_code.getDomFather(alertBack).removeChild(alertBack);
    };
    file2Bottom.onmousedown = file2Fuc ? file2Fuc : function () {
        file2Bottom.style.cursor = "";
        file2Bottom.style.backgroundColor = "#ccc";
        file2Bottom.title = "没有权限";
        return function () { };
    }();
    fileAllBottom.onmousedown = allFuc ? allFuc : function () {
        fileAllBottom.style.cursor = "";
        fileAllBottom.style.backgroundColor = "#ccc";
        fileAllBottom.title = "没有权限";
        return function () { };
    }();

    if (file1 && file2) {
        showFile(file1, fileValue1, true);
        showFile(file2, fileValue2, false);
    }
};

lt_code.variable.addRun(function () {
    return setInterval(function () {
        body.clientWidth / body.clientHeight < 1470 / 935 ? body.style.backgroundSize = "auto 100%" : body.style.backgroundSize = "100% auto";
    }, 100);
}(), "背景图片适应");

//页面加载
window.onload = function () {
    //iconImg.src = lt_code.variable.images.headPortrait[0];
    /**所有按钮 */
    var bottoms = Array.prototype.slice.call(lt_code.getAll2(".bottom", mouseBox));
    mouseBox.onmousemove = function (e) {
        bottoms.forEach(function (ea) {
            lt_code.mouseBoxShadow(ea, e, "#999");
        });
    };

    lists.push(lt_code.getAll(".listBlock", 0));
    lt_code.getAll(".listBottom", 0).onmousedown = function () {
        var father = lt_code.getDomFather(lt_code.getDomFather(this));
        father.className = father.classList.length > 1 ? "listBlock" : "listBlock listSelect";
        //console.log(father.classList);
    };
    var i = 0;
    lt_code.variable.addRun(setInterval(function () {
        if (i < lists.length) {
            /**父类结点 */
            var father = lists[i];
            /**真实路径 */
            var dir = father.dataset.dir;
            /**上传数据 */
            var up = {
                n: "list",
                isdir: "True",
                dir: dir
            };
            //获取目录
            $(function () {
                $.ajax({
                    type: "post",
                    url: postUrl,
                    data: JSON.stringify(up),
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (data) {
                        eval("data = " + data);
                        //console.log(data);
                        for (var j = 0; j < data.length; j++) {
                            //console.log(data[j]);
                            for (var x in data[j]) {
                                if (data[j][x] == "False") {
                                    newListBlock(x, false, father);
                                } else if (data[j][x] == "True") {
                                    continue;
                                }
                            }
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            });
            i++;
        } else if (i > lists.length * 2) {
            lt_code.variable.runer.forEach(function (e) {
                if (e['name'] == '遍历所有文件夹') {
                    clearInterval(e['num']);
                }
            });
        }
    }, 100), "遍历所有文件夹");
    lt_code.history.newSearch("");
    lt_code.getAll(".listValue", 0).onmousedown = function () {
        lt_code.history.newSearch("");
    }
    //后退
    mouseBottoms[0].onmousedown = function () {
        lt_code.history.lastSearch();
    };
    //新建目录
    mouseBottoms[1].onmousedown = function () {
        newAlert("新建目录", "请输入目录名称", function () {
            /**输入框 */
            var input = lt_code.getAll("#alertInput");
            /**输入值 */
            var value = input.value;
            if (value.length > 20 || /[\ `~!@#$%^&*()_\-+=<>?:"{}|,\.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”]/.test(value)) {
                alert("文件名不能长于20字符\n也不允许输入奇怪的字符!");
            } else {
                /**上传数据 */
                var up = {
                    n: "newDir",
                    name: value,
                    dir: lt_code.history.now,
                    uid: UID,
                };

                //新建文件夹
                $(function () {
                    $.ajax({
                        type: "post",
                        url: postUrl,
                        data: JSON.stringify(up),
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (data) {
                            console.log(data);
                            if (data == "True") {
                                alert("创建成功!");
                                window.location.href = window.location.href;
                            } else if (data == "Error") {
                                alert("错误!\n可能是因为没有权限!");
                            } else {
                                alert("创建失败!");
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                });
            }
            //关闭弹窗
            var back = lt_code.getAll("#alertBack");
            lt_code.getDomFather(back).removeChild(back);
        }, null, 2);
    };
    //上传文件
    mouseBottoms[2].onmousedown = function () {
        newAlert("上传文件", "请选择文件", function () {
            /**输入框 */
            var input = lt_code.getAll("#alertInput");

            if (input.files.length > 0) {
                /**上传的文件 */
                var file = input.files[0];

                if (file.size > 1024 * 1024 * 20) {
                    alert("上传文件过大!\n最大支持20MB");
                } else if (file.size == 0) {
                    alert("上传文件为空文件!");
                } else {
                    lt_code.test.fileToBase(input);
                    var getReturn = setInterval(function () {
                        var ret = lt_code.test.fileToBase.getReturn() || "";
                        if (ret.length > 0) {
                            clearInterval(getReturn);
                            const md5 = lt_code.md5(ret);
                            const time = new Date().getTime();
                            const values = ret.split(",");
                            const key = lt_code.base64.base64change.getKey();
                            const keyUp = lt_code.base64.chinese.setCode(time, key);
                            ret = values[0] + "," + keyUp + "+" + lt_code.base64.change.setCode(values[1], key);
                            //console.log(ret);
                            /**上传测试 */
                            var upTest = {
                                n: "upFileTest",
                                name: file.name,
                                size: file.size,
                                md5: md5,
                                dir: lt_code.history.now,
                                create: file.lastModified,
                                uptime: time,
                            };

                            /**上传的数据 */
                            var up = {
                                n: "upFile",
                                name: file.name,
                                size: file.size,
                                md5: md5,
                                dir: lt_code.history.now,
                                create: file.lastModified,
                                uptime: time,
                                value: ret,
                            };

                            /**强制上传的数据 */
                            var upOver = {
                                n: "upFileOver",
                                name: file.name,
                                size: file.size,
                                md5: md5,
                                dir: lt_code.history.now,
                                //create: file.lastModified,
                                uptime: time,
                                value: ret,
                            };

                            //上传文件
                            $(function () {
                                //上传测试
                                $.ajax({
                                    type: "post",
                                    url: postUrl,
                                    data: JSON.stringify(upTest),
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "text",
                                    success: function (data) {
                                        //console.log(data);
                                        if (data == "True") {
                                            //文件存在
                                            //console.trace("文件存在,还没写");
                                            //进入文件比对操作界面
                                            newAlert("注意", "文件\"" + upTest.name + "\"已存在!\n是否打开重复文件操作界面?", function () {
                                                /**后台已有文件 */
                                                var oldFile = {};
                                                $.ajax({
                                                    type: "post",
                                                    url: postUrl,
                                                    data: '{"n":"getFileInfo","dir":"' + upTest.dir + "/" + upTest.name + '"}',
                                                    contentType: "application/json; charset=utf-8",
                                                    dataType: "text",
                                                    success: function (data) {
                                                        //console.log(data);
                                                        eval("oldFile=" + data);
                                                        /**新创建的文件 */
                                                        var newFile = {
                                                            name: upTest.name,
                                                            size: upTest.size,
                                                            md5: upTest.md5,
                                                            path: upTest.dir + "/" + upTest.name,
                                                            create: upTest.create,
                                                        };
                                                        fileCompare(oldFile, newFile, null, function () {
                                                            if (upOver.md5 == oldFile.md5) {
                                                                alert("文件完全相同\n没有修改必要");
                                                            } else {
                                                                $.ajax({
                                                                    type: "post",
                                                                    url: postUrl,
                                                                    data: JSON.stringify(upOver),
                                                                    contentType: "application/json; charset=utf-8",
                                                                    dataType: "text",
                                                                    success: function (data) {
                                                                        //console.log(data);
                                                                        if (data == "True") {
                                                                            alert("文件覆盖成功!");
                                                                            window.location.href = window.location.href;
                                                                        } else if (data == "SystemError") {
                                                                            alert("后台系统出错!\n请联系管理员!");
                                                                            //console.trace("后台系统出错");
                                                                        } else if (data == "Error") {
                                                                            alert("错误!\n可能是因为没有权限!");
                                                                        } else if (data == "Alive") {
                                                                            alert("错误!\n要覆盖的文件不存在!");
                                                                        } else if (data == "False") {
                                                                            alert("上传失败!");
                                                                        }
                                                                    },
                                                                    error: function (err) {
                                                                        console.log(err);
                                                                    }
                                                                });
                                                            }
                                                        }, function () {
                                                            var fileBox = lt_code.getAll("#fileBox");
                                                            lt_code.getDomFather(fileBox).removeChild(fileBox);
                                                            newAlert("请改名!", "原名:'" + newFile.name + "'\n请输入文件的新名称", function () {
                                                                /**输入框 */
                                                                var input = lt_code.getAll("#alertInput");
                                                                /**输入值 */
                                                                var value = input.value;
                                                                if (value.length > 20 || /[\ `~!@#$%^&*()_\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”]/.test(value)) {
                                                                    alert("文件名不能长于20字符\n也不允许输入奇怪的字符!");
                                                                } else {
                                                                    //修改上传数据
                                                                    up = {
                                                                        n: "upFile",
                                                                        name: value,
                                                                        size: file.size,
                                                                        md5: md5,
                                                                        dir: lt_code.history.now,
                                                                        create: file.lastModified,
                                                                        uptime: time,
                                                                        value: ret,
                                                                    };

                                                                    //改过名了,直接用老模块上传
                                                                    $.ajax({
                                                                        type: "post",
                                                                        url: postUrl,
                                                                        data: JSON.stringify(up),
                                                                        contentType: "application/json; charset=utf-8",
                                                                        dataType: "text",
                                                                        success: function (data) {
                                                                            //console.log(data);
                                                                            if (data == "True") {
                                                                                alert("文件上传成功!");
                                                                                window.location.href = window.location.href;
                                                                            } else if (data == "Error") {
                                                                                alert("错误!\n可能是因为没有权限!");
                                                                            } else if (data == "Alive") {
                                                                                alert("错误!\n文件已经存在!");
                                                                            }
                                                                        },
                                                                        error: function (err) {
                                                                            console.log(err);
                                                                        }
                                                                    });
                                                                }
                                                                //关闭弹窗
                                                                var back = lt_code.getAll("#alertBack");
                                                                lt_code.getDomFather(back).removeChild(back);

                                                            }, null, 2);
                                                        },
                                                        )
                                                    },
                                                    error: function (err) {
                                                        console.log(err);
                                                    }
                                                });

                                            });
                                        } else if (data == "False") {
                                            //文件不存在,直接上传,用老模块
                                            $.ajax({
                                                type: "post",
                                                url: postUrl,
                                                data: JSON.stringify(up),
                                                contentType: "application/json; charset=utf-8",
                                                dataType: "text",
                                                success: function (data) {
                                                    //console.log(data);
                                                    if (data == "True") {
                                                        alert("文件上传成功!");
                                                        window.location.href = window.location.href;
                                                    } else if (data == "Error") {
                                                        alert("错误!\n可能是因为没有权限!");
                                                    } else if (data == "Alive") {
                                                        alert("错误!\n文件已经存在!");
                                                    }
                                                },
                                                error: function (err) {
                                                    console.log(err);
                                                }
                                            });
                                        } else if (data == "Error") {
                                            console.error("数据错误!\n没有权限!");
                                            alert("数据错误!\n没有权限!");
                                        }
                                    },
                                    error: function (err) {
                                        console.log(err);
                                    }
                                });
                            });

                        } else {
                            newAlert("稍等", "正在读取中...");
                        }
                    }, 100);

                }

                //关闭弹窗
                var back = lt_code.getAll("#alertBack");
                lt_code.getDomFather(back).removeChild(back);
            } else {
                alert("尚未选择文件!");
            }

        }, null, 1);
    };
    //删除目录
    mouseBottoms[3].onmousedown = function () {
        newAlert("确认删除", "你确认删除当前目录?\n目录: root" + lt_code.history.now, function () {
            alert("错误!没有权限!");
        }, null, 0);
    };
    //获取头像以及用户名
    !function () {
        /**新建用户 */
        var newUser = function (username) {
            var ret = lt_code.newDom("a", {
                href: "/changeValue/",
                id: "user",
                title: "个人中心",

            });
            ret.innerText = username;
            return ret;
        };

        /**
         * 显示用户类型
         * @param nameAndType
         */
        var showNameAndType = function (nameAndType) {
            switch (nameAndType.type) {
                case "admin":
                    iconVal.innerText = "最高管理员:";
                    iconVal.style.cursor = "pointer";
                    iconVal.title = "管理员界面";
                    iconVal.onmousedown = function () {
                        window.location.href = "/adminFile/";
                    }
                    lt_code.addChild(newUser(nameAndType.name), iconVal);
                    break;
                case "staff":
                    iconVal.innerText = "管理员:";
                    lt_code.addChild(newUser(nameAndType.name), iconVal);
                    break;
                case "general":
                    iconVal.innerText = "高级用户:";
                    lt_code.addChild(newUser(nameAndType.name), iconVal);
                    break;
                case "basic":
                    iconVal.innerText = "普通用户:";
                    lt_code.addChild(newUser(nameAndType.name), iconVal);
                    break;
                default:
                    iconVal.innerText = "尚未登录";
                    iconVal.onmousedown = function () {
                        window.location.href = "/signOn/";
                    };
                    iconVal.title = "登录";
                    iconVal.style.cursor = "pointer";
            }
        };

        /**删除头图并且生成一个上传头图的按钮 */
        var upHeadPhoto = function () {
            iconImg.style.display = "none";
            var inner = icon.innerHTML;
            icon.innerHTML = "";
            var upBottom = lt_code.newDom("div", {
                class: "iconUp",
                style: {
                    cursor: "pointer",
                }
            });

            upBottom.innerText = "上传\n头像";

            lt_code.addChild(upBottom, icon);
            icon.innerHTML += inner;

            lt_code.getAll(".iconUp").onmousedown = function () {
                upTheHeadPhoto();
            };
        }

        $(function () {
            $.ajax({
                type: "post",
                url: postUrl,
                data: '{"n":"headPhoto"}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (data) {
                    //console.log(data);
                    if (data.length > 0) {
                        iconImg.src = data;
                    } else {
                        if (iconVal.innerText !== "尚未登录") {
                            upHeadPhoto();
                        }
                    }
                },
                error: function (err) {
                    console.log(err);
                    iconImg.src = lt_code.variable.images.icons[0];
                }
            });
        });

        $(function () {
            $.ajax({
                type: "post",
                url: postUrl,
                data: '{"n":"nameAndType"}',
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function (data) {
                    //console.log(data);
                    var x = {};
                    eval("x = " + data);
                    showNameAndType(x);
                },
                error: function (err) {
                    console.log(err);
                    showNameAndType("");
                }
            });
        });
    }();
    //关闭加载
    lt_code.closeLoading();
    //读取历史记录
    lt_code.history.load();
};

//界面关闭
window.onbeforeunload = function () {
    //记录历史记录
    lt_code.history.save();
};