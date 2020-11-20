<template>
  <div>
      <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
        <el-breadcrumb separator="-">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="##">会员</a></el-breadcrumb-item>
            <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- ///////////////////////////user list//////////////////////////////////////// -->
        <el-card class="box-card">
            <el-row>
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <div class="table">
            <el-table
                :data="userList"
                border
                stripe
                row-key="id"
                style="width: 100%"
                >
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-table
                      :data="props.row.address"
                       style="width: 100%">
                      <el-table-column
                        width="300"
                        prop="address"
                        label="地址">
                      </el-table-column>
                      <el-table-column
                        width="120"
                        prop="contact_name"
                        label="联系人">
                      </el-table-column>
                      <el-table-column
                        width="80"
                        label="性别">
                        <template slot-scope="scope">
                          {{ scope.row.gender === 1 ? '男' : '女' }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        width="120"
                        prop="contact_phone"
                        label="电话">
                      </el-table-column>
                      <el-table-column
                        prop="created_at"
                        label="创建时间"
                        width="200">
                      </el-table-column>
                       <el-table-column
                        prop="updated_at"
                        label="更新时间"
                        width="200">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="ID"
                    width="100">
                </el-table-column>
                <el-table-column
                    label="头像"
                    width="80">
                    <template slot-scope="scope">
                    <img :src="scope.row.avatar" width="50px" height="50px" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户名"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="Email"
                    width="400">
                </el-table-column>
                <el-table-column
                    label="是否显示"
                    width="120">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change = "updateSwitch(scope.row)"
                            >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    label="创建日期"
                    width="200">
                </el-table-column>
                 <el-table-column
                    prop="updated_at"
                    label="修改日期"
                    width="200">
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
      searchInput: ''
    }
  },
  methods: {
    // 当前页变化触发
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.getUserList()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getUserList()
    },
    // update switch////////////////////////////////////////
    async updateSwitch (val) {
      const { id, status } = { ...val }
      const { data: res } = await this.$HTTP.post('user/update', { id, status })
      console.log(res)
      if (res.status === 200) {
        this.$message.success(res.msg)
        this.getUserList()
      } else {
        this.$message.error('数据更新失败', res.msg)
      }
    },
    /// getUserList ////////////////////////////////////////////////////////////////////////
    async getUserList () {
      const { data: res } = await this.$HTTP.post('user/list', { words: this.searchInput, page: this.currentPage, size: this.pagesize })
      this.total = res.users.total
      const userList = res.users.data
      console.log(res)
      userList.forEach((item) => {
        item.status = item.status === 1
      })
      this.userList = userList
    }
  },
  created () {
    this.getUserList()
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
