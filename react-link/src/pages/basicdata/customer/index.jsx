/*
 * PageName: 客户管理
 * Branch: 0
 * Autor: 唐鹏飞
 * Description:
 */
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from "react-redux"
import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText } from '@ant-design/pro-form'
import { Button, Tag } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import MoreButton from '@/components/MoreButton'



const namespace = 'customer'
// 颜色状态
const statusMap = {
    0: { color: 'green', text: "可用", status: 'Success' },
    1: { color: 'red', text: "不可用", status: 'Processing' },
    2: { color: '', text: "废弃", status: 'Default' },
};
export default function (props) {
    const dispatch = useDispatch()
    const actionRef = useRef()
    // 数据列表及分页
    const [dataSource, setDataSource] = useState({
        list: [],
        pagination: {}
    })
    // 搜索文本值
    const [searchValue, setSearchValue] = useState('')
    // 新建窗口的弹窗
    const [modalVisible, setModalVisible] = useState(false);


    const columns = [
        { title: "客户编号", dataIndex: 'no', align: 'center' },
        { title: "客户名称", dataIndex: 'name', align: 'center' },
        {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            hideInForm: true,
            // valueEnum: statusMap,
            render: (_text, record) => {
                let status = record?.status?.toString()
                return status ? <Tag style={{ marginRight: 0 }} color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag> : ''
            }
        },
        { title: '用户名', dataIndex: 'createAt', align: 'center' },
        { title: '最后操作时间', dataIndex: 'lastUpdateTime', align: 'center' },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            align: 'center',
            render: (_text, record) => {
                return (
                    <MoreButton
                        data={[
                            {
                                name: '编辑',
                                onClick: () => {
                                    console.log('编辑')
                                }
                            },
                            {
                                name: '删除',
                                isConfirm: true,
                                commonProps: {
                                    onConfirm: () => removeCustomer(record)
                                }
                            }
                        ]}
                    />
                )
            }
        }
    ]


    useEffect(() => {

    }, [])
    /*
     * FunctionName: 查询列表
     * Author: 唐鹏飞
     * Description: 
     * param {*} params 查询参数
     */
    function select(params) {
        const { current, pageSize, search } = params
        dispatch({
            type: `${namespace}/select`,
            payload: {
                pageNo: current,
                size: pageSize,
                search
            }
        }).then(data => {
            setDataSource(data)
        })

    }
    /*
     * FunctionName: 添加客户
     * Author: 唐鹏飞
     * Description: 
     */
    function addCustomer(value) {
        // handleModalVisible(false)
        console.log('value', value)
        if (actionRef.current) {
            actionRef.current.reload()
        }
    }
    /*
     * FunctionName: 删除客户信息
     * Author: 唐鹏飞
     * Description: 
     */
    function removeCustomer(record) {
        dispatch({
            type: `${namespace}/remove`,
            payload: {
                customerNo: record.no,
            },
            method: 'get'
        }).then(() => {
            reset()
        })
    }
    /*
     * FunctionName: 搜查
     * Author: 唐鹏飞
     * Description: 按客户名称查询
     */
    function onSearch(value = '') {
        value = value.trim()
        select({
            search: value ? value : undefined
        })
        console.log('onSearch', value)
    }
    /*
     * FunctionName: 重置
     * Author: 唐鹏飞
     * Description: 
     */
    function reset() {
        if (actionRef.current) {
            actionRef.current.reload()
            setSearchValue('')
        }
    }
    return (
        <PageContainer>
            <ProTable
                actionRef={actionRef}
                rowKey="key"
                search={false}
                options={false}
                // toolBarRender={false}
                // search={{
                //     labelWidth: 120,
                // }}
                dataSource={dataSource.list}
                pagination={dataSource.pagination}
                columns={columns}
                toolbar={{
                    title: '查询表格',
                    search: {
                        value: searchValue,
                        placeholder: '请输入客户名称',
                        onChange: (event) => setSearchValue(event.target.value),
                        onSearch: onSearch
                    },
                    actions: [
                        <Button type="primary" onClick={reset}>重置</Button>,
                        <Button type="primary" style={{ marginLeft: 20 }} key="primary" onClick={() => setModalVisible(true)}><PlusOutlined /> 添加</Button>
                    ]
                }}
                request={(params) => select(params)}
            />
            <ModalForm
                title={'新建客户'}
                width="400px"
                visible={modalVisible}
                onVisibleChange={setModalVisible}
                onFinish={addCustomer}
            >
                <ProFormText
                    label="客户名"
                    name="name"
                    placeholder="请填写客户名称"
                    rules={[
                        {
                            required: true,
                            message: '规则名称为必填项',
                        },
                    ]}
                    width={120}

                />
                <ProFormText
                    label="客户编号"
                    name="no"
                    placeholder="请填写客户编号"
                    rules={[
                        {
                            required: true,
                            message: '规则名称为必填项',
                        },
                    ]}
                    width={120}
                />
            </ModalForm>
            <ModalForm
                title={'修改'}
                width="400px"
                visible={modalVisible}
                onVisibleChange={setModalVisible}
                onFinish={addCustomer}
            >
                <ProFormText
                    label="状态"
                    name="name"
                    placeholder="请填写客户名称"
                    rules={[
                        {
                            required: true,
                            message: '规则名称为必填项',
                        },
                    ]}
                    width={120}

                />
            </ModalForm>
        </PageContainer>
    )
}