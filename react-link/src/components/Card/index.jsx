import { Card } from 'antd'
import Style from './style.less'

export default (props) => {
    return (
        <div className={Style.card}>
            <Card {...props}>
                {props.children}
            </Card>
        </div>
    )
}
