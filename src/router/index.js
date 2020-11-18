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
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
