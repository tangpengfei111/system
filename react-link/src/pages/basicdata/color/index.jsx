/*
 * PageName: 需求池-平台需求
 * Branch: 0
 * Autor: 唐鹏飞
 * Description:
 */
import React, { useState, useEffect } from 'react'
import { useDispatch } from "react-redux";
import { history } from 'umi'
import { Tooltip } from 'antd'
import ListPage from '@/components/ListPage'
import Page from '@/components/Page'
import MoreButton from '@/components/MoreButton'
import { getOptuonsValue, showMsg } from '@/utils/common'
import Badge from '@/components/Badge'
// import style from './style.less'

const namespaced = 'color'

export default function(props) {
    const columns = [
        {
            title: '序号',
            key: 'index',
            width: 50,
            render: (_text, _record, index) => ++index
        },
        // {
        //     title: '操作',
        //     key: 'operate',
        //     width: 100,
        //     align: 'center',
        //     fixed: 'right',
        //     checked: true,
        //     render: (_text, record) => {
        //         // const { sysDecomposeStatus } = record
        //         const same = havePermission(record, 'decompose')
        //         return (
        //             <MoreButton
        //                 data={[
        //                     {
        //                         code: 'demand.plat.view',
        //                         name: '查看',
        //                         onClick: () => {
        //                             history.push({
        //                                 pathname: './platform/detail',
        //                                 query: { platformCode: record.platformCode }
        //                             })
        //                         }
        //                     },
        //                     {
        //                         code: 'demand.plat.analysis',
        //                         name: '分析',
        //                         show: havePermission(record, 'analysis'),
        //                         onClick: () => {
        //                             history.push({
        //                                 pathname: './platform/analysis',
        //                                 query: { platformCode: record.platformCode }
        //                             })
        //                         }
        //                     },
        //                     {
        //                         code: 'demand.plat.decompose',
        //                         name: '分解',
        //                         show: Boolean(same),
        //                         onClick: () => {
        //                             history.push({
        //                                 pathname: './platform/decompose',
        //                                 query: {
        //                                     platformCode: record.platformCode,
        //                                     oriCode: record.oriCode,
        //                                     mainCode: record.platformCode,
        //                                     pkId: record.pkId,
        //                                     backendSystems: same ? same.join(',') : ''
        //                                 }
        //                             })
        //                         }
        //                     }
        //                 ]}
        //             />
        //         )
        //     }
        // }
    ]
    const formItems = [
        {
            type: 'textArea',
            name: 'platformCodes',
            label: '平台需求编号',
            style: {
                height: '100px'
            },
            disabled: true
        },
        {
            type: 'datePicker',
            name: 'planReleaseDate',
            label: '计划上线日期'
        }
    ]
    const searchParam = {}
    const initialValues = {}
    useEffect(() => {
        
    }, [])
   
    

    return (
        // <Page>
        //     <ListPage
        //         search={{
        //             dropdowns: {
        //                 list: columns,
        //                 show: true
        //             },
        //             data: searchParam,
        //             initialValues: initialValues,
        //             // onBeforeSearch: ({ query }) => {
                      
        //             //     return query
        //             // }
        //         }}
        //         list={{
        //             // affix: {
        //             //     extra: (item) => {
        //             //         const { selectedRows = [], selectedRowKeys = [] } = item

        //             //         return (
        //             //             <>
        //             //                 <Modal
        //             //                     button={{
        //             //                         name: '批量设置计划上线日期',
        //             //                         type: 'primary',
        //             //                         disabled: !selectedRowKeys.length,
        //             //                         style: {
        //             //                             marginLeft: '15px'
        //             //                         },
        //             //                         onClick: () => {
        //             //                             let value = batchSetDate(selectedRows)
        //             //                             return value
        //             //                         }
        //             //                     }}
        //             //                     modal={{
        //             //                         title: '批量设置计划上线日期',
        //             //                         width: '500px',
        //             //                         onOk: sureSetDate
        //             //                     }}>
        //             //                     <EditPage
        //             //                         formItems={formItems}
        //             //                         foot={false}
        //             //                         formValues={params}
        //             //                         onValuesChange={formOnChange}
        //             //                     />
        //             //                 </Modal>
        //             //                 {/* <Button style={{ marginLeft: '16px' }} type="primary" onClick={() => { mergeDecompose(selectedRows) }}>分解</Button> */}
        //             //             </>
        //             //         )
        //             //     }
        //             // },
        //             spin: {
        //                 spinning: false
        //             },
        //             table: {
        //                 style: { width: '1800px' },
        //                 scroll: { x: 1500 },
        //                 rowKey: 'no',
        //                 columns,
        //                 dataSource: list,
        //                 rowSelection: true
        //             },
        //             pagination
        //         }}
        //     />
        // </Page>
        <div>22222222222222222</div>
    )
}