/*
 * PageName: 气泡确认框
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React from 'react'
import { Popconfirm } from 'antd'

function ZLPopconfirm(props) {
    return (
        <div>
            <Popconfirm {...props} >
                {props.children}
            </Popconfirm>
        </div>
    )
}

export default ZLPopconfirm
