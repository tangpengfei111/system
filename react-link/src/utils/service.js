import API from './api';
import CONFIG from './config';
import { getURLParams } from './common'
import request from './request';
import lodash from 'lodash';
import { showMsg } from './common'

function throwError(errorMessage) {
    throw new Error(errorMessage)
}

function getFullApiUrl(type) {
    if (!type) {
        throwError('缺少type参数');
    }
    let nattypeArr = API[type]
    nattypeArr[1] = lodash.trimStart(nattypeArr[1], '/');
    let url = CONFIG.ApiNatToHost(nattypeArr[0]) + nattypeArr[1];
    // console.warn(nattypeArr, "接口请求地址", url)
    return url
}

/**
 * 新增数据
 */
function add(type = null, { payload = {}, extra = {} }) {
    const url = getFullApiUrl(type)
    return request({ url, payload, type, extra }).then(result => {
        /**
         * showMsg 是否显示接口返回的 操作提示信息
         * 有些场景不需要直接显示, 可能需要在页面中处理其他逻辑, 那么指定showMsg为false即可
         */
        if (result.success == "1" && extra.showMsg !== false) {
            showMsg(extra.msg ? extra.msg : "操作成功")
        }
        return result
    })
}

/**
 * 删除数据 这边不用delete是因为 删除对象的key  系统有个默认的delete方法, 起一样的名字会冲突
 */
function del(type = null, { payload = {}, extra = {} }) {

    console.log('extra', extra)



    const url = getFullApiUrl(type)
    return request({ url, payload, type, extra }).then(result => {
        if (result.success == "1") {
            showMsg(extra.msg ? extra.msg : "操作成功")
        }
        return result
    })
}

/**
 * 修改数据
 */
function edit(type = null, { payload = {}, extra = {} }) {
    const url = getFullApiUrl(type)
    return request({ url, payload, type, extra }).then(result => {
        const { haveMsg = true } = extra;//兼容在部分情况自主提示（比如单个删除和批量删除--批量删除自主显示提示）
        if (result.success == "1" && haveMsg) {
            showMsg(extra.msg ? extra.msg : "操作成功")
        }
        return result
    })
}

/**
 * 使用场景：查询数据（多条）  如：列表页数据查询
 * ★★★ 请阅读以下说明项 ★★★：
 * 1、调用这个方法的时候默认会给接口传一个pageSize的参数，pageSize的参数默认在utils/config.js中设定；
 * 2、如果你不需要pageSize的参数，或者返回的数据结构是object的话，可能用detail方法去请求更加合理；
 * 3、如果就是用于查询数据列表，但是不想让url中的参数值传给接口，那么需要指定 extra:{urlparams: false}
 * 4、默认url中的参数值会覆盖payload中传给接口的参数值，如果不想这样的话，那么需要指定 extra:{cover: "url"} 来改变覆盖优先级；
 * 5、在调用此方法的时候，默认会把URL中的参数值一并传给接口；如果不想传，请参看第3点的处理方法；
 */
function select(type = null, { payload = {}, extra = {} }) {
    const url = getFullApiUrl(type)
    let queryString = {}
    //不需要传递URL参数值
    if (extra.urlparams !== false) {
        queryString = getURLParams(); //在控制台中直接输入 urlparams 回车，可以看到当前获取到的URL参数键值对
    }
    //强制修改为payload覆盖url参数值，也就是说：payload中的值优先级高于url中的参数值
    if (extra.cover == "url") {
        payload = {
            ...queryString,
            ...payload
        };
    } else {
        //默认模式：url的参数值覆盖payload中的值
        payload = {
            ...payload,
            ...queryString
        };
    }
    payload.pageNo = payload.pageNo ? payload.pageNo : CONFIG.PAGE_NO
    payload.size = payload.size ? payload.size : CONFIG.PAGE_SIZE
    return request({ url, payload, type, extra });
}

/**
 * 使用场景：获取数据详情  如：编辑页面根据ID获取数据详情
 */
function detail(type = null, { payload = {}, extra = {} }) {
    const url = getFullApiUrl(type)
    return request({ url, payload, type, extra }).then(response => {
        return response
    })
}

// 参数不是用解构
function inquiry(type = null, payload = {}, extra = {}) {
    const url = getFullApiUrl(type)
    return request({ url, payload, type, extra }).then(result => {
        return result
    })
}



//暴露方法，数据的CURD操作方法
export {
    getFullApiUrl,
    add,    //增    C
    del,    //删    D
    edit,   //改    U
    select, //查(多条)  R
    detail,  //查(一条)  R
    inquiry
}
