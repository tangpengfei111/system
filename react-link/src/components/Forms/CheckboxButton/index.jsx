/*
 * ComponentName: 多选
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React from 'react'
import { Button } from 'antd'
import Style from './style.less'

function CheckboxButton(props) {
    const { value, data = [] } = props
    /**
     * FunctionName: 遍历数据源
     * Author: 崔皓然
     * Description:
     */
    function checkShow(params) {
        return data.map((item, key) => {
            return <Button {...item}
                type={item.value == params.value ? 'primary' : ''}
                key={key}
                onClick={() => onClick({ value: item.value })}
            >{item.label}</Button>
        })
    }

    /**
     * FunctionName: 多选点击
     * Author: 崔皓然
     * Description:
     */
    function onClick(params) {
        let { onChange } = props
        typeof onChange == 'function' && onChange(params.value)
    }

    return (
        <div className={Style.checkboxBtn}>
            {checkShow({ value })}
        </div>
    )
}

export default CheckboxButton
