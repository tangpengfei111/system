/*
 * ComponentName: 入口页-查询列表
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React, { PureComponent } from 'react'
import Search from './Search'
import Table from './Table'
import { history, withRouter } from 'umi'
import { urlStringify, getURLParams } from '../../utils/common'
import QueueAnim from 'rc-queue-anim'
import lodash from 'lodash'
import moment from 'moment'
import Style from './style.less'
@withRouter
export default class ListPage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            columns: []
        }
    }

    /**
     * FunctionName: 搜索点击筛选
     * Author: 崔皓然
     * query：搜索条件值
     */
    searchCallBack = (query) => {
        let { search } = this.props
        let result = typeof search.onBeforeSearch == 'function' ? search.onBeforeSearch({ query }) : query
        this.routerUrl(urlStringify(result))
    }

    /**
     * FunctionName: 跳转路由
     * Author: 崔皓然
     * Description:
     */
    routerUrl = (params) => {
        let { type, modalListPage, search } = this.props
        if (type !== 'modal') {
            history.push({
                query: {
                    currentPage: 1,
                    ...params,
                    _t: Date.now().toString()
                },
                hash: window.location.hash
            })
            // console.log(onUrlChanged)
            typeof search.onUrlChanged == 'function' && search.onUrlChanged()
        } else {
            typeof modalListPage === 'function' && modalListPage(params)
        }
    }

    /**
     * FunctionName: 点击分页
     * Author: 崔皓然
     * Description:
     */
    pagCallBack = ({ currentPage, pageSize }) => {
        let query = getURLParams()
        query.currentPage = currentPage
        query.pageSize = pageSize
        this.routerUrl(urlStringify(query))
    }

    /**
     * FunctionName: 控制列组件返回新列表
     * Author: 崔皓然
     * Description:
     */
    dropdownsCallBack = (columns) => {
        this.setState({
            columns: lodash.cloneDeep(columns)
        })
        typeof this.props.getFilterColumns ==='function'&&this.props.getFilterColumns(columns)
    }
    render() {
        let {
            className,
            title,
            // 入场特效
            queueAnim = {},
            // 查询
            search = {},
            // 列表
            list: { table = {}, spin = {}, pagination = {}, affix = {} } = {},
            type,
            customShowElement = false // 自定义要展示的列表(非表格时)
        } = this.props
        let {
            // 表头
            columns
        } = this.state
        return (
            <div className={`${Style.tableLayout} ${className || ''}`}>
                <QueueAnim delay={0} className="queue-simple" {...queueAnim} >
                    {
                        typeof title == 'string' ? <div className='table-title'>{title}</div> : title
                    }
                    {
                        Object.keys(search || {}).length > 0 && <Search
                            {...search}
                            key='searchKey'
                            callBack={(v) => this.searchCallBack(v)}
                            // wrappedComponentRef={(form) => this.formGroup = form}
                            handleChange={search?.handleChange}// form组件有改动就会触发
                            dropdowns={{
                                show: false,
                                ...search?.dropdowns,
                                columns: table.columns,
                                callBack: this.dropdownsCallBack
                            }}
                            showExport={search?.exportparam?.showExport || false}
                            exportParams={search?.exportparam ? { ...search.exportparam.exportParams } : {}}
                            type={type}
                        />
                    }
                    {!customShowElement ? <div class='tableCnt'>
                        <Table
                            key='tableKey'
                            // 旋转等待效果
                            spin={spin}
                            // 表格
                            table={{
                                ...table,
                                // columns 控制列数据后返回新列
                                columns: columns.length > 0 ? columns : table.columns
                            }}
                            // 底部按钮
                            affix={affix}
                            // 分页
                            pagination={pagination ? {
                                ...pagination,
                                callBack: this.pagCallBack
                            } : false}
                        />
                    </div> : customShowElement}
                </QueueAnim>
            </div>
        )
    }
}
