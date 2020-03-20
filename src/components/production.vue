<template>
  <div class="production">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '订单管理'}}</div>
        <!-- <div>总计 {{totalNum}} 条数据</div> -->
      </div>
      <div class="func-bar">
        <my-search style="float:left" @searchContent="searchContent"></my-search>
        <div class="add btn" @click="addOrder">新建订单</div>
      </div>
    </div>
    <!-- :row-class-name="tableRowClassName" -->
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :height="browserAttr.height - 200"
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
                v-model="scope.row.deliveryDate"
                type="datetime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
            <div v-if="item.label !== '交货日期'">
              <input type="text" v-model="scope.row[item.prop]">
            </div>
          </div>
          <div v-if="!scope.row.isEditor || !item.editor">
            <div v-if="item.label !== '生产计划'">{{scope.row[item.prop]}}</div>
            <div v-if="item.label == '生产计划'">
              <div v-if="!scope.row.productionPlan">
                <el-button size="mini" :disabled="scope.row.isEditor" @click="createPlan(scope.row)">创建</el-button>
              </div>
              <div v-if="scope.row.productionPlan">
                <el-button size="mini" :disabled="scope.row.isEditor" @click="viewPlan(scope.row)">查看</el-button>
                <el-button size="mini" :disabled="scope.row.isEditor" @click="editorPlan(scope.row)">修改</el-button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
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
    <div class="pagination">
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
      <div class="data-show">共{{Math.floor(totalNum/pageSize)}}页，每页{{pageSize}}条数据</div>
    </div>
   
    <div class="loading dialog-box" v-if="childPageIsShow">
      <div class="dialog">
        <div class="title">
          <div class="title-label">生产计划</div>
          <!-- <div class="export">导出</div> -->
        </div>
        <el-form 
          :inline="true"
          class="demo-form-inline"
          ref="form" 
          :model="planParams" 
          label-width="80px"
          >
          <el-form-item label="订单编号">
            <el-input v-model="planParams.orderNumber" :disabled='true'></el-input>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="生产商品">
            <el-input v-model="planParams.goods" :disabled='true'></el-input>
          </el-form-item>
          <el-form-item label="生产数量">
            <el-input v-model="planParams.requirement" :disabled='true'></el-input>
          </el-form-item>
          <el-form-item label="设备">
            <el-select v-model="planParams.machine" placeholder="请选择设备">
              <el-option label="设备1" value="设备1"></el-option>
              <el-option label="设备2" value="设备2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="色号">
            <el-select v-model="planParams.color" placeholder="请选择色号">
              <el-option label="蓝色" value="blue"></el-option>
              <el-option label="红色" value="red"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原料">
            <el-select v-model="planParams.material" placeholder="请选择原料">
              <el-option label="原料1" value="原料1"></el-option>
              <el-option label="原料2" value="原料2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原料数量">
            <el-input v-model="planParams.materialNum" placeholder="请填写原料数量"></el-input>
          </el-form-item>
          <el-form-item label="染化剂">
            <el-select v-model="planParams.dyeAgent" placeholder="请选择染化剂">
              <el-option label="染化剂1" value="染化剂1"></el-option>
              <el-option label="染化剂2" value="染化剂2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="染化剂数量">
            <el-input v-model="planParams.dyeAgentNum" placeholder="请填写染化剂数量"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="surePlan">立即创建</el-button>
            <el-button @click="cancelPlan">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import search from '@/components/common/search.vue';
import utils from '@/lib/utils.js';
export default {
  components: {
    'my-search': search
  },
  data() {
    return {
      eidtorState: 'add',
      childPageIsShow: false,
      currentPage: 1, // 表格当前页码
      pageSize: 50, // 表格每一页展示数据的数量
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      copyRow: {},
      tableData: [],
      tableHeader: [
        {label: '订单编号', prop: 'orderNumber', editor: false},
        {label: '客户', prop: 'custom', editor: true },
        {label: '商品', prop: 'goods', editor: true },
        {label: '需求量', prop: 'requirement', editor: true },
        {label: '金额', prop: 'money', editor: true },
        {label: '交货日期', prop: 'deliveryDate', editor: true, width: 210},
        {label: '生产计划', prop: 'productionPlan', editor: false, width: 180 },
        // {label: '制单日期', prop: 'orderDate'},
      ],
      planParams: {                    // 子页面参数
        machine: '',
        color: '',
        material: '',
        materialNum:'',
        dyeAgent: '',
        dyeAgentNum: '',
        orderNumber: '',
        goods: '',
        requirement: ''
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
    for (let i = 0; i < 100; i++) {
      let obj = JSON.parse(JSON.stringify({
        orderNumber: 'xasdasd1',
        custom: '客户1',
        goods: '商品1',
        requirement: 50,
        money: '3000',
        deliveryDate: '2019-05-03',
        productionPlan: 1,
        isEditor: false
      }));
      obj.index = i + 1;
      this.tableData.push(obj);
    }
  },
  beforeDestroy() {
    window.onresize = null;
  },
  computed: {
    totalNum() {
      return this.tableData.length;
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
    // 添加订单
    addOrder() {
      this.eidtorState = 'add';
      let flag = this.tableData.some(item => {
        return item.isEditor;
      });
      if (flag) {
        this.$message({
          showClose: true,
          message: '已经存在编辑项，请完成后再继续操作'
        });
      }else {
        let obj = {};
        this.tableHeader.forEach(item => {
          obj[item.prop] = '';
        });
        obj.orderNumber = '系统自动生成';
        obj.isEditor = true;
        this.tableData.unshift(obj);
      }
    },
    // 确定编辑（创建）
    sureEditor(row) {
      if (row.custom.trim() === '' || row.goods.trim() === '' || row.requirement.trim() === '' || row.money.trim() === '' || row.deliveryDate.trim() === ''){
        this.$message({
          message: '请填写客户、商品、需求量、金额、交货日期等信息'
        })
        return;
      }
      if (this.eidtorState === 'add') {
        let letter = 'qwertyuiopasdfghjklzxcvbnm';
        let number = '0123456789';
        let str = '';
        for(let i = 0; i < 8; i++) {
          if (i < 2) {
            str += letter[Math.round(Math.random() * 25)];
          }else {
            str += number[Math.round(Math.random() * 9)]
          }
        }
        row.orderNumber = str;
      }else {

      }
      row.isEditor = false;
    },
    // 取消编辑（创建）
    cancelEditor(row) {
      for (let k in this.copyRow) {
        row[k] = this.copyRow[k]
      }
    },
    // 编辑行
    editorRow(row) {
      this.eidtorState = 'editor';
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
      }
    },
    // 删除行
    deleteRow(index) {
      this.tableData.splice(index,1);
    },
    // 显示子页面
    showChildPage(row) {
      this.copyRow = row;
      this.planParams.orderNumber = row.orderNumber;
      this.planParams.goods = row.goods;
      this.planParams.requirement = row.requirement;
      this.childPageIsShow = true;
    },
    // 创建计划
    createPlan(row) {
      this.showChildPage(row);
    },
    // 编辑计划
    editorPlan(row) {
      this.showChildPage(row);
    },
    // 查看计划
    viewPlan(row) {
      if (row.productionPlan && row.productionPlan.orderNumber) {
        this.planParams = this._.cloneDeep(row.productionPlan);
        this.childPageIsShow = true;
        
      }else {
        this.showChildPage(row);
      }
      console.log(this.planParams)
    },
    // 取消创建
    cancelPlan() {
      this.childPageIsShow = false;
      for (let k in this.planParams) {
        this.planParams[k] = ''
      }
    },
    // 确定创建
    surePlan() {
      this.copyRow.productionPlan = this._.cloneDeep(this.planParams);
      this.childPageIsShow = false;
      for (let k in this.planParams) {
        this.planParams[k] = ''
      }
      
    },
    onSubmit() {
      console.log('submit!');
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
        background: #1e79eb;
        // background: #009AFE;
        border-radius: 4px;
        cursor: pointer;
      }
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
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 80%;
      height: 30px;
      line-height: 30px;
    }
    /deep/.el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    /deep/.el-input__icon {
      line-height: 30px;
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
      // width: 400px;
      // height: 300px;
      background-color: #ffffff;
      .title {
        overflow: hidden;
        height: 30px;
        .title-label {
          float: left;
          width: 80px;
          height: 30px;
          line-height: 30px;
          font-family: Microsoft Yahei;
          font-size: 18px;
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
      .el-form {
        padding: 20px 30px 0 30px;
        width: 500px;
        .el-form-item {
          width: 240px;
          margin-bottom: 16px;
        }
        /deep/.el-form-item__label {
          width: 100px !important;
          background-color: rgb(223, 232, 251);
          text-align: center;
          padding: 0 12px;
          border-color: #dcdfe6;
          color: #303133;
          font-weight: bold;
          border: 1px solid #b6b6b6;
          box-sizing: border-box;
          height: 40px;
          border-right: none;
        }
        /deep/.el-input__inner {
          border-radius: 0;
          border: 1px solid #b6b6b6;
          outline: none;
        }
        /deep/.el-form-item__content {
          width: calc(100% - 100px);
          margin-left: 0px !important;
        }
        .el-form-item:nth-last-child(1) {
          width: 100%;
          margin: 20px 0 10px 0;
        }
      }
      // .content-item {
      //   width: 100%;
      //   margin: 20px auto;
      //   box-sizing: border-box;
      //   div {
      //     display: inline-block;
      //     width: 80px;
      //     color: #606266;
      //     font-size: 14px;
      //   }
      //   input {
      //     width: 160px;
      //     margin-left: 10px;
      //     &::-webkit-input-placeholder {
      //       font-family: Microsoft YaHei;
      //       font-size: 14px;
      //       font-weight: 500;
      //       color: #a9adb3;
      //     }
      //   }
      // }
    }
    .footer {
      position: absolute;
      bottom: 25px;
      right: 30px;
    }
  }
  /deep/.el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>