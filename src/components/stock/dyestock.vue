<template>
  <div class="stock">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '染化剂库存'}}</div>
      </div>
      <div class="func-bar">
        <my-search style="float:left" @searchContent="searchContent"></my-search>
        <!-- <div class="add btn" @click="addOrder">新建订单</div> -->
      </div>
    </div>
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
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="stockChange(scope.row)">库存</el-button>
          <el-button size="mini" @click="viewLog(scope.row)">查看</el-button>
          <el-popconfirm
            title="确定要删除吗?"
            cancelButtonType="plain"
            @onConfirm="deleteRow(scope.$index, scope.row)"
            >
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
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
        </div>
        <div class="content-item">
          <div class="item-label">类型</div>
          <el-select v-model="params.changeType" placeholder="请选择变化类型">
            <el-option label="增加库存" value="增加库存"></el-option>
            <el-option label="减少库存" value="增加库存"></el-option>
          </el-select>
        </div>
        <div class="content-item">
          <div class="item-label">数量</div>
          <input type="text" v-model="params.number" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请填写变化数量">
        </div>
        <div class="content-item">
          <div class="item-label reason">原因</div>
          <el-input
            type="textarea"
            placeholder="请填写变化原因"
            v-model="params.reason"
            >
          </el-input>
        </div>
        <div class="footer">
          <el-button @click="cancelStockOperation">取消</el-button>
          <el-button type="primary" @click="sureStockOperation">确定</el-button>
        </div>
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
      childPageIsShow: false,
      tableHeader: [
        { label: '序号', prop: 'index', editor: false, width: 80 },
        { label: '染化剂编号', prop: 'agentNo', editor: false },
        { label: '染化剂名称', prop: 'agentName', editor: false },
        { label: '库存数量', prop: 'stockNum', editor: false },
        { label: '目前状况', prop: 'dyeInfo', editor: false },
        { label: '最后操作时间', prop: 'lastUpdateTime', editor: false },
      ],
      tableData: [],
      currentPage: 1, // 表格当前页码
      pageSize: 50, // 表格每一页展示数据的数量
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      copyRow: {},
      params: {
        user: '',
        changeType: '',
        reason: '',
        number: ''
      },
      roleOptions: []
    }
  },
  mounted() {
    this.browserResize();
    for (let i = 0; i < 100; i++) {
      let obj = JSON.parse(JSON.stringify({
        agentNo: '00X1',
        agentName: '蓝色染化剂',
        stockNum: '40',
        dyeInfo: '良好',
        lastUpdateTime: '2019-05-03 08:08:08',
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
    // 库存变化
    stockChange(row) {
      this.childPageIsShow = true;
    },
    // 查看日志
    viewLog(row) {
      console.log(111)
      this.$router.push({
        path: '/stocklog', 
        query: {
          title: '染化剂',
          agentName: row.agentName,
          agentNo: row.agentNo,
        }
      });
    },
    // 删除行信息
    deleteRow(index,row) {
      this.tableData.splice(index,1);
    },
    // 取消库存操作
    cancelStockOperation() {
      this.childPageIsShow = false;
      for(let k in this.params) {
        this.params[k] = '';
      }
    },
    // 确定库存操作
    sureStockOperation() {
      let userInfo = utils.getUserInfo();
      this.params.user = userInfo.name;
      this.params.number = parseFloat(this.params.number);
      console.log('确定库存',JSON.parse(JSON.stringify(this.params)));

      // 添加库存操作请求

      this.cancelStockOperation();
    },
    searchContent() {

    }
  }
};
</script>

<style lang="less" scoped>
.stock {
  height: 100%;
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
      width: 280px;
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
  .list {
    height: calc(100% - 65px);
    border: 1px solid red;
    box-sizing: border-box;
    .list-item {
      width: 150px;
      height: 60px;
      border: 1px solid red;
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
      width: 400px;
      height: 350px;
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
      .content-item {
        width: 100%;
        margin: 20px auto;
        box-sizing: border-box;
        .item-label {
          display: inline-block;
          width: 70px;
          color: #606266;
          font-size: 14px;
        }
        .item-label.reason {
          height: 54px;
          line-height: 54px;
        }
        .el-select {
          width: 180px;
          margin-left: 10px;
        }
        .el-input__inner {
          width: 180px;
        }
        .el-textarea {
          width: 180px;
          margin-left: 10px;
        }
        input {
          width: 180px;
          margin-left: 10px;
          outline-color: #409EFF;
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