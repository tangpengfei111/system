<template>
  <div class="user">
    <div class="header">
        <el-tabs v-model="activeName" type="card" @tab-click="tabsChange">
            <el-tab-pane label="所有用户" name="all"></el-tab-pane>
            <el-tab-pane label="管理员" name="admin"></el-tab-pane>
            <el-tab-pane label="普通用户" name="user"></el-tab-pane>
        </el-tabs>
        <div class="add-user" @click="addUser">创建用户</div>
    </div>
    <el-table
      :data="userList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :height="browserAttr.height - 190"
      :header-cell-style="{background: '#EFF3F6', color: '#354053'}"
    >
      <el-table-column
        v-for="(item,index) in userHeader"
        :key="'row' + index"
        :prop="item.prop"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.isEditor">
            <input type="text" v-model="scope.row[item.prop]">
          </div>
          <div v-if="!scope.row.isEditor">{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="editorRow(scope.row)">编辑</el-button>
          <el-popconfirm
              title="确定要删除吗?"
              cancelButtonType="plain"
              @onConfirm="deleteRow(scope.row)"
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
      <div class="data-show">共{{Math.ceil(totalNum/pageSize)}}页，每页{{pageSize}}条数据</div>
    </div>
    <div class="loading dialog-box" v-if="addUserPageIsShow">
      <div class="dialog">
        <div class="content-item">
          <div class="username">用户名</div>
          <input v-model="userObj.name" :disabled="model === 'editor'" placeholder="请填写用户名">
        </div>
        <div class="content-item">
          <div class="password">密 码</div>
          <input v-model="userObj.password" placeholder="请填写密码">
        </div>
        <div class="content-item">
          <div class="role">权 限</div>
          <el-select v-model="userObj.role" placeholder="请选择用户权限">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="footer">
          <el-button @click="cancelCreateUser">取消</el-button>
          <el-button type="primary" @click="sureCreateUser">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userRole from '../lib/role.js';
export default {
  data() {
    return {
      userObj: {
        id: '',
        name: '',
        password: '',
        role: ''
      },
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      addUserPageIsShow: false,    //添加用户是否显示
      pageSize: 50,
      currentPage: 1,
      activeName: "all",
      userHeader: [
        /*{ label: "用户ID", prop: "id" },*/
        { label: "用户名", prop: "name" },
        { label: "密码", prop: "password" },
        { label: "权限", prop: "rolelabel" },
        { label: "最后操作时间", prop: "lastUpdateTime" }
      ],
      userList: [],       // 用户列表
      copyUserList: [],   // 用户列表副本
      roleOptions: [],
      model: 'editor',    // 模式  编辑或创建
    };
  },
  created() {
    this.roleOptions = userRole.options;
    this.getUserList();
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
      };
    },
    // 获取用户列表
    getUserList() {
      // 查询所有用户
      let params = {
        pageNo: this.currentPage,
        size: this.pageSize
      };
      this.$http.post('/userController/pageList', params).then(res => {
        if (res.data.code == 0 && res.data.message == '操作成功') {
          let options = {};
          userRole.options.forEach(item => {
            options[item.value] = item.label;
          });
          this.userList = res.data.data.records.map(item => {
            item.rolelabel = options[item.role];
            return item;
          })
          this.copyUserList = this._.cloneDeep(this.userList);
        }else {
          this.$message({
            message: '获取用户列表失败,请重试',
            type: 'error',
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      })
    },
    // 点击页面page
    currentChange(val) {
      this.currentPage = val;
    },
    // 标签页改变
    tabsChange(tab) {
      if (tab.name === 'all') {
        this.userList = this._.cloneDeep(this.copyUserList);
      }else if (tab.name === 'user') {
        this.userList = this.copyUserList.filter(item => {
          return item.role !== 'superAdmin';
        });
      }else if (tab.name === 'admin') {
        this.userList = this.copyUserList.filter(item => {
          return item.role === 'superAdmin';
        });
      }
    },
    // 表格当前页改变
    tableChangePage(nowPage) {
      this.currentPage = nowPage;
    },
    // 编辑行
    editorRow(row) {
      this.addUserPageIsShow = true;
      this.userObj = JSON.parse(JSON.stringify(row));
      this.model = 'editor';
    },
    // 删除行
    deleteRow(row) {
      /*
      this.userList = this.userList.filter(item => {
        return item.id !== row.id;
      });
      */

      // 删除用户
      this.$http.get('/userController/removeUser' + '?userId=' + row.id ).then(res => {
        console.log('res',res);
        if (res.data.code == 0 && res.data.message == '操作成功') {
          this.getUserList();
        }else {
          this.$message({
            message: res.data.message || '删除用户失败',
            type: 'error',
            duration: 3000,
            showClose: true
          });
        }
      }).catch(error => {
        console.log('失败原因:' + error);
      })
    },
    // 添加用户
    addUser() {
      this.addUserPageIsShow = true;
      this.model = 'create';
    },
    // 取消创建用户
    cancelCreateUser() {
      this.addUserPageIsShow = false;
      this.userObj = {
        id: '',
        name: '',
        password: '',
        role: ''
      };
    },
    // 确定创建用户
    sureCreateUser() {
      let name = this.userObj.name.trim();
      let password = this.userObj.password.trim();
      let role = this.userObj.role.trim();
      let type = 0;
      if(role != 'superAdmin'){
        type = 1;
      }
      if (this.userObj.id === '') {
        /*
        this.$store.commit('createUser',this.userObj);
        this.addUserPageIsShow = false;
        this.userObj = {
          name: '',
          password: '',
          role: ''
        };
        */
        let params = {
            name : name,
            password : password,
            role : role,
            type : type
        }
        // 创建非管理员用户
        this.$http.post('/userController/addUser', params).then(res => {
          if (res.data.code == 0 && res.data.message == '操作成功') {
            this.cancelCreateUser();
            this.getUserList();
          }else {
            this.cancelCreateUser();
            this.$message({
              message: res.data.message || '创建用户失败',
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
        }).catch(error => {
          this.cancelCreateUser();
          console.log('失败原因:' + error);
        })
      }else {
        // 修改用户信息
        this.$http.post('/userController/modifyUser',this.userObj).then(res => {
          if (res.data.code == 0 && res.data.message == '操作成功') {
            this.cancelCreateUser();
            this.getUserList();
          }else {
            this.cancelCreateUser();
            this.$message({
              message: res.data.message || '修改用户信息失败',
              type: 'error',
              duration: 3000,
              showClose: true
            });
          }
        }).catch(error => {
          this.cancelCreateUser();
          console.log('失败原因:' + error);
        })
      }
    }
  },
  computed: {
    totalNum() {
      return this.userList.length;
    }
  }
};
</script>

<style lang="less" scoped>
.user {
  padding: 0 20px;
  .header {
    overflow: hidden;
    box-sizing: border-box;
    .el-tabs {
      float: left;
    }
    .add-user {
      float: right;
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-family: Microsoft Yahei;
      font-size: 14px;
      color: #f3f3f3;
      background: #1e79eb;
      border-radius: 4px;
      margin: 11px 5px 0 0;
      cursor: pointer;
    }
  }
  /deep/.el-tabs__header.is-top {
    margin: 10px 0 2px 0;
  }
  .el-table {
    .el-button {
      padding: 4px 8px;
      margin: 0 8px 0 0;
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
    width: 420px;
    height: 330px;
    background-color: #ffffff;
    .content-item {
      width: 100%;
      margin: 20px auto;
      box-sizing: border-box;
    }
    div {
      display: inline-block;
      color: #606266;
      font-size: 14px;
    }
    .username {
      margin-right: 20px;
    }
    .password,.role {
      letter-spacing: 5px;
      margin-right: 15px;
    }
    input {
      width: 200px;
      &::-webkit-input-placeholder {
        font-family: Microsoft YaHei;
        font-size: 14px;
        font-weight: 500;
        color: #a9adb3;
      }
    }
    .el-select {
      width: 200px;
    }
  }
  .footer {
    position: absolute;
    bottom: 25px;
    right: 30px;
  }
}
</style>