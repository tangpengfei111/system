/*
 * ModelName: 客户管理-公共数据
 * Branch: 0
 * Autor: 唐鹏飞
 * Description:
 */

import { select, edit, del, detail } from '@/utils/service'
import modelExtend from 'dva-model-extend'
import { model } from '@/utils/commonModel'

export default modelExtend(model, {
    namespace: 'material',
    state: {},
    reducers: {
        save(state, action) {
            Object.keys(action.payload).map(item => {
                state[item] = action.payload[item]
            })
            return state;
        }
    },
    effects: {
        /**
         * FunctionName: 列表查询
         * Author: 唐鹏飞
         * Description: 
         */
        *select({ type, payload = {}, ...extra }, { call, put }) {
            let result = yield call(select, type, { payload, extra })
            const { records = [], current, size, total } = result.data || {}
            return {
                list: records,
                pagination: {
                    current: +current,
                    pageSize: +size,
                    total: +total,
                }
            }
        },
        /**
         * FunctionName: 添加
         * Author: 唐鹏飞
         * Description: 
         */
        *add({ type, payload = {}, ...extra }, { call, put }) {
            return yield call(edit, type, { payload, extra })
        },
        /**
         * FunctionName: 修改
         * Author: 唐鹏飞
         * Description: 
         */
        *modify({ type, payload = {}, ...extra }, { call, put }) {
            return yield call(detail, type, { payload, extra })
        },
        /**
         * FunctionName: 删除
         * Author: 唐鹏飞
         * Description: 
         */
        *remove({ type, payload = {}, ...extra }, { call, put }) {
            return yield call(del, type, { payload, extra })
        },
    }
})
