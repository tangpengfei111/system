<template>
  <div class="stocklog">
    <div class="header">
      <div class="title">
        <div>{{title}}</div>
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
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定要清除吗?"
            cancelButtonType="plain"
            @onConfirm="deleteLogRecord(scope.$index, scope.row)"
            >
            <el-button slot="reference" size="mini" type="danger">清除记录</el-button>
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
  </div>
</template>

<script>
import search from "@/components/common/search.vue";
export default {
  components: {
    "my-search": search
  },
  data() {
    return {
      title: "",
      tableHeader: [
        { label: '序号', prop: 'index', width: 80 },
        { label: '变化类型', prop: 'changeType' },
        { label: '变化数量', prop: 'number' },
        { label: '库存余量', prop: 'stockNum' },
        { label: '操作用户', prop: 'user' },
        { label: '操作时间', prop: 'time' },
      ],
      tableData: [],
      currentPage: 1, // 表格当前页码
      pageSize: 50, // 表格每一页展示数据的数量
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
    };
  },
  computed: {
    totalNum() {
      return this.tableData.length;
    }
  },
  created() {
    console.log(this.$route);
    if (this.$route.query) {
        this.title = this.$route.query.agentName + '日志';
    }else {
        this.title = this.$route.meta.til;
    }
  },
  mounted() {
    this.browserResize();
    for (let i = 0; i < 100; i++) {
      let obj = JSON.parse(JSON.stringify({
        stockNum: '100',
        changeType: '增加',
        number: '5',
        user: 'admin1',
        time: '2019-05-03 08:08:08',
        isEditor: false
      }));
      obj.index = i + 1;
      this.tableData.push(obj);
    }
  },
  beforeDestroy() {
    window.onresize = null;
  },
  methods: {
    searchContent() {},
    // 监听窗口大小改变
    browserResize() {
      window.onresize = () => {
        this.browserAttr.width = window.innerWidth;
        this.browserAttr.height = window.innerHeight;
        console.log("监听窗口改变111");
      };
    },
    // 删除库存日志记录
    deleteLogRecord(index,row) {
        this.tableData.splice(index,1);
    },
    // 表格当前页改变
    tableChangePage(nowPage) {
      this.currentPage = nowPage;
    },
  }
};
</script>

<style lang="less" scoped>
.stocklog {
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
}
</style>