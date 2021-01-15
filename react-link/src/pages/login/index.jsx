/*
 * PageName: 登录
 * Branch: 0
 * Autor: 唐鹏飞
 * Description:
 */
import React from 'react'
import { useDispatch } from "react-redux";
import { Input, Button, Form } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { getCache } from '@/utils/common'
import Style from './style.less'


export default function List(props) {
    const dispatch = useDispatch()
    // 切换
    const userInfo = getCache('userInfo') || {}
    /**
     * FunctionName: 请求后端
     * Author: 唐鹏飞
     * Description:
     */
    const handleSubmit = (values = {}) => {
        dispatch({
            type: 'common/login',
            payload: {
                ...values
            },
            method: 'get'
        })
    }

    return (
        <div className={Style.login}>
            <div className="logo"></div>
            <div className="login-dialog">
                <div className="image"></div>
                <div className="dialog">
                    <div className="title">印染业务系统管理平台</div>
                    <div className="message">Welcome欢迎登陆</div> 
                    <Form
                        className="loginForm"
                        onFinish={handleSubmit}
                        initialValues={{
                            username: userInfo?.loginCode,
                            password: ''
                        }}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input size="large" placeholder="用户名" autoComplete="off" prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password size="large" placeholder="密码" autoComplete="off" prefix={<LockOutlined />} />
                        </Form.Item>
                        <Button className="ladning" type="primary" htmlType="submit" block size="large">登录</Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}
