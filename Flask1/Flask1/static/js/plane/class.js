/**类型模块 */
myglobal.class = {};

/**基类 */
myglobal.class.base = myglobal;

/**道具效果 */
myglobal.class.tools = {
    /**基类 */
    base: myglobal.class,
    /**增加血量 */
    addHP: 0,
    /**增加护盾时间 */
    addEP: 1,
    /**添加武器 */
    addWP: 2,
    /**增加清屏弹 */
    addCL: 3,

}

/**子弹类型 */
myglobal.class.bullet = {
    /**基类 */
    base: myglobal.class,
    /**无飞弹 */
    noBullet: 0,
    /**慢速飞弹 */
    slow: 1,
    /**直线飞弹 */
    line:2,
    /**圆形散开飞弹 */
    group: 3,
    /**追踪飞弹 */
    follow: 4,

    /**清屏弹 */
    clearAll:10,
}

/**玩家 */
myglobal.class.player = class {
    /**
     * 构造函数
     * @param {any} x 
     * @param {any} y
     * @param {any} w
     * @param {any} h
     * @param {any} l 生命值
     * @param {any} s 护盾时间
     * @param {any} bullet 子弹类型
     * @param {string|HTMLImageElement} img 图片路径(base64编码)
     * @param {number} [value] 子弹伤害
     */
    constructor(x, y, w, h,l,s,bullet,img,value) {
        /**x轴坐标 */
        this.x = x;
        /**y轴坐标 */
        this.y = y;
        /**宽度 */
        this.w = w;
        /**高度 */
        this.h = h;
        /**生命值 */
        this.l = l;
        /**护盾持续时间 */
        this.s = s;
        /**子弹类型 */
        this.bullet = bullet;
        /**每次移动能移动多少距离 */
        this.mv = 3;
        /**子弹伤害 */
        this.value = value?value:35;
        /**飞机的样式 */
        this.img = typeof (img) == "string" ? lt_code.newDom("img", { src: img }) : img;
        /**玩家碰撞点 */
        //this.points = {
        //    leftTop: [this.x - w / 2, this.y - h / 2],
        //    rightTop: [this.x + w / 2, this.y - h / 2],
        //    leftBottom: [this.x - w / 2, this.y + h / 2],
        //    rightBottom: [this.x + w / 2, this.y + h / 2],
        //};
        /**游戏运行时间(帧数) */
        this.j = 0;
        /**开火间隔(帧数) */
        this.c = 10;
        /**开火次数 */
        this.f = 0;
        /**距离上次开火时间(帧数) */
        this.lf = this.c;

        //碰撞还是用圆来检测吧
        /**碰撞半径 */
        this.r = lt_code.getNum(Math.sqrt(this.w * this.w + this.h * this.h) / 3);
        /**是否是敌人的子弹 */
        this.isFoe = false;
    }

    /**
     * 清空飞机
     * @param {CanvasRenderingContext2D} ctx
     */
    clear(ctx) {
        ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    /**
     * 绘制飞机
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        //this.clear(ctx);
        myglobal.image.drawPlane2(ctx, this.x, this.y, this.w, this.h, this.img);
    }

    /**
     * 绘制血量
     * @param {CanvasRenderingContext2D} ctx
     */
    drawHP(ctx) {
        /**画布高度 */
        var height = ctx.canvas.height;
        /**画布宽度 */
        var width = ctx.canvas.width;
        /**血量颜色 */
        //var color = this.l < myglobal.MAXHP*0.3 ? "red" : this.l < myglobal.MAXHP*0.6 ? "yellow" : "green";
        var color = "rgba(" + lt_code.getNum((1 - (this.l / myglobal.MAXHP)) * 255) + "," + lt_code.getNum((this.l / myglobal.MAXHP) * 255) + ",0,0.3)";
        /**血量宽度 */
        var HPwidth = lt_code.getNum(this.l / myglobal.MAXHP * width);

        //删去原先血量内容
        ctx.clearRect(0, height - 8, width, 8);

        //开始绘制血量
        ctx.beginPath();
        ctx.moveTo(0, height - 4);
        ctx.lineTo(HPwidth, height - 4);
        ctx.lineWidth = 8;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * 绘制护盾能量
     * @param {CanvasRenderingContext2D} ctx
     */
    drawEP(ctx) {
        /**画布高度 */
        var height = ctx.canvas.height;
        /**画布宽度 */
        var width = ctx.canvas.width;
        /**护盾颜色 */
        var color = "rgba(0,0,255,0.5)"; 
        /**护盾宽度 */
        var EPwidth = lt_code.getNum(this.s / myglobal.MAXEP * width);

        //删去原先护盾内容
        ctx.clearRect(0, height - 4, width, 4);

        //开始绘制
        ctx.beginPath();
        ctx.moveTo(0, height - 2);
        ctx.lineTo(EPwidth, height - 2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * 被破坏
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} blockImg 图片路径(base64编码)
     */
    block(ctx,blockImg) {
        var base = this;
        base.clear(ctx);
        var img = new Image(w, h);
        img.src = blockImg;
        lt_code.addChild(img, myglobal.image.displayBox);
        this.clear(ctx);
        setTimeout(function () {
            base.clear(ctx);
        }, 100);
    }

    /**
     * 玩家血量增加
     * @param {myglobal.class.item} item
     */
    addHP(item) {
        if (item.tools == myglobal.class.tools.addHP) {
            this.l = this.l + item.value > myglobal.MAXHP ? myglobal.MAXHP : this.l + item.value;
        }
    }

    /**
     * 玩家护盾时间增加
     * @param {myglobal.class.item} item
     */
    addEP(item) {
        if (item.tools==myglobal.class.tools.addEP) {
            this.s = this.s + item.value > myglobal.MAXEP ? myglobal.MAXEP : this.s + item.value;
        }
    }

    /**
     * 刷新
     * @param {CanvasRenderingContext2D} ctx
     */
    update(ctx) {
        this.draw(ctx);
        this.drawHP(ctx);
        if (this.s>0) {
            this.drawEP(ctx);
        }
    }

    /**
     * 监测玩家控制
     * @param {HTMLCanvasElement} cas
     * @param {Array} keys
     */
    checkKey(cas, keys) {
        //帧数增加
        this.j++;
        this.lf++;
        //护盾减少(根据刷新帧数减少护盾时间)
        this.s -= myglobal.refresh30;
        keys.forEach(function (e) {
            if (e) {
                //移动监测
                if (e == 38) {
                    this.y = this.y - this.mv < this.h / 2 ? this.h / 2 : this.y - this.mv;
                }
                if (e == 40) {
                    this.y = this.y + this.mv > cas.height - this.h / 2 ? cas.height - this.h / 2 : this.y + this.mv;
                }
                if (e == 37) {
                    this.x = this.x - this.mv < this.w / 2 ? this.w / 2 : this.x - this.mv;
                }
                if (e == 39) {
                    this.x = this.x + this.mv > cas.width - this.w / 2 ? cas.width - this.w / 2 : this.x + this.mv;
                }

                //攻击监测
                if (e==32&&this.lf>=this.c) {
                    this.shut();
                    this.lf = 0;
                    this.f++;
                }

                //道具使用监测

            }
        }.bind(this));
    }

    /**射击 */
    shut() {
        var newBullet = new myglobal.class.playerBullet(this.x, this.y-this.h/2, 4, 8, 0, -5, this.value, myglobal.image.image.bullet.playerBullet);
        myglobal.bullet.push(newBullet);
    }
}

/**敌人 */
myglobal.class.foe = class {
    /**
     * 构造函数
     * @param {any} x
     * @param {any} y
     * @param {any} w
     * @param {any} h
     * @param {any} l
     * @param {myglobal.class.bullet} bulletType
     * @param {number} [bv] 子弹伤害
     * @param {number} [v] 碰撞伤害
     * @param {number} [c] 开火间隔
     */
    constructor(x, y, w, h, l, bulletType,bv,v,c) {
        /**x轴坐标 */
        this.x = x;
        /**y轴坐标 */
        this.y = y;
        /**宽度 */
        this.w = w;
        /**高度 */
        this.h = h;
        /**生命值 */
        this.l = l;
        /**子弹类型 */
        this.bulletType = bulletType;
        /**子弹伤害 */
        this.bv = bv?bv:10;
        /**碰撞伤害 */
        this.v = v?v:20;
        /**飞机的样式 */
        //this.img = typeof (img) == "string" ? lt_code.newDom("img", { src: img }) : img;
        this.img = null;
        try {
            this.img = myglobal.image.image.foes[this.bulletType]
        } catch (e) {
            this.img = myglobal.image.image.foes[0];
            this.bulletType = myglobal.class.bullet.noBullet;
        }
        /**每次最大移动距离 */
        this.MAXMOVE = 3;
        /**x轴移动速度 */
        this.mx = bulletType==myglobal.class.bullet.noBullet?0:lt_code.variable.random(this.MAXMOVE,-this.MAXMOVE,true);
        /**y轴移动速度(不能向后飞) */
        this.my = lt_code.variable.random(this.MAXMOVE, 1, true);

        /**游戏运行时间(帧数) */
        this.j = 0;
        /**开火间隔(帧数) */
        this.c = c ? c : 20;
        //减少子弹发射
        if (this.bulletType==myglobal.class.bullet.slow) {
            this.c = this.c * 4;
        }

        //敌人分数
        this.p = bulletType == myglobal.class.bullet.noBullet ? 10 :
            myglobal.class.bullet.slow ? 20 :
                myglobal.bullet.line ? 40 :
                    myglobal.bullet.group ? 100 : 0;

        //碰撞还是用圆来检测吧
        /**碰撞半径 */
        this.r = lt_code.getNum(Math.sqrt(this.w * this.w + this.h * this.h) / 3);
    }

    /**
     * 清空飞机
     * @param {CanvasRenderingContext2D} ctx
     */
    clear(ctx) {
        ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    /**
     * 绘制飞机
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        //this.clear(ctx);
        myglobal.image.drawPlane3(ctx, this.x, this.y, this.w, this.h, this.img);
        this.drawHP(ctx);
    }

    /**
     * 绘制血量
     * @param {CanvasRenderingContext2D} ctx 画布
     */
    drawHP(ctx) {
        /**血量颜色 */
        //var color = this.l < myglobal.MAXHP*0.3 ? "red" : this.l < myglobal.MAXHP*0.6 ? "yellow" : "green";
        var color = "rgba(" + lt_code.getNum((1 - (this.l / myglobal.MAXHP)) * 255) + "," + lt_code.getNum((this.l / myglobal.MAXHP) * 255) + ",0,0.3)";
        /**血量宽度 */
        var HPwidth = lt_code.getNum(this.l / myglobal.MAXHP * this.w);
        HPwidth = HPwidth > 0 ? HPwidth : function () {
            this.block(ctx, myglobal.image.image.brock[0]);
            return 0;
        }.bind(this)();

        //画血槽框
        ctx.beginPath();
        ctx.moveTo(this.x - this.w / 2, this.y - this.h / 2 - 4);
        ctx.lineTo(this.x + this.w / 2, this.y - this.h / 2 - 4);
        ctx.lineTo(this.x + this.w / 2, this.y - this.h / 2);
        ctx.lineTo(this.x - this.w / 2, this.y - this.h / 2);
        ctx.closePath();
        ctx.strokeStyle = "#999";
        ctx.lineWidth = "0.5";
        ctx.stroke();

        //绘制血量
        ctx.beginPath();
        ctx.moveTo(this.x - this.w / 2, this.y - this.h / 2 - 4);
        ctx.lineTo(this.x - this.w / 2 + HPwidth, this.y - this.h / 2 - 4);
        ctx.lineTo(this.x - this.w / 2 + HPwidth, this.y - this.h / 2);
        ctx.lineTo(this.x - this.w / 2, this.y - this.h / 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    /**
     * 被破坏
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} blockImg 图片路径(base64编码)
     */
    block(ctx, blockImg) {
        var base = this;
        base.clear(ctx);
        var img = new Image(this.w, this.h);
        img.src = blockImg;
        //lt_code.addChild(img, myglobal.image.displayBox);
        ctx.drawImage(img, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
        myglobal.POINT += this.p;
        lt_code.getAll(".point", 0).innerText = "分数:" + myglobal.POINT;
        //this.clear(ctx);
        setTimeout(function () {
            base.delete();
        }, 100);
    }

    /**
     * 移动
     * @param {HTMLCanvasElement} cas canvas画布
     */
    move(cas) {
        this.x = this.x + this.mx < this.w / 2 ? function () {
            this.mx = -this.mx;
            return this.w / 2;
        }.bind(this)() : this.x + this.mx > cas.width - this.w / 2 ? function () {
            this.mx = -this.mx;
            return cas.width - this.w / 2;
        }.bind(this)() : this.x + this.mx;
        this.y = this.y + this.my < this.h / 2 ? function () {
            return this.h / 2;
        }.bind(this)() : this.y + this.my > cas.height + this.h / 2 ? function () {
            this.delete();
        }.bind(this)() : this.y + this.my;
    }

    /**删除本飞机 */
    delete() {
        try {
            myglobal.foes = myglobal.foes.delete(this);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 飞机大小
     * @param {myglobal.class.bullet} bullet 子弹类型
     * @param {number} [zoom] 放大倍数(默认1.0)
     */
    static size(bullet, zoom) {
        var ret = {
            x: 0,
            y:0,
        };
        zoom = zoom ? zoom : 1;

        //飞机大小型号
        switch (bullet) {
            case myglobal.class.bullet.noBullet:
                ret.x = 37; ret.y = 49;
                break;
            case myglobal.class.bullet.slow:
                ret.x = 69; ret.y = 50;
                break;
            case myglobal.class.bullet.line:
                ret.x = 79; ret.y = 100;
                break;
            case myglobal.class.bullet.group:
                ret.x = 100; ret.y = 100;
                break;
            default:
                console.error("使用了没有录入数据的飞机型号!!!");
        }

        ret = {
            x: Math.abs(ret.x * zoom),
            y: Math.abs(ret.y * zoom),
        };

        return ret;
    }

    /**发射子弹 */
    fire() {
        this.j++;
        if (this.bulletType && this.j % this.c == 0) {
            var newBullet = new myglobal.class.foeBullet(this.x, this.y + this.h / 2, 4, 8, 0, 5,this.bv, myglobal.image.image.bullet.foeBullet,this.bulletType);
            myglobal.bullet.push(newBullet);
        }
    }

    /**
     * 碰撞
     * @param {myglobal.class.player} player
     */
    touch(player) {
        var x = Math.abs(this.x - player.x);
        var y = Math.abs(this.y - player.y);
        var distance = Math.sqrt(x * x + y * y);
        if (distance<this.r+player.r) {
            if (player.s>0) {
                this.l = 0;
            } else {
                player.l -= this.v;
                player.s = myglobal.refresh30*10;
                this.l = 0;
            }
        }
    }
}

/**道具 */
myglobal.class.item = class {
    /**
     * 构造函数
     * @param {any} x
     * @param {any} y
     * @param {any} w
     * @param {any} h
     * @param {any} img
     */
    constructor(x, y, w, h,tools,value, img) {
        /**x轴坐标 */
        this.x = x;
        /**y轴坐标 */
        this.y = y;
        /**宽度 */
        this.w = w;
        /**高度 */
        this.h = h;
        /**效果 */
        this.tools = tools;
        /**增加的值 */
        this.value = Math.abs(value);
        /**道具的样式 */
        this.img = img;
    }
    
    /**
     * 清空道具
     * @param {CanvasRenderingContext2D} ctx
     */
    clear(ctx) {
        ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    /**
     * 绘制道具
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        //不一定要现在删除,直接游戏运行的刷新的时候全部清理
        //this.clear(ctx);
        myglobal.image.drawPlane3(ctx, this.x, this.y, this.w, this.h, this.img);
    }

    /**
     * 被玩家获取
     * @param {myglobal.class.player} player
     */
    onplay(player) {
        
    }
}

/**玩家子弹 */
myglobal.class.playerBullet = class {
    /**
     * 构造函数
     * @param {any} x
     * @param {any} y
     * @param {any} w
     * @param {any} h
     * @param {any} s
     * @param {any} value
     * @param {string|HTMLImageElement} img
     */
    constructor(x, y, w, h, sl,st, value, img) {
        /**位置:x */
        this.x = x;
        /**位置:y */
        this.y = y;
        /**宽度 */
        this.w = w;
        /**高度 */
        this.h = h;
        /**速度:横向 */
        this.sl = sl;
        /**速度:纵向 */
        this.st = st;
        /**伤害值 */
        this.value = value;
        /**图片 */
        this.img = typeof (img) == "string" ? lt_code.newDom("img", { src: img }) : img;
    }

    /**
     * 清除
     * @param {CanvasRenderingContext2D} ctx
     */
    clear(ctx) {
        ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    /**
     * 绘制子弹
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    /**子弹移动
     * @param {HTMLCanvasElement} cas
     * */
    move(cas) {
        this.x = this.x + this.sl;
        this.y = this.y + this.st;
        //超出屏幕的子弹就直接消失
        if (this.x<0||this.x>cas.width||this.y<0||this.y>cas.height) {
            //console.log(this);
            this.delete();
        }
    }

    /**删除本子弹 */
    delete() {
        try {
            myglobal.bullet = myglobal.bullet.delete(this);
        } catch (e) {
            console.log(e);
        }
    }
    
    /**
     * 碰撞到玩家
     * @param {myglobal.class.foe[]} foes
     */
    touch(foes) {
        foes.forEach(function (e) {
            var x = Math.abs(this.x - e.x);
            var y = Math.abs(this.y - e.y);
            var distance = Math.sqrt(x * x + y * y);
            //console.log(0);
            if (distance < e.r) {
                e.l = e.l - this.value;
                //player.s = myglobal.refresh30;
                //console.log(1);
                this.delete();
            }
        }.bind(this));
    }
}

/**敌人子弹 */
myglobal.class.foeBullet = class {
    /**
     * 构造函数
     * @param {any} x
     * @param {any} y
     * @param {any} w
     * @param {any} h
     * @param {any} s
     * @param {number} value
     * @param {string|HTMLImageElement} img
     * @param {myglobal.class.bullet} bulletType
     */
    constructor(x, y, w, h, sl,st, value, img,bulletType) {
        /**位置:x */
        this.x = x;
        /**位置:y */
        this.y = y;
        /**宽度 */
        this.w = w;
        /**高度 */
        this.h = h;
        /**伤害值 */
        this.value = value;
        /**图片 */
        this.img = typeof (img) == "string" ? lt_code.newDom("img", { src: img }) : img;
        /**子弹类型 */
        this.bulletType = bulletType;
        /**速度:横向 */
        this.sl = sl;
        /**速度:纵向 */
        this.st = st;
        //慢速子弹
        if (bulletType===myglobal.class.bullet.slow) {
            /**速度:横向 */
            this.sl = sl / 2;
            /**速度:纵向 */
            this.st = st / 2;
            //console.log(1);
        } 
        /**是否是敌人的子弹 */
        this.isFoe = true;
    }

    /**
     * 清除
     * @param {CanvasRenderingContext2D} ctx
     */
    clear(ctx) {
        ctx.clearRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    /**
     * 绘制子弹
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    /**子弹移动
     * @param {HTMLCanvasElement} cas
     * */
    move(cas) {
        ////如果是慢速子弹
        //if (this.bulletType == myglobal.class.bullet.slow) {
        //    this.x = this.x + this.sl/10;
        //    this.y = this.y + this.st/10;
        //} else {
        //    this.x = this.x + this.sl;
        //    this.y = this.y + this.st;
        //} 

        this.x = this.x + this.sl;
        this.y = this.y + this.st;
        //超出屏幕的子弹就直接消失
        if (this.x<0||this.x>cas.width||this.y<0||this.y>cas.height-10) {
            //console.log(this);
            this.delete();
        }
    }

    /**删除本子弹 */
    delete() {
        try {
            myglobal.bullet = myglobal.bullet.delete(this);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 碰撞到玩家
     * @param {myglobal.class.player} player
     */
    touch(player) {
        var x = Math.abs(this.x - player.x);
        var y = Math.abs(this.y - player.y);
        var distance = Math.sqrt(x * x + y * y);
        //console.log(0);
        if (distance<player.r&&player.s<=0) {
            player.l = player.l - this.value;
            player.s = myglobal.refresh30;
            //console.log(1);
            this.delete();
        }
    }
}

/**按钮类(废弃) */
myglobal.class.bottomCanvas = class {
    /**
     * 构造函数
     * @param {any} x 中心点x轴
     * @param {any} y 中心点y轴
     * @param {any} w 宽度
     * @param {any} h 高度
     * @param {any} text 文字内容
     * @param {any} [font] 字体大小
     * @param {any} [color] 按钮颜色
     * @param {any} [borderColor] 边框颜色
     */
    constructor(x, y, w, h,text,font,color,borderColor) {
        /**中心点x轴 */
        this.x = x;
        /**中心点y轴 */
        this.y = y;
        /**按钮宽度 */
        this.w = w<6?6:w;
        /**按钮高度 */
        this.h = h<6?6:h;
        /**按钮内容 */
        this.text = text;
        /**字体大小 */
        this.font = font ? font + " Verdana" : "16px Verdana";
        /**按钮颜色 */
        this.color = color ? color : "#ccc";
        /**按钮边框颜色 */
        this.borderColor = borderColor ? borderColor : "#999";
        /**按钮转角弧度 */
        this.borderRadius = 3;

    }

    /**
     * 绘制按钮
     * @param {CanvasRenderingContext2D} ctx 画布
     */
    draw(ctx) {
        //开始绘画
        ctx.beginPath();

        //从左上角开始绘制弧线
        ctx.moveTo(this.x - this.w / 2, this.y - this.h / 2 + this.borderRadius);
        ctx.arc((this.x - this.w / 2) + this.borderRadius,
            (this.y - this.h / 2) + this.borderRadius,
            this.borderRadius, Math.PI, 1.5 * Math.PI);
        ctx.lineTo(this.x + this.w / 2 - this.borderRadius, this.y - this.h / 2);
        ctx.arc((this.x + this.w / 2) - this.borderRadius,
            this.y - this.h / 2 + this.borderRadius,
            this.borderRadius, 1.5 * Math.PI, 2 * Math.PI);
        ctx.lineTo(this.x + this.w / 2, this.y + this.h / 2 - this.borderRadius);
        ctx.arc((this.x + this.w / 2) - this.borderRadius,
            this.y + this.h / 2 - this.borderRadius,
            this.borderRadius, 0, 0.5 * Math.PI);
        ctx.lineTo(this.x - this.w / 2 + this.borderRadius, this.y + this.h / 2);
        ctx.arc((this.x - this.w / 2) + this.borderRadius,
            this.y + this.h / 2 - this.borderRadius,
            this.borderRadius, 0.5 * Math.PI, Math.PI);
        ctx.lineTo(this.x - this.w / 2, this.y - this.h / 2 + this.borderRadius);

        ctx.strokeStyle = this.borderColor;
        ctx.fillStyle = this.color;

        ctx.fill();
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y + lt_code.getNum(this.font) / 3, this.w);
        ctx.closePath();
    }
}

/**
 * 按钮
 * @param {number} x 中心x
 * @param {number} y 中心y
 * @param {number} w 宽度
 * @param {number} h 高度
 * @param {string} t 内容
 * @param {Function} [fuc] 按钮事件
 * @param {string} [f] 字体大小
 * @param {string} [c] 按钮颜色
 * @param {string} [bc] 边框颜色
 * @param {string} [br] 转角半径
 */
myglobal.class.bottom = function (x, y, w, h, t, fuc,f, c, bc, br) {
    f = f ? f : "16px";
    c = c ? c : "#ccc";
    bc = bc ? bc : "#999";
    br = br ? br : "5px";
    var ret = lt_code.newDom("div", {
        x: x,
        y: y,
        w: w,
        h: h,
        t: t,
        f: f,
        c: c,
        bc: bc,
        br: br,
        class: "bottom",
        title:t,
        style: {
            left: x - w / 2 + "px",
            top: y - h / 2 + "px",
            position: "absolute",
            width: w + "px",
            height: h + "px",
            cursor: "pointer",
            "text-align": "center",
            "line-height": h + "px",
            "font-size": f,
            "border-radius": br,
            "background-color": c,
            border: "1px solid "+bc,
        },
    });
    ret.innerText = t;
    ret.onmousedown = fuc;
    /**移除按钮 */
    ret.display = function () {
        lt_code.getDomFather(ret).removeChild(ret);
    }

    lt_code.addChild(ret, myglobal.box);

    return ret;
}

//游戏类文件加载完成以后才加载游戏逻辑文件
myglobal.addJs(myglobal.currentDir + "game.js");