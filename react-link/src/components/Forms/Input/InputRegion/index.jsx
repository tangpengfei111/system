/*
 * PageName: 输入框范围
 * Branch: 0
 * Autor: 张胜
 * Description:
 */
import React, {useState}from 'react'
import { Input, message } from 'antd'

export default function InputRegion(props){
    const {onChange} = props
    let { value = {} } = props
    if (typeof value === 'string') {
        value = JSON.parse(value)
        value.startTime = value.overTimeStart && value.overTimeStart
        value.endTime = value.overTimeEnd && value.overTimeEnd
    }
    const [startValue, setstartValue]=useState(value?.overTimeStart)
    const [endValue, setendValue]=useState(value?.overTimeEnd)
    /*
     * FunctionName: 超时开始回调
     * Author: 张胜
     * Description:
     */
     const handleOverTimeStart=(e) =>{
        const obj = {}
        //  let reg=/^(0|[1-9]\d{0,2})(\.\d{0,2})?$/
        //  if(reg.test(startValue)||startValue==''){
            if(value?.overTimeEnd===undefined){
                obj.overTimeStart=startValue
            }else if(startValue*1>value?.overTimeEnd){
                obj.overTimeStart=value?.overTimeEnd
                obj.overTimeEnd=startValue
                setendValue(startValue)
                setstartValue(value?.overTimeEnd)
            }else{
                obj.overTimeStart=startValue
                obj.overTimeEnd=value?.overTimeEnd
            }
            typeof onChange === 'function' && onChange(obj)
        //  }else{
        //      setstartValue(0)
        //      obj.overTimeStart=0
        //      obj.overTimeEnd=value?.overTimeEnd
        //      //typeof onChange === 'function' && onChange(obj)
        //      typeof onChange === 'function' && onChange(obj)
        //      //message.warn('请输入最多两位的小数')
        //  }
    }
    const timeStart=(e) => {
        let a=e.target.value.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1')
        // if(a.split('.').length===2){
        //     a=a.split('.')[1]===''?a.split('.')[0]:a
        // }
        setstartValue(a)
    }
    /*
     * FunctionName: 超时结束回调
     * Author: 张胜
     * Description:
     */
    const endStart=(e) => {
        let a=e.target.value.replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1')
        // if(a.split('.').length===2){
        //     a=a.split('.')[1]===''?a.split('.')[0]:a
        // }
        setendValue(a)
    }
    const handleOverTimeEnd=(e) => {
        const obj = {}
        //let reg=/^(0|[1-9]\d{0,2})(\.\d{0,2})?$/
       // let a=endValue.replace(/^\D*([1-9]\d*\.?\d{0,2})?.*$/, '$1')
         //if(reg.test(endValue)||endValue==''){
            if(value?.overTimeStart===undefined){
                obj.overTimeStart=endValue
            }else if(endValue*1>value?.overTimeStart){
                obj.overTimeStart=value?.overTimeStart
                obj.overTimeEnd=endValue
            }else{
                obj.overTimeStart=endValue
                obj.overTimeEnd=value?.overTimeStart
                setstartValue(endValue)
                setendValue(value?.overTimeStart)
            }
            typeof onChange === 'function' && onChange(obj)
        //  }else{
        //     setendValue(value?.overTimeStart)
        //     setstartValue(0)
        //     obj.overTimeStart=0
        //     obj.overTimeEnd=value?.overTimeStart
        //     typeof onChange === 'function' && onChange(obj)
        //     //message.warn('请输入最多两位的小数')
        //  }
    }
    return <div style={{display: 'flex', width: 180}}>
                <Input style={{flex: '1'}} value={startValue} onChange={timeStart} onBlur={handleOverTimeStart}/>-<Input style={{flex: '1'}} value={endValue} onBlur={handleOverTimeEnd} onChange={endStart}/>
            </div>
}
