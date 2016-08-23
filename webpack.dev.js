#!/usr/bin/env node

let cors = require('cors');
let express = require('express');
let webpack = require('webpack');
let config = require('./webpack.config');
let webpackDevMiddleware = require('webpack-dev-middleware');
let webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const compiler = webpack(config);

app.use(cors());

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  stats: { colors: true },
  publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}));

app.listen(4001, 'localhost', err => {
  if (err) return console.log(err);
  console.log('Webpack server running on port 4001');
});

process.stdin.resume();
process.stdin.on('end', () => process.exit(0));
