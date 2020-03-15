<template>
  <div class="home" :style="{height: this.browserAttr.height + 'px'}">
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
            <el-submenu index="maintain" v-if="this.menuItemIsShow.material">
              <template slot="title">
                <i class="el-icon-s-data"></i>
                <span>基础数据维护</span>
              </template>
              <el-menu-item index="material">原料管理</el-menu-item>
              <el-menu-item index="dyeAgent">染化剂管理</el-menu-item>
              <el-menu-item index="color">色号管理</el-menu-item>
              <el-menu-item index="machine">设备管理</el-menu-item>
              <el-menu-item index="customer">客户管理</el-menu-item>
              <el-menu-item index="supplier">供应商管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="production" v-if="this.menuItemIsShow.production">
              <i class="el-icon-s-tools"></i>
              <span slot="title">生产管理</span>
            </el-menu-item>
            <el-menu-item index="stock" v-if="this.menuItemIsShow.stock">
              <i class="el-icon-box"></i>
              <span slot="title">库存管理</span>
            </el-menu-item>
            <el-menu-item index="report" v-if="this.menuItemIsShow.report">
              <i class="el-icon-document"></i>
              <span slot="title">报表管理</span>
            </el-menu-item>
            <el-menu-item index="user" v-if="this.menuItemIsShow.user">
              <i class="el-icon-user"></i>
              <span slot="title">用户管理</span>
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

import role from '../lib/role.js';
export default {
  data() {
    return {
      browserAttr: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      maintainAry: [
        { index: 'material', label: '原料管理' },
        { index: 'color', label: '色号管理' },
        { index: 'dyeAgent', label: '染化剂管理' },
        { index: 'customer', label: '客户管理' },
        { index: 'machine', label: '设备管理' },
        { index: 'supplier', label: '供应商管理' }
      ],
    };
  },
  mounted() {
    this.getHeightAndWidth();
  },
  beforeDestroy() {
    window.onresize = null;
  },
  computed: {
    // 左侧菜单每一项是否显示，根据用户权限来控制
    menuItemIsShow() {
      let user = JSON.parse(sessionStorage.getItem('user'));
      console.log()
      let option = {
        material: true,
        production: true,
        stock: true,
        report: true,
        user: true
      }
      for (let k in option) {
        if (!role.define[user.role].includes(k)) {
          option[k] = false;
        }
      } 
      return option;
    }
  },
  methods: {
    // 获取高度和宽度
    getHeightAndWidth() {
      window.onresize = () => {
        this.browserAttr.width = window.innerWidth;
        this.browserAttr.height = window.innerHeight;
      };
    },
  }
  
}
</script>

<style lang="less" scoped>
.el-header {
  height: 70px !important;  
  background-color: #4c6eb5;
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
  height: 100%;
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  overflow: visible;
}
.el-main {
  height: 100%;
  background-color: #fff;
  color: #333;
  text-align: center;
  padding: 0;
  overflow: visible;
}
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
  height: calc(100% - 70px);
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
