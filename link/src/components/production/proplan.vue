<template>
  <div class="plan">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '订单管理'}}</div>
        <!-- <div>总计 {{totalNum}} 条数据</div> -->
      </div>
      <div class="func-bar">
        <div class="add btn" @click="addPlan">新建计划</div>
        <div class="return btn" @click="returnPage">返回</div>
      </div>
    </div>
    <div class="orderInfo">
      <div class="title">订单信息</div>
      <el-table
        :data="orderTableData"
        :header-cell-style="{background: '#EFF3F6', color: '#354053'}"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in orderTableHeader"
          :key="'row' + index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="planInfo">
      <div class="title">计划信息</div>
      <el-table
        :data="planTableData"
        :header-cell-style="{background: '#EFF3F6', color: '#354053'}"
        :height="browserAttr.height - 400"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in planTableHeader"
          :key="'row' + index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        >
          <template slot-scope="scope">
            <div v-show="!scope.row.isEditor">{{scope.row[item.prop]}}</div>
            <div v-show="scope.row.isEditor && item.label == '合格品量'">
              <input type="text" v-model="scope.row.productionQualified">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <div v-if="!scope.row.isEditor">
              <el-button size="mini" :disabled="scope.row.state !== '0'" @click="editorQualified(scope.row)">填写合格品</el-button>
              <el-button size="mini" @click="printPlan(scope.row)">打印计划</el-button>
            </div>
            <div v-if="scope.row.isEditor">
              <el-button size="mini" @click="sureEditor(scope.row)">确定</el-button>
              <el-button size="mini" @click="cancelEditor(scope.row)">取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="loading dialog-box" v-if="childPageIsShow">
      <div class="dialog">
        <div class="title">
          <div class="title-label">新建计划</div>
          <!-- <div class="export">导出</div> -->
        </div>
        <el-form
          class="demo-form-inline"
          :inline="true"
          ref="form"
          :model="planParams"
          label-width="80px"
          status-icon
        >
          <el-form-item label="生产日期">
            <el-date-picker
              v-model="planParams.date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="设备">
            <el-select v-model="planParams.machineName" placeholder="请选择设备">
              <el-option
                v-for="(item,index) in machineOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="色号">
            <el-select v-model="planParams.colorName" placeholder="请选择色号">
              <el-option
                v-for="(item,index) in colorOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原料">
            <el-select v-model="planParams.materialName" placeholder="请选择原料">
              <el-option
                v-for="(item,index) in materialOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原料用量">
            <el-input
              v-model="planParams.materialUse"
              :disabled="!materialMaxStock"
              @blur="blurInput($event,'material')"
              placeholder="请填写原料数量"
            ></el-input>
          </el-form-item>
          <el-form-item label="染化剂">
            <el-select v-model="planParams.agentName" placeholder="请选择染化剂">
              <el-option
                v-for="(item,index) in agentOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="染化剂用量">
            <el-input
              v-model="planParams.agentUse"
              :disabled="!agentMaxStock"
              @blur="blurInput($event,'agent')"
              placeholder="请填写染化剂数量"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="surePlan">确定</el-button>
            <el-button @click="cancelPlan">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      orderTableHeader: [
        // {label: '订单编号', prop: 'orderNumber', editor: false},
        { label: "客户", prop: "customerName" },
        { label: "商品", prop: "goods" },
        { label: "需求量", prop: "productionSummary" },
        { label: "当前生产量", prop: "productionCurrency" },
        { label: "金额", prop: "amount" },
        { label: "状态", prop: "state" },
        { label: "交货日期", prop: "transactionDate", width: 180 }
      ],
      orderTableData: [], // 订单数据
      planTableData: [], // 计划数据
      planTableHeader: [
        { label: "序号", prop: "index", width: 80 },
        { label: "生产日期", prop: "date", width: 210 },
        { label: "设备", prop: "machineName" },
        { label: "色号", prop: "colorName" },
        { label: "原料", prop: "materialName" },
        { label: "原料用量", prop: "materialUse" },
        { label: "染化剂", prop: "agentName" },
        { label: "染化剂用量", prop: "agentUse" },
        { label: "合格品量", prop: "productionQualified" }
      ],
      childPageIsShow: false,
      planParams: {
        // 子页面参数
        data: "",
        machineName: "",
        colorName: "",
        materialName: "",
        materialUse: "",
        agentName: "",
        agentUse: "",
        createAt: ""
      },
      statusOptions: {
        "1": "打开",
        "2": "正在生产中",
        "0": "完成",
        "99": "暂停"
      },
      pickerOptions: {
        disabledDate: time => {
          // 当前时间
          const curDate = new Date().getTime();
          // 订单交货日期时间
          const dateRegion = new Date(
            this.orderTableData[0].transactionDate
          ).getTime();
          return (
            time.getTime() < Date.now() - 8.64e7 || time.getTime() > dateRegion
          );
        }
      },
      colorOptions: [],
      materialOptions: [],
      agentOptions: [],
      machineOptions: [],
      agentMaxStock: 50,
      materialMaxStock: 50,
      copyRow: {}
    };
  },
  created() {
    console.log(this.$route);
    if (this.$route.query) {
      this.getOrderData(this.$route.query.orderId);
      this.getPlanData(this.$route.query.orderId);
    }
  },
  mounted() {
    this.browserResize();
    // let obj = {
    //   orderNumber: "xasdasd1",
    //   customerName: "客户1",
    //   goods: "商品1",
    //   productionSummary: "50",
    //   productionCurrency: "20",
    //   state: "完成",
    //   amount: "3000",
    //   transactionDate: "2020-05-03"
    // };
    // this.orderTableData.push(obj);
    // for (let i = 0; i < 15; i++) {
    //   let obj = JSON.parse(JSON.stringify({
    //     date: '2019-05-03 08:08:08',
    //     machineName: '设备1',
    //     colorName: '红色',
    //     materialName: '原料1',
    //     materialUse: '50',
    //     agentName: '染化剂1',
    //     agentUse: '50',
    //     productionQualified: 0,
    //     isEditor: false
    //   }));
    //   obj.index = i + 1;
    //   this.planTableData.push(obj);
    // }
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
    // 返回上一页面
    returnPage() {
      this.$router.push({
        path: "/production"
      });
    },
    // 获取原料库存
    getMaterialStock() {
      this.$http
        .get(
          "/materialStockController/getStockByMaterial" + "？materialName=" + ""
        )
        .then(res => {
          if (res.data.code == 0 && res.data.message == "操作成功") {
            this.materialMaxStock = res.data.data.stock;
          }
        })
        .catch(error => {
          console.log("失败原因:" + error);
        });
    },
    // 获取染化剂库存
    getAgentStock() {
      this.$http
        .get("/agentStockController/getStockByAgent" + "？materialName=" + "")
        .then(res => {
          if (res.data.code == 0 && res.data.message == "操作成功") {
            this.agentMaxStock = res.data.data.stock;
          }
        })
        .catch(error => {
          console.log("失败原因:" + error);
        });
    },
    // 获取订单信息
    getOrderData(orderId) {
      // 根据订单编号查订单信息
      this.$http.get("/orderController/getOrderById" + "?orderId=" + orderId).then(res => {
        if (res.data.code == 0 && res.data.message == "操作成功") {
          let obj = this._.cloneDeep(res.data.data);
          obj.customerName = obj.customer.name;
          obj.state = this.statusOptions[obj.status];
          this.orderTableData.push(obj);
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log("失败原因:" + error);
      });
    },
    // 获取生产计划列表
    getPlanData(orderId) {
      // 根据订单查询生产
      this.$http.get("/productionController/queryProdByOrder" + "?orderId=" + orderId).then(res => {
        if (res.data.code == 0 && res.data.message == "操作成功") {
          this.planTableData = res.data.data.map((item, index) => {
            item.isEditor = false;
            item.index = index + 1;
            return item;
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log("失败原因:" + error);
      });
    },
    // 新建计划
    addPlan() {
      // 检查是否存在编辑状态 生产计划
      let editorFlag = this.planTableData.some(item => {
        return item.isEditor;
      });
      if (editorFlag) {
        this.$message({
          showClose: true,
          message: "当前有计划正在编辑，请完成后再继续操作"
        });
        return;
      }
      // 获取可用染化剂
      this.$http.get('/dyeAgentController/queryAvailableDyeAgent').then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.agentOptions = res.data.data.map(item => {
            return { label: item.name, value: item.name };
          });
        }else {
          this.agentOptions = [];
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
      // 获取可用设备
      this.$http.get('/machineController/queryAvailableMachine').then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.machineOptions = res.data.data.map(item => {
            return { label: item.name, value: item.name };
          });
        }else {
          this.machineOptions = [];
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
      // 获取可用色号
      this.$http.get('/colorController/queryAvailableColor').then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.colorOptions = res.data.data.map(item => {
            return { label: item.name, value: item.name };
          });
        }else {
          this.colorOptions = [];
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
      // 获取可用原料
      this.$http.get('/materialController/queryAvailableMaterial').then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.materialOptions = res.data.data.map(item => {
            return { label: item.name, value: item.name };
          });
        }else {
          this.materialOptions = [];
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
      

      // // 获取可用染化剂
      // let p1 = this.$http.get('/dyeAgentController/queryAvailableDyeAgent');
      // // 获取可用设备
      // let p2 = this.$http.get('/machineController/queryAvailableMachine');
      // // 获取可用色号
      // let p3 = this.$http.get('/colorController/queryAvailableColor');
      // // 获取可用原料
      // let p4 = this.$http.get('/materialController/queryAvailableMaterial');
      // Promise.all([p1,p2,p3,p4]).then(res => {


        // this.childPageIsShow = true;
      // }).catch(error => {
      //   console.log('失败原因:' + error);
      // });
      
      this.childPageIsShow = true;
    },
    // 保存计划
    savePlan() {},
    // 取消创建
    cancelPlan() {
      this.childPageIsShow = false;
      for (let k in this.planParams) {
        this.planParams[k] = "";
      }
    },
    // 确定创建
    surePlan() {
      // this.planParams.index = this.planTableData.length + 1;
      // let obj = this._.cloneDeep(this.planParams);
      // this.planTableData.push(obj);
      // this.childPageIsShow = false;
      // for (let k in this.planParams) {
      //   this.planParams[k] = ''
      // }
      console.log(this.planParams);
      // {
      //   "agentName": "染化剂1",
      //   "agentUse": 10,
      //   "colorName": "色号1",
      //   "createAt": "admin",
      //   "date": "2020-3-31",
      //   "machineName": "染缸1",
      //   "materialName": "原料1",
      //   "materialUse": 150,
      //   "orderId": "1244977037068783618"
      // }
      let user = JSON.parse(sessionStorage.getItem("user"));
      this.params.createAt = user.name;
      this.params.orderId = this.$route.query.orderId || this.orderTableData[0].id;
      this.$http.post("/productionController/addProduction", this.planParams).then(res => {
        if (res.data.code == 0 && res.data.message == "操作成功") {
          this.getPlanData(this.params.orderId);
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log("失败原因:" + error);
      });
    },
    blurInput(event, str) {
      console.log(111, event.target.value);
      if (str === "material" && event.target.value > this.materialMaxStock) {
        console.log(11111);
      } else if (str === "agent" && event.target.value > this.agentMaxStock) {
      }
    },
    // 打印计划
    printPlan(row) {
      console.log("打印", row);
      this.$http.get("/productionController/export?id=" + row.id).then(res => {
        if (res.data.code == 0 && res.data.message == "操作成功") {
          this.$message({
            message: "打印成功",
            type: "success",
            duration: 3000,
            showClose: true
          });
        } else {
          this.$message({
            message: "打印失败",
            type: "error",
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log("失败原因:" + error);
      });
    },
    // 编辑生产计划合格品
    editorQualified(row) {
      // 检查是否存在编辑状态 生产计划
      let editorFlag = this.planTableData.some(item => {
        return item.isEditor;
      });
      if (editorFlag) {
        this.$message({
          showClose: true,
          message: "当前有计划正在编辑，请完成后再继续操作"
        });
        return;
      }
      this.copyRow = JSON.parse(JSON.stringify(row));
      row.isEditor = true;
    },
    // 确定编辑
    sureEditor(row) {
      if (row.productionQualified.trim() === ''){
        this.$message({
          message: '请填合格品数量'
        })
        return;
      }
      let qualified = Number(row.productionQualified);
      this.$http.get("/productionController/fillQuality?id=" + row.id + '?qualified=' + qualified).then(res => {
        if (res.data.code == 0 && res.data.message == "操作成功") {
          this.getPlanData(row.orderId);
        } else {
          this.$message({
            message: "填写失败",
            type: "error",
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log("失败原因:" + error);
      });
    },
    // 取消编辑
    cancelEditor(row) {
      for (let k in this.copyRow) {
        row[k] = this.copyRow[k];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.plan {
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
  .orderInfo,
  .planInfo {
    .title {
      height: 30px;
      line-height: 30px;
      text-align: left;
      font-family: SimHei;
      font-size: 14px;
      color: #354052;
      padding-left: 5px;
      margin: 10px 0;
      border-left: 3px solid #1e79eb;
    }
  }
  .bottom-btn {
    margin: 25px 0;
    .btn {
      display: inline-block;
      width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin: 0 0 0 20px;
      font-family: Microsoft Yahei;
      font-size: 12px;
      color: #f3f3f3;
      background: #1e79eb;
      // background: #009AFE;
      border-radius: 4px;
      cursor: pointer;
    }
    .save {
      background: #6aca15;
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
  /deep/.el-date-editor .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .el-date-editor.el-input {
    width: 140px;
  }
}
</style>