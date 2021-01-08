/*
 * ComponentName: 数字、价格 输入框
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { Input } from 'antd'

export default function ZLInputPassword(props) {
    return (
        <div>
            <Input.Password
                {...props}
            />
        </div>
    )
}
