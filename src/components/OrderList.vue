<template>
  <div>
      <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
        <el-breadcrumb separator="-">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="##">会员</a></el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- ///////////////////////////user list//////////////////////////////////////// -->
        <el-card class="box-card">
            <el-row>
                <el-col :span="2">
                    <el-button type="primary" icon="el-icon-plus" @click="changeStatus">批量发货</el-button>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="statusValue" placeholder="请选择分类" @change="handleSelect">
                        <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="10">
                    <el-input placeholder="请输入订单编号" v-model="searchInput" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <div class="table">
            <el-table
                v-loading="loading"
                :data="orderList"
                border
                stripe
                row-key="id"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                >
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-table
                       v-loading="loading"
                      :data="props.row.items"
                       style="width: 100%">
                        <el-table-column
                            width="120"
                            prop="id"
                            label="ID">
                        </el-table-column>
                        <el-table-column
                            width="200"
                            prop="goods_title"
                            label="商品名称">
                        </el-table-column>
                        <el-table-column
                            width="120"
                            prop="sku_title"
                            label="规格名称">
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            width="120"
                            label="价格">
                        </el-table-column>
                        <el-table-column
                            width="120"
                            prop="amount"
                            label="数量">
                        </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="订单ID"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="user.name"
                    label="用户名"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="user.tel"
                    label="手机号"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="order_money"
                    label="订单金额"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="order_sn"
                    label="订单编号"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="order_status"
                    label="订单状态"
                    width="80">
                    <template slot-scope="scope">
                        {{ scope.row.order_status | statusReadble}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="pay_method"
                    label="支付方式"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="created_at"
                    label="创建日期"
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
const statusFormat = {
  '-2': '已关闭',
  '-1': '已取消',
  0: '全部订单',
  1: '待付款',
  2: '已付款',
  3: '已发货',
  4: '已收货',
  11: '已退回',
  12: '已收退货'
}
export default {
  data () {
    return {
      orderList: [],
      pagesize: 10,
      currentPage: 1,
      total: 0,
      searchInput: '',
      status: [
        { label: '已关闭', value: -2 },
        { label: '已取消', value: -1 },
        { label: '全部订单', value: 0 },
        { label: '待付款', value: 1 },
        { label: '已付款', value: 2 },
        { label: '已发货', value: 3 },
        { label: '已收货', value: 4 },
        { label: '已退回', value: 11 },
        { label: '已收退货', value: 12 }
      ],
      statusValue: 0,
      loading: true,
      multipleSelection: []
    }
  },
  methods: {
    /// on search////////////////////////////////////////////
    handleSelect () {
      this.currentPage = 1
      this.searchInput = ''
      this.getOrderList()
    },
    // 当前页变化触发
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.getOrderList()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getOrderList()
    },
    /// checkbox -----////////////////////////////////////////////////////////
    handleSelectionChange (val) {
      this.multipleSelection = val.map(item => {
        return item.id
      })
    },
    /// changeStatus -----////////////////////////////////////////////////////////
    async changeStatus () {
      const { data: res } = await this.$HTTP.post('order/send', { ids: this.multipleSelection })
      if (res.status === '200') {
        this.$message.success('更新成功')
        this.currentPage = 1
        this.getOrderList()
      } else {
        this.$message.error('更新失败')
        this.getOrderList()
      }
      console.log(res)
    },
    /// getOrderList ////////////////////////////////////////////////////////////////////////
    async getOrderList () {
      this.loading = true
      const { data: res } = await this.$HTTP.post('order/list',
        {
          page: this.currentPage,
          size: this.pagesize,
          words: this.searchInput,
          status: this.statusValue
        })
      this.total = res.orders.total
      console.log(res)
      if (res.status === 200) {
        this.loading = false
      } else {
        this.$message.error('加载失败')
      }
      this.orderList = res.orders.data
    }
  },
  filters: {
    statusReadble (status) {
      return statusFormat[status]
    }
  },
  created () {
    this.getOrderList()
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
