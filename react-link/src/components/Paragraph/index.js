/*
 * PageName: 省略...
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React from 'react'
import { Typography } from 'antd'

const { Paragraph } = Typography

export default function ZLParagraph(props) {
    let { children } = props
    return (
        <div>
            <Paragraph ellipsis {...props}>{children}</Paragraph>
        </div>
    )
}
