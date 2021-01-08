/*
 * ComponentName: 编辑页面组件
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import { useState, useEffect } from 'react'
import { Form, Button } from 'antd'
import { history, connect } from 'umi'
import Style from './style.less'
import Card from './Card'
import { getURLParams } from '../../utils/common'
import formSwitchItems from '../Forms/formSwitchItems'
import QueueAnim from 'rc-queue-anim'

export default function EditPage(props) {
    let {
        init = () => { },
        formKey = 'formKey',
        foot = true, // 底部区域是否显示
        saveBtn = true, // 确定按钮是否显示
        closeBtn = true, // 关闭按钮是否显示
        resetBtn = true, // 清空按钮是否显示
        customBtn, // 自定义按钮
        onValuesChange = () => { }, // 表单数据发生编发触发
        queueAnim = {}, // 进出场动画 属性
        formItems = [],
        formValues = {},
        onSubmit = () => { },
        style = {}
    } = props
    const [form] = Form.useForm()
    const [items, setItems] = useState([])

    useEffect(() => {
        typeof init == 'function' && init({ form })
    }, [])


    useEffect(() => {
        formItemsShow()
    }, [formItems])

    /*
     * FunctionName: formValues变化时重新赋值
     * Author: 朴成欢
     * Description: 
     */
    useEffect(() => {
        setFieldsValue()
    }, [formValues])

    /**
     * FunctionName: 提交、保存
     * Author: 崔皓然
     * Description:
     */
    function handleSubmit() {
        form.validateFields().then((values) => {
            typeof onSubmit == 'function' && onSubmit({ values })
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
        let { resetCB } = props
        if (typeof resetCB == 'function') {
            // 重置回调
            resetCB({ form })
        } else {
            // 重置所有
            form.resetFields()
        }
    }

    // 给 form表单赋值
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
    function formItemsShow() {
        // 将子组件放入FormItem
        let contItems = []
        if (formItems[0] && !formItems[0].items) {
            formItems.forEach((item, key) => {
                contItems.push(
                    <Form.Item
                        key={'form' + key}
                        label={item.label}
                        extra={item.extra}
                        name={item.name}
                        rules={[{ required: false, message: '', ...item.rules }]}
                    >
                        {formSwitchItems({ item, values: formValues, form, key, handles: {} })}
                    </Form.Item>
                )
            })
        } else {
            formItems.forEach((obj, index) => {
                contItems.push(
                    <Card key={'card' + index} title={obj.name} className={`card ${obj.className}`}>
                        {
                            obj.items.map((item, key) => {
                                return (
                                    <Form.Item
                                        key={'form' + key}
                                        label={item.label}
                                        extra={item.extra}
                                        name={item.name}
                                        rules={[{ required: false, message: '', ...item.rules }]}
                                    >
                                        {formSwitchItems({ item, values: formValues, form, key, handles: {} })}
                                    </Form.Item>
                                )
                            })
                        }
                    </Card>
                )
            })
        }
        setItems(contItems)
    }

    return (

        <div className={Style.editCont} style={{ ...style }}>
            <QueueAnim delay={0} className="queue-simple" {...queueAnim}>
                <Form
                    form={form}
                    className='form'
                    key={formKey}
                    onValuesChange={(changedValues, allValues) => {
                        typeof onValuesChange == 'function' && onValuesChange({ changedValues, allValues })
                    }}
                >
                    <div className='formCnt'>
                        {items}
                    </div>
                    {
                        foot === true ?
                            <div className='bottom'>
                                {
                                    saveBtn &&
                                    <Form.Item>
                                        {saveBtn?.cnt || <Button type="primary" onClick={handleSubmit} {...saveBtn}>{saveBtn?.name || '保存'}</Button>}
                                    </Form.Item>
                                }
                                {
                                    closeBtn &&
                                    <Form.Item>
                                        {closeBtn?.cnt || <Button type="default" onClick={handleClose} {...closeBtn}>{closeBtn?.name || '关闭'}</Button>}
                                    </Form.Item>
                                }
                                {
                                    resetBtn &&
                                    <Form.Item>
                                        {resetBtn?.cnt || <Button type="default" onClick={handleReset} {...resetBtn}>{resetBtn?.name || '清空'}</Button>}
                                    </Form.Item>
                                }
                                {customBtn && <Form.Item>{customBtn}</Form.Item>}
                            </div> :
                            foot
                    }
                </Form>
            </QueueAnim>
        </div>
    )
}