<template>
  <div class="wrap">
      <div class="loginForm">
          <el-form ref="ruleForm" :rules="rules" :model="user">
            <el-form-item prop="username">
                <el-input v-model="user.username" >
                  <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="user.password" type="password">
                  <i slot="prefix" class="el-input__icon el-icon-s-goods"></i>
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">登陆</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '密码长度至少3位数', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        // console.log(valid)
        if (valid) {
          this.login()
        } else {
          return false
        }
      })
    },

    async login () {
      const res = await this.$HTTP.post('user/login', this.user)
      const result = res.data
      if (result.meta.status === 200) {
        this.$message({ message: result.meta.msg, type: 'success' })
        sessionStorage.setItem('user_icon', result.data.icon)
        sessionStorage.setItem('username', result.data.username)
        sessionStorage.setItem('token', result.data.api_token)
        this.$router.push('/type_list')
      } else {
        this.$message({ message: result.meta.msg, type: 'warning' })
      }
    }
  }
}
</script>

<style>
.wrap{
  max-width: 100%;
  height: 100vh;
  background-color: #314B69;
}
.loginForm{
  position: absolute;
  width:450px;
  height: 200px;
  top:0;
  left:0;
  right:0;
  bottom:0;
  margin: auto;
  background-color: white;
  text-align: right;
  padding:2% 2% 1% 2%;
  border-radius: 2%;
}
</style>
