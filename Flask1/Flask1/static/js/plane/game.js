/**���� */
myglobal.games.base = myglobal;

/**�ؿ�ģ�� */
myglobal.games.rounds = {};

/**���еİ�ť */
myglobal.games.bottoms = [];

/**���˳��ֵļ��ʱ��:�� */
myglobal.games.INTERVEL = 2;

/**���������ֶ��ٵ��� */
myglobal.games.MAXFOE = 5;

/**��Ϸϵͳ���� */
myglobal.games.run = 0;

/**��Ϸˢ�¹��� */
myglobal.games.gameRun = 0;

/**����İ��� */
myglobal.games.keys = [];

/**ɾ�����еİ�ť */
myglobal.games.clearBottoms = function () {
    myglobal.games.bottoms.forEach(function (e) {
        e.display();
    });
    myglobal.games.bottoms = [];
};

/**
 * ��ʼ�ؿ�
 * @param {number} foes ��������
 * @param {Array} foeType ��������
 */
myglobal.games.startRound = function (foes,foeType) {
    /**�Ѿ����ֹ��ĵ��� */
    var i = 0;

    /**������� */
    myglobal.player = new myglobal.class.player(200, 700, 50, 60, myglobal.MAXHP, 1000, myglobal.class.bullet.line, myglobal.image.image.plane[0])

    /**
     * ���ذ�ť
     * (���������Ϸ����)
     */
    var returnBottom = myglobal.class.bottom(40, 40, 40, 40, "��", function () {
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
    var pointDiv = myglobal.class.bottom(330, 40, 100, 40, "����:" + myglobal.POINT, null, null, "transparent", "transparent");
    returnBottom.title = "���ز˵�";
    returnBottom.style.opacity = "0.4";
    returnBottom.onmousemove = function () {
        this.style.opacity = "1";
    };
    returnBottom.onmouseout = function () {
        this.style.opacity = "0.4";
    };
    pointDiv.className = "bottom point";

    //��ӷ��ذ�ť
    myglobal.games.bottoms.push(returnBottom);
    myglobal.games.bottoms.push(pointDiv);
    
    //��ʼ����
    myglobal.games.run = setInterval(function () {

        //���ӵ���
        if (i<foes&&myglobal.foes.length<myglobal.games.MAXFOE) {
            //myglobal.foes.push(new myglobal.class.foe())
            /**ȷ���ɻ����ӵ����� */
            var bullet = foeType[lt_code.variable.random(foeType.length,0,true)];
            /**ȷ���ɻ��Ĵ�С */
            var size = myglobal.class.foe.size(bullet);
            myglobal.foes.push(new myglobal.class.foe(
                lt_code.variable.random(myglobal.cas.width - 100, 100, true),
                0, size.x, size.y, myglobal.MAXHP, bullet
            ));

        }

        //������Ϸ
        if (i == foes&&myglobal.foes.length == 0) {
            alert("����!");

        }

    }, myglobal.games.INTERVEL * 1000);

    //��30֡������Ϸ
    myglobal.games.gameRun = setInterval(function () {

        //�����Ļ
        myglobal.clearCtx();

        //���˶���
        myglobal.foes.forEach(function (e) {
            e.move(myglobal.cas);
            e.draw(myglobal.ctx);
            e.fire();
            e.touch(myglobal.player);
        });

        //��һ���
        myglobal.player.update(myglobal.ctx);

        //��ҿ���
        myglobal.player.checkKey(myglobal.cas, myglobal.games.keys);

        //�ӵ��ƶ�
        myglobal.bullet.forEach(function (e) {
            e.move(myglobal.cas);
            e.draw(myglobal.ctx);
            if (e.isFoe) {
                e.touch(myglobal.player);
            } else {
                e.touch(myglobal.foes);
            }
        });

        //���������Ϸ����
        if (myglobal.player.l<0) {
            myglobal.games.rounds.over.start();
        }

    }, myglobal.refresh30);

    //��������
    window.onkeydown = function (e) {
        myglobal.games.keys = myglobal.games.keys.add(e.keyCode);
    };
    //�����ͷ�
    window.onkeyup = function (e) {
        myglobal.games.keys = myglobal.games.keys.ree(e.keyCode);
    }

}

/**���û�������� */
Array.prototype.add = function (e) {
    var ret = Array.prototype.slice.call(this);
    if (this.indexOf(e) == -1) {
        ret.push(e);
        return ret;
    } else {
        return this;
    }
};

/**�������ɾ�� */
Array.prototype.ree = function (e) {
    if (this.indexOf(e) >= 0) {
        return this.delete(e);
    } else {
        return this;
    }
};

/**���� */
myglobal.games.rounds.base = myglobal.games;

/**��Ϸ��ʼ���� */
myglobal.games.rounds.begin = {
    /**���� */
    base: myglobal.games.rounds,
    /**���� */
    start: function () {
        /**��ʼ��Ϸ��ť */
        var startBottom = myglobal.class.bottom(200, 400, 120, 40, "��ʼ��Ϸ",
            function () {
                myglobal.games.clearBottoms()
                myglobal.games.rounds.menu.start();
            });
        /**������Ϸ��ť */
        var exitBottom = myglobal.class.bottom(200, 460, 100, 40, "�˳���Ϸ",
            function () {
                lt_code.close();
            });
        /**��ν��ͼ�� */
        var icon = myglobal.class.bottom(200, 200, 300, 300, "�ɻ���ս", null, "40px", "white", "white", null);
        icon.style.cursor = "auto";
        /**��������Ϣ */
        var auther = myglobal.class.bottom(300, 760, 160, 40, "������:������", function () {
            window.location.href = "https://github.com/huimengli";
        }, null, "white", "white", null);
        auther.title = "��������Ϣ";
        //��ӽ���ť����,Ϊ�˷���ɾ��...
        myglobal.games.bottoms.push(startBottom);
        myglobal.games.bottoms.push(exitBottom);
        myglobal.games.bottoms.push(icon);
        myglobal.games.bottoms.push(auther);
    },
};

/**��Ϸ�˵����� */
myglobal.games.rounds.menu = {
    /**���� */
    base: myglobal.games.rounds,
    /**���ؿ����� */
    MAXROUND:28,
    /**���� */
    start: function () {
        /**���� */
        var base = this;
        /**���ذ�ť */
        var returnBottom = myglobal.class.bottom(40, 40, 40, 40, "��", function () {
            myglobal.games.clearBottoms();
            myglobal.games.rounds.begin.start();
        });
        returnBottom.title = "����������";

        //��ʼ���ݹؿ���ӹؿ���ť
        myglobal.games.rounds.rounds.forEach(function (e,i) {
            if (i<base.MAXROUND) {
                /**�ؿ���ť */
                var round = myglobal.class.bottom(90 * (i % 4) + 65, 40 + 100 + 90 * lt_code.getNum(i / 4), 80, 80, i.toString(), function () {
                    myglobal.games.clearBottoms();
                    e.start();
                });
                round.title = "�ؿ�:" + round.innerText;
                //��Ӱ�ť���밴ť����
                myglobal.games.bottoms.push(round);
            }
        })

        //��ӽ���ť����
        myglobal.games.bottoms.push(returnBottom);
    },
}

/**��Ϸ�������� */
myglobal.games.rounds.over = {
    /**���� */
    base: myglobal.games.rounds,

    /**�������� */
    start: function () {
        //��Ϸ����
        myglobal.games.clearBottoms();
        //myglobal.games.rounds.menu.start();
        clearInterval(myglobal.games.run);
        clearInterval(myglobal.games.gameRun);
        myglobal.foes = [];
        myglobal.player = null;
        myglobal.item = [];
        myglobal.bullet = [];
        myglobal.clearCtx();

        /**���¿�ʼ��Ϸ��ť */
        var startBottom = myglobal.class.bottom(200, 400, 120, 40, "�ص�������",
            function () {
                myglobal.games.clearBottoms()
                myglobal.games.rounds.begin.start();
            });
        /**������Ϸ��ť */
        //var exitBottom = myglobal.class.bottom(200, 460, 100, 40, "�˳���Ϸ",
        //    function () {
        //        lt_code.close();
        //    });
        /**��ν��ͼ�� */
        var icon = myglobal.class.bottom(200, 200, 300, 300, "��Ϸ����!\n��ķ���:"+myglobal.POINT, null, "40px", "white", "white", null);
        icon.style.cursor = "auto";
        /**��������Ϣ */
        var auther = myglobal.class.bottom(300, 760, 160, 40, "������:������", function () {
            window.location.href = "https://github.com/huimengli";
        }, null, "white", "white", null);
        auther.title = "��������Ϣ";
        //��ӽ���ť����,Ϊ�˷���ɾ��...
        myglobal.games.bottoms.push(startBottom);
        //myglobal.games.bottoms.push(exitBottom);
        myglobal.games.bottoms.push(icon);
        myglobal.games.bottoms.push(auther);
    }
}

/**�ؿ� */
myglobal.games.rounds.rounds = [];

/**�ؿ�1 */
myglobal.games.rounds.rounds[0] = {
    /**���� */
    base: myglobal.games.rounds,
    /**�������� */
    foes: 15,
    /**�������� */
    foeType: [myglobal.class.bullet.noBullet],
    /**��ʼ�ؿ� */
    start: function () {
        //this.base.base.base.clearGame();
        //this.base.base.base.clearCtx();
        myglobal.games.startRound(this.foes, this.foeType);
    },
}
/**�ؿ�1 */
myglobal.games.rounds.rounds[1] = {
    /**���� */
    base: myglobal.games.rounds,
    /**�������� */
    foes: 20,
    /**�������� */
    foeType: [myglobal.class.bullet.noBullet,myglobal.class.bullet.slow],
    /**��ʼ�ؿ� */
    start: function () {
        myglobal.games.startRound(this.foes, this.foeType);
    },
}
/**�ؿ�2 */
myglobal.games.rounds.rounds[2] = {
    /**���� */
    base: myglobal.games.rounds,
    /**�������� */
    foes: 20,
    /**�������� */
    foeType: [myglobal.class.bullet.slow,myglobal.class.bullet.line],
    /**��ʼ�ؿ� */
    start: function () {
        myglobal.games.startRound(this.foes, this.foeType);
    },
}
//myglobal.games.rounds.rounds[3] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[4] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[5] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[6] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[7] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[8] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[9] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[10] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[11] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[12] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[13] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[14] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[15] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[16] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[17] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[18] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[19] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[20] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[21] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[22] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[23] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[24] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[25] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[26] = { start: function () { alert("�ؿ���δ����!"); },};
//myglobal.games.rounds.rounds[27] = { start: function () { alert("�ؿ���δ����!"); },};



//�ѹ����ļ�������վ
myglobal.addJs(myglobal.currentDir+"program.js");