/*
 * PageName: 供应商管理
 * Branch: 0
 * Autor: 唐鹏飞
 * Description:
 */
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from "react-redux"
import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form'
import { Button, Tag } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import MoreButton from '@/components/MoreButton'
import { getCache, showMsg } from '@/utils/common'
import { cloneDeep } from 'lodash'

const namespace = 'supplier'
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
    const [modalVisible, setModalVisible] = useState(false)
    // 修改弹窗类型  默认 add edit
    const [modalType, setModalType] = useState('add')
    // 修改状态请求参数
    const [modifyParams, setModifyParams] = useState({})
    const stateOption = [           // 状态数组
        { label: '可用', value: 0 },
        { label: '不可用', value: 1 }
    ]

    const columns = [
        { title: "供应商编号", dataIndex: 'no', align: 'center' },
        { title: "供应商名称", dataIndex: 'name', align: 'center' },
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
                                    showModal('edit', record)
                                }
                            },
                            {
                                name: '删除',
                                isConfirm: true,
                                commonProps: {
                                    onConfirm: () => removeData(record)
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
     * FunctionName: 显示弹窗
     * Author: 唐鹏飞
     * Description: 
     */
    function showModal(type, record) {
        setModifyParams(record)
        setModalType(type)
        setModalVisible(true)
    }
    /*
     * FunctionName: 添加数据
     * Author: 唐鹏飞
     * Description: 
     */
    function addData(value) {
        // 用户信息
        const userInfo = getCache('userInfo') || {}
        dispatch({
            type: `${namespace}/add`,
            payload: {
                ...value,
                createAt: userInfo.name
            },
            method: 'post'
        }).then(() => {
            setModalVisible(false)
            reset()
        })
    }
    /*
     * FunctionName: 修改数据
     * Author: 唐鹏飞
     * Description: 
     */
    function modifyData(value) {
        let payload = {
            ...cloneDeep(modifyParams),
            ...value
        }
        delete payload.lastUpdateTime

        dispatch({
            type: `${namespace}/modify`,
            payload,
            method: 'post'
        }).then(() => {
            setModalVisible(false)
            reset()
        })
    }
    /*
     * FunctionName: 删除数据
     * Author: 唐鹏飞
     * Description: 
     */
    function removeData(record) {
        dispatch({
            type: `${namespace}/remove`,
            payload: {
                supplierNo: record.no,
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
                        placeholder: '请输入供应商名称',
                        onChange: (event) => setSearchValue(event.target.value),
                        onSearch: onSearch
                    },
                    actions: [
                        <Button type="primary" onClick={reset}>重置</Button>,
                        <Button type="primary" style={{ marginLeft: 20 }} key="primary" onClick={() => showModal('add', {})}><PlusOutlined /> 添加</Button>
                    ]
                }}
                request={(params) => select(params)}
            />
            <ModalForm
                title={modalType === 'add' ? '新建' : '编辑'}
                width="400px"
                visible={modalVisible}
                modalProps={{
                    destroyOnClose: true,
                    forceRender: true,
                    maskClosable: false,
                    onCancel: () => setModifyParams({}),
                }}
                onVisibleChange={setModalVisible}
                onFinish={modalType === 'add' ? addData : modifyData}
            >
                {
                    modalType === 'add' && <>
                        <ProFormText
                            label="供应商名"
                            name="name"
                            placeholder="请填写供应商名称"
                            fieldProps={{
                                autoComplete: "off"
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: '请填写供应商名称',
                                },
                            ]}
                        />
                        <ProFormText
                            label="供应商编号"
                            name="no"
                            placeholder="请填写供应商编号"
                            fieldProps={{
                                autoComplete: "off"
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: '请填写供应商编号',
                                },
                            ]}
                        />
                    </>
                }
                {
                    modalType === 'edit' && <>
                        <ProFormSelect
                            label="状态"
                            name="status"
                            placeholder="请选择状态"
                            initialValue={modifyParams.status}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择状态',
                                },
                            ]}
                            options={stateOption}
                        />
                    </>
                }
            </ModalForm>
        </PageContainer>
    )
}

