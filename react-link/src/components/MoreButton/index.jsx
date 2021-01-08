/*
 * PageName: 按钮
 * Branch: 0
 * Autor: 崔皓然
 * Description: 整个系统所有按钮统一使用这个，不要单独使用antd Button
 */
import Button from '../Button'
import { Space, Popconfirm } from 'antd'


export default (props) => {
    // const menus = localStorage.getItem('menusList')

    let {
        data = [], // button 属性[{name:'',type:'',onClick:()=>{}}]
        type = 'a' // 默认列表按钮，a标签
    } = props

    /*
     * FunctionName: 按钮返回值
     * Author: 崔皓然
     * Description:
     */
    function btns({ item, index }) {
        // show不传就不校验 传的话 一切非 都显示
        if (Object.keys(item).find(i => i === 'show') && !item.show) {
            return null
        }
        // const allow = menus && menus.indexOf(item.code) || false
        const allow = true
        // 有code但是没有权限
        if (item.code && allow == -1) {
            return null
        }
        if (item.other) {
            return typeof item.other === 'function' ? item.other({ item }) : item.other
        }

        if (item.isConfirm) {
            return <Popconfirm
                title='是否确认删除'
                okText="删除"
                okType="danger"
                cancelText="取消"
                {...item.commonProps}
                >
                    <Button type={type} key={item.code || index} {...item} >{item.name || item.name}</Button>
            </Popconfirm>
        }


        return <Button type={type} key={item.code || index} {...item} >{item.name || item.name}</Button>
    }

    return (
        <div>
            <Space>
                {
                    data && data.map((item, index) => {
                        return btns({ item, index })
                    })
                }
            </Space>
        </div>
    )
}
