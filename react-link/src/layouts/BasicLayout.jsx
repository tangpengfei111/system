/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, connect, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import { checkPathname } from '@/utils/common'
import logo from '@/assets/logo.png';
const noMatch = (
	<Result
		status={403}
		title="403"
		subTitle="抱歉，您无权访问此页。"
		extra={
			<Button type="primary">
				<Link to="/login">登录</Link>
			</Button>
		}
	/>
);

const menuDataRender = (menuList) => {
	let menu = menuList.map((item) => {
		const localItem = {
			...item,
			children: item.children ? menuDataRender(item.children) : undefined,
		}
		return Authorized.check(item.authority, localItem, null)
	})
	return menu
}


const BasicLayout = (props) => {
	const {
		dispatch,
		children,
		settings,
		location = {
			pathname: '/',
		},
	} = props;
	const menuDataRef = useRef([]);


	useEffect(() => {

	}, []);

	const authorized = useMemo(
		() =>
			getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
				authority: undefined,
			},
		[location.pathname],
	);
	
	return (
		<ProLayout
			logo={logo}
			{...props}
			{...settings}
			onMenuHeaderClick={() => history.push('/')}
			menuItemRender={(menuItemProps, defaultDom) => {
				if (
					menuItemProps.isUrl ||
					!menuItemProps.path ||
					location.pathname === menuItemProps.path
				) {
					return defaultDom;
				}

				return <Link to={menuItemProps.path}>{defaultDom}</Link>;
			}}

			itemRender={(route, params, routes, paths) => {
				const first = routes.indexOf(route) === 0;
				return first ? (
					<Link to={paths.join('/')}>{route.breadcrumbName}</Link>
				) : (
						<span>{route.breadcrumbName}</span>
					);
			}}
			menuDataRender={menuDataRender}
			rightContentRender={() => <RightContent />}
			postMenuData={(menuData) => {
				menuDataRef.current = menuData || [];
				return menuData || [];
			}}
		>
			<Authorized authority={authorized.authority} noMatch={noMatch}>
				{children}
			</Authorized>
		</ProLayout>
	);
};

export default connect(({ settings }) => ({

	settings,
}))(BasicLayout);
