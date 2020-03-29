<template>
  <div>
    <el-dialog
      width="420px"
      :visible="registerPageIsShow"
      top="8vh"
      align="center"
      :before-close="handleClose"
    >
      <el-form :model=" formData" status-icon :rules="rules" ref="formData" label-width="100px">
        <div class="title">用户注册</div>
        <el-form-item prop="username" label=" 用 户 名 ">
          <el-input v-model="formData.username" class="inp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密 码">
          <el-input type="password" v-model="formData.password" class="inp" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="password1" label="确认密码">
          <el-input type="password" v-model="formData.password1" class="inp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="age" label="年 龄">
          <el-input v-model="formData.age" class="inp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mail" label="电子邮箱">
          <el-input v-model="formData.mail" class="inp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label=" 手 机 号 ">
          <el-input v-model="formData.phone" class="inp" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">重 置</el-button>
        <el-button type="primary" @click="ensure('formData')">确定注册</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["registerPageIsShow"],
  data() {
    var conformName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else if (
        this.formData.username.length > 5 &&
        this.formData.username.length < 17
      ) {
        callback();
      } else {
        callback(new Error("用户名长度在6至18位之间"));
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (
          this.formData.password.length < 5 ||
          this.formData.password.length > 17
        ) {
          callback(new Error("密码长度在6至18位之间"));
        }
        if (this.formData.password1 !== "") {
          this.$refs.formData.validateField("password1");
        }
        callback();
      }
    };
    // var checkAge = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("年龄不能为空"));
    //   } else if (isNaN(this.formData.age * 1)) {
    //     callback(new Error("请输入数字值"));
    //   } else {
    //     if (value < 18) {
    //       callback(new Error("必须年满18岁"));
    //     } else {
    //       callback();
    //     }
    //   }
    // };
    // var validatePass1 = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请再次输入密码"));
    //   } else if (value !== this.formData.password) {
    //     callback(new Error("两次输入密码不一致!"));
    //   } else {
    //     callback();
    //   }
    // };
    // var checkPhone = (rule, value, callback) => {
    //   if (value === "" || this.formData.phone.length < 11) {
    //     callback(new Error("请11位手机号码"));
    //   } else if (this.formData.phone.length > 11) {
    //     callback(new Error("输入的手机号码大于11位"));
    //   } else if (!/^1[34578]\d{9}$/.test(value)) {
    //     callback(new Error("请输入正确的手机号码"));
    //   } else {
    //     callback();
    //   }
    // };
    // var checkMail = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入邮箱地址"));
    //   } else if (
    //     /^(\w)+([-.]\w+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9])*\.[a-zA-Z]{2,5}$/.test(
    //       this.formData.mail
    //     )
    //   ) {
    //     callback();
    //   } else {
    //     callback(new Error("请输入有效的邮箱地址"));
    //   }
    // };
    return {
      formData: {
        username: "",
        password: "",
        // password1: "",
        // mail: "",
        // phone: "",
        // age: ""
      },
      rules: {
        username: [{ required: true, validator: conformName, trigger: "blur" }],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        // password1: [
        //   { required: true, validator: validatePass1, trigger: "blur" }
        // ],
        // age: [{ required: true, validator: checkAge, trigger: "blur" }],
        // phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        // mail: [{ required: true, validator: checkMail, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 确定注册
    ensure(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          let p = this.$store.dispatch("register", this.formData);
          p.then(data => {
            if (data.data.status == 100) {
              this.$message({
                type: "error",
                message: data.data.msg
              });
            } else if (data.data.status == 110) {
              this.$message({
                type: "success",
                message: data.data.msg
              });
              this.$emit("openPage", false);
              this.$refs[formData].resetFields();
            }
          });
        }
      });
    },
    // 重置
    cancel() {
      this.$refs.formData.resetFields();
    },
    // 关闭页面
    handleClose(done) {
      console.log(done)
      this.$confirm("确认关闭？").then(() => {
        done();
        this.$emit("openPage", false);
      }).catch(error => {
        console.log('错误:'+ error)
      });
    }
  }
};
</script>

<style lang='less' scoped>
.el-form {
  border: 1px solid red;
  .title {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #303133;
  }
  .item_box {
    text-align: center;
  }
  .inp {
    width: 220px;
    margin-left: -10px;
  }
}
</style>