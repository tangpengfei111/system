<template>
  <div class="search-box">
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="searchObj">
      <el-form-item
              v-for="(formItem,index) in formParams" :key="'formItem' + index"
              :label="formItem.noColon ? formItem.name : formItem.name + ':'"
      >
        <el-input
                v-if="formItem.type === 'input'"
                v-model="searchObj[formItem.value]"
                :placeholder="formItem.placeholder ? formItem.placeholder : '请输入搜索内容'"
        >
        </el-input>
        <el-select
                v-if="formItem.type === 'select'"
                v-model="searchObj[formItem.value]"
                :placeholder="formItem.placeholder ? formItem.placeholder : '请选择状态'"
        >
          <el-option
                  v-for="(item,index) in formItem.options" :key="index"
                  :label="item.label"
                  :value="item.value"
          >
          </el-option>
        </el-select>
        <el-date-picker
                v-if="formItem.type === 'date'"
                v-model="searchObj[formItem.value]"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :editable="false"
        >
        </el-date-picker>
        <!-- <el-date-picker
          v-if="formItem.type === 'date'"
          v-model="searchObj[formItem.value]"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker> -->
      </el-form-item>
      <el-form-item>
        <div class="search btn" @click="searchContent">搜索</div>
        <div class="reset btn" @click="resetContent">重置</div>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
    import utils from '@/lib/utils'
    export default {
        props: ["placeholder",'formParams'],
        data() {
            return {
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                // form1: [
                //   {
                //     type: 'input',
                //     name: '客户名称',
                //     noColon: false,
                //     value: 'name',
                //     placeholder: '请输入搜索内容'
                //   },
                //   {
                //     type: 'select',
                //     name: '状态',
                //     noColon: false,
                //     value: 'status',
                //     placeholder: '请选择状态',
                //     options: [
                //       { label: '可用', value: '0' },
                //       { label: '不可用', value: '1' }
                //     ]
                //   },
                //   {
                //     type: 'date',
                //     name: '日期',
                //     noColon: false,
                //     value: 'date',
                //   }
                // ],
                searchObj: {
                    name: '',
                    status: '',
                    date: utils.getNowDate(),
                    machineName: ''
                }
            };
        },
        methods: {
            searchContent() {
                this.$emit("searchContent", this.searchObj);
            },
            // 重置
            resetContent() {
                this.searchObj = {
                    name: '',
                    status: '',
                    date: utils.getNowDate(),
                    machineName: ''
                }
            }
        },
    };
</script>

<style lang="less" scoped>
  .search-box {
    width: 100%;
    height: 60px;
    margin: 0 0 5px 0;
    background: #f5f8fa;
    box-sizing: border-box;
    overflow: hidden;
  .el-form {
    width: 700px;
  .el-form-item {
    margin: 10px 0 10px 40px;
  }
  /deep/.el-input__inner {
    width: 150px;
    height: 30px;
    line-height: 30px;
    border-radius: 0;
    border: 1px solid #b6b6b6;
    outline: none;
  }
  /deep/.el-date-editor .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-date-editor.el-input {
    width: 150px;
  }
  }
  .btn {
    display: inline-block;
    width: 65px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-family: Microsoft Yahei;
    font-size: 14px;
    color: #f3f3f3;
    background: #1e79eb;
    margin: 5px 0;
    cursor: pointer;
  }
  .reset {
    margin-left: 10px;
  }
  }
</style>