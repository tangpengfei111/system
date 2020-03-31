<template>
  <div class="plan">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '订单管理'}}</div>
        <!-- <div>总计 {{totalNum}} 条数据</div> -->
      </div>
      <div class="func-bar">
        <div class="add btn" @click="addPlan">新建计划</div>
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
        :height="browserAttr.height - 450"
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
            <div>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom-btn">
      <div class="save btn" @click="savePlan">保存</div>
      <div class="return btn" @click="returnPage">返回</div>
    </div>
    <div class="loading dialog-box" v-if="childPageIsShow">
      <div class="dialog">
        <div class="title">
          <div class="title-label">新建计划</div>
          <!-- <div class="export">导出</div> -->
        </div>
        <el-form 
          :inline="true"
          class="demo-form-inline"
          ref="form" 
          :model="planParams" 
          label-width="80px"
          >
          <el-form-item label="生产日期">
            <el-date-picker
              v-model="planParams.date"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              :picker-options="pickerOptions"
              :editable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="设备">
            <el-select v-model="planParams.machineName" placeholder="请选择设备">
              <el-option label="设备1" value="设备1"></el-option>
              <el-option label="设备2" value="设备2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="色号">
            <el-select v-model="planParams.colorName" placeholder="请选择色号">
              <el-option label="蓝色" value="blue"></el-option>
              <el-option label="红色" value="red"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原料">
            <el-select v-model="planParams.materialName" placeholder="请选择原料">
              <el-option label="原料1" value="原料1"></el-option>
              <el-option label="原料2" value="原料2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原料用量">
            <el-input v-model="planParams.materialUse" placeholder="请填写原料数量"></el-input>
          </el-form-item>
          <el-form-item label="染化剂">
            <el-select v-model="planParams.agentName" placeholder="请选择染化剂">
              <el-option label="染化剂1" value="染化剂1"></el-option>
              <el-option label="染化剂2" value="染化剂2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="染化剂用量">
            <el-input v-model="planParams.agentUse" placeholder="请填写染化剂数量"></el-input>
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
        {label: '客户', prop: 'customerName' },
        {label: '商品', prop: 'goods' },
        {label: '需求量', prop: 'productionSummary' },
        {label: '当前生产量', prop: 'productionCurrency' },
        {label: '金额', prop: 'amount' },
        {label: '交货日期', prop: 'transactionDate', width: 210}
      ],
      orderTableData: [],   // 订单数据
      planTableData: [],    // 计划数据
      planTableHeader: [
        {label: '序号', prop: 'index', width: 80 },
        {label: '生产日期', prop: 'date', width: 210 },
        {label: '设备', prop: 'machineName' },
        {label: '色号', prop: 'colorName' },
        {label: '原料', prop: 'materialName' },
        {label: '原料用量', prop: 'materialUse' },
        {label: '染化剂', prop: 'agentName' },
        {label: '染化剂用量', prop: 'agentUse' },
        {label: '合格品量', prop: 'productionQualified' },
      ],
      childPageIsShow: false,
      planParams: {                    // 子页面参数
        data: '',
        machineName: '',
        colorName: '',
        materialName: '',
        materialUse:'',
        agentName: '',
        agentUse: ''
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 设置可选择的日期为今天之后的一个月内
          const curDate = (new Date()).getTime();
          // 这里算出一个月的毫秒数,这里使用30的平均值,实际中应根据具体的每个月有多少天计算
          const day = 10 * 24 * 3600 * 1000;
          const dateRegion = curDate + day;
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > dateRegion;
        }
      }
    };
  },
  mounted() {
    this.browserResize();
    let obj = {
      orderNumber: 'xasdasd1',
      customerName: '客户1',
      goods: '商品1',
      productionSummary: '50',
      productionCurrency: '20',
      amount: '3000',
      transactionDate: '2019-05-03 08:08:08',
    }
    this.orderTableData.push(obj);
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
        path: '/production',
      });
    },
    // 新建计划
    addPlan() {
      this.childPageIsShow = true;
    },
    // 保存计划
    savePlan() {

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
      let obj = this._cloneDeep();
      this.planTableData.push(obj);
      this.childPageIsShow = false;
      for (let k in this.planParams) {
        this.planParams[k] = ''
      }
      
    },
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
  .orderInfo, .planInfo {
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
}
</style>