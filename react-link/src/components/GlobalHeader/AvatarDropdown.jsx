import React from 'react'
import { Avatar, Menu, Spin } from 'antd'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { history } from 'umi'
import { useDispatch } from "react-redux"
import { getCache } from '@/utils/common'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'

export default function AvatarDropdown() {
	const dispatch = useDispatch()
	const currentUser = getCache('userInfo')
	const photoText = currentUser?.name?.toString()[0]?.toLocaleUpperCase() || ''
	const menu = false
	const menuHeaderDropdown = (
		<Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
			{menu && (
				<Menu.Item key="center">
					<UserOutlined />
            个人中心
				</Menu.Item>
			)}
			{menu && (
				<Menu.Item key="settings">
					<SettingOutlined />
            个人设置
				</Menu.Item>
			)}
			{menu && <Menu.Divider />}

			<Menu.Item key="logout">
				<LogoutOutlined />
          退出登录
        </Menu.Item>
		</Menu>
	)

	/*
	* FunctionName: 点击菜单
	* Author: 唐鹏飞
	* Description: 
	* param {*} event 数据源
	*/
	function onMenuClick(event) {
		const { key } = event;
		if (key === 'logout') return dispatch({ type: 'common/logout' })
		// history.push(`/account/${key}`)
	}


	return currentUser && currentUser.name ? (
		<HeaderDropdown overlay={menuHeaderDropdown}>
			<span className={`${styles.action} ${styles.account}`}>
				<Avatar size="small" className={styles.avatar} alt="avatar" >{photoText}</Avatar>
				{/** src={currentUser.avatar}  */}
				<span className={`${styles.name} anticon`}>{currentUser.name}</span>
			</span>
		</HeaderDropdown>
	) : (
		<span className={`${styles.action} ${styles.account}`}>
			<Spin
				size="small"
				style={{
					marginLeft: 8,
					marginRight: 8,
				}}
			/>
		</span>
	)
}
