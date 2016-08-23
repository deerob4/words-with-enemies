let path = require('path');
let webpack = require('webpack');
let autoprefixer = require('autoprefixer');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

const join = (dest) => path.resolve(__dirname, dest);
const web = (dest) => join('web/static/' + dest);

const env = process.env.MIX_ENV || 'dev';
const prod = env === 'prod';
const publicPath = 'http://localhost:4001/';
const hot = `webpack-hot-middleware/client?path=${publicPath}__webpack_hmr`;
const entry = web('js/index.js');

let plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    __PROD: prod,
    __DEV: env === 'dev'
  })
];

let config = {
  entry: prod ? entry : ['react-hot-loader/patch', 'babel-regenerator-runtime',  entry, hot],
  devtool: prod ? null : 'cheap-module-eval-source-map',

  output: {
    path: join('/priv/static/js'),
    filename: 'index.js',
    publicPath,
  },

  resolve: {
    alias: {
      actions: web('js/actions'),
      css: web('css'),
      components: web('js/components'),
      constants: web('js/constants'),
      layouts: web('js/layouts'),
      views: web('js/views'),
      utils: web('js/utils'),
    }
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: join('/node_modules/'),
        loader: 'babel',
        query: {
          cacheDirectory: true,
        }
      },
      {
        test: /\.css$/,
        loaders: [
          'style?sourceMap',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss'
        ]
      }
    ]
  },

  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ],

  plugins,
};

if (env === 'dev') {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (prod) {
  plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  );
}

module.exports = config;
