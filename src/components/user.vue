<template>
    <div class="user">
        <div class="header">

        </div>
        <el-table :data="adminList.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column prop="user_name" label="管理员帐户" align='center'></el-table-column>
            <el-table-column prop="user_phone" label="手机号码" align='center'></el-table-column>
            <el-table-column prop="user_mail" label="邮箱地址" align='center'></el-table-column>
            <el-table-column prop="registerTime" label="注册日期" align='center'></el-table-column>
            <el-table-column prop="user_permissions" label="管理级别" align='center'></el-table-column>
        </el-table>
        <el-pagination
            background
            :total="total"
            layout="prev, pager, next"
            :page-size="pageSize"
            @current-change='currentChange'>
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageSize: 8,
                currentPage: 1,
                adminList: [
                    {

                    }
                ]
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() { 
                console.log(22222)
            },
            currentChange(val) {
                this.currentPage = val;
            }
        },
        computed: {
            total() {
                return this.adminList.length;
            }
        }
    }
</script>

<style lang="less" scoped>
.user {
    .header {
        height: 65px;
        border: 1px solid red;
    }
}
</style>