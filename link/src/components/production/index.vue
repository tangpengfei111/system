<template>
  <div class="production">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '订单管理'}}</div>
        <!-- <div>总计 {{totalNum}} 条数据</div> -->
      </div>
      <div class="func-bar">
        <div class="add btn" @click="addOrder">新建订单</div>
      </div>
    </div>
    <my-search style="float:left" @searchContent="searchContent" :formParams="formParams"></my-search>
    <!-- :row-class-name="tableRowClassName" -->
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <div v-if="!scope.row.isEditor && !scope.row.stateIsEditor">
            <el-button size="mini" @click="viewPlan(scope.row)">查看</el-button>
            <el-button size="mini" @click="editorRow(scope.row, 'editor')">编辑</el-button>
            <el-button v-if="scope.row.state === '打开' || scope.row.state === '暂停'" size="mini" @click="editorRow(scope.row, 'status')">状态</el-button>
          </div>
          <div v-if="scope.row.isEditor || scope.row.stateIsEditor">
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
          <div class="title-label">新建订单</div>
        </div>
        <div class="content-item">
          <div>客户</div>
          <el-select v-model="params.customerName" placeholder="请填选择客户">
             <el-option
               v-for="item in customList"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
          </el-select>
        </div>
        <div class="content-item">
          <div>商品</div>
          <input type="text" v-model="params.goods" placeholder="请填写商品">
        </div>
        <div class="content-item">
          <div>需求量</div>
          <input type="text" 
            v-model="params.productionSummary"
            placeholder="请填写需求量"
            @keyup="checkNumber" 
            @blur="blurInput"
            />
        </div>
        <div class="content-item">
          <div>金额</div>
          <input type="text" 
            v-model="params.amount"
            placeholder="请填写金额"
            @keyup="checkNumber"
            @blur="blurInput"
            />
        </div>
        <div class="content-item">
          <div>交货日期</div>
          <el-date-picker
            v-model="params.transactionDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :editable="false"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="footer">
          <el-button @click="cancelAddOrder">取消</el-button>
          <el-button type="primary" @click="sureAddOrder">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import search from '@/components/common/advancedSearch.vue';
import utils from '@/lib/utils.js';
export default {
  components: {
    'my-search': search
  },
  data() {
    return {
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
        {label: '客户', prop: 'customerName', editor: false },
        {label: '商品', prop: 'goods', editor: true },
        {label: '需求量', prop: 'productionSummary', editor: true },
        {label: '金额', prop: 'amount', editor: true },
        {label: '状态', prop: 'state', editor: false },
        {label: '交货日期', prop: 'transactionDate', editor: true, width: 180}
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
      statusOptions: [
        { label: '打开', value: 'active' },
        { label: '暂停', value: 'idle' }
      ],
      formParams: [
        {
          type: 'input',
          name: '客户名称',
          noColon: true,
          value: 'name'
        },
        {
          type: 'select',
          name: '状态',
          noColon: true,
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
      // formParams: {
      //   namePlaceholder: '请输入搜索内容',
      //   statusOptions: [
      //     { label: '打开', value: '1' },
      //     { label: '正在生产中', value: '2' },
      //     { label: '完成', value: '0' },
      //     { label: '暂停', value: '99' }
      //   ] 
      // },
      childPageIsShow: false,  // 子页面是否显示
      params: {                 // 子页面用到的参数对象                
        createAt: "",           
        customerName: "",       
        goods: "",
        productionSummary: '',   
        amount: '',
        transactionDate: ""
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 禁止选择今天之前的时间，可以选择今天
          // const curDate = (new Date()).getTime();
          // 这里算出一天的毫秒数
          // const day = 24 * 3600 * 1000;
          // const dateRegion = curDate + day;
          return time.getTime() < new Date() - 8.64e7;
        }
      },
    };
  },
  mounted() {
    this.browserResize();
    for (let i = 0; i < 100; i++) {
      let obj = JSON.parse(JSON.stringify({
        id: 'xasdasd1',
        customerName: '客户1',
        goods: '商品1',
        productionSummary: '50',
        amount: '3000',
        state: '打开',
        status: '1',
        transactionDate: '2020-05-03',
        qualityNum: '0',
        productionPlan: 1,
        isEditor: false,
        stateIsEditor: false
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
    },
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
    // 查询可用客户列表
    queryCustomList() {
      this.$http.get('/customerController/queryAvailableCustomer').then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.customList = res.data.data.map(item => {
            return { label: item.name, value: item.name };
          });
        }else {
          this.customList = [];
          this.$message({
            message: res.data.message || "获取客户信息失败",
            type: 'error',
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
    },
    // 获取订单数据
    getOrderData(options) {
      let params = {
        pageNo: this.currentPage,
        size: this.pageSize
      };
      if (options) {
        params.search = JSON.parse(JSON.stringify(options));
      }
      this.$http.post('/orderController/queryOrder', params).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          let options = {};
          this.formParams[1].options.forEach(item => {
            options[item.value] = item.label;
          });
          this.tableData = res.data.data.records.map((item,index) => {
            //  将status码 转成 state 汉语标签
            item.state = options[item.status];
            item.index = index + 1;
            item.stateIsEditor = false;     // 编辑状态
            item.isEditor = false;          // 编辑除状态外数据
            return item;
          });

          // "createAt": "admin",
					// "customerName": "客户1",
					// "goods": "商品1",
					// "productionSummary": 1000,
					// "amount": 100000,
					// "transactionDate": "2020-5-9",
					// "extend": null,
					// "payAmount": null,
					// "lastUpdateTime": "2020-03-31 21:24:41",
					// "status": 99
        }else {
          if (options !== undefined) {
            this.$message({
              message: res.data.message || "搜索失败",
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
    },
    // 搜索
    searchContent(options) {
      this.getOrderData(options);
    },
    // 添加订单
    addOrder() {
      // 验证是否有编辑项
      let editorFlag = this.tableData.some(item => {
        return item.isEditor;
      });
      if (editorFlag) {
        this.$message({
          showClose: true,
          message: '当前有订单正在编辑，请完成后再继续操作'
        });
        return;
      }
      // 验证是否有修改状态项
      let statusFlag = this.tableData.some(item => {
        return item.stateIsEditor;
      });
      if (statusFlag) {
        this.$message({
          showClose: true,
          message: '当前有订单正在修改状态，请完成后再继续操作'
        });
        return;
      }
      this.params.transactionDate = new Date();
      this.queryCustomList();
      this.childPageIsShow = true;
    },
    // 确认添加订单
    sureAddOrder() {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.params.createAt = user.name;
      this.params.productionSummary = Number(this.params.productionSummary);
      this.params.amount = Number(this.params.amount);
      console.log(this.params)
      return
      this.$http.post('/orderController/addOrder', params).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.cancelAddOrder();
          // 获取订单数据
          this.getOrderData(); 
        }else {
          this.cancelAddOrder();
          this.$message({
            message: res.data.message || "添加订单失败",
            type: 'error',
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        this.cancelAddOrder();
        console.log('失败原因:' + error);
      });
    },
    // 取消添加订单
    cancelAddOrder() {
      // 子页面不显示，且初始化params对象
      this.childPageIsShow = false;
      this.params = {
        createAt: "",           
        customerName: "",       
        goods: "",
        productionSummary: '',   
        amount: '',
        transactionDate: ""
      }
    },

    // 编辑订单
    editorRow(row,str) {
      // 验证是否有编辑项
      let editorFlag = this.tableData.some(item => {
        return item.isEditor;
      });
      if (editorFlag) {
        this.$message({
          showClose: true,
          message: '当前有订单正在编辑，请完成后再继续操作'
        });
        return;
      }
      // 验证是否有修改状态项
      let statusFlag = this.tableData.some(item => {
        return item.stateIsEditor;
      });
      if (statusFlag) {
        this.$message({
          showClose: true,
          message: '当前有订单正在修改状态，请完成后再继续操作'
        });
        return;
      }
      this.copyRow = JSON.parse(JSON.stringify(row));
      if (str === 'editor') {
        row.isEditor = true;
      }else if (str === 'status') {
        // 编辑订单状态
        row.stateIsEditor = true;
        row.status = '';
      }
    },
    // 确定编辑（创建）
    sureEditor(row) {
      if (row.isEditor) {
        if (row.customerName.trim() === '' || row.goods.trim() === '' || row.productionSummary.trim() === '' || row.amount.trim() === '' || !row.transactionDate){
          this.$message({
            message: '请填写客户、商品、需求量、金额、交货日期等信息'
          })
          return;
        }
        let params = {
          id: row.id,
          goods: row.goods,
          amount: Number(row.amount),                
          productionSummary: Number(row.productionSummary),        
          transactionDate: row.transactionDate
        }
        this.$http.post('/orderController/editOrder', params).then(res => {
          if (res.data.code == 0 && res.data.message == '操作成功') {
            row.isEditor = false;
            // 获取订单数据
            this.getOrderData();
          }else {
            this.$message({
              message: res.data.message || "编辑订单失败",
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
        }).catch(error => {
          console.log('失败原因:' + error);
        });
      }else if (row.stateIsEditor) {
        this.$http.get('/orderController/changeStatus' + '?id=' + row.id + '?operate=' + row.status).then(res => {
          if (res.data.code == 0 && res.data.message == '操作成功') {
            row.stateIsEditor = false;
            // 获取订单数据
            this.getOrderData();
          }else {
            this.$message({
              message: res.data.message || "编辑订单失败",
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
        }).catch(error => {
          console.log('失败原因:' + error);
        });
      }
    },
    // 取消编辑（创建）
    cancelEditor(row) {
      for (let k in this.copyRow) {
        row[k] = this.copyRow[k]
      }
    },
    // 查看计划
    viewPlan(row) {
      this.$router.push({
        path: '/proplan', 
        query: {
          orderId: row.id
        }
      });
    },
    // 处理金额输入框  只输入数字且允许保留两位小数
    checkNumber(event){
      event.target.value = event.target.value.replace(/[^\d.]/g,"");//清除"数字"和"."以外的字符
      event.target.value = event.target.value.replace(/^\./g,"");//验证第一个字符是数字而不是字符
      event.target.value = event.target.value.replace(/\.{2,}/g,".");//只保留第一个.清除多余的
      event.target.value = event.target.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      event.target.value = event.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    },
    blurInput(event) {
      if (event.target.value !== '') {
        // 失去焦点，将字符串转换为数字
        event.target.value = Number(event.target.value);
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
    /deep/.el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
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
      height: 450px;
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
      }
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
        /deep/.el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 170px;
          margin-left: 10px;
          .el-input__inner {
            height: 40px;
            line-height: 40px;
          }
        }
        /deep/.el-date-editor .el-input__icon {
          line-height: 40px;
        }
        .el-select {
          width: 170px;
          margin-left: 10px;
        }
        .el-input__inner {
          width: 170px;
        }
        input {
          width: 170px;
          margin-left: 10px;
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