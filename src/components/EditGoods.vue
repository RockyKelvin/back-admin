<template>
    <div>
        <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
        <el-breadcrumb separator="-">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="##">商品</a></el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>发布商品</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- ///////////////////////////box-card//////////////////////////////////////// -->
        <el-card class="box-card">
           <el-form :model="form" label-width="100px">
            <el-form-item label="商品分类" required>
              <el-select v-model="form.pid" placeholder="请选择分类">
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
            </el-form-item>
            <el-form-item label="商品名称" required>
               <el-col :span="18"><el-input v-model="form.title"></el-input></el-col>
            </el-form-item>
            <el-form-item label="商品价格" required>
               <el-col :span="18"><el-input v-model="form.price"></el-input></el-col>
            </el-form-item>
            <el-form-item label="商品描述">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="是否上架">
                <el-switch
                    v-model="form.on_sale"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change = "switchChange"
                    >
                </el-switch>
            </el-form-item>
            <el-form-item label="上传图片">
                <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    multiple
                    :auto-upload = "false"
                    :http-request = "uploadImg"
                    ref = "imgupload"
                    :file-list="fileList"
                    :on-remove="handleRemove"
                    >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onUpdate">保存修改</el-button>
                <el-button @click="goBack">返 回</el-button>
            </el-form-item>
          </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        pid: null,
        title: '',
        description: '',
        on_sale: true,
        price: ''
      },
      formData: null,
      cateList: [],
      id: null,
      fileList: []
    }
  },
  methods: {
    /// //////////////////////////////////////////////////////////
    goBack () {
      this.$router.back()
    },
    // switch Change//////////////////////////////////////////
    switchChange (val) {
      this.form.on_sale = val
    },
    /// upload Img///////////////////////////////////////////////////
    uploadImg (pic) {
      this.formData.append('pic[]', pic.file)
      console.log('test', pic)
    },
    /// Delete Img///////////////////////////////////////////////
    async handleRemove (file, fileList) {
      if (!file.is_del) {
        return false
      }
      console.log(file, fileList)
      const arr = file.url.split('/')
      const img = arr[5]
      const { data: res } = await this.$HTTP.post('products/del_img', { id: this.id, img })
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
      } else {
        this.$message.error('删除失败', res.meta.msg)
      }
    },
    async onUpdate () {
      this.formData = new FormData()
      this.formData.append('form', JSON.stringify(this.form))
      this.$refs.imgupload.submit()
      const { data: res } = await this.$HTTP.post('products/update', this.formData)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
        this.$router.push('/goods_list')
      } else {
        this.$message.error(res.meta.msg)
      }
      console.log(res)
    },
    /// get Product list///////////////////////////////////////////////////
    async getProductsDetail () {
      const { data: res } = await this.$HTTP.post('products/detail', { id: this.id })
      this.form = { ...res }
      // this.fileList = res.image
      this.fileList = res.image.map(item => {
        const obj = {}
        obj.url = item
        obj.is_del = true
        return obj
      })
      console.log('fileList', this.fileList)
    },
    /// get cate list///////////////////////////////////////////////////
    async getCateList () {
      const { data: res } = await this.$HTTP.get('cate/list')
      console.log(res)
      this.cateList = res
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getCateList()
    this.getProductsDetail()
  }
}
</script>
<style lang="less" scoped>
.box-card{
  margin-top: 30px;
}
</style>
