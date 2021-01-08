/*
 * PageName: 状态颜色显示
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { Badge } from 'antd'
import styles from './index.less'
import Tooltip from '../Tooltip'

export default (props) => {
    const { hint = false, hintMessage = '' } = props
    if (hint && hintMessage) {// 需要提示
        return (
            <Tooltip content={hintMessage} paragraph={{ ellipsis: { rows: 2 } }} >
                <Badge className={styles.badge} {...props}></Badge>
            </Tooltip>
        )
    }
    return (<Badge className={styles.badge} {...props}></Badge>)
}