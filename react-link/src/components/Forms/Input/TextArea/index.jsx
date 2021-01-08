/*
 * ComponentName: 文本域
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React from 'react'
import { Input } from 'antd'
import Style from './style.less'

export default function TextArea(props) {
    let { showCount } = props
    return (
        <div className={showCount ? Style.textArea : ''}>
            <Input.TextArea {...props} />
        </div>
    )
}
