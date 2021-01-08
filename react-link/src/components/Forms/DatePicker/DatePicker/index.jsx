/*
 * ComponentName: 日期组件
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React, {} from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'

export default function ZLDatePicker(props) {
    let value = props.value&&moment(props.value)
    return (
        <>
            <DatePicker {...props} value={value}/>
        </>
    )
}
