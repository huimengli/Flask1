!function () {
    /**���ر��� */
    let back = lt_code.newDom("div", {
        id: "loadBack",
        style: {
            width: "100vw",
            height: "100vh",
            position: "fixed",
            "z-index": "1000",
            left: "0",
            top: "0",
            "background-color": "#2f8cdc",

        }
    });

    let loadimg = lt_code.newDom("img", {
        id: "loadImg",
        style: {
            width: "400px",
            height: "300px",
            position: "relative",
            left: "calc((100vw - 400px)/2)",
            top: "calc((100vh - 300px)/2)",

        },
        src: "../static/images/loading/loading1.gif",
    });



    //������ӵ���ҳ��
    lt_code.addChild(back, document.body);
    lt_code.addChild(loadimg, back);

    //�رռ��ؽ���
    lt_code.closeLoading = function () {
        back.style.display = "none";
    };
}();