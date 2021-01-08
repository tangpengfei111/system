/*
 * ComponentName: 控制列显示
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React, { PureComponent } from 'react'
import { Button, Dropdown, Menu, Checkbox } from 'antd'
import Style from './style.less'

export default class ColumnsDropdown extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            data: props.list
        }
    }

    componentDidMount() {
        this.tableColumns()
    }

    /**
     * FunctionName: 点击选中显示隐藏列名
     * Author: 崔皓然
     * Description:
     */
    onChange = (e) => {
        // e.stopPropagation()
        let val = e.target.value,
            { data } = this.state,
            list = data.map((item) => {
                if (item.title == val) {
                    item.checked = !item.checked
                }
                return item
            })
        this.setState({
            data: JSON.parse(JSON.stringify(list))
        }, () => {
            this.tableColumns()
        })
    }

    /**
     * FunctionName: 整理table列名
     * Author: 崔皓然
     * Description:
     */
    tableColumns = () => {
        let { columns, callBack } = this.props,
            { data } = this.state
        if (columns) {
            columns.map((item) => {
                item.show = true
                data.forEach((itemA) => {
                    if (item.title == itemA.title && !itemA.checked) {
                        item.show = false
                    }
                })
                return item
            })
            callBack && callBack(columns)
        }
    }

    /**
     * FunctionName: 能改变的列名列表
     * Author: 崔皓然
     * Description:
     */
    menuColumns = () => {
        return (
            <Menu className={Style.dropMenu}>
                {
                    this.state.data.map((item, key) => {
                        return (
                            <li key={key}>
                                <Checkbox
                                    checked={item.checked}
                                    onClick={this.onChange}
                                    value={item.title}
                                >
                                    {item.title}
                                </Checkbox>
                            </li>
                        )
                    })
                }
            </Menu>
        )
    }

    render() {
        return (
            <Dropdown
                // overlayClassName={`${styles.settingcolumns}`}
                placement="bottomLeft"
                getPopupContainer={() => document.getElementById('root')}
                overlay={this.menuColumns}
            >
                <Button
                    type="icon"
                    // onClick={this.onColumnSettingClick}
                    className={'ml16'}
                >
                    <icon className='zl_iconfont zl_shezhi1' />
                </Button>
            </Dropdown>
        )
    }
}
