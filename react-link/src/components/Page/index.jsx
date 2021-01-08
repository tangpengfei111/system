/*
 * PageName: 每个页面的外层
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import Style from './style.less'
import { Button } from 'antd'
import { history } from 'umi'
import MoreButton from '../MoreButton'

export default function Page(props) {
    let {
        className,
        title, // 标题
        headerWrapper, // 左边PageHeaderWrapper内容 属性
        extra, // 右边内容
        moreButton = {}, // 列表
        goBack = false, // 返回按钮
        other = null//
    } = props
    return (
        <div className={`${Style.rPage} ${className}`}>
            <div className='hd'>
                <div className='lt'>
                    <PageHeaderWrapper {...headerWrapper} title={title || ' '}></PageHeaderWrapper>
                    {typeof other == 'function' ? other() : other}
                </div>
                <div className='rt'>
                    <MoreButton data={[]} {...moreButton} />
                    {extra}
                    {
                        goBack && <Button onClick={() => {
                            history.goBack()
                        }}>返回</Button>
                    }
                </div>
            </div>
            <div className='cnt'>
                {props.children}
            </div>
        </div>
    )
}
