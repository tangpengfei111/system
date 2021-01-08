/*
 * ComponentName: 下拉选择框
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { useEffect, useState } from 'react'
import { Select } from 'antd'
import styles from './selectStyle.less'
// import { select } from '@/utils/service'

export default function ZLSelect(props) {
    const {
        api,
        transform,
        fetchOptions,
    } = props
    const [opt, setOpt] = useState([])
    const options = props.options || opt

    useEffect(() => {
        if (typeof fetchOptions === 'function') {
            fetchOptions().then(data => {
                const list = data.list || []
                const arr = transform && transform.constructor.name === 'Object' ?
                    list.map(i => ({ label: i[transform.label], value: i[transform.value] })) :
                    list.map(i => ({ label: i.name, value: i.code }))
                setOpt(arr)
            })
        }
    }, [])

    return (
        <div >
            <Select
                allowClear
                optionFilterProp="children"
                {...props}
                className={props.name=='participants'&&props.disabled?styles.borderStyle:''}
            >
                {
                    options && options.map(option => <Select.Option key={option.value} disabled={option.disabled}>{option.label}</Select.Option>) || null
                }
            </Select>
        </div>
    )
}
