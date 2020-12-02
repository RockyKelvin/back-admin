<template>
  <div>
    <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
    <el-breadcrumb separator="-">
        <el-breadcrumb-item >首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="##">权限</a></el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- ///////////////////////////permission list//////////////////////////////////////// -->
    <el-card class="box-card">
      <div class="table">
        <el-table
          v-loading="loading"
          :data="permissionList"
          border
          stripe
          row-key="id"
          style="width: 100%"
          >
          <el-table-column
              prop="id"
              label="ID"
              width="100">
          </el-table-column>
          <el-table-column
              prop="name"
              label="名称"
              width="200">
          </el-table-column>
          <el-table-column
              prop="module"
              label="模块"
              width="400">
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      permissionList: [],
      loading: true
    }
  },
  methods: {
    /// getPermissionList ////////////////////////////////////////////////////////////////////////
    async getPermissionList () {
      this.loading = true
      const { data: res } = await this.$HTTP.post('permission/list', { type: 'list' })
      this.permissionList = res.data
      if (res.status === 200) {
        this.loading = false
      } else {
        this.$message.error('加载失败')
        this.loading = false
      }
    }
  },
  created () {
    this.getPermissionList()
  }
}
</script>
<style lang="less" scoped>
.box-card{
  margin-top: 30px;
  .table{
    padding-top: 20px;
  }
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.pages{
  text-align: center;
}
</style>
