<template>
  <div class="login" :style="{height: this.loginHeight + 'px'}">
    <div class="logo"></div>
    <div class="login-dialog">
      <div class="image"></div>
      <div class="dialog">
        <div class="title">数据建模系统管理平台</div>
        <div class="message">Welcome欢迎登陆</div>
        <div class="login-info">
          <div class="username">
            <div class="icon"></div>
            <input type="text" v-model="username" placeholder="请输入用户名">
          </div>
          <div class="password">
            <div class="icon"></div>
            <input type="password" v-model="password" placeholder="请输入密码" @keyup.enter="userLogin">
          </div>
        </div>
        <div class="ladning" @click="userLogin">登陆</div>
      </div>
    </div>
    <div class="copyright">Copyright © xxxx有限公司 |苏ICP备000000000</div>
    <div class="loading dialog-box" v-if="registerPageIsShow">
      <div class="dialog">
        <div class="content-item">
          <div class="username">用户名</div>
          <input v-model="regObj.name" placeholder="请填写用户名">
        </div>
        <div class="content-item">
          <div class="password">密 码</div>
          <input v-model="regObj.password" placeholder="请填写密码">
        </div>
        <div class="footer">
          <el-button @click="cancelRegister">取消</el-button>
          <el-button type="primary" @click="sureRegister">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginHeight: window.innerHeight,
      username: "",
      password: "",
      registerPageIsShow: false, // 注册页面是否显示  默认false 不显示
      regObj: {
        name: "",
        password: ""
      },
      userInfo: [
        {
          name: 'admin1',
          password: '123456',
          permissions: [
            'maintain'
          ]
        },
        {
          name: 'admin2',
          password: '123456',
          permissions: [
            'production'
          ]
        },
        {
          name: 'admin3',
          password: '123456',
          permissions: [
            'report'
          ]
        },
        {
          name: 'admin4',
          password: '123456',
          permissions: [
            'stock'
          ]
        }
      ]
    };
  },
  mounted() {
    this.getHeightAndWidth();
  },
  methods: {
    getHeightAndWidth() {
      window.onresize = () => {
        this.loginHeight = window.innerHeight;
      };
    },
    // 用户登录
    userLogin() {
      if (this.username.trim() === '') {
        this.$message({
          message: '用户名输入为空',
          type: 'warning'
        });
        return;
      }
      if (this.password.trim() === '') {
        this.$message({
          message: '密码输入为空',
          type: 'warning'
        });
        return;
      }
      let option = {};
      let flag = this.userInfo.some(item => {
        return item.name === this.username;
      });
      if (flag) {
        this.userInfo.forEach(item => {
          if (item.name === this.username) {
            if (item.password === this.password) {
              option.name = item.name;
              option.permissions = item.permissions;
            }else {
              this.$message({
                message: '密码输入错误',
                type: 'error'
              });
            }
          }
        });
      }else {
        this.$message({
          message: '该用户未注册',
          type: 'error'
        });
      }
      if (option.name && option.permissions) {
        sessionStorage.setItem('user',JSON.stringify(option))
        this.$router.push({
          name:'home', 
          params:{
            option
          }
        });
      }
    },
    // 用户注册
    userRegister() {
      this.registerPageIsShow = true;
    },
    // 取消注册
    cancelRegister() {},
    // 确定注册
    sureRegister() {}
  }
};
</script>

<style lang="less" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1270px;
  min-height: 860px;
  box-sizing: border-box;
  background-image: url("../assets/image/bg.png");
  .login-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 930px;
    height: 560px;
    padding: 40px;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.4);
    overflow: hidden;
    .image {
      float: left;
      width: 50%;
      height: 100%;
      border: 1px solid blue;
      box-sizing: border-box;
    }
    .dialog {
      float: left;
      width: 50%;
      height: 100%;
      padding: 60px 60px 70px 20px;
      border: 1px solid blue;
      box-sizing: border-box;
      .title {
        width: 100%;
        max-width: 470px;
        height: 70px;
        line-height: 70px;
        margin: 0 auto;
        font-family: Microsoft YaHei;
        font-size: 30px;
        color: #333333;
      }
      .message {
        width: 100%;
        max-width: 470px;
        margin: 0 auto;
        height: 30px;
        line-height: 30px;
        font-family: Microsoft YaHei;
        font-size: 18px;
        color: #a9a9a9;
      }
      .login-info {
        width: 100%;
        max-width: 470px;
        margin: 0 auto;
        padding: 11% 0;
        height: calc(100% - 160px);
        box-sizing: border-box;
        overflow: hidden;
        .username,
        .password {
          position: relative;
          height: 40%;
          border-bottom: 1px solid #eeeeee;
          input {
            width: 80%;
            height: 100%;
            font-size: 16px;
            margin-left: 12%;
            border: none;
          }
          .icon {
            position: absolute;
            width: 15%;
            height: 100%;
            background-image: url("../assets/image/user-icon.png");
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 24px 24px;
            box-sizing: border-box;
          }
        }
        .password {
          margin-top: 20px;
          .icon {
            background-image: url("../assets/image/password-icon.png");
            background-size: 26px 26px;
          }
        }
      }
      .ladning {
        width: 100%;
        margin: 0 auto;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background: #2994ff;
        font-family: Microsoft YaHei;
        font-size: 24px;
        color: #ffffff;
        text-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.5);
        border-radius: 25px;
        cursor: pointer;
      }
    }
  }
  .logo {
    position: absolute;
    top: 6.5%;
    left: 7%;
    width: 500px;
    height: 50px;
  }
  .copyright {
    position: absolute;
    bottom: 4%;
    width: 100%;
    text-align: center;
    font-family: Simhei;
    font-size: 14px;
    color: #ffffff;
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
    width: 350px;
    height: 260px;
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
    .password {
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
  }
  .footer {
    position: absolute;
    bottom: 25px;
    right: 30px;
  }
}
</style>
