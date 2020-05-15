<template>
    <div class="report">
        <div class="header">
            <div class="title">
                <div>{{this.$route.meta.til}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
.report {
  height: 100%;
  padding: 0 30px;
  .header {
    position: relative;
    height: 65px;
    .title {
      position: absolute;
      top: 22px;
      left: 0;
      height: 20px;
      line-height: 20px;
      div {
        display: inline-block;
        &:nth-child(1) {
          padding-right: 15px;
          font-family: SimHei;
          font-size: 16px;
          color: #354052;
        }
        &:nth-child(2) {
          padding-left: 10px;
          font-family: Microsoft Yahei;
          font-size: 14px;
          color: #74797f;
          border-left: 1px solid #90959a;
        }
      }
    }
  }
  .list {
    height: calc(100% - 65px);
    border: 1px solid red;
    box-sizing: border-box;
    .list-item {
      width: 150px;
      height: 60px;
      border: 1px solid red;
    }
  }
  .el-table {
    input {
      width: 80%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      outline: none;
      padding: 0 5px;
      box-sizing: border-box;
    }
    .el-button {
      padding: 4px 8px;
      margin: 0 8px 0 0;
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
          width:100%;
          height: 30px;
          line-height: 30px;
          text-align: left;
          font-family: Microsoft Yahei;
          font-size: 18px;
          span {
            font-size: 16px;
          }
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
          outline-color: #409EFF;
          &::-webkit-input-placeholder {
            font-family: Microsoft YaHei;
            font-size: 14px;
            font-weight: 500;
            color: #a9adb3;
          }
        }
        input:focus {
          border-color: #409EFF;
        }
      }
    }
    .footer {
      position: absolute;
      bottom: 25px;
      right: 30px;
    }
  }
}
</style>