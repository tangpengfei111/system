<template>
  <div class="maintain-child">
    <div class="header">
      <div class="title">
        <div>{{this.$route.meta.til || '色号管理'}}</div>
        <div>总计 {{totalNum}} 条数据</div>
      </div>
      <div class="func-bar">
        <my-search style="float:left" @searchContent="searchContent"></my-search>
        <div class="add btn" @click="addRow">添加</div>
      </div>
    </div>
    <el-table 
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :height="browserAttr.height - 200"
      :header-cell-style="{background: '#bbd7f9', color: '#354356'}"
      :row-class-name="tableRowClassName"
      style="width: 100%" 
      border>
      <el-table-column
        v-for="(item,index) in tableHeader"
        :key="'row' + index"
        :prop="item.prop"
        :label="item.label"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isEditor">
            <input type="text" v-model="scope.row[item.prop]">
          </div>
          <div v-if="!scope.row.isEditor">{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="130"
        align="center">
        <template slot-scope="scope">
          <div v-if="!scope.row.isEditor">
            <el-button size="mini" @click="editorRow(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </div>
          <div v-if="scope.row.isEditor">
            <el-button size="mini" @click="sureEditor(scope.row)">确定</el-button>
            <el-button size="mini" @click="cancelEditor(scope.row)">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
    <div class="loading dialog-box" v-if="childPageIsShow">
      <div class="dialog">
        <div class="content-item">
          <div>色号</div>
          <input v-model="params.name" placeholder="请填写色号名称">
        </div>
        <div class="content-item">
          <div>编号</div>
          <input v-model="params.no" placeholder="请填写色号编号">
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
        {label: '序号', prop: 'index'},
        {label: '色号编号', prop: 'color_no'},
        {label: '色号名称', prop: 'color_name'},
        {label: '状态', prop: 'state'},
        {label: '用户id', prop: 'user_id'},
        {label: '用户名', prop: 'user_name'},
        {label: '最后操作时间', prop: 'last_update_time'}
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
      },
    };
  },
  mounted() {
    // 修改分页器 jump 文字内容
    let jump = document.querySelector('.el-pagination__jump');
    if (jump) {
      jump.childNodes[0].nodeValue = '跳至';
    }
    this.browserResize();
    for (let i = 0; i < 100; i++) {
      let obj = JSON.parse(JSON.stringify({
        color_no: 1,
        color_name: 2,
        state: 5,
        user_id: 111111,
        user_name: 'xxxal12',
        last_update_time: '2019-03-03',
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
    // 获取表格数据，头部信息
    // getTbaleData(id) {
    // },
    // 表格当前页改变
    tableChangePage(nowPage) {
      this.currentPage = nowPage;
    },
    // 获取所有颜色数据
    getAllColors(type) {
      // 两种类型，一是所有颜色，二是可用颜色
      let url = '';
      if (type === 'all') {
        url = '/colorController/queryAllColors';
      }else if (type === 'available') {
        url = '/colorController/queryAvailableColor';
      }
      // 查询所有颜色
      // this.$http.get(url).then(res => {
      //   console.log('res',res);
      //   if (res.data.code == 0 && res.data.message == 'success') {

      //   }
      // }).catch(error => {
      //   console.log('失败原因:' + error);
      // })
    },
    // 文本搜索
    searchContent(text) {
      console.log(text);
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
        this.childPageIsShow = true;
        console.log(this.params);
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
      let obj = {};
      this.tableHeader.forEach(item => {
        obj[item.prop] = '';
      });
      obj.isEditor = true;
      this.tableData.unshift(obj);
      let user = JSON.parse(sessionStorage.getItem('user'));
      let createAt = user.name;
      console.log(createAt)
      // 添加色号请求
      // this.$http.post('/colorController/addColor',{

      // }).then(res => {
      //   console.log('res',res);
      //   if (res.data.code == 0 && res.data.message == 'success') {

      //   }
      // }).catch(error => {
      //   console.log('失败原因:' + error);
      // })
      
      this.childPageIsShow = false;
      this.params = {
        name: '',
        no: '',
      }
    },
    // 编辑行
    editorRow(row) {
      let flag = this.tableData.some(item => {
        return item.isEditor;
      });
      if (flag) {
        this.$message({
          showClose: true,
          message: '已经存在编辑项，请完成后再继续操作'
        });
      }else {
        this.copyRow = JSON.parse(JSON.stringify(row));
        row.isEditor = true;
        // 编辑色号请求
        // this.$http.post('/colorController/removeColor',{

        // }).then(res => {
        //   console.log('res',res);
        //   if (res.data.code == 0 && res.data.message == 'success') {

        //   }
        // }).catch(error => {
        //   console.log('失败原因:' + error);
        // })
      }
    },
    // 删除行
    deleteRow(index) {
      this.tableData.splice(index,1);
    },
    // 确定编辑
    sureEditor(row) {
      row.isEditor = false;
    },
    // 取消编辑
    cancelEditor(row) {
      for (let k in this.copyRow) {
        row[k] = this.copyRow[k]
      }
    }
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
      width: 330px;
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
    }
    .el-button {
      padding: 4px 8px;
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