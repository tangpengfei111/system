import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Modal,
    Button
} from 'antd'
import ExContent from './components/ExContent'

class ExportModule extends PureComponent {
    state = { visible: false };
    showModal = () => {
        this.setState({
            visible: true
        })
    };

    handleOk = () => {
        this.setState({
            visible: false
        })
    };

    handleCancel = () => {
        this.setState({
            visible: false
        })
        this.child.handleState()
    };

    /**
     * @param ref=>object
     * @Explain 获取子组件的对象
     * 2019/7/11
     */
    onRef = (ref) => {
        this.child = ref
    };
    render() {
        const { title = '导出资料', style = {}, className = ''} = this.props
        return (

            <div id='ExportModule' style={{ ...style }} className={className}>
                <Button onClick={this.showModal} type="icon"><span className="icon zl-iconfont zl-icondaochu"></span></Button>
                <Modal
                    title={title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    getContainer={() => document.getElementById('root')}
                    destroyOnClose={true}
                    footer={false}
                    maskClosable={false}
                    width={450}
                >
                    <ExContent onRef={this.onRef} {...this.props} />
                </Modal>
            </div>

        );
    }
}

ExportModule.propTypes = {
    title: PropTypes.string, // 弹框标题 String
    businesstype: PropTypes.string.isRequired, // 必填参数 String
    exportParameter: PropTypes.func // 导出查询参数
};
export default ExportModule
