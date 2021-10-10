const registerRouter = require('./backend/router');

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      config.plugins.push(new BundleAnalyzerPlugin());
    }
  },
  devServer: {
    before (app) {
      registerRouter(app);
    }
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/music-next/' : '/music-next/'
};
