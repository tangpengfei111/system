<template>
  <div class="stock">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '原料库存'}}</div>
      </div>
    </div>
    <my-search style="float:left" @searchContent="searchContent" :formParams="formParams"></my-search>
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
      >
        <!-- <template slot-scope="scope">
          
        </template> -->
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
          <div class="title-label">库存调整 —
            <span>{{copyRow.name}}</span>
          </div>
        </div>
        <div class="content-item">
          <div class="item-label">调整类型</div>
          <el-select v-model="params.type" placeholder="请选择调整类型">
            <el-option label="增加" value="0"></el-option>
            <el-option label="减少" value="1"></el-option>
          </el-select>
        </div>
        <div class="content-item">
          <div class="item-label">调整量</div>
          <input type="text" v-model="params.variation" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请填写变化数量">
        </div>
        <div class="content-item">
          <div class="item-label reason">原因</div>
          <el-input 
            v-if="params.type === '0'"
            type="textarea"
            placeholder="请填写变化原因"
            v-model="params.increaseType"
            >
          </el-input>
          <el-input
            v-if="params.type === '1'"
            type="textarea"
            placeholder="请填写变化原因"
            v-model="params.reduceType"
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
import search from '@/components/common/advancedSearch.vue';
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
        { label: '染化剂编号', prop: 'no', editor: false },
        { label: '染化剂名称', prop: 'name', editor: false },
        { label: '库存数量', prop: 'stock', editor: false },
        { label: '状态', prop: 'state', editor: false },
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
        createAt: '',
        type: '0',
        reduceType: '',
        increaseType: '',
        variation: ''
      },
      roleOptions: [],
      formParams: {
        namePlaceholder: '请输入搜索内容',
        statusOptions: [
          { label: '打开', value: '1' },
          { label: '正在生产中', value: '2' },
          { label: '完成', value: '0' },
          { label: '暂停', value: '99' }
        ]
      },
    }
  },
  created() {
    this.getStockList();
  },
  mounted() {
    this.browserResize();
    // for (let i = 0; i < 100; i++) {
    //   let obj = JSON.parse(JSON.stringify({
    //     no: '00X1',
    //     name: '蓝色原料',
    //     stock: '40',
    //     state: '可用',
    //     lastUpdateTime: '2019-05-03 08:08:08',
    //     isEditor: false
    //   }));
    //   obj.index = i + 1;
    //   this.tableData.push(obj);
    // }
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
    // 获取库存信息列表
    getStockList(options) {
      let params = {
        pageNo: this.currentPage,
        size: this.pageSize
      };
      if (options) {
        params.search = JSON.parse(JSON.stringify(options));
      }
      this.$http.post('/materialStockController/queryByCondition', params).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.tableData = res.data.data.materialStockInfos.map((item,index) => {
            if (item.status === 0) {
              item.state = '可用';
            }else if (item.status === 1) {
              item.state = '不可用';
            }else if (item.status === 2) {
              item.state = '废弃';
            }
            item.isEditor = false;
            item.index = index + 1;
            return item;
          });
        }else {
          if (options !== undefined) {
            this.$message({
              message: res.data.message || "查询失败",
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
          // this.tableData = [];
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
    },
    // 库存变化
    stockChange(row) {
      this.copyRow = row;
      console.log(this.copyRow.name)
      this.childPageIsShow = true;
    },
    // 查看日志
    viewLog(row) {
      console.log(111)
      this.$router.push({
        path: '/stocklog', 
        query: {
          title: '原料',
          name: row.name,
          no: row.no,
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
      this.params.type = '0';
    },
    // 确定库存操作
    sureStockOperation() {
      let userInfo = utils.getUserInfo();
      this.params.createAt = userInfo.name;
      this.params.variation = parseFloat(this.params.variation);
      if (this.params.type === '1') {
        this.params.increaseType = '';
      }else {
        this.params.reduceType = '';
      }
      console.log('确定库存',JSON.parse(JSON.stringify(this.params)));
      let params = this._.cloneDeep(this.params);
      // 添加库存操作请求
      this.$http.post('/materialStockLogController/addMaterialStockLog', params).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.cancelStockOperation();
        }else {
          this.$message({
            message: res.data.message || "操作失败",
            type: 'error',
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
    },
    // 搜索
    searchContent(options) {
      this.getStockList(options);
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