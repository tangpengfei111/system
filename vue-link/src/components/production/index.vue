<template>
  <div class="production">
    <div class="header">
      <div class="title">
        <div>{{ this.$route.meta.til || "订单管理" }}</div>
        <!-- <div>总计 {{totalNum}} 条数据</div> -->
      </div>
      <div class="func-bar">
        <div class="add btn" @click="addOrder">新建订单</div>
      </div>
    </div>
    <my-search
      style="float: left"
      @searchContent="searchContent"
      :formParams="formParams"
    ></my-search>
    <el-table
      :data="tableData"
      :height="browserAttr.height - 265"
      :header-cell-style="{ background: '#EFF3F6', color: '#354053' }"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="'row' + index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.stateIsEditor || item.label != '状态'">
            {{scope.row[item.prop] }}
          </div>
          <div v-if="scope.row.stateIsEditor">
            <div v-if="item.label == '状态'">
              <el-select v-model="scope.row.status" placeholder="请选择状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <div v-if="!scope.row.stateIsEditor">
            <el-button size="mini" @click="viewPlan(scope.row)">查看</el-button>
            <el-button size="mini" @click="editorRow(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.state === '打开' || scope.row.state === '暂停'"
              size="mini"
              @click="modifyOrderStatus(scope.row)"
              >状态</el-button
            >
          </div>
          <div v-if="scope.row.stateIsEditor">
            <el-button size="mini" @click="sureModifyOrderStatus(scope.row)">确定</el-button>
            <el-button size="mini" @click="cancelModify(scope.row)">取消</el-button>
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
      <div class="data-show">
        共{{ Math.ceil(totalNum / pageSize) }}页，每页{{ pageSize }}条数据
      </div>
    </div>
    <div class="loading dialog-box" v-if="childPageIsShow">
      <div class="dialog">
        <div class="title">
          <div class="title-label">{{this.model == 'add' ? '新建订单' : '编辑订单'}}</div>
        </div>
        <div class="content-item">
          <div>客户</div>
          <!-- 注释 允许选择框中输入 filterable  clearable 清空当前数据 -->
          <el-select v-model="params.customerName" filterable clearable="true" placeholder="请填选择客户">
            <el-option
              v-for="item in customList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="content-item">
          <div>原料</div>
          <!-- 注释 允许选择框中输入 filterable  clearable 清空当前数据 -->
          <el-select v-model="params.extend.material" filterable clearable="true" placeholder="请填选择原料">
            <el-option
              v-for="item in materialList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="content-item">
          <div>色号</div>
          <!-- 注释 允许选择框中输入 filterable  clearable 清空当前数据 -->
          <el-select v-model="params.extend.color" filterable clearable="true" placeholder="请填选择色号">
            <el-option
              v-for="item in colorList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="content-item">
          <div>数量</div>
          <input
            type="text"
            v-model="params.productionSummary"
            placeholder="请填写数量"
            @keyup="checkNumber"
            @blur="blurInput"
          />
        </div>
        <div class="content-item">
          <div>订单日期</div>
          <el-date-picker
            v-model="params.transactionDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :editable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
        <div class="content-item">
          <div>订单号</div>
          <input v-model="params.id" :disabled="model === 'editor'"  placeholder="请填写订单号" />
        </div>
        <div class="footer">
          <el-button @click="initParams">取消</el-button>
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
      model: 'add', // 模式 add 新建， editor 编辑
      currentPage: 1, // 表格当前页码
      pageSize: 50, // 表格每一页展示数据的数量
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      copyRow: {},
      tableData: [],
      tableHeader: [
        {label: '订单编号', prop: 'id'},
        {label: '客户', prop: 'customerName'},
        {label: '商品', prop: 'goods'},
        {label: '数量', prop: 'productionSummary'},
        // {label: '金额', prop: 'amount'},
        {label: '状态', prop: 'state'},
        {label: '订单日期', prop: 'transactionDate', width: 180}
      ],
      customList: [], // 客户列表,
      materialList: [], // 原料列表
      colorList: [],  // 色号列表
      statusOptions: [
        { label: '打开', value: 'active' },
        { label: '暂停', value: 'idle' }
      ],
        totalNum: 0,
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
        orderStatusOptions: {
            0: "完成",
            1: "打开",
            2: "正在生产中",
            99: "暂停"
        },
      childPageIsShow: false,  // 子页面是否显示
      params: {},  // 子页面用到的参数对象
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
  created() {
    // 初始化参数对象，请求获取订单列表数据
    this.initParams()
    this.getOrderData()
  },
  mounted() {
    this.browserResize();
  },
  beforeDestroy() {
    window.onresize = null;
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
    // 查询可用原料
    queryMaterialList() {
      this.$http.get('/materialController/queryAvailableMaterial').then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.materialList = res.data.data.map(item => {
            return { label: item.name, value: item.name };
          });
        }else {
          this.materialList = [];
          this.$message({
            message: res.data.message || "获取原料信息失败",
            type: 'error',
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
    },
    // 查询可用色号
    queryColorList() {
      this.$http.get('/colorController/queryAvailableColor').then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.colorList = res.data.data.map(item => {
            return { label: item.name, value: item.name };
          });
        }else {
          this.colorList = [];
          this.$message({
            message: res.data.message || "获取色号信息失败",
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
        params.search = JSON.stringify(options);
      }
      this.$http.post('/orderController/queryOrder', params).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.tableData = res.data.data.records.map((item,index) => {
            //  将status码 转成 state 汉语标签
            item.state = this.orderStatusOptions[item.status];
            item.index = index + 1;
            item.stateIsEditor = false;     // 编辑状态
            return item;
          });
            this.totalNum =  res.data.data.total;
        }else {
          if (options !== undefined) {
            this.$message({
              message: res.data.message || "搜索失败",
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
          this.tableData = [];
          this.totalNum = 0;
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
    },
    // 搜索
    searchContent(options) {
        let option = {
            name: options?.name || '',
            status: options?.status || ''
        }
        this.getOrderData(option);
    },
    // 添加订单
    addOrder() {
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
      //this.params.transactionDate = new Date();
      this.queryCustomList()
      this.queryMaterialList()
      this.queryColorList()
      this.model = 'add'
      this.childPageIsShow = true
    },
    // 确认添加订单
    sureAddOrder() {
      if (
        this.params.customerName == '' || 
        this.params.id == '' || 
        this.params.productionSummary == '' || 
        !this.params.transactionDate ||
        this.params.extend.material == '' ||
        this.params.extend.color == ''
      ){
        this.$message({
            message: '订单填写完成后，再进行保存操作',
            type: "error",
            duration: 3000,
            showClose: true
        })
        return
      }
      this.params.goods = this.params.extend.material + this.params.extend.color
      this.params.extend = JSON.stringify(this.params.extend)
      // 新建订单
      if (this.model == 'add') {
        let user = JSON.parse(sessionStorage.getItem('user'));
        this.params.createAt = user.name;
        this.$http.post('/orderController/addOrder', this.params).then(res => {
          if (res.data.code == 0 && res.data.message == '操作成功') {
            this.initParams();
            // 获取订单数据
            this.getOrderData();
          }else {
            this.initParams();
            this.$message({
              message: res.data.message || "添加订单失败",
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
        }).catch(error => {
          this.initParams();
          console.log('失败原因:' + error);
        });
      }else {
        // 编辑订单
        this.$http.post('/orderController/editOrder', this.params).then(res => {
          if (res.data.code == 0 && res.data.message == '操作成功') {
            this.initParams();
            // 获取订单数据
            this.getOrderData();
          }else {
            this.initParams();
            this.$message({
              message: res.data.message || "编辑订单失败",
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
        }).catch(error => {
          this.initParams();
          console.log('失败原因:' + error);
        });
      }
    },
    // 初始化参数对象
    initParams() {
      // 子页面不显示，且初始化params对象
      this.childPageIsShow = false;
      this.params = { 
        createAt: "",
        amount: '0',      // 金额
        customerName: "",   // 客户
        goods: "",   // 商品
        productionSummary: '',  // 数量
        transactionDate: "",  // 订单日期
        id: '',     // 订单号
        extend: {
          material: '',  // 原料
          color: ''   // 色号
        }
      }
    },
    //编辑订单
    editorRow(row) {
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
    
      this.params = {
        createAt: row.createAt,
        amount: row.amount,
        customerName: row.customerName,
        goods: row.goods,
        productionSummary: row.productionSummary,
        transactionDate: row.transactionDate,
        id: row.id,
        extend: row.extend ? row.extend : JSON.stringify({'material': '','color': ''})
      }
      this.params.extend = JSON.parse(this.params.extend)
      this.queryCustomList()
      this.queryMaterialList()
      this.queryColorList()
      this.model = 'editor'
      this.childPageIsShow = true;
    },
    // 修改订单状态
    modifyOrderStatus(row) {
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
      row.stateIsEditor = true;
      row.status = '';
    },

    // 确定修改订单状态
    sureModifyOrderStatus(row) {
      if (!row.status){
        this.$message({
          showClose: true,
          message: '请选择当前订单状态',
          type: 'error'
        })
        return
      }
      this.$http.get('/orderController/changeStatus' + '?id=' + row.id + '&operate=' + row.status).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
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
    },
    // 取消编辑（创建）
    cancelModify(row) {
      for (let k in this.copyRow) {
        row[k] = this.copyRow[k]
      }
    },
    // 查看计划
    viewPlan(row) {
      this.$router.push({
        path: '/proplan',
        query: {
          orderId: row.id,
            type: 'order'
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
      width: 440px;
      height: 500px;
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
          width: 190px;
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
          width: 190px;
          margin-left: 10px;
        }
        .el-input__inner {
          width: 170px;
        }
        input {
          width: 190px;
          margin-left: 10px;
          &::-webkit-input-placeholder {
            font-family: Microsoft YaHei;
            font-size: 14px;
            font-weight: 500;
            color: #a9adb3;
          }
        }
        input:focus {
          border-color: #409eff;
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