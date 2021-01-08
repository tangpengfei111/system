/*
 * ComponentName: 列表
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React, { useState } from 'react'
import { Checkbox, Affix, Table, Pagination, Button, Spin, Space } from 'antd'
import Style from './style.less'
import MoreButton from '../../MoreButton'

export default function ZLTable(props) {
    let {
        // 表格
        table,
        // 分页
        pagination,
        // 等待
        spin,
        // 浮动
        affix = false
    } = props

    // 多选 数据
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    // 底部多选 半选
    const [indeterminate, setIndeterminate] = useState(false)
    // 底部区域浮动
    const [isAffixed, setIsAffixed] = useState(false)
    // 是否全选
    const [checked, setChecked] = useState(false)

    /**
     * FunctionName: 多选
     * Author: 崔皓然
     * Description:
     */
    function onSelectChange(RowKeys, Rows) {
        // 判断是否有选中数据
        if (Rows && Rows.length) { // 有数据的情况
            // 判断当时当前状态是否为全部选中
            if (Rows.length == table?.dataSource?.length) { // 全部选中的情况
                setIndeterminate(false)
                setChecked(true)
            } else { // 没有全部选中的情况
                setIndeterminate(true)
            }
        } else { // 没有选中的数据则checked与方块状态都为false
            setIndeterminate(false)
            setChecked(false)
        }
        setSelectedRowKeys(RowKeys)
        setSelectedRows(Rows)
    }

    /**
     * FunctionName: 底部全选
     * Author: 崔皓然
     * Description:
     */
    function onBottonAllSelect(e) {
        let val = e.target.checked
        setChecked(val)
        setIndeterminate(false)
        setSelectedRowKeys(val ? table?.dataSource?.map(item => item[table?.rowKey]) : [])
        setSelectedRows(val ? table?.dataSource?.map(item => item) : [])
    }

    /**
     * FunctionName: table全选
     * Author: 崔皓然
     * Description:
     */
    function onSelectAll(selected, selectedRows, changeRows) {
        setChecked(selected)
        setIndeterminate(false)
        setSelectedRowKeys(selected ? table?.dataSource.map(item => item[table?.rowKey]) : [],)
        setSelectedRows(selectedRows)
    }

    /**
     * FunctionName: 分页点击
     * Author: 崔皓然
     * Description:
     */
    function onPaginChange(page, pageSize) {
        pagination && pagination.callBack && pagination.callBack({ currentPage: page, pageSize })
    }

    /**
     * FunctionName: 分页选择pageSize
     * Author: 崔皓然
     * Description:
     */
    // function onShowSizeChange(current, size) {
    //     pagination && pagination.callBack && pagination.callBack({ currentPage: current, pageSize: size })
    // }

    /**
     * FunctionName: 列表底部多选区域内容
     * Author: 崔皓然
     * Description:
     */
    function affixExtra() {
        let isBool = selectedRowKeys.length > 0
        /**
             * 特殊按钮
             * selectedRowKeys：多选数据源
             * isBool：是否有多选
             * table：列表数据源
             */
        if (typeof affix.extra === 'function') {
            return affix.extra({ affix, selectedRowKeys, selectedRows, table, isBool: !isBool })
        }
    }

    /**
     * FunctionName: 过滤列名
     * Author: 崔皓然
     * Description:
     */
    function columnsFilter() {
        let columnsList = []
        table && table.columns && table.columns.forEach(item => {
            if (typeof item.show == 'undefined' || item.show == true) {
                columnsList.push(item)
            }
        })
        return columnsList
    }

    /**
     * FunctionName: 底部按钮浮动触发
     * Author: 崔皓然
     * Description:
     */
    function onAffiex(affixed) {
        setIsAffixed(affixed)
    }

    // 全选
    let checkbox = Boolean(table?.rowSelection) &&
        <Checkbox
            className='ckeckbox'
            disabled={!(table.dataSource && table.dataSource.length)}
            indeterminate={indeterminate && table.dataSource && table.dataSource.length}
            checked={checked}
            onChange={onBottonAllSelect}>全选</Checkbox>
    // 左下角 全选、操作按钮 是否显示 true显示
    let isAffix = affix
    // 底部是否显示
    let isFoot = isAffix || pagination
    return (
        <div className={Style.table}>
            <Spin {...spin}>
                {/* 列表 */}
                <Table
                    rowKey='id'
                    pagination={false}
                    {...table}
                    rowSelection={table?.rowSelection === true ? {
                        selectedRowKeys: selectedRowKeys,
                        onSelectAll: onSelectAll,
                        onChange: onSelectChange
                    } : table?.rowSelection}
                    className={`${table?.className}`}
                    columns={columnsFilter()}
                    size="small"
                    bordered={true}
                />
                {
                    isFoot && <div className='foot'>
                        {/* 左下角 区域 */}
                        {
                            isAffix && (
                                selectedRowKeys.length > 0 ?
                                    <Affix onChange={onAffiex} offsetBottom={0}>
                                        <div className={`affixCont ${isAffixed ? 'shadow' : ''}`}>
                                            {/* {checkbox} */}
                                            {affixExtra()}
                                            <MoreButton data={[]} {...affix?.moreButton} />
                                        </div>
                                    </Affix> :
                                    <div className='affixCont'>
                                        {/* {checkbox} */}
                                        {affixExtra()}
                                        <MoreButton data={[]} {...affix?.moreButton} />
                                    </div>
                            )
                        }
                        {/* 分页 */}
                        {
                            pagination && <div className='pagin'>
                                <Pagination
                                    onChange={onPaginChange}
                                    // onShowSizeChange={onShowSizeChange}
                                    {...pagination}
                                    pageSize={pagination?.pageSize || 20}
                                    current={pagination?.current || 1}
                                    showSizeChanger={true}
                                    showQuickJumper={true}
                                    pageSizeOptions={pagination?.pageSizeOptions || ['10', '20', '50', '100']}
                                    showTotal={(total) => {
                                        return pagination?.showTotal && pagination?.showTotal() || `共 ${total} 条，每页 ${pagination?.pageSize || 20} 条`
                                    }}
                                />
                            </div>
                        }
                    </div>
                }

            </Spin>
        </div >
    )
}