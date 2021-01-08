/*
 * ComponentName: 搜索
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Form } from 'antd'
import { history } from 'umi'
import Style from './style.less'
import ColumnsDropdown from '../ColumnsDropdown'
import { getURLParams } from '../../../utils/common'
import ExportModule from '../../ExportModule'
import formSwitchItems from '../../Forms/formSwitchItems'
import { SearchOutlined } from '@ant-design/icons'
import { setCache, getCache } from '@/utils/common'
import Button from '../../Button'
import lodash from 'lodash'
import moment from 'moment'

export default function Search(props) {
    let {
        dropdowns,
        list,
        handleChange,
        initialValues = {},
        searchDefBtn = true,
        searchBtn = true,
        resetBtn = true,
        onBeforeReset, // 重置自定义url参数
        isSenior = true, // 高级搜索 按钮 是否展示
        data = {}, // 子组件
        type, // 类型，modal：弹窗类型不需要赋值
        result = (v) => v, // 赋值截断函数
        init,
        showExport,
        exportParams,
        inline = false
        // onRef
        // isSearch,
        // changeisSearch=(v) => v,
        // onBeforeReseisSearch=(v) => v
    } = props
    const [form] = Form.useForm()
    // 高级搜索，默认关闭，存放在 localstorage里面
    const [isSearch, setIsSearch] = useState(Boolean(getCache('isSearch')))
    // 表单渲染数据
    const [formObj, setFormObj] = useState({})
    useEffect(() => {
        typeof init === 'function' && init({ form })
        // typeof onRef === 'function' && onRef(formref)
    }, [])

    useEffect(() => {
        // setIsSearch(true)
        formListItems()
        formBackIn()
    }, [data])

    /*
     * FunctionName: 刷新页面，将url参数赋值到form表单上
     * Author: 崔皓然
     * Description:
     */
    function formBackIn() {
        // url参数
        let query = getURLParams()
        if (type === 'modal') {
            return
        }
        query = typeof result == 'function' && result(query)
        form.setFieldsValue(query)
    }
    // useImperativeHandle(ref,() => ({
    //      formFields: getLabelValuesSync()
    // }))
    /**
     * FunctionName: form组合展示
     * Author: 崔皓然
     * Description:
     */
    function formListItems() {
        let contItems = ''// 将子组件放入FormItem
        let formItems = []// 高级搜索
        let defaultFormItems = []// 默认搜索
        data.forEach((item, key) => {
            //console.log('search',item)
            contItems = (
                <Form.Item
                    // labelCol={{ span: 12 }}
                    key={key}
                    label={item.label}
                    name={item.name}
                    rules={[
                        { required: false, message: '', ...item.rules }
                    ]}
                >
                    {formSwitchItems({ item, values: null, form, key, handles: { handleSearch } })}
                </Form.Item>
            )

            if (item.default) {
                // 默认搜索
                defaultFormItems.push(contItems)
            } else {
                // 高级搜索
                formItems.push(contItems)
            }
        })
        setFormObj({ defItems: defaultFormItems, items: formItems })
    }

    /**
     * FunctionName: 筛选
     * Author: 崔皓然
     * Description:
     */
    function handleSearch() {
        let { callBack } = props
        form.validateFields().then((values) => {
            //console.log('vvvvvvvvvv',values)
            // 筛选回调
            typeof callBack == 'function' && callBack(values)
        }).catch((errorInfo) => {
        })
    }

    /**
     * FunctionName: 重置
     * Author: 崔皓然
     * Description:
     */
    function handleReset() {
        let query = getURLParams(), payload = {}
        if (typeof onBeforeReset == 'function') {
            // 重置回调
            payload = onBeforeReset({ form, query })
        } else {
            // 重置所有
            form.resetFields()
        }
        if (type !== 'modal') {
            history.push({
                query: {
                    currentPage: 1,
                    _t: Date.now().toString(),
                    ...payload
                },
                hash: ''
            })
        }
    }

    /**
     * FunctionName: 高级搜索切换
     * Author: 崔皓然
     * Description:
     */
    function onSwitch() {
        // 配合 BasicLayout.jsx 文件里面的 路由监听
        let isbool = getCache('isSearch')
        setIsSearch(!isbool)
        setCache('isSearch', !isbool)
    }
    const getLabelValues = () => {
        let arr = getLabelValuesSync()
        let result = arr.filter(a => !!a.value) // 过滤掉值为假值的情况
        let arr2 = lodash.cloneDeep(result)
        let temp = []
        arr2.map((item) => {
            if (item.key === 'dateRange') {
                let a = typeof item.value == 'string' ? JSON.parse(item.value) : item.value
                if (a.startTime && a.endTime) {
                    if (a.startTime > a.endTime) {
                        [a.startTime, a.endTime] = [a.endTime, a.startTime]
                    }
                }
                if (a.startTime instanceof moment) {
                    temp.push({
                        label: '开始时间',
                        key: 'startTime',
                        value: a.startTime.format('YYYY-MM-DD')
                    })
                }
                if (a.endTime instanceof moment) {
                    temp.push({
                        label: '结束时间',
                        key: 'endTime',
                        value: a.endTime.format('YYYY-MM-DD')
                    })
                }
                if (typeof (a.startTime) === 'string') {
                    temp.push({
                        label: '开始时间',
                        key: 'startTime',
                        value: moment(a.startTime).format('YYYY-MM-DD')
                    })
                }
                if (typeof (a.endTime) === 'string') {
                    temp.push({
                        label: '结束时间',
                        key: 'endTime',
                        value: moment(a.endTime).format('YYYY-MM-DD')
                    })
                }
            } else if (item.key === 'planDateRange') {
                let a = typeof item.value == 'string' ? JSON.parse(item.value) : item.value
                if (a.startTime && a.endTime) {
                    if (a.startTime > a.endTime) {
                        [a.initReleaseDateStart, a.initReleaseDateEnd] = [a.endTime, a.startTime]
                    }
                }
                if (a.startTime instanceof moment) {
                    temp.push({
                        label: '计划开始时间',
                        key: 'initReleaseDateStart',
                        value: a.startTime.format('YYYY-MM-DD')
                    })
                }
                if (a.endTime instanceof moment) {
                    temp.push({
                        label: '计划结束时间',
                        key: 'initReleaseDateEnd',
                        value: a.endTime.format('YYYY-MM-DD')
                    })
                }
            } else if ((item.key !== 'dateRange') && (item.key !== 'planDateRange')) {
                temp.push(item)
            }
        })
        return temp
    }

    /**
     * 同步获取label, key, value，主要用于页面导出
     */
    const getLabelValuesSync = () => {
        const values = getValuesSync()
        const { formItems } = props.exportparam
        const arr = Object.keys(values).map(key => {
            let obj = {}
            const temp = formItems.filter(f => f.name === key)[0]
            const { interaction = {}, label } = temp
            // let hide = interaction.handleMiss ? interaction.handleMiss() : (interaction.handleHide ? !interaction.handleHide() : false); //将组件是否隐藏的状态传递出去，以便导出自定义是否给用户看 zc 2020/4/17 0518分支
            let filterArr = []
            obj = {
                label,
                key,
                // hide,
                value: values[key]
            }
            if (temp.type === 'selectSearch' && values[key] != undefined) {
                obj.name = values[key]?.label
            }
            if (temp.options) {
                filterArr = temp.options.filter(o => o.value === values[key])
                if (filterArr.length) {
                    obj.name = filterArr[0].label
                }
            }
            if (temp.options && values[key] instanceof Array) {
                let name = []
                values[key].map((oitem, oindex) => {
                    let selectitem = lodash.find(temp.options, function (o) {
                        return o.value == oitem
                    })
                    name += selectitem.label + ','
                })
                obj.name = name
            }
            // }
            // if (obj.value == undefined) {
            //     obj.name = ''
            // }
            return obj
        })
        return arr
    }

    /**
     * 同步获取表单值
     */
    const getValuesSync = (fieldNames) => {
        return form.getFieldsValue(fieldNames)
    }
    const exportParams1 = { ...exportParams, exportParameter: getLabelValues }
    return (
        <div className={Style.search}>
            <Form
                name='form'
                className='form'
                form={form}
                initialValues={initialValues}
                onValuesChange={(changedValues, allValues) => {
                    typeof handleChange == 'function' && handleChange({ changedValues, allValues })
                }}>

                {
                    isSenior ? <div className='top'>
                        <div className='lt'>
                            {formObj?.defItems}
                            {
                                searchDefBtn &&
                                <Form.Item>
                                    {
                                        searchDefBtn?.cnt ||
                                        // <Button type="primary"  {...searchBtn}>{searchBtn?.name || '筛选'}</Button>
                                        <SearchOutlined onClick={handleSearch} className='searchIcon' />
                                    }
                                </Form.Item>
                            }
                        </div>
                        {
                            (formObj?.items?.length > 0 && isSenior) &&
                            <div className='rt'>
                                <a onClick={onSwitch} className='fl'>
                                    <Button type="link">高级搜索</Button> <div style={{ transform: isSearch ? 'rotate(180deg)' : 'rotate(0deg)' }} ><icon className='zl_iconfont zl_shuangjiantou-shang' style={{ fontSize: '1rem' }} /></div>
                                </a>
                                {
                                    showExport && <ExportModule style={{ float: 'left', marginLeft: 16 }} {...exportParams1} />
                                }
                                {
                                    dropdowns?.show && <ColumnsDropdown {...dropdowns} table={list} />
                                }
                            </div>
                        }
                    </div> : ''
                }
                <div className={Style.child} style={{ display: isSearch ? 'none' : 'block' }}>
                    <div className={`${Style.chCnt} ${inline ? Style.inline : ''}`}>
                        <div className='searchFormItems' style={isSenior ? {} : { width: '100%' }}>
                            {formObj?.items}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {
                                searchBtn &&
                                <Form.Item style={{ marginRight: '16px' }}>
                                    {searchBtn?.cnt || <Button type="primary" onClick={handleSearch} {...searchBtn}>{searchBtn?.name || '筛选'}</Button>}
                                </Form.Item>
                            }
                            {
                                resetBtn &&
                                <Form.Item>
                                    {resetBtn?.cnt || <Button type="default" onClick={handleReset} {...resetBtn}>{resetBtn?.name || '重置'}</Button>}
                                </Form.Item>
                            }
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    )
}