/*
 * PageName: 联想下拉框
 * Branch: 0
 * Autor:
 * Description:
 */

import React, { useState, useEffect } from 'react'
import { Select, Spin } from 'antd'
import { debounce, isPlainObject, uniqBy } from 'lodash'
import PropTypes from 'prop-types'
const { Option } = Select
export default function SelectSearch(props) {
    const [value, setValue] = useState(props.defaultValue || [])
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])
    useEffect(() => {
        props.value && setValue(isPlainObject(props.value) || Object.prototype.toString.call(props.value) === '[object Array]' ? props.value : JSON.parse(props.value))
    }, [props.value])
    // let lastFetchId = 0
    /*
     * FunctionName: select选择
     * Author:
     * Description:
     */
    function handleChange(val) {
        setValue(val)
        if (!props.mode) {
            setOptions([])
        }
        setFetching(false)
        typeof props?.onChange === 'function' && props.onChange(val)
    }
    function fetchUser(val) {
        // lastFetchId += 1
        // const fetchId = this.lastFetchId
        setOptions([])
        setFetching(true)
        val && fetchData(val)
    }
    /*
     * FunctionName: 模糊查询
     * Author:
     * Description:
     */
    function fetchData(val) {
        // let promise = new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve([{ value: 1, label: '123' }, { value: 2, label: '321' }])
        //     }, 100)
        // })
        // promise.then((res) => {
        //     setOptions(format(res))
        //     typeof props?.onload === 'function' && props.onload(options)
        //     setFetching(false)
        // })
        // lastFetchId += 1
        // const fetchId = lastFetchId
        if (val && val.trim()) {
            typeof props?.searchurl === 'function' && props.searchurl(val.trim()).then(res => {
                // if (fetchId !== lastFetchId) {
                //     // for fetch callback order
                //     return
                // }
                setOptions(format(res))
                setFetching(false)
                typeof props?.onload === 'function' && props.onload(options)
            })
        } else {
            setOptions([])
        }
    }
    /*
     * FunctionName: 下拉选择框时
     * Author:
     * Description:
     */
    function dropdown(open) {
        if (open && value && Object.prototype.toString.call(value) !== '[object Array]') {
            fetchData(value.label)
        }
    }
    /*
     * FunctionName: options转换
     * Author:
     * Description:
     */
    function format(data) {
        const { transform } = props
        if (typeof transform === 'function') {
            return transform(data)
        } else if (isPlainObject(transform) && transform.value && transform.label) {
            const { value: key, label } = transform
            const result = uniqBy(data, key)
            return result.map(item => {
                return {
                    value: item[key],
                    label: item[label],
                    origin: item
                }
            })
        }
        return data
    }
    const { onchange, ...rest } = props
    return (
        <Select
            mode={props.mode ? props.mode : false}
            labelInValue
            value={value}
            showSearch={true}
            placeholder={props.placeholder ? props.placeholder : '请选择'}
            filterOption={false}
            // notFoundContent={fetching ? <Spin size="small" /> : null}
            onSearch={debounce(fetchUser, 500)}
            allowClear={true}
            showArrow={true}
            style={props.style}
            onDropdownVisibleChange={dropdown}
            {...rest}
            onChange={handleChange}
        >
            {options.map(d => (
                <Option key={d.value}>{d.label}</Option>
            ))}
        </Select>
    )
}
SelectSearch.propTypes = {
    searchurl: PropTypes.func
}