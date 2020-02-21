<template>
  <div class="home" :style="{height: this.pageHeight + 'px'}">
    <el-container>
      <el-header>
        <div class="title">印染管理系统</div>
      </el-header>
      <el-container class="main">
        <el-aside width="200px">
          <el-menu
            :default-active="this.$route.name"
            class="el-menu-vertical-demo"
            background-color="#D3DCE6"
            text-color="rgb(138, 138, 138)"
            active-text-color="rgb(4, 25, 17)"
            router>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-data"></i>
                <span>主数据维护</span>
              </template>
              <el-menu-item index="1-1">染化料/助剂管理</el-menu-item>
              <el-menu-item index="1-2">原料管理</el-menu-item>
              <el-menu-item index="1-2">色号管理</el-menu-item>
              <el-menu-item index="1-2">设备管理</el-menu-item>
              <el-menu-item index="1-2">客户管理</el-menu-item>
              <el-menu-item index="1-2">供应商管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="maintain">
              <i class="el-icon-s-data"></i>
              <span slot="title">主数据维护</span>
            </el-menu-item>
            <el-menu-item index="production">
              <i class="el-icon-s-tools"></i>
              <span slot="title">生产管理</span>
            </el-menu-item>
            <el-menu-item index="stock">
              <i class="el-icon-box"></i>
              <span slot="title">物料的库存管理</span>
            </el-menu-item>
            <el-menu-item index="report">
              <i class="el-icon-document"></i>
              <span slot="title">数据报表</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>


export default {
  data() {
    return {
      pageHeight: window.innerHeight,
    };
  },
  created() {
    
  },
  mounted() {
    this.getHeightAndWidth();
  },
  methods: {
    getHeightAndWidth() {
      window.onresize = () => {
        this.pageHeight = window.innerHeight;
      }
    },
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
.el-menu-vertical-demo {
  .el-submenu {
    text-align: left;
    .el-menu-item {
      height: 30px;
      line-height: 30px;
    }
  }
  .el-menu-item {
    height: 45px;
    line-height: 45px;
    text-align: left;
    &:hover {
      background-color: rgba(29, 89, 175, 0.16) !important;
    }
  }
}
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
