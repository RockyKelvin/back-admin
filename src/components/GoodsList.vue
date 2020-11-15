<template>
    <div>
        <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
        <el-breadcrumb separator="-">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="##">商品</a></el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- ///////////////////////////create house//////////////////////////////////////// -->
        <el-card class="box-card">
            <el-row>
                <el-col :span="2">
                    <el-button type="primary" @click="newCreate()">+ 新增分类</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="danger" icon="el-icon-delete" @click="onDelete">删除分类</el-button>
                </el-col>
            </el-row>
            <!-- Products List////////////////////////////////////////////////////// -->
            <div class="table">
                <el-table
                :data="productsList"
                border
                row-key="id"
                style="width: 100%"
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        label="商品名称"
                        width="600">
                        <template slot-scope="scope">
                            <div class="title">
                                <div class="image">
                                    <img
                                        style="width: 50px; height: 50px"
                                        :src="scope.row.image"
                                        />
                                </div>
                                <p>{{scope.row.title}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="售价"
                        width="600">
                        <template slot-scope="scope">
                            <span>￥ {{scope.row.price}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sold_count"
                        label="销量"
                        width="600">
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        width="600">
                        <template slot-scope="scope">
                            <span>{{ scope.row.on_sale ? "已上架" : "已下架" }}</span>
                        </template>
                    </el-table-column>on_sale
                </el-table>
            <!-- create new categoray -->
            <!-- <el-dialog title="创建分类" :visible.sync="dialogFormVisible" width="30%">
                <el-form :model="form" label-width="100px" label-position="right">
                    <el-form-item label="排序">
                        <el-col :span="12"><el-input v-model="form.ord"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="上级">
                    <el-col :span="12">
                        <el-select v-model="form.pid" placeholder="请选择" @change="handleSelect">
                        <el-option-group label="一级分类">
                            <el-option label="创建一级根节点" :value="0"></el-option>
                        </el-option-group>
                        <el-option-group label="二级分类">
                            <el-option
                            v-for="item in goodsList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                            >
                            </el-option>
                        </el-option-group>
                        </el-select>
                    </el-col>
                    </el-form-item>
                    <el-form-item label="分类名称" required>
                        <el-col :span="18"><el-input v-model="form.title"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="分类描述">
                        <el-input v-model="form.des"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示">
                    <el-col :span="8">
                        <el-radio-group v-model="form.status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onCreate()">立即创建</el-button>
                </div>
            </el-dialog> -->
            <!-- update categoray -->
            <!-- <el-dialog title="更新分类" :visible.sync="updateFormVisible" width="30%">
                <el-form :model="form" label-width="100px" label-position="right">
                    <el-form-item label="排序">
                        <el-col :span="12"><el-input v-model="form.ord"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="上级">
                    <el-col :span="12">
                        <el-select v-model="form.pid" placeholder="请选择" @change="handleSelect">
                        <el-option-group label="一级分类">
                            <el-option label="修改一级根节点" :value="0"></el-option>
                        </el-option-group>
                        <el-option-group label="二级分类">
                            <el-option
                            v-for="item in goodsList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                            >
                            </el-option>
                        </el-option-group>
                        </el-select>
                    </el-col>
                    </el-form-item>
                    <el-form-item label="分类名称:" required>
                        <el-col :span="18"><el-input v-model="form.title"></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="分类描述">
                        <el-input v-model="form.des"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示">
                    <el-col :span="8">
                        <el-radio-group v-model="form.status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-col>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="updateFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="getUpdate()">立即更新</el-button>
                </div>
            </el-dialog> -->
        </div>
        <!-- //////分页器、、、、、、、、、、、、、、、、、、、、、、、、、、、、、//// -->
        <!-- 此例是一个完整的用例，使用了size-change和current-change
        事件来处理页码大小和当前页变动时候触发的事件。
        page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项，
        [100, 200, 300, 400]表示四个选项，每页显示 100 个，200 个，300 个
        或者 400 个。 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 6, 7, 5]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      productsList: [],
      pagesize: 8,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      formData: null,
      dialogFormVisible: false,
      updateFormVisible: false
    }
  },
  methods: {
    /// dropdown menue////////////////////////////////////////////
    handleSelect (id) {
      console.log(id)
    },
    /// ////////////////////////////////////////////////
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
      this.getHouseList()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getHouseList()
    },
    /// checkbox -----////////////////////////////////////////////////////////
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async getProductsList () {
      const { data: res } = await this.$HTTP.post('products/list')
      this.productsList = res.data
      console.log(res)
    },
    newCreate () {
      this.dialogFormVisible = true
      this.form = {
        pid: 0,
        title: '',
        ord: 0,
        status: 1
      }
    },
    onDelete () {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(async (item) => {
          this.deleteItem(item.id)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async deleteItem (id) {
    //   const { data: result } = await this.$HTTP.post('cate/delete', { id })
    //   if (result.status === 200) {
    //     this.$message.success('分类删除成功')
    //     this.getGoodsList()
    //   } else {
    //     this.$message.error('分类删除失败')
    //   }
    }
  },
  created () {
    this.getProductsList()
  }
}
</script>
<style lang="less" scoped>
.title{
    width: 100%;
    height: 100%;
    .image{
        float: left;
        height: 100%;
    }
    p{
        padding-left: 30px;
        float: left;
        height: 100%;
    }
}
</style>
