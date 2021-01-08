/**
* ComponentName: Form组件集
* Author: 崔皓然
* Description:
* item：组件属性
* form：form组件对象
*/
import React from 'react'
import { Input, TextArea, InputPassword, InputRegion } from './Input'
import { Select, SelectInput, SelectSearch } from './Select'
import CheckboxButton from './CheckboxButton'
import Upload from './Upload'
import Label from './label'
import { DateRangePicker, DatePicker } from './DatePicker'

export default (props) => {
    let { item, values, form, key, handles } = props
    switch (item.type) {
        case 'selectInput': return (<SelectInput {...item} key={key} handles={handles} form={form} />)
        case 'checkboxButton': return (<CheckboxButton {...item} style={{ ...item.style }} key={key} />)
        case 'select': return (<Select {...item} style={{ minWidth: 100, ...item.style }} key={key} />)
        case 'textArea': return (<TextArea {...item} />)
        case 'input-pass': return (<InputPassword {...item} />)
        case 'upload': return (<Upload {...item} />)
        case 'datePicker': return (<DatePicker {...item} style={{ minWidth: 100, ...item.style }} key={key} />)
        case 'dateRangePicker': return (<DateRangePicker {...item} style={{ minWidth: 100, ...item.style }} key={key} />)
        case 'text': return (<Label style={{ ...item.style }}>{item.value}</Label>)
        case 'external': return (<div> {typeof item.content == 'function' && item.content({ item, values, key, form })} </div>)
        case 'link': return (<div key={key}><a target="_blank" href={values[item.name]}>{values[item.name]}</a></div>)
        case 'selectSearch': return (<SelectSearch style={{ minWidth: 100, ...item.style }} {...item} />)
        case 'custom': return (typeof item.Element === 'function' ? <item.Element {...props} key={key} /> : React.cloneElement(item.Element, { ...props }))
        case 'inputRegion': return (<InputRegion {...item} key={key} />)
        default: return (<Input {...item} key={key} />)
    }
}
