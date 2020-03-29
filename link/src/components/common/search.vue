<template>
  <div class="search-box">
    <input type="text" v-model="searchText" @keyup.enter="searchContent" placeholder="请输入搜索内容">
    <div class="search-btn" @click="searchContent">搜索</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: ""
    };
  },
  methods: {
    searchContent() {
      this.$emit('searchContent',this.searchText);
    }
  },
  watch: {
    searchText(newVal, oldVal) {
      if (newVal === '' && oldVal !== '') {
        this.$emit('searchContent','');
      }
    }
  }
};
</script>

<style lang="less" scoped>
.search-box {
  position: relative;
  height: 30px;
  box-sizing: border-box;
  overflow: hidden;
  input {
    float: left;
    width: 180px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border: 1px solid #d2d2d2;
    border-radius: 0px;
    font-family: Microsoft Yahei;
    font-size: 14px;
    color: rgb(53, 53, 53);
  }
  .search-btn {
    float: left;
    width: 65px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-family: Microsoft Yahei;
    font-size: 16px;
    color: #f3f3f3;
    background: #1e79eb;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
  }
}
</style>