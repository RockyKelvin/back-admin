<template>
 <div>
    <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
    <el-breadcrumb separator="-">
      <el-breadcrumb-item >首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="##">商品</a></el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- ///////////////////////////create house//////////////////////////////////////// -->
    <el-card class="box-card">
         <el-row>
          <el-col :span="2">
            <el-button type="primary" icon="el-icon-plus" @click="newCreate()">新增分类</el-button>
          </el-col>
          <el-col :span="2">
             <el-button type="danger" icon="el-icon-delete" @click="onDelete">删除分类</el-button>
          </el-col>
        </el-row>
          <!-- Type List////////////////////////////////////////////////////// -->
        <div class="table">
         <el-table
          v-loading="loading"
          :data="goodsList"
          border
          stripe
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
            prop="id"
            label="ID"
            width="100">
          </el-table-column>
          <el-table-column
            label="图片"
            width="80">
            <template slot-scope="scope">
              <img :src="scope.row.img" width="50px" height="50px" />
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="分类名称"
            width="400">
          </el-table-column>
           <el-table-column
            prop="ord"
            label="排序"
            width="100">
          </el-table-column>
          <el-table-column
            label="是否显示"
            width="180">
           <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change = "updateSwitch"
                  >
              </el-switch>
           </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="创建日期"
            width="300">
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit"  size="mini" @click="updateItem(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete"  size="mini"  @click="deleteRow(scope.row.id)"></el-button>
              </template>
          </el-table-column>
        </el-table>
        <!-- create new categoray -->
        <el-dialog title="创建分类" :visible.sync="dialogFormVisible" width="30%" >
          <el-form :model="form" label-width="100px" label-position="right">
            <el-form-item label="排序">
                 <el-col :span="12"><el-input v-model="form.ord"></el-input></el-col>
            </el-form-item>
            <el-form-item label="上级">
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
            </el-form-item>
            <el-form-item label="分类名称" required>
               <el-col :span="18"><el-input v-model="form.title"></el-input></el-col>
            </el-form-item>
            <el-form-item label="分类描述">
                <el-input v-model="form.des"></el-input>
            </el-form-item>
            <el-form-item label="是否显示">
                <el-radio-group v-model="form.status">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="图片">
                <el-upload
                  class="upload-demo"
                  action=""
                  :auto-upload = "false"
                  :http-request = "uploadImg"
                  :limit="1"
                  ref = "imgupload"
                  >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onCreate()">立即创建</el-button>
          </div>
        </el-dialog>
        <!-- update categoray -->
        <el-dialog title="更新分类" :visible.sync="updateFormVisible" width="30%">
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
              <el-switch
                  v-model="form.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change = "updateSwitch"
                  >
              </el-switch>
            </el-form-item>
            <el-form-item label="图片">
              <el-upload
                class="upload-demo"
                action=""
                :auto-upload = "false"
                :http-request = "uploadImg"
                ref = "updateImgupload"
                :file-list="fileList"
                :limit="1"
                >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="updateFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="getUpdate()">立即更新</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
 </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      multipleSelection: [],
      form: {
        pid: 0,
        title: '',
        ord: 0,
        status: 1,
        des: ''
      },
      fileList: [],
      formData: null,
      dialogFormVisible: false,
      updateFormVisible: false,
      dropMenueTitle: '选择父节点',
      loading: true
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
    /// upload Img///////////////////////////////////////////////////
    uploadImg (pic) {
      this.formData.append('pic', pic.file)
    },
    /// /////////////////////////////////////////////////////////////
    newCreate () {
      this.dialogFormVisible = true
      this.form = {
        pid: 0,
        title: '',
        ord: 0,
        status: 1
      }
      this.fileList = []
    },
    async onCreate () {
      this.formData = new FormData()
      this.$refs.imgupload.submit()
      this.formData.append('form', JSON.stringify(this.form))
      const { data: res } = await this.$HTTP.post('cate/store', this.formData)
      if (res.status === 200) {
        this.$message.success(res.msg)
      } else {
        return this.$message.error(res.msg)
      }
      this.dialogFormVisible = false
      this.getGoodsList()
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
    /// update item/////////////////////////////////////////////
    updateItem (item) {
      const index = this.goodsList.findIndex(element => {
        return element.id === item.pid
      })
      if (index >= 0) {
        this.dropMenueTitle = this.goodsList[index].title
      } else {
        this.dropMenueTitle = ''
      }
      this.updateFormVisible = true
      this.form = { ...item }
      this.fileList = []
    },
    async getUpdate () {
      this.formData = new FormData()
      this.$refs.updateImgupload.submit()
      this.formData.append('form', JSON.stringify(this.form))
      const { data: res } = await this.$HTTP.post('cate/update', this.formData)
      if (res.status === 200) {
        this.$message.success(res.msg)
        this.updateFormVisible = false
      } else {
        return this.$message.error(res.msg)
      }
      this.getGoodsList()
    },
    /// delete item///////////////////////////////////
    deleteRow (id) {
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
    async deleteItem (id) {
      const { data: result } = await this.$HTTP.post('cate/delete', { id })
      if (result.status === 200) {
        this.$message.success('分类删除成功')
        this.getGoodsList()
      } else {
        this.$message.error('分类删除失败')
      }
    },
    // update switch
    updateSwitch (val) {
      this.form.status = val
    },
    // switch change
    async switchChange (val) {
      const id = val.id
      const status = val.status === true ? 1 : 0
      const { data: result } = await this.$HTTP.post('cate/update_state', { id, status })
      if (result.status === 200) {
        this.$message.success('数据更新成功')
        this.getGoodsList()
      } else {
        this.$message.error('数据更新失败')
      }
    },
    async getGoodsList () {
      this.loading = true
      const { data: res } = await this.$HTTP.get('cate/list')
      const goodsList = res
      goodsList.forEach(async (item) => {
        if (item.children.length > 0) {
          item.children.forEach(element => {
            element.status = element.status === 1
          })
        }
        item.status = item.status === 1
      })
      this.goodsList = goodsList
      this.loading = false
    }
  },
  created () {
    this.getGoodsList()
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
