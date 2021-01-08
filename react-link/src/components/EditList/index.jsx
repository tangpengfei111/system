/*
 * PageName: 列表编辑
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React from 'react'
import { Form, Button } from 'antd'
import ListPage from '../ListPage'

export default function EditList(props) {
    const [form] = Form.useForm()
    let {
        saveBtn = true // 保存按钮是否显示
    } = props

    return (
        <Form form={form} onFinish={(value) => {
            console.log('render -> value', value)
        }}>
            <ListPage {...props} />
            {
                saveBtn && <Button htmlType="submit" >保存</Button>
            }
        </Form>
    )
}
