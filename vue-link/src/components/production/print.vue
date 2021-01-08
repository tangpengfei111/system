<!-- 打印 -->
<template>
    <div class="print_box">
        <div @click="print">打印</div>
        <el-dialog :visible.sync="dialogVisible" :before-close="handleClose">
            <div id="print">
                <div class="desc">
                    <span class="code">*20201103029078*</span>
                    <span class="label">染色工艺单</span>
                </div>
                <el-form :model="detailForm" label-width="80px">
                    <el-row
                        v-for="(row, rowIndex) in formItems"
                        :key="'row' + rowIndex"
                        :gutter="40"
                    >
                        <el-col
                            v-for="(item, index) in row"
                            :key="'item' + index"
                            :span="4"
                        >
                            <el-form-item :label="item.label" :prop="item.prop">
                                <div>{{detailForm[item.prop]}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                    size="mini"
                    :data="tableData1"
                    :border="true"
                >
                    <el-table-column
                        v-for="(item, index) in tableHeader1"
                        :key="'row' + index"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                        align="center"
                    ></el-table-column>
                </el-table>
                <el-table size="mini" :border="true" :data="tableData2">
                    <el-table-column
                        v-for="(item, index) in tableHeader2"
                        :key="'row' + index"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                        align="center"
                    >
                        <el-table-column
                            :prop="item.prop2"
                            :label="item.label2"
                            :width="item.width2"
                            align="center"
                        >
                            <el-table-column
                                v-for="(item, number) in tableHeader3"
                                :key="'three' + number"
                                :prop="item.prop + (index * 1 + 1)"
                                :label="item.label"
                                :width="item.width"
                                align="center"
                            >
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: [],
    data() {
        return {
            dialogVisible: false,
            formItems: [
                [
                    { label: "单号", prop: "oddNum" },
                    { label: "色号", prop: "colorCode" },
                    { label: "颜色", prop: "color" },
                ],
                [
                    { label: "客户", prop: "customerName" },
                    { label: "机台号", prop: "machineNum" },
                    { label: "订单号", prop: "id" },
                    { label: "打色员", prop: "colorist" },
                ],
                [
                    { label: "规格", prop: "spec" },
                    { label: "计划量kg", prop: "plan" },
                    { label: "测试", prop: "index" },
                    { label: "溶比", prop: "ratio" },
                    { label: "缸号", prop: "crock" },
                ],
            ],
            detailForm: {
                id: "11111",
                oddNum: "2222",
                customerName: "东方",
                machineNum: "xxxx01",
                colorCode: "",
                color: "",
                colorist: "里哈哈",
                spec: "1箱",
                plan: "55",
                index: "1",
                ratio: "5",
                crock: "",
            },
            tableHeader1: [
                { label: "材料名称", prop: "id", width: 150 },
                { label: "配方", prop: "customerName", width: 150 },
                { label: "详细信息", prop: "goods", width: 150 },
                { label: "备注", prop: "remark", width: 250 },
            ],
            tableData1: [
                {
                   id: '11111',
                   customerName: "22222",
                   goods: '33333',
                   remark: ''
                },
                {
                   id: '11111',
                   customerName: "22222",
                   goods: '33333',
                   remark: ''
                },
                {
                   id: '11111',
                   customerName: "22222",
                   goods: '33333',
                   remark: ''
                },
                {
                   id: '11111',
                   customerName: "22222",
                   goods: '33333',
                   remark: ''
                },
                {
                   id: '11111',
                   customerName: "22222",
                   goods: '33333',
                   remark: ''
                }
            ],
            tableHeader2: [
                { 
                    label: "染色工艺代号", prop: "xx",
                    label2: "染色助剂", prop2: "xxx",
                },
                { 
                    label: "前处理工艺代号", prop: "ll",
                    label2: "前处理剂", prop2: "lll" 
                },
                { 
                    label: "后处理工艺代号", prop: "cc",
                    label2: "后处理剂", prop2: "ccc" 
                },
            ],
            tableHeader3: [
                {label: "助剂名称", prop: "name", width: 150},
                {label: "配方", prop: "peifang", width: 150},
                {label: "实际重KG", prop: "zhongliang", width: 150},
            ],
            tableData2: [
                {
                   'name1': 'yaojiao',
                   'peifang1': "xxxxx",
                   'zhongliang1': '15',
                   'name2': 'ceshi',
                   'peifang2': "88888",
                   'zhongliang2': '25',
                   'name3': 'lalal',
                   'peifang3': "00000",
                   'zhongliang3': '35',
                },
                {
                   'name1': 'yaojiao',
                   'peifang1': "xxxxx",
                   'zhongliang1': '15',
                },
                {
                   'name1': 'yaojiao',
                   'peifang1': "xxxxx",
                   'zhongliang1': '15',
                },
                {
                   'name1': 'yaojiao',
                   'peifang1': "xxxxx",
                   'zhongliang1': '15',
                },
            ],
        };
    },
    methods: {
        handleClose() {
            this.dialogVisible = false;
        },
        print() {
            this.dialogVisible = true
            setTimeout(() => {
                console.log('#print', $("#print"))
                // $("#print").jqprint({
                //     importCSS: true
                // });  
            }, 1000)
        }
    },
};
</script>

<style lang='less' scoped>
.print_box {
    /deep/.el-dialog__wrapper {
        min-width: 1100px;
        overflow: hidden;
        .el-dialog {
            margin-top: 0 !important;
            width: 100%;
            height: 100%;
            .el-dialog__header {
                padding: 0;
            }
        }
        .el-form-item {
            height: 26px;
            margin-bottom: 4px;
            .el-form-item__label {
                text-align: left;
                line-height: 26px;
            }
            .el-form-item__content {
                text-align: left;
                line-height: 26px;
            }
        }
    }
    #print {
        .desc {
            line-height: 40px;
            margin-bottom: 16px;
            .code {
                font-size: 22px;
            }
            .label {
                margin-left: 10px;
                letter-spacing: 12px;
            }
        }
        .el-row {
            &:last-child {
                margin-bottom: 0;
            }
        }
        .el-col {
            border-radius: 4px;
        }
        /deep/ .el-table th { 
            height: 30px;
            line-height: 30px;
        }
        /deep/ .el-table td {
            height: 30px;
        }

        /deep/ .el-table--border, .el-table--group {
            border: 0px;
        }
        /deep/ .el-table thead tr {
            td:nth-child(1) {
                border-left: 1px solid #858686;
            }
        }
        /deep/ .el-table--border th {
            border-style: solid;
            border-width: 1px 1px 0 0;
            border-color: #858686 #858686 transparent transparent;
        }
        /deep/ tbody tr td {
            border-style: solid;
            border-width: 1px;
            border-color: #858686 #858686 transparent transparent;
        }
    }
}
@media print {
    @page {
        size: auto;
    }

    * {
        page-break-after: initial !important;
        color: #000!important;
        font-family: sans-serif !important;
        font-size: 10px!important;
    }
    .fs16-print{
        font-size: 16px!important;
        font-weight: bold;
    }
    .fs16-print span{
        font-size: 10px!important;
        font-weight: initial;
    }
    #print {
        width: 100%;
        margin: 0 !important;
        padding: 5px !important;
    }
    #print th,
    #print td {
        word-break: break-all;
    }

    #print th div,
    #print td div {
        width: auto !important;
    }
    /* #print .el-table table {
        border-color: black !important;
    } */
    
    #print .el-table td {
        font-size: 10px;
        padding: 2px !important;
        text-align: center;
        border-color: black !important;
    }
    /* #print .el-table th {
        font-size: 10px;
        padding: 2px !important;
        text-align: center;
        border-color: black !important;
    } */

    #print .el-table th {
        font-size: 14px !important;
    }
    #print .el-table-wrapper{
        margin: 2px 0!important;
    }


    #print .desc {
        line-height: 40px;
        margin-bottom: 16px;
    }
    #print .desc .code {
        font-size: 22px;
    }
    #print .desc .label {
        margin-left: 10px;
        letter-spacing: 12px;
    }
    #print .el-table th { 
        height: 30px;
        line-height: 30px;
    }
    #print .el-table td {
        height: 30px;
    }
    #print .el-table--border, .el-table--group {
        border: 0px;
    }
    #print .el-table thead tr td:nth-child(1) {
        border-left: 1px solid #858686;
    }
    #print .el-table--border th {
        border-style: solid;
        border-width: 1px 1px 0 0;
        border-color: #858686 #858686 transparent transparent;
    }
    #print tbody tr td {
        border-style: solid;
        border-width: 1px;
        border-color: #858686 #858686 transparent transparent;
    }
}
</style>

