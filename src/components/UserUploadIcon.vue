<template>
    <div>
        <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
        <el-breadcrumb separator="-">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="##">个人中心</a></el-breadcrumb-item>
            <el-breadcrumb-item>头像上传</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- ///////////////////////////box-card//////////////////////////////////////// -->
        <el-card class="avatar-box-card">
            <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                ref = "avatarImg"
                list-type="picture-card"
                :auto-upload = "false"
                :limit="1"
                :http-request = "uploadImg">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <div class="btn">
                <el-button size="small" type="primary" @click="onSubmit">点击上传</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import Bus from '../bus'
export default {
  data () {
    return {
      formData: null,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    /// upload Img///////////////////////////////////////////////////
    uploadImg (pic) {
      this.formData.append('pic', pic.file)
      console.log('test', pic)
    },
    async onSubmit () {
      this.formData = new FormData()
      this.$refs.avatarImg.submit()
      const { data: res } = await this.$HTTP.post('user/upload_icon', this.formData)
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success(res.meta.msg)
        Bus.$emit('avatar', res.meta.user.icon)
        sessionStorage.setItem('user_icon', res.meta.user.icon)
        this.$refs.avatarImg.clearFiles()
      } else {
        this.$message.error('头像上传失败!', res.meta.msg)
      }
    }
  }
}
</script>
<style lang="less">
.avatar-box-card{
    margin-top: 30px;
    .btn{
        padding: 20px 30px;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
}
</style>
