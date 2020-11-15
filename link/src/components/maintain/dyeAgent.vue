<template>
  <div class="maintain-child">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '染化剂管理'}}</div>
      </div>
      <div class="func-bar">
        <my-search style="float:left" @searchContent="searchContent" :placeholder="searchPlaceholder"></my-search>
        <div class="add btn" @click="addRow">添加</div>
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
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isEditor && item.editor">
            <div v-if="item.label == '状态'">
              <el-select v-model="scope.row.status" placeholder="请选择状态">
                <el-option
                  v-for="item in stateOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div v-if="item.label == '供应商'">
              <!-- 注释 允许选择框中输入 filterable  clearable 清空当前数据 -->
              <el-select v-model="scope.row[item.prop]" filterable clearable='true' placeholder="请选择供应商">
                <el-option
                  v-for="item in supplierOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div v-if="!scope.row.isEditor || !item.editor">{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="130"
        align="center">
        <template slot-scope="scope">
          <div v-if="!scope.row.isEditor">
            <el-button size="mini" @click="editorRow(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定要删除吗?"
              cancelButtonType="plain"
              @onConfirm="deleteRow(scope.$index, scope.row)"
              >
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
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
    <div class="loading dialog-box" v-if="childPageIsShow">
      <div class="dialog">
        <div class="content-item">
          <div>染化剂名</div>
          <input v-model="params.name" placeholder="请填写染化剂名称">
        </div>
        <div class="content-item">
          <div>染化剂编号</div>
          <input v-model="params.no" placeholder="请填写染化剂编号">
        </div>
        <div class="content-item">
          <div>供应商</div>
          <el-select v-model="params.supplierName" placeholder="请选择供应商">
             <el-option
               v-for="item in supplierOption"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
          </el-select>
        </div>
        <div class="footer">
          <el-button @click="cancelCreate">取消</el-button>
          <el-button type="primary" @click="sureCreate">确定</el-button>
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
      tableHeader: [              // 表格头部信息
        { label: '染化剂编号', prop: 'no', editor: false },
        { label: '染化剂名称', prop: 'name', editor: false },
        { label: '供应商', prop: 'supplierName', editor: true },
        { label: '状态', prop: 'state', editor: true },
        { label: '用户名', prop: 'createAt', editor: false },
        { label: '最后操作时间', prop: 'lastUpdateTime', editor: false }
      ],
      tableData: [],   // 表格数据
      copyRow: {},     // 当前行副本
      currentPage: 1,  // 表格当前页码
      pageSize: 50,   // 表格每一页展示数据的数量
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      childPageIsShow: false,    // 子页面是否展示 默认false
      params: {                 // 子页面用到的参数对象 
        name: '', 
        no: '',
        supplierName: ''
      },
      supplierOption: [],      // 供应商列表 用于编辑中供应商选择
      stateOption: [           // 状态数组
        { label: '可用', value: 0 },
        { label: '不可用', value: 1 }
      ],
      searchPlaceholder: '请输入搜索的染化剂名称'
    };
  },
  created() {
    this.getAllDyeAgents();
  },
  mounted() {
    // 修改分页器 jump 文字内容
    let jump = document.querySelector('.el-pagination__jump');
    if (jump) {
      jump.childNodes[0].nodeValue = '跳至';
    }
    this.browserResize();
  },
  beforeDestroy() {
    window.onresize = null;
  },
  computed: {
    // 数据总条数
    totalNum() {
      return this.tableData.length;
    }
  },
  methods: {
    // 表格 行的样式
    tableRowClassName({rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'odd-number';
      }else {
        return 'even-number';
      }
    }, 
    // 监听窗口大小改变
    browserResize() {
      window.onresize = () => {
        this.browserAttr.width = window.innerWidth;
        this.browserAttr.height = window.innerHeight;
        console.log('监听窗口改变111');
      };
    },
    // 表格列宽自适应
    tableHeaderColumWidthAdaptive(data) {
      let minWidth = document.querySelectorAll('.maintain-child .el-table__header-wrapper')[0].clientWidth;
      console.log(1111,data,minWidth)
      let headerWidth = 0;
      let tableHeader = data.map(item => {
        let width = utils.getTextLength(item.label) + 50;
        headerWidth = width + headerWidth;
        return { label: item.label, prop: item.prop, width: width };
      });
      if (headerWidth < minWidth) {
        let width = Math.floor(minWidth - headerWidth) / tableHeader.length;
        tableHeader.forEach(item => {
          item.width = item.width + width;
        });
      }
      return tableHeader;
    },
    // 获取可用供应商列表
    getAvailableSupplier() {
      this.$http.get('/supplierController/queryAvailableSupplier').then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.supplierOption = res.data.data.map(item => {
            return { label: item.name, value: item.name };
          });
        }else {
          this.supplierOption = [];
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      });
    },
    // 表格当前页改变
    tableChangePage(nowPage) {
      this.currentPage = nowPage;
    },
    // 获取可用染化剂列表
    // 获取所有染化剂数据
    getAllDyeAgents(text) {
      let params = {
        pageNo: this.currentPage,
        size: this.pageSize
      }
      if (text !== undefined) {
        params.search = text;
      }
      this.$http.post('/dyeAgentController/pageList',params).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.tableData = res.data.data.records.map(item => {
            if (item.status === 0) {
              item.state = '可用';
            }else if (item.status === 1) {
              item.state = '不可用';
            }else if (item.status === 2) {
              item.state = '废弃';
            }
            item.isEditor = false;
            return item;
          });
        }else {
          if (text !== undefined) {
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
    // 文本搜索
    searchContent(text) {
      text = text.trim();
      if (text !== '') {
        this.getAllDyeAgents(text);
      }else if (text == ''){
        this.getAllDyeAgents();
      }
    },
    // 添加新数据
    addRow() {
      let flag = this.tableData.some(item => {
        return item.isEditor;
      });
      if (flag) {
        this.$message({
          showClose: true,
          message: '已经存在编辑项，请完成后再进行添加操作'
        });
      }else {
        this.getAvailableSupplier();
        this.childPageIsShow = true;
      }
    },
    // 取消创建
    cancelCreate() {
      this.childPageIsShow = false;
      this.params = {
        name: '',
        no: '',
      }
    },
    // 确定创建
    sureCreate() {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.params.createAt = user.name;
      if (!this.params.name) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请填写染化剂名称'
        });
        return
      }
      if (!this.params.no) {
        this.$message({
          showClose: true,
          type: 'error',
          message: '请填写染化剂编号'
        });
        return
      }
      // 添加染化剂
      this.$http.post('/dyeAgentController/addDyeAgent',this.params).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.getAllDyeAgents();
          this.cancelCreate();
        }else {
          this.cancelCreate();
          this.$message({
            message: res.data.message || "添加失败",
            type: 'error',
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        this.cancelCreate();
        console.log('失败原因:' + error);
      })
    },
    // 编辑行
    editorRow(row) {
      let flag = this.tableData.some(item => {
        return item.isEditor;
      });
      if (flag) {
        this.$message({
          showClose: true,
          message: '已存在编辑项，请完成后再进行操作'
        });
      }else {
        this.copyRow = JSON.parse(JSON.stringify(row));
        this.getAvailableSupplier()
        row.isEditor = true;
      }
    },
    // 删除行
    deleteRow(index,row) {
      // this.tableData.splice(index,1);
      // 删除染化剂
      this.$http.get('/dyeAgentController/removeDyeAgent' + '?dyeAgentNo=' + row.no).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.getAllDyeAgents();
        }else {
          this.$message({
            message: res.data.message || "删除失败",
            type: 'error',
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      })
    },
    // 确定编辑
    sureEditor(row) {
      //请求参数
      let option = {
        createAt: row.createAt,
        name: row.name,
        no: row.no,
        supplierName: row.supplierName,
        status: row.status
      }
      this.$http.post('/dyeAgentController/modifyDyeAgent',option).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
           this.getAllDyeAgents();
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      })
    },
    // 取消编辑
    cancelEditor(row) {
      for (let k in this.copyRow) {
        row[k] = this.copyRow[k]
      }
    },
   
  },
};
</script>

<style lang="less" scoped>
.maintain-child {
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
      // width: 330px;
      overflow: hidden;
      .add {
        float: right;
        width: 35px;
        height: 35px;
        margin-right: 10px;
        box-sizing: border-box;
        background-image: url('../../assets/image/add-icon.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 25px 25px;
      }
      .btn {
        float: right;
        width: 65px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 0 0 0 10px;
        font-family: Microsoft Yahei;
        font-size: 16px;
        color: #f3f3f3;
        background: #1e79eb;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  
  .el-table {
    input {
      width: 80%;
      height: 25px;
      line-height: 25px;
      outline: none;
      padding: 0 5px;
      box-sizing: border-box;
      text-align: center;
    }
    .el-button {
      padding: 4px 8px;
      margin: 0 8px 0 0;
    }
    /deep/ .el-input__inner {
      height: 25px;
      line-height: 25px;
      text-align: center;
    }
    /deep/ .el-select {
      width: 80%;
      .el-input__icon {
        line-height: 25px;
      }
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
      height: 300px;
      background-color: #ffffff;
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
        .el-select {
          width: 160px;
          margin-left: 10px;
        }
        .el-input__inner {
          width: 160px;
        }
        input {
          width: 160px;
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