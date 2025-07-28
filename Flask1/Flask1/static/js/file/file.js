/**
 * 文件界面优化
 */
var file_project = {
    /**
     * 文件行
     */
    lines: [],

    /**
     * 变量
     */
    variable: {
        Name: false,
        Time: false,
        Size:false,
    },

    /**
     * 放置文件行的盒子
     */
    box:lt_code.getAll(".showBox"),

    /**
     * 按钮
     */
    buttons: {

        /**
         * 文件名排序按钮
         */
        fileNameButton: lt_code.getAll5(".eachFile>div")[1],

        /**
         * 文件时间排序按钮
         */
        fileTimeButton: lt_code.getAll5(".eachFile>div")[2],

        /**
         * 文件大小排序按钮
         */
        fileSizeButton:lt_code.getAll5(".eachFile>div")[3],
    },

    /**
     * 添加行
     * @param {HTMLDivElement} line 文件行
     */
    pushLine:function(line) {
        this.lines.push(line);
    },

    /**
     * 排序
     * @param {fileOrder} orderType 排序方式
     */
    Order: function (orderType) {
        switch (orderType) {
            case fileOrder.nameUp:
                this.NameUp();
                break;
            case fileOrder.nameDown:
                this.NameDown();
                break;
            case fileOrder.timeUp:
                this.TimeUp();
                break;
            case fileOrder.timeDown:
                this.TimeDown();
                break;
            case fileOrder.sizeUp:
                this.SizeUp();
                break;
            case fileOrder.sizeDown:
                this.SizeDown();
                break;
            default:
                console.error("错误的排序类型");
        }
    },

    /**
     * 对列表排序
     * @param {any[]} list
     * @param {boolean} isMinToMax
     */
    ListOrder: function (list,isMinToMax=true) {
        var temp = list.concat();
        var ret = [];

        if (typeof(list[0])=="number") {
            return list.order(isMinToMax);
        } else if (typeof(list[0])=="string") {
            for (var i = 0; i < list.length; i++) {
                list[i] = list[i].charCodeAt(0)*10000+i;
            }
            var list2 = list.order(isMinToMax);
            for (var i = 0; i < list2.length; i++) {
                ret.push(temp[list.indexOf(list2[i])]);
            }
        } else if (list[0] instanceof Date) {
            console.error("这个方法没写!");
        }

        return ret;
    },

    NameUp: function () {
        var names = [];
        var fileName = [];
        var dirName = [];
        this.lines.forEach(e => {
            lt_code.removeChild(e, this.box);
            if (e.dataset.isfile=="false") {
                dirName.push(e.dataset.filename);
            } else {
                fileName.push(e.dataset.filename);
            }
            names.push(e.dataset.filename);
        });
        fileName = this.ListOrder(fileName);
        dirName = this.ListOrder(dirName);
        this.lines.forEach(e => {
            dirName.forEach(d => {
                lt_code.addChild(this.lines[names.indexOf(d)],this.box);
            });
            fileName.forEach(f => {
                lt_code.addChild(this.lines[names.indexOf(f)],this.box);
            });
        })
    },

    NameDown: function () {
        var names = [];
        var fileName = [];
        var dirName = [];
        this.lines.forEach(e => {
            lt_code.removeChild(e, this.box);
            if (e.dataset.isfile=="false") {
                dirName.push(e.dataset.filename);
            } else {
                fileName.push(e.dataset.filename);
            }
            names.push(e.dataset.filename);
        });
        fileName = this.ListOrder(fileName,false);
        dirName = this.ListOrder(dirName,false);
        this.lines.forEach(e => {
            dirName.forEach(d => {
                lt_code.addChild(this.lines[names.indexOf(d)], this.box);
            });
            fileName.forEach(f => {
                lt_code.addChild(this.lines[names.indexOf(f)], this.box);
            });
        });
    },

    SizeUp: function () {
        var sizes = [];
        var dirSize = [];
        var fileSize = [];
        this.lines.forEach((e,i) => {
            if (e.dataset.isfile == "false") {
                sizes.push(-1);
            } else {
                lt_code.removeChild(e, this.box);
                var size = lt_code.getAll2(".eachFileSize", e);
                fileSize.push(lt_code.getNum(size.innerHTML)*10000+i);
                sizes.push(lt_code.getNum(size.innerHTML)*10000+i);
            }
        });
        fileSize = this.ListOrder(fileSize);
        this.lines.forEach(e => {
            fileSize.forEach(f => {
                lt_code.addChild(this.lines[sizes.indexOf(f)],this.box);
            });
        });
    },

    SizeDown: function () {
        var sizes = [];
        var dirSize = [];
        var fileSize = [];
        this.lines.forEach((e,i) => {
            if (e.dataset.isfile == "false") {
                sizes.push(-1);
            } else {
                lt_code.removeChild(e, this.box);
                var size = lt_code.getAll2(".eachFileSize", e);
                fileSize.push(lt_code.getNum(size.innerHTML)*10000+i);
                sizes.push(lt_code.getNum(size.innerHTML)*10000+i);
            }
        });
        fileSize = this.ListOrder(fileSize,false);
        this.lines.forEach(e => {
            fileSize.forEach(f => {
                lt_code.addChild(this.lines[sizes.indexOf(f)],this.box);
            });
        });
    },

    TimeUp: function () {
        var times = [];
        var fileTimes = [];
        this.lines.forEach((e,i) => {
            if (e.dataset.isfile == "false") {
                times.push(0);
            } else {
                lt_code.removeChild(e, this.box);
                var time = lt_code.getAll2(".eachFileCreate", e);
                fileTimes.push(e.dataset.time + i);
                times.push(e.dataset.time + i);
            }
        });
        fileTimes = this.ListOrder(fileTimes);
        this.lines.forEach(e => {
            fileTimes.forEach(f => {
                lt_code.addChild(this.lines[times.indexOf(f)], this.box);
            });
        });
    },

    TimeDown: function () {
        var times = [];
        var fileTimes = [];
        this.lines.forEach((e,i) => {
            if (e.dataset.isfile == "false") {
                times.push(0);
            } else {
                lt_code.removeChild(e, this.box);
                var time = lt_code.getAll2(".eachFileCreate", e);
                fileTimes.push(e.dataset.time + i);
                times.push(e.dataset.time + i);
            }
        });
        fileTimes = this.ListOrder(fileTimes,false);
        this.lines.forEach(e => {
            fileTimes.forEach(f => {
                lt_code.addChild(this.lines[times.indexOf(f)], this.box);
            });
        });
    }
}

/**
 * 文件顺序 
 */
const fileOrder = Object.freeze({
    /** 名字从小到大 */
    nameUp: 0,
    /** 名字从大到小 */
    nameDown: 1,
    /** 时间从旧到新 */
    timeUp: 2,
    /** 时间从新到旧 */
    timeDown: 3,
    /** 体积从小到大 */
    sizeUp: 4,
    /** 体积从大到小 */
    sizeDown: 5,
});

!function () {
    file_project.buttons.fileNameButton.onmouseup = function () {
        file_project.variable.Name = !file_project.variable.Name;
        if (file_project.variable.Name) {
            file_project.Order(fileOrder.nameUp);
            this.classList.remove('down');
            this.classList.add('up');
        } else {
            file_project.Order(fileOrder.nameDown);
            this.classList.remove('up');
            this.classList.add('down');
        }
        // 清除其他两个按钮的样式
        file_project.buttons.fileTimeButton.classList.remove('up', 'down');
        file_project.buttons.fileSizeButton.classList.remove('up', 'down');
    };

    file_project.buttons.fileTimeButton.onmouseup = function () {
        file_project.variable.Time = !file_project.variable.Time;
        if (file_project.variable.Time) {
            file_project.Order(fileOrder.timeUp);
            this.classList.remove('down');
            this.classList.add('up');
        } else {
            file_project.Order(fileOrder.timeDown);
            this.classList.remove('up');
            this.classList.add('down');
        }
        // 清除其他两个按钮的样式
        file_project.buttons.fileNameButton.classList.remove('up', 'down');
        file_project.buttons.fileSizeButton.classList.remove('up', 'down');
    };

    file_project.buttons.fileSizeButton.onmouseup = function () {
        file_project.variable.Size = !file_project.variable.Size;
        if (file_project.variable.Size) {
            file_project.Order(fileOrder.sizeUp);
            this.classList.remove('down');
            this.classList.add('up');
        } else {
            file_project.Order(fileOrder.sizeDown);
            this.classList.remove('up');
            this.classList.add('down');
        }
        // 清除其他两个按钮的样式
        file_project.buttons.fileNameButton.classList.remove('up', 'down');
        file_project.buttons.fileTimeButton.classList.remove('up', 'down');
    };

    file_project.buttons.fileNameButton.style.cursor = "pointer";
    file_project.buttons.fileTimeButton.style.cursor = "pointer";
    file_project.buttons.fileSizeButton.style.cursor = "pointer";
}();