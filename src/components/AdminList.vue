<template>
  <div>
     <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
        <el-breadcrumb separator="-">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="##">权限</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- ///////////////////////////user list//////////////////////////////////////// -->
        <el-card class="box-card">
           <el-row>
                <el-col :span="4">
                    <el-button type="primary" icon="el-icon-plus" @click="createAdmin">添加管理员</el-button>
                </el-col>
            </el-row>
            <div class="table">
              <el-table
                v-loading="loading"
                :data="userList"
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
                    prop="username"
                    label="用户名"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="Email"
                    width="400">
                </el-table-column>
                <el-table-column
                    prop="role_name"
                    label="权限名"
                    width="200">
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="120">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.state"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change = "updateSwitch(scope.row)"
                            >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="changeRole(scope.row)" >分配管理权限</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteAdmin(scope.row.id)"></el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editAdmin(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
        <!-- //////分页器、、、、、、、、、、、、、、、、、、、、、、、、、、、、、//// -->
        <!-- 此例是一个完整的用例，使用了size-change和current-change
        事件来处理页码大小和当前页变动时候触发的事件。
        page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项，
        [100, 200, 300, 400]表示四个选项，每页显示 100 个，200 个，300 个
        或者 400 个。 -->
            <div class="pages">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 15, 20, 25]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
          </div>
        </el-card>
        <el-dialog
          title="新增管理员"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="form" label-width="100px" label-position="right">
            <el-form-item label="用户名">
                <el-col :span="18"><el-input v-model="form.username"></el-input></el-col>
            </el-form-item>
            <el-form-item label="EMAIL">
                <el-col :span="18"><el-input v-model="form.email"></el-input></el-col>
            </el-form-item>
            <el-form-item label="PASSWORD">
                <el-col :span="18"><el-input v-model="form.password"></el-input></el-col>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCreateAdmin">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="修改管理员"
          :visible.sync="editDialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="form" label-width="100px" label-position="right">
            <el-form-item label="用户名">
                <el-col :span="18"><el-input :value="form.username" disabled></el-input></el-col>
            </el-form-item>
            <el-form-item label="ID">
                <el-col :span="18"><el-input :value="form.id" disabled></el-input></el-col>
            </el-form-item>
            <el-form-item label="EMAIL">
                <el-col :span="18"><el-input v-model="form.email"></el-input></el-col>
            </el-form-item>
            <el-form-item label="PASSWORD">
                <el-col :span="18"><el-input v-model="form.password"></el-input></el-col>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditAdmin">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="分配管理权限"
          :visible.sync="changeRoleDialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="form" label-width="100px" label-position="right">
            <el-form-item label="用户名">
                <el-col :span="18"><el-input :value="form.username" disabled></el-input></el-col>
            </el-form-item>
            <el-form-item label="ID">
                <el-col :span="18"><el-input :value="form.id" disabled></el-input></el-col>
            </el-form-item>
            <el-form-item label="EMAIL">
                <el-col :span="18"><el-input v-model="form.email" disabled></el-input></el-col>
            </el-form-item>
            <el-form-item label="当前权限">
                <el-col :span="18"><el-input v-model="form.role_name" disabled></el-input></el-col>
            </el-form-item>
             <el-form-item label="选择权限">
                <el-col :span="18">
                  <el-select v-model="roleId" placeholder="请选择权限">
                      <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="changeRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitChangeRole">确 定</el-button>
          </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userList: [],
      multipleSelection: [],
      pagesize: 10,
      currentPage: 1,
      total: 0,
      loading: true,
      form: {
        username: '',
        id: null,
        email: '',
        password: '',
        role_name: ''
      },
      dialogVisible: false,
      editDialogVisible: false,
      changeRoleDialogVisible: false,
      roleList: [],
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
    // 当前页变化触发
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.getUserList()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getUserList()
    },
    // createAdmin/////////////////////////////////////////
    createAdmin () {
      this.form = {
        username: '',
        id: null,
        email: '',
        password: '',
        role_name: ''
      }
      this.dialogVisible = true
    },
    async submitCreateAdmin () {
      this.dialogVisible = false
      const { data: res } = await this.$HTTP.post('user/create', this.form)
      console.log(res)
      if (res.meta.status === 201) {
        this.$message.success(res.meta.msg)
        this.getUserList()
      } else {
        this.$message.error('添加管理员失败', res.meta.msg)
      }
    },
    // change Role/////////////////////////////////////////
    async getRoleList (form) {
      const { data: res } = await this.$HTTP.get('role/list')
      this.roleList = res.data
    },
    async changeRole (form) {
      this.form = { ...form }
      this.changeRoleDialogVisible = true
    },
    async submitChangeRole () {
      this.changeRoleDialogVisible = false
      const { data: res } = await this.$HTTP.post('user/role', { user_id: this.form.id, role_id: this.roleId })
      if (res.status === 200) {
        this.$message.success(res.msg)
        this.getUserList()
      } else {
        this.$message.error('修改信息失败', res.msg)
      }
    },
    // Edit Admin/////////////////////////////////////////
    editAdmin (form) {
      this.form = { ...form }
      this.editDialogVisible = true
      console.log(this.form)
    },
    async submitEditAdmin () {
      this.editDialogVisible = false
      const { data: res } = await this.$HTTP.post('user/edit', this.form)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
        this.getUserList()
      } else {
        this.$message.error('修改信息失败', res.meta.msg)
      }
    },
    // delete Admin ////////////////////////////////////
    async deleteAdmin (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmDeleteAdmin(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async confirmDeleteAdmin (id) {
      const { data: res } = await this.$HTTP.post('user/delete', { id })
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
        this.getUserList()
      } else {
        this.$message.error('删除规格失败', res.meta.msg)
      }
    },
    // update switch////////////////////////////////////////
    async updateSwitch (val) {
      const { id, state } = { ...val }
      const { data: res } = await this.$HTTP.post('user/update', { id, state })
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
        this.getUserList()
      } else {
        this.$message.error('数据更新失败', res.meta.msg)
      }
    },
    /// getUserList ////////////////////////////////////////////////////////////////////////
    async getUserList () {
      const { data: res } = await this.$HTTP.post('user/list', { page: this.currentPage, size: this.pagesize })
      this.total = res.data.total
      const userList = res.data.data
      if (res.meta.status === 200) {
        this.loading = false
      } else {
        this.$message.error('加载失败')
        this.loading = false
      }
      console.log(res)
      userList.forEach((item) => {
        item.state = item.state === 1
      })
      this.userList = userList
    }
  },
  created () {
    this.getUserList()
    this.getRoleList()
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
