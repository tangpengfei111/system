<template>
  <div class="home" :style="{height: this.pageHeight + 'px'}">
    <el-container>
      <el-header>
        <div class="title">印染管理系统</div>
      </el-header>
      <el-container class="main">
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
    <!-- <div class="header">
      
    </div>
    <div class="main">
      <div class="left-nav">
        <div class="nav-item"></div>
      </div>
      <div class="content-area">

      </div>
    </div> -->
  </div>
</template>

<script>


export default {
  data() {
    return {
      pageHeight: window.innerHeight,
    };
  },
  mounted() {
    this.getHeightAndWidth();
  },
  methods: {
    getHeightAndWidth() {
      window.onresize = () => {
        this.pageHeight = window.innerHeight;
      }
    }
  }
  
}
</script>

<style lang="less" scoped>
.el-header {
  height: 70px !important;  
  background-color: #33a4c7;
  padding: 0;
  .title {
    width: 300px;
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 30px;
    font-family: SimHei;
    color: #ecf5ff;
  }
}
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
// body > .el-container {
//   margin-bottom: 40px;
// }
// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//   line-height: 260px;
// }
// .el-container:nth-child(7) .el-aside {
//   line-height: 320px;
// }
.home {
  position: relative;
}
.main {
  position: absolute;
  top: 70px;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  .left-nav {
    float: left;
    width: 300px;
    height: 100%;
    background: #ccc;
    box-sizing: border-box;
  }
  .content-area {
    height: 100%;
    margin-left: 300px;
    box-sizing: border-box;
  }
}
</style>
