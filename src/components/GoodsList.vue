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
                    <el-button type="primary" icon="el-icon-plus" @click="createProduct">发布商品</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button type="danger" icon="el-icon-delete" @click="confirmDeleteAll">批量删除</el-button>
                </el-col>
                <el-col :span="3">
                  <el-select v-model="pid" placeholder="请选择分类" @change="handleSelect">
                    <el-option-group
                        v-for="item in cateList"
                        :key="item.id"
                        :label="item.title"
                        >
                      <el-option
                        v-for="i in item.children"
                        :key="i.id"
                        :label="i.title"
                        :value="i.id"
                        >
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getProductsList"></el-button>
                  </el-input>
                </el-col>
            </el-row>
            <!-- Products List////////////////////////////////////////////////////// -->
            <div class="table">
                <el-table
                  v-loading="loading"
                  :data="productsList"
                  stripe
                  border
                  row-key="id"
                  style="width: 100%"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                  @selection-change="handleSelectionChange">
                    <el-table-column type="expand">
                      <template slot-scope="props">
                         <el-table
                          :data="props.row.skus"
                          style="width: 100%">
                           <el-table-column
                            width="180"
                            prop="title"
                            label="商品名称">
                          </el-table-column>
                          <el-table-column
                            width="120"
                            prop="price"
                            label="价格">
                          </el-table-column>
                          <el-table-column
                            width="120"
                            prop="stock"
                            label="库存">
                          </el-table-column>
                           <el-table-column
                            prop="description"
                            label="规格描述"
                            width="400">
                          </el-table-column>
                          <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteSku(scope.row.id)"></el-button>
                                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editSku(scope.row)"></el-button>
                            </template>
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
                        label="ID"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="商品名称"
                        width="300">
                    </el-table-column>
                    <el-table-column
                        label="售价"
                        width="200">
                        <template slot-scope="scope">
                            <span>￥ {{scope.row.price}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="sold_count"
                        label="销量"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        label="上架状态"
                        width="200">
                        <template slot-scope="scope">
                          <el-switch
                              v-model="scope.row.on_sale"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                              @change = "updateSwitch(scope.row)"
                              >
                          </el-switch>
                        </template>
                    </el-table-column>
                     <el-table-column
                        prop="created_at"
                        label="创建时间"
                        width="200">
                    </el-table-column>
                     <el-table-column label="操作">
                       <template slot-scope="scope">
                          <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteRow(scope.row.id)"></el-button>
                          <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editItem(scope.row)"></el-button>
                          <el-button type="primary" plain size="mini" @click="getProductDetail(scope.row.id)" >商品详情</el-button>
                          <el-button type="primary" plain size="mini" @click="addSku(scope.row.id)" >添加规格</el-button>
                       </template>
                    </el-table-column>
                </el-table>
          </div>
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
        </el-card>
        <el-dialog
          title="创建规格"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="form" label-width="100px" label-position="right" :rules="rules" ref="addSkuruleForm">
            <el-form-item label="商品名称" prop="title">
                <el-col :span="18"><el-input v-model="form.title"></el-input></el-col>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <el-col :span="18"><el-input v-model.number="form.price"></el-input></el-col>
            </el-form-item>
            <el-form-item label="商品库存" prop="stock">
                <el-col :span="18"><el-input v-model.number="form.stock"></el-input></el-col>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddSku">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="修改规格"
          :visible.sync="editDialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-form :model="form" label-width="100px" label-position="right" :rules="rules" ref="editSkuruleForm">
            <el-form-item label="商品名称" prop="title">
                <el-col :span="18"><el-input v-model="form.title"></el-input></el-col>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <el-col :span="18"><el-input v-model.number="form.price"></el-input></el-col>
            </el-form-item>
            <el-form-item label="商品库存" prop="stock">
                <el-col :span="18"><el-input v-model.number="form.stock"></el-input></el-col>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditSku">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      pid: 0,
      searchInput: '',
      productsList: [],
      pagesize: 10,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      deletAllSelect: [],
      formData: null,
      dialogFormVisible: false,
      updateFormVisible: false,
      dialogVisible: false,
      editDialogVisible: false,
      loading: true,
      form: {
        id: null,
        product_id: '',
        title: '',
        description: '',
        price: '',
        stock: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空' },
          { type: 'number', message: '价格必须为数字值' }
        ],
        stock: [
          { required: true, message: '商品描述不能为空' },
          { type: 'number', message: '商品描述必须为数字值' }
        ],
        description: [
          { required: true, message: '请输入商品描述', trigger: 'blur' },
          { min: 3, max: 300, message: '长度在 3 到 300 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /// on search////////////////////////////////////////////
    handleSelect (id) {
      this.currentPage = 1
      this.searchInput = ''
      this.getProductsList()
    },
    /// ////////////////////////////////////////////////
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // add Sku/////////////////////////////////////////
    addSku (id) {
      this.form = {
        product_id: id,
        title: '',
        description: '',
        price: '',
        stock: ''
      }
      this.dialogVisible = true
    },
    async submitAddSku () {
      this.$refs.addSkuruleForm.validate(async (valid) => {
        if (valid) {
          this.dialogVisible = false
          const { data: res } = await this.$HTTP.post('sku/add', this.form)
          if (res.status === 200) {
            this.$message.success(res.msg)
            this.getProductsList()
          } else {
            this.$message.error('添加规格失败', res.msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // Edit Sku/////////////////////////////////////////
    editSku (sku) {
      this.form = { ...sku }
      this.editDialogVisible = true
    },
    async submitEditSku () {
      this.$refs.editSkuruleForm.validate(async (valid) => {
        if (valid) {
          this.editDialogVisible = false
          const { data: res } = await this.$HTTP.post('sku/update', this.form)
          if (res.status === 200) {
            this.$message.success(res.msg)
            this.getProductsList()
          } else {
            this.$message.error('添加规格失败', res.msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // delete sku ////////////////////////////////////
    async deleteSku (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmDeleteSku(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async confirmDeleteSku (id) {
      const { data: res } = await this.$HTTP.post('sku/del', { id })
      if (res.status === 200) {
        this.$message.success(res.msg)
        this.getProductsList()
      } else {
        this.$message.error('删除规格失败', res.msg)
      }
    },
    // editItem////////////////////////////////////////
    editItem (val) {
      this.$router.push({
        path: '/edit_goods',
        query: {
          id: val.id
        }
      })
    },
    /// getProductDetail////////////////////////////////////
    getProductDetail (id) {
      this.$router.push({
        path: '/goods_detail',
        query: {
          id: id
        }
      })
    },
    // update switch////////////////////////////////////////
    async updateSwitch (val) {
      const { id } = { ...val }
      const onSale = val.on_sale
      const { data: result } = await this.$HTTP.post('products/state', { id, on_sale: onSale })
      if (result.meta.status === 200) {
        this.$message.success(result.meta.msg)
        this.getProductsList()
      } else {
        this.$message.error('数据更新失败', result.meta.msg)
      }
    },
    // 当前页变化触发
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.getProductsList()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.getProductsList()
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
    /// createProduct -----////////////////////////////////////////////////////////
    createProduct () {
      this.$router.push('/create_product')
    },
    async getProductsList () {
      this.loading = true
      const { data: res } = await this.$HTTP.post('products/list', {
        size: this.pagesize,
        page: this.currentPage,
        pid: this.pid,
        words: this.searchInput
      })
      this.productsList = res.data
      this.total = res.total
      this.loading = false
    },
    /// delete item///////////////////////////////////
    async deleteRow (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItem(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async confirmDeleteAll () {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.deleteAll()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async deleteAll () {
      this.multipleSelection.forEach((item) => {
        this.deletAllSelect.push(item.id)
      })
      const { data: result } = await this.$HTTP.post('products/del_all', { id_arr: this.deletAllSelect })
      if (result.status === 200) {
        this.$message.success(result.msg)
        this.getProductsList()
      } else {
        this.$message.error('批量删除失败', result.msg)
      }
      this.deletAllSelect = []
    },
    async deleteItem (id) {
      const { data: result } = await this.$HTTP.post('products/del', { id })
      if (result.status === 200) {
        this.getProductsList()
        this.$message.success('分类删除成功')
      } else {
        this.$message.error('分类删除失败')
      }
    },
    /// get cate list///////////////////////////////////////////////////
    async getCateList () {
      const { data: res } = await this.$HTTP.get('cate/list')
      this.cateList = res
      this.cateList.unshift({
        title: '全部',
        children: [{
          id: 0,
          title: '搜索全部'
        }]
      })
    }
  },
  created () {
    this.getProductsList()
    this.getCateList()
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
.demo-table-expand {
    font-size: 0;
  }
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 20%;
}
.box-card{
  margin-top: 30px;
  .table{
    padding-top: 20px;
  }
  .pages{
    text-align: center;
  }
}
</style>
