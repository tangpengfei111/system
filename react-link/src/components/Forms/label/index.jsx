/*
 * ComponentName: 信息展示
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */

export default function Lable(props) {
    let { value } = props
    return (
        <div className='label' {...props}>
            {value}
        </div>
    )
}
