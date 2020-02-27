<template>
  <div class="login" :style="{height: this.loginHeight + 'px'}">
    <div class="dialog">
      <div class="title">xxxxxx</div>
      <div class="content">
        <div class="username"></div>
        <div class="password"></div>
      </div>
      <div class="func">
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginHeight: window.innerHeight,
    };
  },
  mounted() {
    this.getHeightAndWidth();
  },
  methods: {
    getHeightAndWidth() {
      window.onresize = () => {
        this.loginHeight = window.innerHeight;
      }
    }
  }
  
}
</script>

<style lang="less" scoped>
.login {
  position: relative;
  box-sizing: border-box;
  background-image: url('../assets/image/bg.png');
  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    height: 300px;
    background: #c3c4c7;
    .title {
      height: 50px;
      border: 1px solid red;
    }
    .content {
      padding: 20px;
      height: calc(100% - 80px);
      box-sizing: border-box;
    }
    .func {

    }
  }
}
</style>
