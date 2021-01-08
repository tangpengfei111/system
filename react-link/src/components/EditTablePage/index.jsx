/*
 * ComponentName: 编辑页面组件
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { useState, useEffect } from 'react'
import { Form, Button } from 'antd'
import { history } from 'umi'
import Style from './style.less'
import formSwitchItems from '../Forms/formSwitchItems'
import QueueAnim from 'rc-queue-anim'
import Card from '../Card'

function EditTablePage(props) {
    let {
        init = () => { },
        formKey = 'formKey', // from的key
        otherContent, // 额外内容
        onSubmit = () => { }, // 提交流程
        onzancun = () => { }, // 暂存流程
        formValues = {}, // form数据
        foot = true, // 底部区域是否显示
        stagBtn = false, // 暂存按钮是否显示
        saveBtn = true, // 确定按钮是否显示
        closeBtn = true, // 关闭按钮是否显示
        resetBtn = true, // 清空按钮是否显示
        customBtn, // 自定义按钮
        onValuesChange = () => { }, // 表单数据发生编发触发
        queueAnim = {}, // 进出场动画 属性,
        formItems,
        nobg = false,
        style = {},
        className = ''
    } = props
    const [form] = Form.useForm()
    const [items, setItems] = useState([])

    useEffect(() => {
        typeof init == 'function' && init({ form })
    }, [])

    /*
     * FunctionName: form表单有变化
     * Author: 崔皓然
     * Description:
     */
    useEffect(() => {
        showformItems()
    }, [formItems])

    /*
     * FunctionName: form表单值有变化
     * Author: 崔皓然
     * Description:
     */
    useEffect(() => {
        setFieldsValue()
    }, [formValues])

    /**
     * FunctionName: 默认处理befor/after 数据
     * Author: 崔皓然
     * Description:
     */
    function fn(val) {
        return val
    }

    /**
     * FunctionName: 提交、保存
     * Author: 崔皓然
     * Description:
     */
    function handleSubmit() {
        form.validateFields().then((values) => {
            // 筛选回调
            onSubmit({ values })
        }).catch((errorInfo) => {
            console.log('handleSubmit -> errorInfo', errorInfo)
        })
    }
    /**
     * FunctionName: 暂存
     * Author: 崔皓然
     * Description:
     */
    function handleStage() {
        form.validateFields().then((values) => {
            // 筛选回调
            onzancun({ values })
        }).catch((errorInfo) => {
            console.log('handleSubmit -> errorInfo', errorInfo)
        })
    }

    /**
     * FunctionName: 关闭/返回上一页
     * Author: 崔皓然
     * Description:
     */
    function handleClose() {
        let { onClose } = props
        typeof onClose == 'function' ? onClose() : history.goBack()
    }

    /**
     * FunctionName: 清空
     * Author: 崔皓然
     * Description:
     */
    function handleReset() {
        let { onReset } = props
        if (typeof onReset == 'function') {
            // 重置回调
            onReset({ form })
        } else {
            // 重置所有
            form.resetFields()
        }
    }

    /*
     * FunctionName: form表单赋值
     * Author: 崔皓然
     * Description:
     */
    function setFieldsValue() {
        form.setFieldsValue({
            ...formValues
        })
    }

    /**
     * FunctionName: form组合展示
     * Author: 崔皓然
     * Description:
     */
    function showformItems() {
        if (formItems[0] && formItems[0].items?.length > 0) {
            let table = formItems.map((item, index) => {
                return (
                    <Card
                        key={'card' + index}
                        className={`card ${item.className}`}
                        title={item.name}
                        {...item}
                    >
                        <table className='table' key={'table' + index}>
                            {trMap({ items: item.items })}
                        </table>
                    </Card>
                )
            })
            setItems(table)
        } else {
            let table = <table className='table'>
                {trMap({ items: formItems })}
            </table>
            setItems(table)
        }
    }

    /*
     * FunctionName: 展示 tr
     * Author: 崔皓然
     * Description:
     */
    function trMap(params = {}) {
        const tbody = <tbody>
            {
                params?.items.map((item, index) => {
                    return (
                        <tr key={index}>
                            {
                                item.map((itemA, indexA) => {
                                    if (!itemA.label && !itemA.name) {
                                        return (
                                            <>
                                                <td {...itemA.rtTd}></td>
                                            </>
                                        )
                                    }
                                    return (
                                        <>
                                            <td className='title' key={'title' + indexA} {...itemA.ltTd} style={{...itemA.labelStyle}}>
                                                <label>{itemA?.rules?.required && <span className='required'>* </span>} {itemA.label || itemA.name}：</label>
                                            </td>
                                            <td key={'td' + indexA} {...itemA.rtTd} style={{...itemA.tdStyle}}>
                                                {
                                                    <Form.Item
                                                        key={'form' + indexA}
                                                        extra={itemA.extra}
                                                        name={itemA.name}
                                                        rules={[{ required: false, message: '', ...itemA.rules }]}
                                                    >
                                                        {formSwitchItems({ item: itemA, values: formValues, form, key: indexA, handles: {} })}
                                                    </Form.Item>
                                                }
                                            </td>
                                        </>
                                    )
                                })
                            }
                        </tr>
                    )
                })
            }
        </tbody>
        return tbody
    }

    return (
        <div className={`${Style.editCont} ${nobg ? Style.onBg : ''} ${className}`} style={{ ...style }}>
            <QueueAnim delay={0} className="queue-simple" {...queueAnim}>
                <Form
                    form={form}
                    className='form'
                    key={formKey}
                    onValuesChange={(changedValues, allValues) => {
                        typeof onValuesChange == 'function' && onValuesChange({ form, changedValues, allValues })
                    }}>
                    <div className={'formCnt'}>
                        {items}
                    </div>
                    <div className='other'>
                        {otherContent}
                    </div>
                    {
                        foot === true ?
                            <div className='bottom'>
                                {
                                    stagBtn &&
                                    <Form.Item>
                                        {stagBtn?.cnt || <Button type="default" onClick={() => handleStage()} {...stagBtn}>{stagBtn?.name || '暂存'}</Button>}
                                    </Form.Item>
                                }
                                {
                                    saveBtn &&
                                    <Form.Item>
                                        {saveBtn?.cnt || <Button type="primary" onClick={() => handleSubmit()} {...saveBtn}>{saveBtn?.name || '保存'}</Button>}
                                    </Form.Item>
                                }
                                {
                                    resetBtn &&
                                    <Form.Item>
                                        {resetBtn?.cnt || <Button type="default" onClick={handleReset} {...resetBtn}>{resetBtn?.name || '清空'}</Button>}
                                    </Form.Item>
                                }
                                {
                                    closeBtn &&
                                    <Form.Item>
                                        {closeBtn?.cnt || <Button type="default" onClick={handleClose} {...closeBtn}>{closeBtn?.name || '关闭'}</Button>}
                                    </Form.Item>
                                }
                                {customBtn ? <Form.Item>{customBtn}</Form.Item> : ''}
                            </div> :
                            foot
                    }
                </Form>
            </QueueAnim>
        </div>
    )
}

export default EditTablePage
