/**
 * �ļ������Ż�
 */
var file_project = {
    /**
     * �ļ���
     */
    lines: [],

    /**
     * ����
     */
    variable: {
        Name: false,
        Time: false,
        Size:false,
    },

    /**
     * �����ļ��еĺ���
     */
    box:lt_code.getAll(".showBox"),

    /**
     * ��ť
     */
    buttons: {

        /**
         * �ļ�������ť
         */
        fileNameButton: lt_code.getAll5(".eachFile>div")[1],

        /**
         * �ļ�ʱ������ť
         */
        fileTimeButton: lt_code.getAll5(".eachFile>div")[2],

        /**
         * �ļ���С����ť
         */
        fileSizeButton:lt_code.getAll5(".eachFile>div")[3],
    },

    /**
     * �����
     * @param {HTMLDivElement} line �ļ���
     */
    pushLine:function(line) {
        this.lines.push(line);
    },

    /**
     * ����
     * @param {fileOrder} orderType ����ʽ
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
                console.error("�������������");
        }
    },

    /**
     * ���б�����
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
            console.error("�������ûд!");
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
 * �ļ�˳�� 
 */
const fileOrder = Object.freeze({
    /** ���ִ�С���� */
    nameUp: 0,
    /** ���ִӴ�С */
    nameDown: 1,
    /** ʱ��Ӿɵ��� */
    timeUp: 2,
    /** ʱ����µ��� */
    timeDown: 3,
    /** �����С���� */
    sizeUp: 4,
    /** ����Ӵ�С */
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
        // �������������ť����ʽ
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
        // �������������ť����ʽ
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
        // �������������ť����ʽ
        file_project.buttons.fileNameButton.classList.remove('up', 'down');
        file_project.buttons.fileTimeButton.classList.remove('up', 'down');
    };

    file_project.buttons.fileNameButton.style.cursor = "pointer";
    file_project.buttons.fileTimeButton.style.cursor = "pointer";
    file_project.buttons.fileSizeButton.style.cursor = "pointer";
}();