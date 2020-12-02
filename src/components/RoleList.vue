<template>
  <div>
    <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
    <el-breadcrumb separator="-">
        <el-breadcrumb-item >首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="##">权限</a></el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- ///////////////////////////role list//////////////////////////////////////// -->
    <el-card class="box-card">
      <div class="table">
        <el-table
          v-loading="loading"
          :data="roleList"
          border
          stripe
          style="width: 100%"
          >
           <el-table-column type="expand">
              <template slot-scope="props">
                <el-row v-for="item1 in props.row.children" :key="item1.id" class="row_one">
                  <el-col :span="5">
                    <el-tag>
                      {{item1.name}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-row v-for="item2 in item1.children" :key="item2.id" justify="space-around" class="row_sec">
                      <el-col :span="5">
                        <el-tag
                          type="success">
                          {{item2.name}}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="19">
                        <el-tag
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          closable
                          type="warning">
                          {{item3.name}}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
          </el-table-column>
          <el-table-column
              prop="id"
              label="ID"
              width="100">
          </el-table-column>
          <el-table-column
              prop="name"
              label="权限名称"
              width="200">
          </el-table-column>
          <el-table-column
              prop="des"
              label="权限描述"
              width="400">
          </el-table-column>
          <el-table-column
              label="操作"
              width="400">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editPermission(scope.row)"></el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      title="更改权限"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-tree
        ref = "pmsTree"
        :data="permissionTree"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      permissionTree: [],
      loading: true,
      dialogVisible: false,
      defKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleId: null
    }
  },
  methods: {
    /// Close Dialog////////////////////////////////////////////////
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    /// getRoleList ////////////////////////////////////////////////////////////////////////
    async getRoleList () {
      this.loading = true
      const { data: res } = await this.$HTTP.get('role/list')
      this.roleList = res.data
      if (res.status === 200) {
        this.loading = false
      } else {
        this.$message.error('加载失败')
        this.loading = false
      }
      console.log(res)
    },
    editPermission (val) {
      this.defKeys = []
      this.roleId = val.id
      this.permissionTree = [...this.permissionTree]
      this.setDefaultCheckedKeys(val)
      this.dialogVisible = true
    },
    setDefaultCheckedKeys (val) {
      if (!val.children) {
        return this.defKeys.push(val.id)
      }
      val.children.forEach(item => {
        this.setDefaultCheckedKeys(item)
      })
    },
    /// getRoleList Tree Type ////////////////////////////////////////////////////////////////////////
    async getPermissionTree () {
      const { data: res } = await this.$HTTP.post('permission/list', { type: 'tree' })
      this.permissionTree = res.data
      console.log(res)
    },
    async submitPermission () {
      const permissions = [...this.$refs.pmsTree.getCheckedKeys(), ...this.$refs.pmsTree.getHalfCheckedKeys()]
      console.log(permissions, this.roleId)
      const { data: res } = await this.$HTTP.post('role/permission', { id: this.roleId, permissions })
      console.log(res)
      if (res.status === 200) {
        this.$message.success(res.msg)
        this.defKeys = []
        this.getRoleList()
        this.getPermissionTree()
      } else {
        this.$message.error('更新失败', res.msg)
      }
      this.dialogVisible = false
    }
  },
  created () {
    this.getRoleList()
    this.getPermissionTree()
  }
}
</script>
<style lang="less" scoped>
.box-card{
  margin-top: 30px;
  .table{
    padding-top: 20px;
  }
  .row_one{
    display: flex;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px #eeeeee solid;
    align-items: center;
    .row_sec{
       padding-bottom: 5px;
    }
  }
.el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
    margin-top:5px;
  }

}

</style>
