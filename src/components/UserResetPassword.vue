<template>
   <div>
        <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
        <el-breadcrumb separator="-">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="##">个人中心</a></el-breadcrumb-item>
            <el-breadcrumb-item>重置密码</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- ///////////////////////////box-card//////////////////////////////////////// -->
        <el-card class="pws-box-card">
            <el-form :model="form" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="旧密码">
                    <el-col :span="5">
                        <el-input v-model="form.oldPassword" type="password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-col :span="5">
                        <el-input v-model="form.password" type="password"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即提交</el-button>
                    <el-button @click="reset">重置</el-button>
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
        oldPassword: null,
        password: null
      }
    }
  },
  methods: {
    async onSubmit () {
      const res = await this.$HTTP.post('user/reset_password', this.form)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.reset()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    reset () {
      this.form.oldPassword = null
      this.form.password = null
    }
  }
}
</script>
<style lang="less">
.pws-box-card{
    margin-top: 30px;
}
</style>
