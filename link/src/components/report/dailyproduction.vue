<template>
  <div class="daily-report">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til}}</div>
      </div>
    </div>
    <my-search style="float:left" @searchContent="searchContent" :formParams="formParams"></my-search>
    <el-table
      :data="tableData"
      :height="browserAttr.height - 260"
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
      ></el-table-column>
      <!-- <el-table-column label="操作" width="200" align="center" fixed="right">
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
      </el-table-column> -->
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
      ></el-pagination>
      <div class="data-show">共{{Math.floor(totalNum/pageSize)}}页，每页{{pageSize}}条数据</div>
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
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      formParams: [
        {
          type: 'input',
          name: '客户名称',
          noColon: true,
          value: 'name'
        },
        {
          type: 'date',
          name: '日期',
          noColon: false,
          value: 'date'
        }
      ],
      tableData: [],
      tableHeader: [
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
      currentPage: 1,  // 表格当前页码
      pageSize: 50,   // 表格每一页展示数据的数量
    };
  },
  computed: {
    // 数据总条数
    totalNum() {
      return this.tableData.length;
    }
  },
  mounted() {
    let jump = document.querySelector('.el-pagination__jump');
    if (jump) {
      jump.childNodes[0].nodeValue = '跳至';
    }
    this.browserResize();
  },
  methods: {
    // 搜索
    searchContent(options) {
      console.log(111111)
    },
    // 监听窗口大小改变
    browserResize() {
      window.onresize = () => {
        this.browserAttr.width = window.innerWidth;
        this.browserAttr.height = window.innerHeight;
        console.log("监听窗口改变111");
      };
    },
    tableChangePage() {

    },
    getTableData() {
      let params = {
        pageNo: this.currentPage,
        size: this.pageSize
      }
      // this.$http.post('/materialController/pageList',params).then(res => {
      //   if (res.data.code == 0 && res.data.message == '操作成功') {
      //     this.tableData = res.data.data.records.map(item => {
      //       return item;
      //     });
      //   }else {
      //     if (text !== undefined) {
      //       this.$message({
      //         message: res.data.message || "查询失败",
      //         type: 'error',
      //         duration: 3000,
      //         showClose: true
      //       });
      //     }
      //     // this.tableData = [];
      //   }
      // }).catch(error => {
      //   console.log('失败原因:' + error);
      // });
    }
  }
};
</script>

<style lang="less" scoped>
.daily-report {
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
          width:100%;
          height: 30px;
          line-height: 30px;
          text-align: left;
          font-family: Microsoft Yahei;
          font-size: 18px;
          span {
            font-size: 16px;
          }
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