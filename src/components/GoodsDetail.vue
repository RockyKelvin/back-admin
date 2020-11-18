<template>
    <div>
         <!--/////////////////////////////导航栏 /////////////////////////////////////////-->
        <el-breadcrumb separator="-">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="##">商品</a></el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- ///////////////////////////box-card//////////////////////////////////////// -->
        <el-card class="box-card">
            <el-carousel :interval="4000" type="card" height="400px">
                <el-carousel-item v-for="item in form.image" :key="item">
                <h3 class="medium"><img :src="item"></h3>
                </el-carousel-item>
            </el-carousel>
            <div class="goods_detail">
                <el-row>
                    <el-col :span="3"><div class="grid-content bg-purple">商品名称</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{form.title}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3"><div class="grid-content bg-purple">商品价格</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">￥ {{form.price}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3"><div class="grid-content bg-purple">销量</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{form.sold_count}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3"><div class="grid-content bg-purple">评价</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{form.review_count}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3"><div class="grid-content bg-purple">创建时间</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{form.created_at}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3"><div class="grid-content bg-purple">更新时间</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{form.updated_at}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3"><div class="grid-content bg-purple">是否已上架</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light"> {{form.on_sale ? '是':'否'}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3"><div class="grid-content bg-purple">描述</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{form.description}}</div></el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      id: null,
      form: {
        pid: null,
        title: '',
        description: '',
        on_sale: true,
        price: '',
        image: [],
        sold_count: 0,
        review_count: 0,
        created_at: '',
        updated_atL: ''
      }
    }
  },
  methods: {
    /// get Product list///////////////////////////////////////////////////
    async getGoodsDetail () {
      const { data: res } = await this.$HTTP.post('products/detail', { id: this.id })
      this.form = { ...res }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getGoodsDetail()
  }
}
</script>

<style lang="less" scoped>
.box-card{
  margin-top: 30px;
    .goods_detail{
        .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
        line-height: 50px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        box-sizing: border-box;
        padding-left: 20px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
  }
}
</style>
