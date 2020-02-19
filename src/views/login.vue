<template>
  <div class="login" :style="{height: this.loginHeight + 'px'}">
    <div class="dialog">

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
  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500px;
    height: 400px;
    background: #5c94f9;
  }
}
</style>
