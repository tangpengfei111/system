/*
 * ComponentName: 日期范围选择器
 * Branch: 0
 * Autor: 唐鹏飞
 * Description:
 */
import { useEffect } from 'react'
import { DatePicker, Select } from 'antd'
import moment from 'moment'
import Style from './style.less'

export default function DateRangePicker(props) {
    const { width = {}, onChange, placeholder = {}, isPattern = true } = props
    let { value = {} } = props
    if (typeof value === 'string') {
        value = JSON.parse(value)
        if (typeof value === 'string') {
            value = JSON.parse(value)
        }
        value.startTime = value.startTime ? moment(value.startTime) : null
        value.endTime = value.endTime ? moment(value.endTime) : null
    }
    const { startTime = null, endTime = null, rangeType } = value
    const options = [
        { label: '时间', value: 'time' },
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '本周', value: 'weekend' },
        { label: '上周', value: 'lastWeekend' },
        { label: '本月', value: 'month' },
        { label: '上月', value: 'lastMonth' },
        { label: '本季', value: 'season' },
        { label: '上季', value: 'lastSeason' },
        { label: '今年', value: 'year' }
    ]

    useEffect(() => {
        dateTypeChange(value?.rangeType || '')
    }, [])

    /*
     * FunctionName: 选择范围类型
     * Author: 唐鹏飞
     * Description:
     */
    function dateTypeChange(type) {
        let start = startTime, end = endTime
        switch (type) {
            case 'today':
                start = moment().startOf('day')
                end = moment().endOf('day')
                break
            case 'yesterday':
                start = moment().add(-1, 'days').startOf('day')
                end = moment().add(-1, 'days').endOf('day')
                break
            case 'weekend':
                start = moment().startOf('week')
                end = moment().endOf('week')
                break
            case 'lastWeekend':
                start = moment().add(-1, 'week').startOf('week')
                end = moment().add(-1, 'week').endOf('week')
                break
            case 'month':
                start = moment().startOf('month')
                end = moment().endOf('month')
                break
            case 'lastMonth':
                start = moment().add(-1, 'month').startOf('month')
                end = moment().add(-1, 'month').endOf('month')
                break
            case 'season':
                start = moment().set('month', (Math.ceil(parseInt(moment().format('M')) / 3) - 1) * 3).set('date', 1)
                end = moment()
                break
            case 'lastSeason':
                start = moment().set('month', (Math.ceil(parseInt(moment().format('M')) / 3) - 1) * 3 - 3).set('date', 1)
                end = moment().set('month', (Math.ceil(parseInt(moment().format('M')) / 3) - 1) * 3 - 1).endOf('month')
                break
            case 'year':
                start = moment().startOf('year')
                end = moment().endOf('year')
                break
            default:
                break
        }
        let obj = {
            rangeType: type,
            startTime: start,
            endTime: end
        }
        typeof onChange === 'function' && onChange(obj)
    }
    /*
     * FunctionName: 开始时间改变回调
     * Author: 唐鹏飞
     * Description:
     */
    function handleStartDate(date) {
        let obj = {
            rangeType,
            startTime: date,
            endTime: date && endTime && date > endTime ? date : endTime
        }
        typeof onChange === 'function' && onChange(obj)
    }
    /*
     * FunctionName: 停止时间改变回调
     * Author: 唐鹏飞
     * Description:
     */
    function handleEndDate(date) {
        let obj = {
            rangeType,
            startTime: startTime && date && date < startTime ? date : startTime,
            endTime: date
        }
        typeof onChange === 'function' && onChange(obj)
    }
    return (
        <div className={Style.dateRangePicker}>
            <DatePicker
                format={'YYYY-MM-DD'}
                value={startTime}
                allowClear={false}
                onChange={handleStartDate}
                style={{
                    width: width.start
                }}
                placeholder={
                    placeholder.start || '请选择日期'
                }
            />
            <label className={Style.label}>至</label>
            <DatePicker
                format={'YYYY-MM-DD'}
                value={endTime}
                allowClear={false}
                onChange={handleEndDate}
                style={{
                    width: width.end
                }}
                placeholder={
                    placeholder.end || '请选择日期'
                }
            />
            {isPattern ? <Select
                value={rangeType}
                className={Style.select}
                onSelect={dateTypeChange}
            >
                {
                    options.map((option, index) => {
                        return <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
                    })
                }
            </Select> : null}
        </div>
    )
}
