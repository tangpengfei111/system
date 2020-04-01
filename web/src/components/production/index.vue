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
                v-model="scope.row.transactionDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                :editable="false">
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
            <div v-if="item.label == '需求量'">
              <input type="text" 
                v-model="scope.row[item.prop]" 
                oninput="value=value.replace(/[^\d]/g,'')"
                >
            </div>
            <div v-if="item.label == '金额'">
              <input type="text" 
                v-model="scope.row[item.prop]" 
                @keyup="checkNumber"
                >
            </div>
          </div>
          <div v-if="!scope.row.isEditor || !item.editor">
            <div>{{scope.row[item.prop]}}</div>
            <!-- <div v-if="item.label == '生产计划'">
              <div v-if="!scope.row.productionPlan">
                <el-button size="mini" :disabled="scope.row.isEditor" @click="createPlan(scope.row)">创建</el-button>
              </div>
              <div v-if="scope.row.productionPlan">
                
                <el-button size="mini" :disabled="scope.row.isEditor" @click="editorPlan(scope.row)">修改</el-button>
              </div>
            </div> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <div v-if="!scope.row.isEditor">
            <el-button size="mini" :disabled="scope.row.isEditor" @click="viewPlan(scope.row)">查看计划</el-button>
            <el-button size="mini" @click="editorRow(scope.row)">编辑订单</el-button>
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
  </div>
</template>

<script>
import search from '@/components/common/search.vue';
import utils from '@/lib/utils.js';
function checkNumber(obj){
      obj.value = obj.value.replace(/[^\d.]/g,"");//清除"数字"和"."以外的字符
      obj.value = obj.value.replace(/^\./g,"");//验证第一个字符是数字而不是字符
      obj.value = obj.value.replace(/\.{2,}/g,".");//只保留第一个.清除多余的
      obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    }
export default {
  components: {
    'my-search': search
  },
  data() {
    return {
      eidtorState: 'add',
      currentPage: 1, // 表格当前页码
      pageSize: 50, // 表格每一页展示数据的数量
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      copyRow: {},
      tableData: [],
      tableHeader: [
        // {label: '订单编号', prop: 'orderNumber', editor: false},
        {label: '客户', prop: 'customerName', editor: true },
        {label: '商品', prop: 'goods', editor: true },
        {label: '需求量', prop: 'productionSummary', editor: true },
        {label: '金额', prop: 'amount', editor: true },
        {label: '状态', prop: 'status', editor: true },
        {label: '交货日期', prop: 'transactionDate', editor: true, width: 210}
      ],
      customList: [            // 客户列表
        { label: '客户1', value: '客户1' },
        { label: '客户2', value: '客户2' },
        { label: '客户3', value: '客户3' },
      ],
      goodsList: [             // 商品列表
        { label: '商品1', value: '商品1' },
        { label: '商品2', value: '商品2' },
        { label: '商品3', value: '商品3' },
      ],
      
    };
  },
  mounted() {
    this.browserResize();
    for (let i = 0; i < 100; i++) {
      let obj = JSON.parse(JSON.stringify({
        orderNumber: 'xasdasd1',
        customerName: '客户1',
        goods: '商品1',
        productionSummary: '50',
        amount: '3000',
        transactionDate: '2019-05-03 08:08:08',
        qualityNum: '0',
        productionPlan: 1,
        isEditor: false
      }));
      obj.index = i + 1;
      this.tableData.push(obj);
      // OPENING(1),//打开
      // PRODUCTION(2),//正在生产中
      // DONE(0),//完成
      // IDLE(99);//暂停
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
    // 搜索
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
        obj.qualityNum = '0';
        obj.isEditor = true;
        this.tableData.unshift(obj);
      }
    },
    // 确定编辑（创建）
    sureEditor(row) {
      if (row.customerName.trim() === '' || row.goods.trim() === '' || row.productionSummary.trim() === '' || row.amount.trim() === '' || !row.transactionDate){
        this.$message({
          message: '请填写客户、商品、需求量、金额、交货日期等信息'
        })
        return;
      }
      console.log('xxxxx',row.transactionDate);
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
      console.log(row)
      this.$router.push({
        path: '/proplan', 
        query: {
          orderNumber: row.orderNumber
        }
      });
    },
    onSubmit() {
      console.log('submit!');
    },
    inputChange(e) {
      console.log(3,e)
      let { min = undefined, onChange } = this.props
      // console.log(this.props, "value onchange")
      min = typeof min == "undefined" ? min : Number(min)
      // max = typeof max == "undefined" ? max : Number(max)
      let newValue
      let value = e.target.value.toString().replace(/^0+/, '0')
      let numberValue = Number(value)
      if (isNaN(numberValue) === true && value != "-") return
      if (min !== undefined && min >= 0 && value.indexOf('-') > -1) return
      //输入的内容超过两个连续的0
      if (numberValue == 0 && (value == "00" || value == "-00") && Number(value) == numberValue) {
        return
      }
      newValue = value
    },
    inputBlur(e) {
      console.log(4,e)
    },
    // 处理金额输入框  只输入数字且允许保留两位小数
    checkNumber(event){
      event.target.value = event.target.value.replace(/[^\d.]/g,"");//清除"数字"和"."以外的字符
      event.target.value = event.target.value.replace(/^\./g,"");//验证第一个字符是数字而不是字符
      event.target.value = event.target.value.replace(/\.{2,}/g,".");//只保留第一个.清除多余的
      event.target.value = event.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      event.target.value = event.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
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
        background-image: url("../../assets/image/add-icon.png");
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
      margin: 0 8px 0 0;
    }
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
    /deep/ .el-select {
      width: 90%;
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
  
  /deep/.el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>