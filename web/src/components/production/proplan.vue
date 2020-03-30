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
      ]
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
    for (let i = 0; i < 15; i++) {
      let obj = JSON.parse(JSON.stringify({
        date: '2019-05-03 08:08:08',
        machineName: '设备1',
        colorName: '红色',
        materialName: '原料1',
        materialUse: '50',
        agentName: '染化剂1',
        agentUse: '50',
        productionQualified: 0,
        isEditor: false
      }));
      obj.index = i + 1;
      this.planTableData.push(obj);
    }
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

    },
    // 保存计划
    savePlan() {

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
}
</style>