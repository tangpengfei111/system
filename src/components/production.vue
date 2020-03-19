<template>
  <div class="production">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '订单管理'}}</div>
        <div>总计 {{totalNum}} 条数据</div>
      </div>
      <div class="func-bar">
        <my-search style="float:left" @searchContent="searchContent"></my-search>
        <div class="add btn" @click="addRow">新建订单</div>
      </div>
    </div>
    <el-table
      :data="tableList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :height="browserAttr.height - 200"
      :header-cell-style="{background: '#EFF3F6', color: '#354053'}"
      style="width: 100%"
      border
    >
      <el-table-column
        v-for="(item,index) in tableHeader"
        :key="'row' + index"
        :prop="item.prop"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.isEditor">
            <input type="text" v-model="scope.row[item.prop]" />
          </div>
          <div v-if="!scope.row.isEditor">{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="scope">
          <div v-if="!scope.row.isEditor">
            <el-button size="mini" @click="editorRow(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </div>
          <div v-if="scope.row.isEditor">
            <el-button size="mini" @click="sureEditor(scope.row)">确定</el-button>
            <el-button size="mini" @click="cancelEditor(scope.row)">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page.sync="currentPage"
      :total="totalNum"
      :page-size="pageSize"
      :page-count="5"
      @current-change="tableChangePage"
      layout="prev, pager, next, jumper"
      >
    </el-pagination>
    <div class="loading dialog-box" v-if="childPageIsShow">
      <div class="dialog">
        <div class="content-item">
          <!-- <div class="username">用户名</div>
          <input v-model="userObj.name" placeholder="请填写用户名"> -->
        </div>
        <div class="content-item">
          <div class="custom">客户</div>
          <el-select v-model="params.custom" placeholder="请选择客户">
            <el-option
              v-for="item in customList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="content-item">
          <div class="goods">商品</div>
          <el-select v-model="params.goods" placeholder="请选择客户">
            <el-option
              v-for="item in goodsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="footer">
          <el-button @click="cancelCreateUser">取消</el-button>
          <el-button type="primary" @click="sureCreateUser">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      childPageIsShow: false,
      currentPage: 1, // 表格当前页码
      pageSize: 50, // 表格每一页展示数据的数量
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      tableList: [],
      tableHeader: [
        {label: '订单编号', prop: 'orderNumber'},
        {label: '客户', prop: 'custom'},
        {label: '商品', prop: 'goods'},
        {label: '数量', prop: 'requirement'},
        {label: '金额', prop: 'money'},
        {label: '交货日期', prop: 'deliveryDate'},
        {label: '制单日期', prop: 'orderDate'},
      ],
      params: {                    // 子页面参数
        custom: '',
        goods: '',
      },
      customList: [            // 客户列表
        { label: '客户1', value: '客户1' },
        { label: '客户2', value: '客户2' },
        { label: '客户3', value: '客户3' },
      ],
      goodsList: [             // 商品列表
        { label: '商品1', value: '商品1' },
        { label: '商品2', value: '商品2' },
        { label: '商品3', value: '商品3' },
      ]
    };
  },
  mounted() {
    this.browserResize();
  },
  beforeDestroy() {
    window.onresize = null;
  },
  computed: {
    totalNum() {
      return this.tableList.length;
    }
  },
  methods: {
    // 表格 行的样式
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "odd-number";
      } else {
        return "even-number";
      }
    },
    // 监听窗口大小改变
    browserResize() {
      window.onresize = () => {
        this.browserAttr.width = window.innerWidth;
        this.browserAttr.height = window.innerHeight;
        console.log("监听窗口改变111");
      };
    },
    // 表格当前页改变
    tableChangePage(nowPage) {
      this.currentPage = nowPage;
    },
    searchContent() {},
    addRow() {},
     // 取消创建
    cancelCreate() {
      this.childPageIsShow = false;
      this.params = {
        name: '',
        no: '',
      }
    },
    // 确定创建
    sureCreate() {
      let obj = {};
      this.tableHeader.forEach(item => {
        obj[item.prop] = '';
      });
      obj.isEditor = true;
      this.tableData.unshift(obj);
      let user = JSON.parse(sessionStorage.getItem('user'));
      let createAt = user.name;
      console.log(createAt)
      // 添加色号请求
      // this.$http.post('/colorController/addColor',{

      // }).then(res => {
      //   console.log('res',res);
      //   if (res.data.code == 0 && res.data.message == 'success') {

      //   }
      // }).catch(error => {
      //   console.log('失败原因:' + error);
      // })
      
      this.childPageIsShow = false;
      this.params = {
        name: '',
        no: '',
      }
    },
    // 编辑行
    editorRow(row) {
      let flag = this.tableData.some(item => {
        return item.isEditor;
      });
      if (flag) {
        this.$message({
          showClose: true,
          message: '已经存在编辑项，请完成后再继续操作'
        });
      }else {
        this.copyRow = JSON.parse(JSON.stringify(row));
        row.isEditor = true;
        // 编辑色号请求
        // this.$http.post('/colorController/removeColor',{

        // }).then(res => {
        //   console.log('res',res);
        //   if (res.data.code == 0 && res.data.message == 'success') {

        //   }
        // }).catch(error => {
        //   console.log('失败原因:' + error);
        // })
      }
    },
    // 删除行
    deleteRow(index) {
      this.tableData.splice(index,1);
    },
    // 确定编辑
    sureEditor(row) {
      row.isEditor = false;
    },
    // 取消编辑
    cancelEditor(row) {
      for (let k in this.copyRow) {
        row[k] = this.copyRow[k]
      }
    }
    
  }
};
</script>

<style lang="less" scoped>
.production {
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
    .func-bar {
      position: absolute;
      top: 15px;
      right: 0;
      width: 330px;
      overflow: hidden;
      .add {
        float: right;
        width: 35px;
        height: 35px;
        margin-right: 10px;
        box-sizing: border-box;
        background-image: url("../assets/image/add-icon.png");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 25px 25px;
      }
      .btn {
        float: right;
        width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 0 0 0 10px;
        font-family: Microsoft Yahei;
        font-size: 12px;
        color: #f3f3f3;
        background: #009AFE;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  .el-table {
    input {
      width: 80%;
      height: 25px;
      line-height: 25px;
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
      padding: 20px 35px;
      box-sizing: border-box;
      width: 400px;
      height: 300px;
      background-color: #ffffff;
      .content-item {
        width: 100%;
        margin: 20px auto;
        box-sizing: border-box;
        div {
          display: inline-block;
          width: 80px;
          color: #606266;
          font-size: 14px;
        }
        input {
          width: 160px;
          margin-left: 10px;
          &::-webkit-input-placeholder {
            font-family: Microsoft YaHei;
            font-size: 14px;
            font-weight: 500;
            color: #a9adb3;
          }
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