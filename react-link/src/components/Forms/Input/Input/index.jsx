/*
 * ComponentName: 输入框
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { Input } from 'antd'

export default function ZLInput(props) {
    return (
        <div className='input'>
            <Input
                {...props}
            />
        </div>
    )
}
