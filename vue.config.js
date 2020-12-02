module.exports = {
  devServer: {
    proxy: 'http://www.lvjiayuan.net/public/index.php/api/'
    // proxy: 'http://10.1.237.10/shop_api_1912/public/index.php/api/'
  },
  publicPath: './',
  // 1 新增加的配置项
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
      config.set('externals', {
        vue: 'Vue',
        'element-ui': 'ELEMENT'
      })
      config.entry('app').clear().add('./src/main-prod.js')
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }

}
