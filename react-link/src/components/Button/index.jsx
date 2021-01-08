/*
 * ComponentName: 按钮
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { Button } from 'antd'

export default (props) => {
    if (props.type === 'a') {// 特殊的列表 a标签 类型，其他属性参照 antd
        return (
            <a {...props}>{props.children}</a>
        )
    }
    return (
        <Button {...props}>{props.children}</Button>
    )
}
