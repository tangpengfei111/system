<template>
    <div class="report">
        <div class="header">
            <div class="title">
                <div>{{this.$route.meta.til}}</div>
            </div>
        </div>
        <my-search style="float:left" @searchContent="searchContent" :formParams="formParams"></my-search>
        <el-table
                :data="tableData"
                :height="browserAttr.height - 265"
                :header-cell-style="{background: '#EFF3F6', color: '#354053'}"
                style="width: 100%"
        >
            <el-table-column
                    v-for="(item,index) in tableHeader"
                    :key="'row' + index"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    align="center"
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.isEditor && item.editor">
                        <div v-if="item.label == '交货日期'">
                            <el-date-picker
                                    v-model="scope.row.transactionDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    :editable="false"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </div>
                        <div v-if="item.label == '客户'">
                            <el-select v-model="scope.row[item.prop]" placeholder="请选择客户">
                                <el-option
                                        v-for="item in customList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div v-if="item.label == '商品'">
                            <input type="text" v-model="scope.row[item.prop]">
                        </div>
                        <div v-if="item.label == '金额' || item.label == '需求量'">
                            <input type="text"
                                   v-model="scope.row[item.prop]"
                                   @keyup="checkNumber"
                                   @blur="blurInput"
                            >
                        </div>
                    </div>
                    <div v-if="!scope.row.isEditor || !item.editor">
                        <div v-if="item.label !== '状态'">{{scope.row[item.prop]}}</div>
                        <div v-if="item.label == '状态' && !scope.row.stateIsEditor">{{scope.row[item.prop]}}</div>
                        <div v-if="item.label == '状态' && scope.row.stateIsEditor">
                            <el-select v-model="scope.row.status" placeholder="请选择状态">
                                <el-option
                                        v-for="item in statusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" @click="viewPlan(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import search from '@/components/common/advancedSearch.vue';
export default {
    components: {
        'my-search': search
    },
    data() {
        return {
            browserAttr: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            tableData: [],
            tableHeader: [
                // {label: '订单编号', prop: 'orderNumber', editor: false},
                {label: '客户', prop: 'customerName', editor: false },
                {label: '商品', prop: 'goods', editor: true },
                {label: '需求量', prop: 'productionSummary', editor: true },
                {label: '金额', prop: 'amount', editor: true },
                {label: '状态', prop: 'state', editor: false },
                {label: '交货日期', prop: 'transactionDate', editor: true, width: 180}
            ],
            orderStatusOptions: {
                0: "完成",
                1: "打开",
                2: "正在生产中",
                99: "暂停"
            },
            formParams: [
                {
                    type: 'input',
                    name: '客户名称',
                    noColon: false,
                    value: 'name'
                },
                {
                    type: 'select',
                    name: '状态',
                    noColon: false,
                    value: 'status',
                    options: [
                        { label: '打开', value: '1' },
                        { label: '正在生产中', value: '2' },
                        { label: '完成', value: '0' },
                        { label: '暂停', value: '99' }
                        //    OPENING(1),//打开
                        //    PRODUCTION(2),//正在生产中
                        //    DONE(0),//完成
                        //    IDLE(99);//暂停
                    ]
                }
            ],
        };
    },
    created() {
        this.getTableData();
    },
    mounted() {
        this.browserResize();
    },
    methods: {
        // 监听窗口大小改变
        browserResize() {
            window.onresize = () => {
                this.browserAttr.width = window.innerWidth;
                this.browserAttr.height = window.innerHeight;
            };
        },
        searchContent(options) {
            let option = {
                name: options?.name || '',
                status: options?.status || ''
            }
            this.getTableData(option);
        },
        // 获取表格数据
        getTableData(options) {
            let params = {
                pageNo: 1,
                size: 1000,
            };
            if (options) {
                params.search = JSON.stringify(options);
            }
            this.$http.post('/orderController/queryOrder',params).then(res => {
                if (res.data.code == 0 && res.data.message == '操作成功') {
                    this.tableData = res.data.data.records.map((item,index) => {
                        //  将status码 转成 state 汉语标签
                        item.state = this.orderStatusOptions[item.status];
                        item.index = index + 1;
                        return item;
                    });
                }else {
                    this.tableData = [];
                }
            }).catch(error => {
                console.log('失败原因:' + error);
            });
        },
        // 查看计划
        viewPlan(row) {
            this.$router.push({
                path: '/proplan',
                query: {
                    orderId: row.id,
                    type: 'report'
                }
            });
        },
    }

}
</script>

<style lang="less" scoped>
.report {
  height: 100%;
  padding: 0 30px;
  .header {
    position: relative;
    height: 65px;
    .title {
      position: absolute;
      top: 22px;
      left: 0;
      height: 20px;
      line-height: 20px;
      div {
        display: inline-block;
        &:nth-child(1) {
          padding-right: 15px;
          font-family: SimHei;
          font-size: 16px;
          color: #354052;
        }
        &:nth-child(2) {
          padding-left: 10px;
          font-family: Microsoft Yahei;
          font-size: 14px;
          color: #74797f;
          border-left: 1px solid #90959a;
        }
      }
    }
  }
  .list {
    height: calc(100% - 65px);
    border: 1px solid red;
    box-sizing: border-box;
    .list-item {
      width: 150px;
      height: 60px;
      border: 1px solid red;
    }
  }
  .el-table {
    input {
      width: 80%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      outline: none;
      padding: 0 5px;
      box-sizing: border-box;
    }
    .el-button {
      padding: 4px 8px;
    }
  }
  .dialog-box {
    background-color: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    .dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px 20px;
      box-sizing: border-box;
      width: 400px;
      height: 350px;
      background-color: #ffffff;
      .title {
        overflow: hidden;
        height: 30px;
        .title-label {
          float: left;
          width:100%;
          height: 30px;
          line-height: 30px;
          text-align: left;
          font-family: Microsoft Yahei;
          font-size: 18px;
          span {
            font-size: 16px;
          }
        }
        .export {
          float: right;
          width: 50px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-family: Microsoft Yahei;
          font-size: 14px;
          color: #f3f3f3;
          background: #1e79eb;
          border-radius: 4px;
        }
      }
      .content-item {
        width: 100%;
        margin: 20px auto;
        box-sizing: border-box;
        .item-label {
          display: inline-block;
          width: 70px;
          color: #606266;
          font-size: 14px;
        }
        .item-label.reason {
          height: 54px;
          line-height: 54px;
        }
        .el-select {
          width: 180px;
          margin-left: 10px;
        }
        .el-input__inner {
          width: 180px;
        }
        .el-textarea {
          width: 180px;
          margin-left: 10px;
        }
        input {
          width: 180px;
          margin-left: 10px;
          outline-color: #409EFF;
          &::-webkit-input-placeholder {
            font-family: Microsoft YaHei;
            font-size: 14px;
            font-weight: 500;
            color: #a9adb3;
          }
        }
        input:focus {
          border-color: #409EFF;
        }
      }
    }
    .footer {
      position: absolute;
      bottom: 25px;
      right: 30px;
    }
  }
}
</style>