const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'
const cdnDomian = process.env.QINIU_CDN ? process.env.QINIU_domain || '/' : '/'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  publicPath: isProd ? cdnDomian : '/',
  configureWebpack: {
    optimization: {
      splitChunks: {
        // chunks: "initial"，"async"和"all"分别是：初始块，按需块或所有块；
        chunks: 'async',
        // （默认值：30000）块的最小大小
        minSize: 30000,
        // （默认值：0）块的最大大小
        maxSize: 30000 * 100,
        // （默认值：1）分割前共享模块的最小块数
        minChunks: 1,
        // （缺省值5）按需加载时的最大并行请求数
        maxAsyncRequests: 8,
        // （默认值3）入口点上的最大并行请求数
        maxInitialRequests: 8,
        // webpack 将使用块的起源和名称来生成名称: `vendors~main.js`,如项目与"~"冲突，则可通过此值修改，Eg: '-'
        automaticNameDelimiter: '~',
        // cacheGroups is an object where keys are the cache group names.
        name: true,
        cacheGroups: {
          // 设置为 false 以禁用默认缓存组
          // default: false,
          antdv: {
            name: 'chunk-antdv',
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            chunks: 'initial',
            // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
            priority: 0
          },
          antv: {
            name: 'chunk-antv',
            test: /[\\/]node_modules[\\/]@antv[\\/]/,
            chunks: 'initial',
            // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
            priority: 0
          },
          antdicon: {
            name: 'chunk-antdicon',
            test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
            chunks: 'initial',
            // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
            priority: 0
          },
        }
      //   minSize: 50000,
      //   maxSize: 200000,
      //   cacheGroups: {
      //     vendors: {
      //       name: 'chunk-vendors',
      //       test: /[\\/]node_modules[\\/]/,
      //       priority: -10,
      //       chunks: 'all'
      //     },
      //     common: {
      //       name: 'chunk-common',
      //       minChunks: 2,
      //       priority: -20,
      //       chunks: 'all',
      //       reuseExistingChunk: true
      //     }
      //   }
      }
    },
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/api': {
        target: process.env.proxy_target || 'http://localhost:3000/',
        ws: false,
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
