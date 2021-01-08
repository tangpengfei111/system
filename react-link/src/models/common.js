/**
 * models目录下的所有js，都属于全局model；
 * 另外还有页面级的model，页面级的model彼此隔离；
 * 更多资料请参看：https://umijs.org/zh/guide/with-dva.html#model-%E6%B3%A8%E5%86%8C
 */
import { detail } from '@/utils/service'
import { history } from 'umi'
import { setCache, clearCache, getCache, showMsg } from '@/utils/common'

export default {
    namespace: 'common',
    state: {
        currentUser: {}, // 当前用户
    },
    reducers: {
        save(state, action) {
            Object.keys(action.payload).forEach(item => {
                state[item] = action.payload[item]
            })
            return state
        },
        updateState(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    },
    effects: {

        /**
         * FunctionName: 用户登录
         * Author: 唐鹏飞
         * Description:
         */
        *login({ type, payload = {}, ...extra }, { call, put }) {
            const result = yield call(detail, type, { payload, extra })
            const { login, user = {} } =  result?.data

            yield put({
                type: "save",
                payload: {
                    currentUser: user.role
                }
            });
            
            showMsg('登陆成功', 'success')
            setCache('authority', user.role)
            setCache('userInfo', JSON.stringify(user))
            history.push('/basicdata/color')
        },
        /**
         * FunctionName: 用户退出
         * Author: 唐鹏飞
         * Description:
         */
        *logout({ type, payload = {}, method = 'post', must = [], ...extra }, { call }) {
            // const result = yield call(detail, type, { payload, method, must, extra })
            const userInfo = getCache('userInfo') || ''
            clearCache()
            setCache('userInfo', userInfo)
            history.push('/login')
        },
    }
}
