/*
 * PageName: 上传组件
 * Branch: 0
 * Autor: 崔皓然
 * Description:
 */
import React from 'react'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload

export default function ZlUpload(props) {
    let { btnName = '上传' } = props
    const constProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text'
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log('uploading -> info', info)
            }
            if (info.file.status === 'done') {
                console.log('done -> info', info)
            } else if (info.file.status === 'error') {
                console.log('error -> info', info)
            }
        },
        ...props
    }
    return (
        <div>
            <Upload {...constProps}>
                <Button><UploadOutlined />{btnName}</Button>
            </Upload>

            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
            </Dragger>
        </div>
    )
}
