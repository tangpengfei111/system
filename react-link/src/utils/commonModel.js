/*
 * ModelName: 公用的modal存取值
 * Branch: 0
 * Autor: 唐鹏飞
 * Description:
 */
export const model = {
  reducers: {
    save(state, action) {
      Object.keys(action.payload).map(item => state[item] = action.payload[item])
      return {...state}
    }
  }
}
