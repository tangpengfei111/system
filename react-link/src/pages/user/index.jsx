/*
 * PageName: 用户管理
 * Branch: 20210114
 * Autor: 唐鹏飞
 * Description:
 */
import { useEffect, useState, useRef } from 'react'
import { useDispatch } from "react-redux"
import { Button } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form'
import ProTable from '@ant-design/pro-table'
import MoreButton from '@/components/MoreButton'
import lodash from 'lodash'


const namespace = 'user'
export default function (props) {
    const dispatch = useDispatch()
    const actionRef = useRef()
    // 数据列表及分页
    const [dataSource, setDataSource] = useState({
        list: [],
        pagination: {}
    })
    // 复制列表数据
    const [copyList, setCopyList] = useState({})
    // 新建窗口的弹窗
    const [modalVisible, setModalVisible] = useState(false)
    // 修改弹窗类型  默认 add edit
    const [modalType, setModalType] = useState('add')
    // 修改状态请求参数
    const [modifyParams, setModifyParams] = useState({})
    const [tabActiveKey, setTabActiveKey] = useState('all')

    const tabList = [
        { tab: '所有用户', key: 'all' },
        { tab: '管理员', key: 'admin' },
        { tab: '普通用户', key: 'common' },
    ]
    const roleOption = [
        { label: '管理员', value: 'superAdmin', type: 0 },
        { label: '生产用户', value: 'prodUser', type: 1 },
        { label: '库存用户', value: 'stockUser', type: 1 },
    ]

    const columns = [
        { title: "用户名", dataIndex: 'name', align: 'center' },
        { title: "密码", dataIndex: 'password', align: 'center' },
        {
            title: '权限',
            dataIndex: 'role',
            align: 'center',
            hideInForm: true,
            valueEnum: {
                'superAdmin': { text: "管理员" },
                'prodUser': { text: "生产用户" },
                'stockUser': { text: "库存用户" },
            }
        },
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
                                    setModifyParams(record)
                                    showModal('edit')
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
     * FunctionName: 切换列表
     * Author: 唐鹏飞
     * Description: 
     * key {*} key tabs 值
     */
    function onTabChange(key) {
        setTabActiveKey(key)
        let data = lodash.cloneDeep(copyList.list)
        if (key == 'all') return setDataSource(copyList)
        switch (key) {
            case 'admin':
                data = data.filter(item => item.role === 'superAdmin')
                break;
            case 'common':
                data = data.filter(item => item.role !== 'superAdmin')
                break;
            default:
                break;
        }
        setDataSource({
            list: data,
            pagination: false
        })
    }

    /*
     * FunctionName: 查询列表
     * Author: 唐鹏飞
     * Description: 
     * param {*} params 查询参数
     */
    function select(params) {
        console.log('tabActiveKey', tabActiveKey)
        const { current, pageSize } = params
        dispatch({
            type: `${namespace}/select`,
            payload: {
                pageNo: current,
                size: pageSize,
            }
        }).then(data => {
            setCopyList(data)
            setDataSource(data)
        })
    }

    /*
     * FunctionName: 显示弹窗
     * Author: 唐鹏飞
     * Description: 
     */
    function showModal(type) {
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
                customerNo: record.no,
            },
            method: 'get'
        }).then(() => {
            reset()
        })
    }

    return (
        <PageContainer
            tabList={tabList}
            tabActiveKey={tabActiveKey}
            onTabChange={onTabChange}
        >
            <ProTable
                actionRef={actionRef}
                rowKey="key"
                search={false}
                options={false}
                dataSource={dataSource.list}
                pagination={dataSource.pagination}
                columns={columns}
                toolbar={{
                    title: '',
                    actions: [
                        <Button type="primary" style={{ marginLeft: 20 }} key="primary" onClick={() => showModal('add')}>创建用户</Button>
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
                    maskClosable: false,
                    forceRender: true,
                    onCancel: () => setModifyParams({})
                }}
                onVisibleChange={setModalVisible}
                onFinish={modalType === 'add' ? addData : modifyData}
            >
                <ProFormText
                    label="用户名"
                    name="name"
                    placeholder="请填写用户名"
                    initialValue={modifyParams.name}
                    fieldProps={{
                        autoComplete: "off"
                    }}
                    disabled={modalType === 'edit'}
                    rules={[
                        {
                            required: true,
                            message: '请填写用户名',
                        },
                    ]}
                />
                <ProFormText
                    label="密码"
                    name="password"
                    placeholder="请填写密码"
                    initialValue={modifyParams.password}
                    fieldProps={{
                        autoComplete: "off"
                    }}
                    rules={[
                        {
                            required: true,
                            message: '请填写密码',
                        },
                    ]}
                />
                <ProFormSelect
                    label="权限"
                    name="role"
                    placeholder="请选择用户权限"
                    initialValue={modifyParams.role}
                    rules={[
                        {
                            required: true,
                            message: '请选择用户权限',
                        },
                    ]}
                    width={120}
                    options={roleOption}
                />
            </ModalForm>
        </PageContainer>
    )
}