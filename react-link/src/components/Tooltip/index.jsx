/*
 * ComponentName: 过长文字省略号组件(鼠标停留悬浮)
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { Tooltip } from 'antd'
import Style from './style.less'
import Paragraph from '../Paragraph'

export default function ZLTooltip(props) {
    let {
        children, // 内容
        content = '', // 特殊内容，content有值就不会显示 children
        paragraph = {} // 省略...
    } = props
    return (
        <div className={Style.toolp}>
            <Tooltip
                title={content || children}
                {...props}
            >
                <Paragraph {...paragraph}>
                    {children}
                </Paragraph>
            </Tooltip>
        </div >
    )
}
