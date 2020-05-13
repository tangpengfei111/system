<template>
  <div class="search-box">
    <el-form :inline="true" class="demo-form-inline" ref="form" :model="form">
      <!-- <el-form-item label="客户名称:">
        <el-input v-model="searchObj.name" :placeholder="form.namePlaceholder"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="searchObj.status" :placeholder="form.statusPlaceholder">
          <el-option
            v-for="(item,index) in form.statusOptions" :key="index"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item 
        v-for="(formItem,index) in form1" :key="'formItem' + index"
        :label="formItem.name + (formItem.colon ? '：' : null)"
      >
        <el-input 
          v-if="formItem.type === 'input'" 
          v-model="searchObj[formItem.value]" 
          :placeholder="formItem.placeholder"
          >
        </el-input>
        <el-select
          v-if="formItem.type === 'select'" 
          v-model="searchObj[formItem.value]" 
          :placeholder="formItem.placeholder"
          >
          <el-option
            v-for="(item,index) in formItem.options" :key="index"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="search btn" @click="searchContent">搜索</div>
        <div class="reset btn" @click="resetContent">重置</div>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  props: ["placeholder",'formParams'],
  data() {
    return {
      defaultForm: {
        namePlaceholder: '请输入搜索内容',
        statusPlaceholder: '请选择状态',
        statusOptions: [
            { label: '可用', value: '0' },
            { label: '不可用', value: '1' }
        ]
      },
      form1: [
        {
          type: 'input',
          name: '客户名称',
          colon: true,
          value: 'name',
          placeholder: '请输入搜索内容'
        },
        {
          type: 'select',
          name: '状态',
          colon: true,
          value: 'status',
          placeholder: '请选择状态',
          options: [
            { label: '可用', value: '0' },
            { label: '不可用', value: '1' }
          ]
        }
      ],
      searchObj: {}
    };
  },
  created() {
    this.searchObj = {};
    this.form1.forEach(item => {
      this.searchObj[item.value] = '';
    })

  },
  methods: {
    searchContent() {
      this.$emit("searchContent", this.searchObj);
    },
     // 重置
    resetContent() {
      this.searchObj = {
        name: null,
        status: null
      }
    }
  },
  computed: {
    form() {
      let target = this._.cloneDeep(this.formParams) || {};
      return Object.assign(this.defaultForm,target);
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
    // /deep/.el-form-item__label {
    //     width: 100px;
    // }
    /deep/.el-input__inner {
      width: 150px;
      height: 30px;
      line-height: 30px;
      border-radius: 0;
      border: 1px solid #b6b6b6;
      outline: none;
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