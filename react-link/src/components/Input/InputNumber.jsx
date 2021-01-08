import { PureComponent } from 'react';
import { Input } from 'antd';
import { fixed as precision } from '@/global.js';
import PropTypes from 'prop-types';

/**
 * 数字输入框.
 * Author: qq
 * Date: 2019年7月10日
 */
class InputNumber extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: this.getDefalutValue(),
        };
    }

    componentWillReceiveProps(nextProps) {
        let { value = undefined, max = undefined, onChange } = nextProps;
        if (value !== undefined && max !== undefined && Number(value) > Number(max)) {
            this.setState(
                {
                    value: max,
                },
                () => {
                    if (onChange) {
                        onChange(max);
                    }
                },
            );
        } else if (nextProps.value != this.state.value && nextProps.value !== undefined) {
            //外面父组件直接改变 input的value值的场景
            this.state.value = nextProps.value;
        }
    }

    getDefalutValue = () => {
        let {
            min = undefined,
            max = undefined,
            showmin = undefined,
            showmax = undefined,
            defaultValue = '',
        } = this.props;
        min = typeof min == 'undefined' ? min : Number(min);
        max = typeof max == 'undefined' ? max : Number(max);
        let value = '';
        if (showmin !== undefined && min !== undefined) {
            value = min;
        } else if (showmax !== undefined && max !== undefined) {
            value = max;
        }
        return value || defaultValue;
    };

    onChange = (e) => {
        // let { min = undefined, max = undefined, onChange } = this.props
        let { min = undefined, onChange } = this.props;
        // console.log(this.props, "value onchange")
        min = typeof min == 'undefined' ? min : Number(min);
        // max = typeof max == "undefined" ? max : Number(max)
        let newValue;
        let value = e.target.value.toString().replace(/^0+/, '0');
        let numberValue = Number(value);
        if (isNaN(numberValue) === true && value != '-' && !/^.{1,}/.test('.')) return;
        if (min !== undefined && min >= 0 && value.indexOf('-') > -1) return;
        //输入的内容超过两个连续的0
        if (numberValue == 0 && (value == '00' || value == '-00') && Number(value) == numberValue) {
            return;
        }
        newValue = value;

        //有最小数, 并且输入的值小于最小数 取最小数
        /* if (min !== undefined && Number(newValue) < min) {
            newValue = min.toString()
        } */

        //有最大数, 并且输入的值大于最大数 取最大数
        /* if (max !== undefined && Number(newValue) > max) {
            newValue = max.toString()
        } */

        this.setState(
            {
                value: newValue,
            },
            () => {
                if (onChange) {
                    // onChange(Object.assign({}, this.state, { value: newValue }))
                    onChange(newValue);
                }
            },
        );
    };

    onBlur = (e) => {
        //let { value } = this.state
        let {
            min = undefined,
            max = undefined,
            fixed = undefined,
            onChange,
            onBlur,
            value,
        } = this.props; //blur 接收最新值，以防止值没有被更新 zc
        if (value) {
            value = value && value.toString().replace(/^-0+\./, '-0.'); //-00000.000010
            value = value && value.toString().replace(/^-0{2,}/, '-'); //-00010 => -010 bug
            value = value && value.toString().replace(/^0{2,}}\./, '0.'); //00000.000010
            value = value && value.toString().replace(/^0{2,}/, ''); //00000.000010
            value = value && value.toString().replace(/^0([1-9]+)/, '$1'); //00000.000010
            value = value && value.toString().replace(/^-0([1-9]+)/, '-$1'); //00000.000010
            value = value && value.toString().replace(/^-0([1-9]+)/, '-$1'); //00000.000010
            value = value && value.toString().replace(/^\.{1,}/, ''); //00000.000010
            value = value && value.toString().replace(/^-\./, ''); //00000.000010
            if (value == '') return;
            // value = Number(value).toString() //直接用Number转的话,会变成科学计数
            // console.log(value, "aaa???")

            min = typeof min == 'undefined' ? min : Number(min);
            max = typeof max == 'undefined' ? max : Number(max);
            let numberValue = Number(e.target.value);
            // console.log(numberValue, "numberValue", min, max)
            if (isNaN(numberValue) === true) {
                value = this.getDefalutValue().toString();
            }

            //处理 -0.000的情况
            if (
                numberValue.toString() === '0' &&
                value.indexOf('-') > -1 &&
                numberValue.toString() !== value
            ) {
                // value = "0"
                value = value.replace('-', '');
            }

            //小于小数 取最小
            if (min !== undefined && numberValue < min) {
                value = min.toString();
            }

            //大于大数 取最大
            if (max !== undefined && numberValue > max) {
                value = max.toString();
            }

            //处理精度
            if (fixed !== undefined && value.indexOf('.') > -1) {
                value = precision(value, fixed, 'string');
            }

            //去除两边的空格
            value = window.$.trim(value);
            if (value.indexOf('.') < 0 && value !== '0') {
                //zc  更改 .001 =>001=>1 bug
                value = value && value.toString().replace(/^0{1,}/, '');
            }
            // console.log(value, "value-----", fixed)
            // if (value != this.state.value.toString()) {
            //this.setState({ value })
            // }
            this.setState({ value }, () => {
                if (onChange) {
                    onChange(value);
                }
                if (onBlur) {
                    onBlur(value);
                }
            });
        }
    };

    render() {
        const { extra = {} } = this.props;
        const { style = {} } = extra;
        // console.log(this.props, "InputNumber")
        return (
            <Input
                value={this.state.value}
                maxLength={12}
                {...extra}
                autoComplete="off"
                style={{
                    width: 160,
                    ...style,
                }}
                {...this.props}
                onBlur={this.onBlur}
                onChange={this.onChange}
            />
        );
    }
}

InputNumber.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    maxLength: PropTypes.number,
};

export default InputNumber;
