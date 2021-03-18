!function () {
    /**加载背景 */
    let back = document.createElement("div");
    back.id = "loadBack";
    back.style.width = "100vw";
    back.style.height = "100vh";
    back.style.position = "fixed";
    back.style.zIndex = "1000";
    back.style.left = 0;
    back.style.top = 0;
    back.style.backgroundColor = "#2f8cdc";

    let loadimg = document.createElement("img");
    loadimg.id = "loadImg";
    loadimg.style.width = "400px";
    loadimg.style.height = "300px";
    loadimg.style.position = "relative";
    loadimg.style.left = "calc((100vw - 400px)/2)";
    loadimg.style.top = "calc((100vh - 300px)/2)";
    loadimg.src = "../static/images/loading/loading1.gif";

    //内容添加到主页中
    lt_code.addChild(back, document.body);
    lt_code.addChild(loadimg, back);

    //关闭加载界面
    lt_code.closeLoading = function () {
        back.style.display = "none";
    };
}();