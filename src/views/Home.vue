<template>
  <div class="home">
    <el-container>
       <el-header class="header" style="background-color:#303133; font-size: 16px; color:silver;">
         <el-row class="header-row" type="flex">
            <el-col :span="2">
                <div class="header-logo">
                  <div class="header-img"><img src="../assets/img_sc/house_logo_3.png" alt="" ></div>
                  <div class="grid-content title" style="font-weight:bolder;">臣护驾</div>
                </div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content">欢迎您，{{username}}
              </div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content" >
                <div class="user-avatar">
                    <el-avatar class="avatar" :src="userIcon"></el-avatar>
                </div>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content" >
                <div class=logout><el-button size="mini" type="info" @click="logout">退出</el-button></div>
              </div>
            </el-col>
        </el-row>
      </el-header>
      <!-- ////////header////////////////////////////////////////////////////////////////////////////// -->
      <el-container>
        <el-aside :width="asideWidth">
          <div class="collapse_button" @click="menuCollapse">|||</div>
          <el-menu
              :collapse="isCollapsed"
              :collapse-transition="false"
              router
              unique-opened
              :default-active="activeIndex"
              @select = "selectedIndex"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu v-for="listItem in menuList" :key="listItem.id" :index="listItem.id+''">
                <template slot="title">
                  <i :class="listItem.icon"></i>
                  <span>{{listItem.name}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="subListItem in listItem.children" :key="subListItem.id" :index="subListItem.path">
                     <div class="sublist">
                       <i class="el-icon-document"></i>
                          {{subListItem.name}}
                      </div>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
          </el-menu>
        </el-aside>
        <!-- ////////////////////////////////////主页面///////////////////////////////////// -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Bus from '../bus'
export default {
  name: 'Home',
  data () {
    return {
      username: '',
      userIcon: '',
      menuList: [],
      activeIndex: '',
      isCollapsed: false,
      asideWidth: '200px'
    }
  },
  methods: {
    selectedIndex (index) {
      sessionStorage.setItem('selectedIndex', index)
    },
    menuCollapse () {
      this.isCollapsed = !this.isCollapsed
      if (this.isCollapsed === false) {
        this.asideWidth = '200px'
      } else if (this.isCollapsed === true) {
        this.asideWidth = '65px'
      }
    },
    logout () {
      sessionStorage.removeItem('selectedIndex')
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$HTTP.post('permission/menus')
      this.menuList = res.data
      console.log('home-----', res)
    }
  },
  created () {
    Bus.$on('avatar', avatar => {
      this.userIcon = avatar
    })
    if (sessionStorage.getItem('selectedIndex')) {
      this.activeIndex = sessionStorage.getItem('selectedIndex')
    } else {
      this.activeIndex = 'type_list'
    }
    this.username = sessionStorage.getItem('username')
    this.userIcon = sessionStorage.getItem('user_icon')
    this.getMenuList()
  }
}
</script>
<style lang="less" scoped>
.el-aside {
  min-width:65px;
  background-color: #545c64;
  color: #333;
  text-align: left;
  line-height: 200px;
}
.el-menu {
    border-right: 0px;
    height: 100vh;
}
.title{
  width: 100px;
  height: 60px;
  float: right;
}
.header-row{
  text-align: right;
  height: 100%;
  line-height: 60px;
  position: relative;
  overflow: hidden;
}
.header-logo{
  text-align: left;
  width: 150px;
  height: 60px;
  position: relative;
  overflow: hidden;
}
.header-img {
  position: absolute;
  width: 40px;
  height: 40px;
  border:1px solid;
  border-radius:50%;
  margin: auto 0;
  top:0;
  left:0;
  right:0;
  bottom: 0;
}
.header-img img {
  position: absolute;
  width: 25px;
  height: 25px;
  margin: auto;
  top:0;
  left:0;
  right:0;
  bottom: 0;
}
.user-avatar{
  position: relative;
  height: 60px;
  width:70px;
}
.avatar{
  position: absolute;
  width: 45px;
  height: 45px;
  margin: auto;
  top:0;
  left:0;
  right:0;
  bottom: 0;
}
.logout{
  text-align: left;
  width:60px;
  height: 60px;
  overflow: hidden;
}
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  line-height: 160px;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.collapse_button {
  cursor:pointer;
  line-height: 50px;
  text-align: center;
  height: 50px;
  background: #4D5162;
  border:none;
  color:white;
  font-size:25px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
.el-main {
  line-height: 100%;
}
</style>
