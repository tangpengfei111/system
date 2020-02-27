var utils = {
    /**
     * 根据文本内容，获取文本长度
     * @param {*} text 文本内容
     * @param {*} font 字体大小及字体样式， 默认值 '16px SimHei'
     */
    getTextLength(text, font) {
        var span = document.createElement('span');
        span.style.font = font || '16px SimHei';
        span.style.visibility = 'hidden';
        span.innerText = text;
        span.className = 'getTextWidth';
        document.querySelector('body').appendChild(span);
        var textWidth = document.querySelector('.getTextWidth').offsetWidth;
        document.querySelector('.getTextWidth').remove();
        return textWidth;
    },
    /**
     * 获取当前时间信息，返回yyyy-MM-dd hh:mm:ss 格式
     */
    getNowTime() {
        var date = new Date();
        var y = date.getFullYear();
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        M = M < 10 ? '0' + M : M;
        d = d < 10 ? '0' + d : d;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return `${y}-${M}-${d} ${h}:${m}:${s}`;
    }
}

export default utils;