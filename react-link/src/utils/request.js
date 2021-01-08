import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { showMsg } from './common';

/**
 * 清除左右空格, 并且删除_t跟ref的URL参数
 * @param {*} paramsObject
 */
function trimValue(paramsObject = {}) {
    let payload = JSON.parse(JSON.stringify(paramsObject))
    delete payload._t
    delete payload._ref
    delete payload.branchcodeobj
    delete payload.commoditytypeobj
    delete payload.rangeTimeQuick
    delete payload.rangeTimeQuick2
    delete payload.mixed
    delete payload.packMixed
    for (let key in payload) {
        if (payload[key] == undefined || typeof payload[key] != "string") {
            if (typeof payload[key] === 'object') {
                payload[key] = JSON.stringify(payload[key])
            }
            continue
        }
        payload[key] = payload[key].trim()
    }

    return payload
}

//axios默认的异步方法
function request({ url, payload = {}, extra = {} }) {
    var instance = axios.create({})
    let method = extra.method ? extra.method : 'post'
    if (!extra.noProgress) {
        NProgress.configure({
            showSpinner: false
        })
        NProgress.start();
    }

    payload = trimValue(payload)
  
    if (method.toLowerCase() == "get") {
        const params = qs.stringify(payload)
        //只有GET请求才需要payload
        return instance.get(`${url}?${params}`).then(response => {

            const { data = {} } = response

            if (!extra.noProgress) {
                NProgress.done();
            }
            if (data.code == 0 && data.message == '操作成功') {
                return data
            } else {
                showMsg(data.message, "error")
            }

        }).catch(error => {
            console.log('error:', error)
        })

    }
    if (method.toLowerCase() == "post") {
        return instance.post(url, payload).then(response => {

            const { data = {} } = response

            if (!extra.noProgress) {
                NProgress.done();
            }
            if (data.code == 0 && data.message == '操作成功') {
                return data
            } else {
                showMsg(data.message, "error")
            }

        }).catch(error => {
            console.log('error:', error)
        })
    }
}


export default request
