
import { message } from 'antd';
import { ExclamationCircleOutlined, CloseCircleOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import lodash from 'lodash';
import { history } from 'umi';
import 'moment/locale/zh-cn';


/**
 * 解析URL参数
 * @param {*} uri
 */
export function parseUrl(uri = window.top.location.href) {
    const url = require('url');
    return url.parse(uri, true);
}

/**
 * 获取URL参数键值对
 * @param {} uri
 */
export function getURLParams(uri = window.top.location.href) {
    const url = require('url');
    const query = url.parse(uri, true).query;
    window.urlparams = query;
    return query;
}

/**
 * 显示提示信息
 * @param {*} param0
 */
export function showMsg(content, type = 'success', config = {}, cb = null) {
    // message.destroy();
    let _config = {
        content,
        duration: 3,
        ...config,
    };
    switch (type) {
        case 'warn':
            _config.icon = <ExclamationCircleOutlined style={{ color: '#FDA24B' }} />;
            break;
        case 'error':
            _config.icon = <CloseCircleOutlined style={{ color: '#FF4647' }} />;
            break;
        case 'success':
            _config.icon = <CheckCircleOutlined style={{ color: '#21BCAE' }} />;
            break;
        default:
            _config.icon = <InfoCircleOutlined style={{ color: '#4B97E6' }} />;
            break;
    }
    // message[type](content)
    if (cb) {
        message.open(_config).then(cb);
    } else {
        message.open(_config);
    }
}

/**
 * 用途描述: 重新刷新列表页表格中的数据, 必须是TableUrl组件才适用,
 * 使用场景如: 删除, 复制, 审核 之后的动作
 * @param {*} location 等价于 this.props.location
 */
export function flushTableDataByUrlQuery({
    location = {},
    dispatch = null,
    type = null,
    payload = {},
    isdispatch = false,
}) {
    let { query = {} } = location;
    if (Object.keys(location).length === 0 || !dispatch || !type) {
        throw new Error('缺少  location, dispatch, type参数');
    }
    if (window.$('#listPageTable').find('tbody:eq(0) tr').length <= 1) {
        let page = query.page || 0;
        let newPage = Number(page) - 1;
        query.page = newPage <= 0 ? 1 : newPage;
    }

    if (isdispatch) {
        dispatch({
            type,
            payload,
        });
        return;
    }

    let _t = Date.now().toString();
    history.push({
        query: {
            ...query,
            _t,
        },
        hash: window.location.hash,
    });
}

/**
 * 判断是否是object
 * @param (object) => any
 */
export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

/**
 * 判断按钮是否有操作权限
 * @param {*} url 按钮的超链接(完整链接)
 * @param {*} id (权限ID,有些按钮没有连接,那么就传入ID)
 * 注意: 有超链接的按钮, 必须传入超链接, 实在没连接的才传入ID,
 * 因为那么多的环境, 后端很容易把ID搞的不一样, 这样出了问题我们还得给他们找问题,
 * 到最后一看是因为ID不一样导致的, 防止自己被坑所以传入链接优先. 两个选择一个传入即可.
 */
export function hasButtonPermission({ url = null, id = null }) {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    let flag = false;
    let flatMenusList = window.flatMenusList || [];
    if (url) {
        if (lodash.find(flatMenusList, { isowned: '1', url: url })) {
            flag = true;
        }
    } else if (id) {
        if (lodash.find(flatMenusList, { isowned: '1', id: id + '' })) {
            flag = true;
        }
    }
    return flag;
}

/**
 * 松散判断两个值是否相同
 * @param (a, b) => (any, any)
 * @Return boolean
 */
export function looseEqual(a, b) {
    if (a === b) {
        return true;
    }
    const isObjectA = isObject(a);
    const isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
        try {
            const isArrayA = Array.isArray(a);
            const isArrayB = Array.isArray(b);
            if (isArrayA && isArrayB) {
                return (
                    a.length === b.length &&
                    a.every((e, i) => {
                        return looseEqual(e, b[i]);
                    })
                );
            } else if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime();
            } else if (!isArrayA && !isArrayB) {
                const keysA = Object.keys(a);
                const keysB = Object.keys(b);
                return (
                    keysA.length === keysB.length &&
                    keysA.every((key) => {
                        return looseEqual(a[key], b[key]);
                    })
                );
            } else {
                return false;
            }
        } catch (_e) {
            return false;
        }
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b);
    } else {
        return false;
    }
}


/**
 * FunctionName: 本地缓存-取值
 * Author: 唐鹏飞
 * Description:
 */
export function getCache(name) {
    return sessionStorage[name] && JSON.parse(sessionStorage[name]);
}

/**
 * FunctionName: 本地缓存-赋值
 * Author: 唐鹏飞
 * Description:
 */
export function setCache(name, value) {
    return sessionStorage.setItem(name, JSON.stringify(value));
}

/**
 * FunctionName: 本地缓存-清空
 * Author: 唐鹏飞
 * Description:
 */
export function clearCache() {
    localStorage.clear()
    sessionStorage.clear()
}

/**
 * FunctionName: 对象属性转换成字符串
 * Author: 唐鹏飞
 * Description: 将对象里面的子级对象转换成字符串，提供给url
 */
export const urlStringify = (query) => {
    for (const key in query) {
        if (typeof query[key] == 'object') {
            query[key] = JSON.stringify(query[key]);
        }
    }
    return query;
};

/**
 * FunctionName: 根据必填参数，拼接url
 * Author: 唐鹏飞
 * Description:
 */
export function getUrl(url, mustparams = []) {
    if (mustparams.length > 0) {
        mustparams.forEach((item) => {
            url = url + `/${item}`;
        });
    }
    return url;
}

/*
 * FunctionName: 计算
 * Author:
 * Description:
 */
export function Calc() {
    const precision = {
        1: '0.0',
        2: '0.00',
        3: '0.000',
        4: '0.0000',
        5: '0.00000',
        6: '0.000000',
    };

    function jia(a = 0, b = 0, prec = 2) {
        a = isNaN(Number(a)) ? 0 : Number(a);
        b = isNaN(Number(b)) ? 0 : Number(b);
        return numeral(a).add(b).format(precision[prec]);
    }

    function jian(a = 0, b = 0, prec = 2) {
        a = isNaN(Number(a)) ? 0 : Number(a);
        b = isNaN(Number(b)) ? 0 : Number(b);
        return numeral(a).subtract(b).format(precision[prec]);
    }

    function cheng(a = 0, b = 0, prec = 2) {
        a = isNaN(Number(a)) ? 0 : Number(a);
        b = isNaN(Number(b)) ? 0 : Number(b);
        return numeral(a).multiply(b).format(precision[prec]);
    }

    function chu(a = 0, b = 0, prec = 2) {
        a = isNaN(Number(a)) ? 0 : Number(a);
        b = isNaN(Number(b)) ? 0 : Number(b);
        return numeral(a).divide(b).format(precision[prec]);
    }

    function format(value = 0, prec = 2) {
        value = isNaN(Number(value)) ? 0 : Number(value);
        return numeral(value).format(precision[prec]);
    }
    return {
        jia,
        jian,
        cheng,
        chu,
        format,
    };
}