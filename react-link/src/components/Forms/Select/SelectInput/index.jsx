/*
 * ComponentName: 下拉配合输入框
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React from 'react'
import { Input as antdInput, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Input } from '../../Input'
import Style from './style.less'
const { Search } = antdInput
export default function SelectInput(props) {
    let { options = [], value = {}, placeholder, onChange } = props

    /**
     * FunctionName: 下拉选择
     * Author: 崔皓然
     * Description:
     */
    function onSelect(val) {
        value = typeof value == 'string' ? JSON.parse(value) : value
        typeof onChange == 'function' && onChange({ select: val, input: value.input })
    }

    /**
     * FunctionName: 输入框填写
     * Author: 崔皓然
     * Description:
     */
    function onInput(e) {
        value = typeof value == 'string' ? JSON.parse(value) : value
        typeof onChange == 'function' && onChange({ select: value.select, input: e.target.value })
    }

    value = typeof value == 'string' ? JSON.parse(value) : value
    // 没有默认值，下拉选择默认选中第一个
    if (!value || !value.select) {
        value.select = options[0] && options[0].value
    }
    // 展示 placeholder
    let [obj] = options.filter((item) => item.value == value.select)
    placeholder = placeholder || obj && obj.label || options[0] && options[0].label
    function search(){
        props.handles.handleSearch()
    }
    return (
        <div className={Style.selectinput} >
            <antdInput.Group compact style={{position: 'relative'}}>
                <Select
                    name="haha"
                    className='w100'
                    value={value.select}
                    onChange={onSelect}>
                    {
                        options && options.map((item, i) => <Select.Option key={i} value={item.value}>{item.label}</Select.Option>)
                    }
                </Select>
                <Input
                    style={{ width: 250 }}
                    value={value.input}
                    onChange={onInput}
                    // onInput={onInput}
                    className='advsearch h32'
                    placeholder={placeholder}
                />
               {/* props.serachicon是否输入框需要添加搜索框  */}
            {props.serachicon&&<SearchOutlined onClick={search} className='searchIcon11' style={{position: 'absolute', right: '-74%'}}/>}
            </antdInput.Group>
        </ div>
    )
}

