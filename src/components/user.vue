<template>
  <div class="user">
    <div class="header">
        <el-tabs v-model="activeName" type="card" @tab-click="tabsChange">
            <el-tab-pane label="所有用户" name="all"></el-tab-pane>
            <el-tab-pane label="普通用户" name="user"></el-tab-pane>
            <el-tab-pane label="管理员用户" name="admin"></el-tab-pane>
        </el-tabs>
        <div class="add-user" @click="addUser">创建用户</div>
    </div>
    <el-table
      :data="userList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :height="browserAttr.height - 190"
      :header-cell-style="{background: '#EFF3F6', color: '#354053'}"
      :row-class-name="tableRowClassName"
      border
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
          <el-button size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
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
    ></el-pagination>
    <div class="loading dialog-box" v-if="addUserPageIsShow">
      <div class="dialog">
        <div class="content-item">
          <div class="username">用户名</div>
          <input v-model="userObj.name" placeholder="请填写用户名">
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
        { label: "用户ID", prop: "id" },
        { label: "用户名", prop: "name" },
        { label: "密码", prop: "password" },
        { label: "权限", prop: "role" },
        { label: "最后操作时间", prop: "lastUpdateTime" }
      ],
      userList: [],       // 用户列表
      copyUserList: [],   // 用户列表副本
      roleOptions: [
        {
          value: '选项1',
          label: '黄金糕'
        }
      ]
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
      console.log(userRole)
      let roleAry = userRole.options.map(item => item.label);
      for (let i = 0; i < 100; i++) {
        let obj = JSON.parse(
          JSON.stringify({
            id: Math.round(Math.random() * 1000000),
            name: "123123",
            password: "sssss",
            role: roleAry[Math.round(Math.random() * 2)],
            type: 1,
            lastUpdateTime: "2018-08-09",
            isEditor: false
          })
        );
        this.userList.push(obj);
      }
      this.copyUserList = this._.cloneDeep(this.userList);
      // 查询所有非管理员用户
      // this.$http.get('/userController/queryAllUsers').then(res => {
      //   console.log('res',res);
      //   if (res.data.code == 0 && res.data.message == 'success') {

      //   }
      // }).catch(error => {
      //   console.log('失败原因:' + error);
      // })
    },
    currentChange(val) {
      this.currentPage = val;
    },
    // 标签页改变
    tabsChange(tab) {
      console.log(tab.name);
      console.log(this.copyUserList)
      if (tab.name === 'all') {
        this.userList = this._.cloneDeep(this.copyUserList);
      }else if (tab.name === 'user') {
        this.userList = this.copyUserList.filter(item => {
          return item.role !== '普通管理员';
        });
      }else if (tab.name === 'admin') {
        this.userList = this.copyUserList.filter(item => {
          return item.role === '普通管理员';
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
    },
    // 删除行
    deleteRow(row) {
      this.userList = this.userList.filter(item => {
        return item.id !== row.id;
      });
      // 删除用户
      // this.$http.get('/userController/deleteUser' + '?userId=' + row.id ).then(res => {
      //   console.log('res',res);
      //   if (res.data.code == 0 && res.data.message == 'success') {

      //   }
      // }).catch(error => {
      //   console.log('失败原因:' + error);
      // })
    },
    // 添加用户
    addUser() {
      this.addUserPageIsShow = true;
    },
    // 取消创建用户
    cancelCreateUser() {
      this.addUserPageIsShow = false;
      this.userObj = {
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
      if (name !== '') {
        this.$message({

        })
      }
      if (password !== '') {

      }
      if (role !== '') {

      }
      
      if (!this.userObj.id) {
        this.$store.commit('createUser',this.userObj);
        this.addUserPageIsShow = false;
        this.userObj = {
          name: '',
          password: '',
          role: ''
        };
        // 创建非管理员用户
        // this.$http.post('/userController/createUser',this.userObj).then(res => {
        //   console.log('res',res);
        //   if (res.data.code == 0 && res.data.message == 'success') {

        //   }
        // }).catch(error => {
        //   console.log('失败原因:' + error);
        // })
      }else {
        console.log('修改', this.userObj);
        // 修改用户信息
        // this.$http.post('/userController/modifyUser',this.userObj).then(res => {
        //   console.log('res',res);
        //   if (res.data.code == 0 && res.data.message == 'success') {

        //   }
        // }).catch(error => {
        //   console.log('失败原因:' + error);
        // })
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