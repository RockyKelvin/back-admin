import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/goods_list',
        name: 'GoodsList',
        component: () => import('../components/GoodsList.vue')
      },
      {
        path: '/data_list',
        name: 'dataList',
        component: () => import('../components/DataList.vue')
      },
      {
        path: '/type_list',
        name: 'TypeList',
        component: () => import('../components/TypeList.vue')
      },
      {
        path: '/sku_list',
        name: 'SkuList',
        component: () => import('../components/SkuList.vue')
      },
      {
        path: '/user_list',
        name: 'UserList',
        component: () => import('../components/UserList.vue')
      },
      {
        path: '/team_leader',
        name: 'TeamLeader',
        component: () => import('../components/TeamLeader.vue')
      },
      {
        path: '/create_product',
        name: 'CreateProduct',
        component: () => import('../components/CreateProduct.vue')
      },
      {
        path: '/edit_goods',
        name: 'EditGoods',
        component: () => import('../components/EditGoods.vue')
      },
      {
        path: '/goods_detail',
        name: 'GoodsDetail',
        component: () => import('../components/GoodsDetail.vue')
      },
      {
        path: '/order_list',
        name: 'OrderList',
        component: () => import('../components/OrderList.vue')
      },
      {
        path: '/admin_list',
        name: 'AdminList',
        component: () => import('../components/AdminList.vue')
      },
      {
        path: '/permission_list',
        name: 'PermissionList',
        component: () => import('../components/PermissionList.vue')
      },
      {
        path: '/role_list',
        name: 'RoleList',
        component: () => import('../components/RoleList.vue')
      },
      {
        path: '/user_upload_icon',
        name: 'UserUploadIcon',
        component: () => import('../components/UserUploadIcon.vue')
      },
      {
        path: '/user_reset_password',
        name: 'UserResetPassword',
        component: () => import('../components/UserResetPassword.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    if (!sessionStorage.getItem('token')) {
      return next()
    } else {
      return next(sessionStorage.getItem('selectedIndex'))
    }
  }
  if (!sessionStorage.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})
export default router
