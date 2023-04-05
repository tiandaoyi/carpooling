const path = require('path') 
const resolve = (dir) => path.join(__dirname, dir)
const webpack = require('webpack') // 引入webpack库
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin') // 引入lodash-webpack-plugin
const FileListWebpackPlugin = require('./webpack/FileListWebpackPlugin.js')
module.exports = {
  // 关闭eslint校验报错
  lintOnSave: false,
  productionSourceMap: false,
  assetsDir: 'static',
  publicPath: './',
  runtimeCompiler: true,
  devServer: {
    // 设置代理
    proxy: {
      '/carpooling-api': { // 开发环境
        target: 'https://sit-hxjf.hongxinshop.com',
        changeOrigin: true, // 是否跨域
      },
      '/local-carpooling-api': { // 本地连接远程
        target: 'https://sit-hxjf.hongxinshop.com',
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/local-carpooling-api': '/' // 重定向
        }
      },
      // '/local-carpooling-api': { // 本地
      //   target: 'http://localhost:7002',
      //   changeOrigin: true, // 是否跨域
      //   pathRewrite: {
      //     '^/local-carpooling-api': '/api' // 重定向
      //   }
      // },
      '/mit-api': {
        target: 'https://mit-hxjf.hongxinshop.com',
        changeOrigin: true,
        pathRewrite: {
          '^/mit-api': ''
        }
      },
      '/sit-api': {
        // 开发环境
        target: 'https://sit-hxjf.hongxinshop.com',
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/sit-api': '', // 重定向
        },
      },
      '/uat-api': {
        target: 'https://uat-hxjf.hongxinshop.com',
        changeOrigin: true,
        pathRewrite: {
          '^/uat-api': '',
        },
      },
    }
  },
  chainWebpack: config => {
    // 路径简化
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@components', resolve('src/components'))
      .set('@styles', resolve('src/styles'))
    // 优化moment
    config.plugin('ignore')
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    // 优化lodash
    config.plugin('loadshReplace')
      .use(new LodashModuleReplacementPlugin())
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
    config.plugin('fileListWebpackPlugin')
      .use(new FileListWebpackPlugin(config))
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: 'vue',
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
}
