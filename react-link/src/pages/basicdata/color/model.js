/*
 * ModelName: 色号管理-公共模块
 * Branch: 0
 * Autor: 唐鹏飞
 * Describeription:
 */
import { select, edit, detail } from '@/utils/service'
import modelExtend from 'dva-model-extend'
import { model } from '@/utils/commonModel'
export default modelExtend(model, {
    namespace: 'color',
    state: {
        // 查询列表
        list: [],
        pagination: {},

        // 详情信息
        analysisInfo: {},
        parentInfo: {}
    },
    effects: {
        /**
         * FunctionName: 查询列表
         * Author: 唐鹏飞
         * Description:
         */
        *select({ type, payload = {}, ...extra }, { call, put }) {
            let result = yield call(select, type, { payload, extra })
            // console.log('result', result)
            const { data = {} } = result
            yield put({
                type: 'save',
                payload: {
                    list: data.rows || [],
                    pagination: {
                        pageSize: ~~data.pageSize,
                        current: ~~data.currentPage,
                        total: ~~data.total
                    }
                }
            })
            return { data }
        },
        /**
        * FunctionName: 添加色号
        * Author: 唐鹏飞
        * Description:
        */
        *add({ type, payload = {}, ...extra }, { call }) {
            let result = yield call(detail, type, { payload, extra })
            return result
        },
        /**
        * FunctionName: 修改色号
        * Author: 唐鹏飞
        * Description:
        */
        *modify({ type, payload = {}, ...extra }, { call }) {
            let result = yield call(detail, type, { payload, extra })
            return result
        },
        /**
        * FunctionName: 删除色号
        * Author: 唐鹏飞
        * Description:
        */
        *remove({ type, payload = {}, ...extra }, { call }) {
            let result = yield call(detail, type, { payload, extra })
            return result
        }
    }
})