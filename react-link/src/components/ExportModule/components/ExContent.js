import { PureComponent } from 'react'
import { connect } from 'dva'
import { Button, Steps, Progress, Spin, message } from 'antd'
import { history } from 'umi'
import { detail } from '@/utils/service'
import lodash from 'lodash'
const Step = Steps.Step

const sleep = x => new Promise(resolve => {
    setTimeout(resolve, x)
})

@connect(({ loading }) => ({ loading }))
class ExContent extends PureComponent {
    state = {
        current: 0, // 步骤条
        speed: 1, // 文件处理速度
        polling: false, // 是否轮询
        result: {}, // 导入完成后的信息
        loading: false

    };

    componentDidMount() {
        this.props.onRef(this)
    }

    /**
     * @Explain 提示说明
     */
    tips = () => {
        return <div className='mt16' style={{ color: '#999999' }}>
            <dl>
                <dt>温馨提示:</dt>
                <dd className='mt0 mb0'>1.系统导出的格式为Excel,一个文件5000条数据，超过会拆成多个文件。</dd>
                <dd className='mt0 mb0'>2.导出的数据越多，生成Excel报表的时间就越长，请耐心等待。</dd>
                <dd className='mt0 mb0'>3.已经生成的Excel报表，将在<a onClick={this.handleJump} target="_blank">导入/导出记录</a>中保留7天，请及时下载
                </dd>
            </dl>
        </div>
    }

    /**
     * @Explain 查询条件内容
     * 2019/7/13
     */
    queryContent = () => {
        const { exportParameter, handleParams = [] } = this.props
        if (typeof exportParameter !== 'function') {
            return
        }
        let arr = lodash.cloneDeep(exportParameter())
        if (handleParams.length > 0) {
            // isHandleBillstatus 处理请求 billstatus参数，显示内容默认[]的,多数据最后为','的情况
            arr = arr.map(item => {
                handleParams.forEach(param => {
                    if (item.key === param.field) {
                        item.name = item.name == '' ? ' ' : item.name.substring(0, item.name.length - 1)
                    }
                })
                return item
            })
        }
        if (!arr.length) {
            return
        }
        const content = arr.map(v => {
            if (!v.hide) { // 导出显示做对页面隐藏组件进行过滤，传参逻辑不变 -zc 2020/4/17 0518分支
                if (v.key === 'commoditytype' || v.key === 'categoryname' || v.key === 'category') {
                    v.name = this.handleTree(v).name
                }
                return <div key={v.key} className='pt5 pb5' style={{ flex: '50%' }}>
                    {v.name || v.value ? `${v.label}：${v.name || v.value}` : ''}
                </div>
            }
        })
        return <div className='pt7 pb7 pl16 pr16 mt12  bsbb' style={{
            background: 'rgba(245,248,250,1)',
            overflowY: 'auto',
            color: '#666666',
            display: 'flex',
            flexWrap: 'wrap',
            maxHeight: 92
        }}>
            {content}
        </div>
    }

    steps = () => {
        const { speed, result, loading = false } = this.state
        const { isMultiple, singleFailReason, singleFileUrl } = result
        return [{
            title: '确定内容',
            content: <div className='mt15'>
                {this.queryContent()}
                <Button onClick={this.handleExprot} disabled={loading} block className='h46  mt12'
                    type="primary">立即生成Excel报表</Button>
                {this.tips()}
            </div>,
        }, {
            title: '生成报表',
            content: <div className='tac pt50'>
                <Spin size="large" spinning={true} />
                <p className=' mt30 mb10 fwb'>正在生成Excel报表</p>
                <p style={{ color: '#999999' }}>请耐心等待</p>
            </div>,
        }, {
            title: '下载数据',
            content: <div className='tac pt50'>
                <Progress type="circle" percent={100} width={80}
                    status={singleFailReason === null ? 'success' : 'exception'} />
                <div className='h50 tac mt30'>
                    <p className='pt0 pb0 mt0 mb0 fwb'>{singleFailReason === null ? '报表生成完成!' : singleFailReason}</p>
                    {isMultiple && <p className='pt0 pb0 mt6 mb0 fwb fs12'>导出数据过多，已拆成多个文件，请至导出记录中下载</p>}
                </div>
                <div className='mt20'>

                    {!isMultiple &&
                        <Button className='w124 h46 mr5' type='primary'><a href={`http://${singleFileUrl}`}>下载导出数据</a></Button>}
                    <Button className='w124 h46 ml5' type={isMultiple ? 'primary' : ''}
                        onClick={this.handleJump}>查看导出记录</Button>
                </div>
            </div>
        }]
    }

    /**
     * @Explain 页面跳转
     */
    handleJump = () => {
        history.push({ pathname: '/setting/logManagement', query: { currentKey: '1' } })
    };


    /**
     * @Explain 给父组件调用
     * 2019/7/11
     */

    handleState = () => {
        this.setState({
            polling: false
        })
    };

    /**
     * @param   (id) => string
     * @Explain 轮询查询导出状态
     */
    handlePolling = async (id) => {
        let { speed, polling } = this.state
        if (!polling) {
            return
        }
        const res = await detail(
            'common/exportInfo',
            {
                must: [id],
                method: 'get'
            }
        )
        const { data = {} } = res
        if (data.isCompleted) {
            this.setState({
                current: 2,
                speed: 100,
                result: data
            })
        } else {
            speed <= 95 && (speed += Math.floor(Math.random() * 5 + 1))
            this.setState({
                speed
            })
            await sleep(1000)
            this.handlePolling(id)
        }
    };


    /**
     * @Explain 导出
     * 2019/7/13
     */
    handleExprot = () => {
        const { businesstype, exportParameter, handleParams = [] } = this.props
        let parameter = {}
        let exportparamsdesc = {}
        if (typeof exportParameter === 'function') {
            const arr = lodash.cloneDeep(exportParameter())
            arr.map(v => {
                if (v.key === 'creatorObj') {
                    delete parameter.creatorObj
                    parameter = { ...parameter, creator: v.value?.value }
                    exportparamsdesc[v.label] = this.handleTree(v).name
                }
                else if (v.key === 'handlerObj') {
                    delete parameter.handlerObj
                    parameter = { ...parameter, handler: v.value?.value }
                    exportparamsdesc[v.label] = this.handleTree(v).name
                } else {
                    parameter[v.key] = v.value
                    exportparamsdesc[v.label] = v.name || v.value
                }
            })
            if (handleParams.length > 0) {
                // isHandleBillstatus 处理请求 billstatus参数，页面查询与导出不一致的情况 不传参默认为空数组
                handleParams.forEach(item => {
                    if (item.isHandle && parameter[item.field] == '[]') {
                        parameter[item.field] = ''
                    }
                })
            }
        }
        this.setState({
            loading: true
        })

        detail(
            'common/queryexport',
            {
                payload: {
                    exportType: businesstype,
                    data: { ...parameter }
                },
                method: 'post'
            },
        ).then(resutl => {
            if (resutl.data) {
                this.setState({ current: 1, polling: true, loading: false })
                this.handlePolling(resutl.data?.value)
            } else {
                message.error('导出正在处理中，请稍后前往任务管理页面查看！')
            }
        })
    };


    handleTree = (obj) => {
        const object = obj.value.tree || []
        const name = object.map(v => {
            return v.label
        })
        return {
            name: name.join('/')
        }
    }

    render() {
        return (
            <>
                <Steps current={this.state.current} size='small'>
                    {this.steps().map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div>{this.steps()[this.state.current].content}</div>
            </>
        )
    }
}

export default ExContent
