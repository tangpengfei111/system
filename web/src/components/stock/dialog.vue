<template>
  <div class="loading dialog-box">
    <div class="dialog">
      <div class="title">
        <div class="title-label">库存调整</div>
      </div>
      <div class="content-item">
        <div class="item-label">类型</div>
        <el-select v-model="params.changeType" placeholder="请选择变化类型">
          <el-option label="增加库存" value="增加库存"></el-option>
          <el-option label="减少库存" value="增加库存"></el-option>
        </el-select>
      </div>
      <div class="content-item">
        <div class="item-label">数量</div>
        <input
          type="text"
          v-model="params.number"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="请填写变化数量"
        />
      </div>
      <div class="content-item">
        <div class="item-label reason">原因</div>
        <el-input type="textarea" placeholder="请填写变化原因" v-model="params.reason"></el-input>
      </div>
      <div class="footer">
        <el-button @click="cancelStockOperation">取消</el-button>
        <el-button type="primary" @click="sureStockOperation">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>


<style lang="less" scoped>
.dialog-box {
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 20px;
    box-sizing: border-box;
    width: 400px;
    height: 350px;
    background-color: #ffffff;
    .title {
      overflow: hidden;
      height: 30px;
      .title-label {
        float: left;
        width: 80px;
        height: 30px;
        line-height: 30px;
        font-family: Microsoft Yahei;
        font-size: 18px;
      }
      .export {
        float: right;
        width: 50px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-family: Microsoft Yahei;
        font-size: 14px;
        color: #f3f3f3;
        background: #1e79eb;
        border-radius: 4px;
      }
    }
    .content-item {
      width: 100%;
      margin: 20px auto;
      box-sizing: border-box;
      .item-label {
        display: inline-block;
        width: 70px;
        color: #606266;
        font-size: 14px;
      }
      .item-label.reason {
        height: 54px;
        line-height: 54px;
      }
      .el-select {
        width: 180px;
        margin-left: 10px;
      }
      .el-input__inner {
        width: 180px;
      }
      .el-textarea {
        width: 180px;
        margin-left: 10px;
      }
      input {
        width: 180px;
        margin-left: 10px;
        outline-color: #409eff;
        &::-webkit-input-placeholder {
          font-family: Microsoft YaHei;
          font-size: 14px;
          font-weight: 500;
          color: #a9adb3;
        }
      }
      input:focus {
        border-color: #409eff;
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