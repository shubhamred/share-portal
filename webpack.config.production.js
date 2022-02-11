const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('config');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin2');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    alias: {
      app: path.resolve(__dirname, 'src/js')
    }
  },
  entry: './src/js/app.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /(src[\/\\]js)/,
        loader: 'babel-loader'
      },
      {
        test: /\.jsx?$/,
        include: /(src[\/\\]js)/,
        loader: 'babel-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|ico|gif)?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './assets', to: './assets' }
      ]
    }),
    // new CopyWebpackPlugin([
    //   { from: './assets', to: './assets' }
    // ]),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.join(__dirname, './src/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new webpack.IgnorePlugin(/^(buffertools)$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`
      },
      ENV: JSON.stringify(config.webpack),
      appConfig: JSON.stringify(config.clientConfig),
      authConfig: JSON.stringify(config.authConfig)
    }),
    new Visualizer({ filename: '../reports/bundle-statistics.html' }),
    new webpack.LoaderOptionsPlugin({ debug: process.env === 'production' })
  ],
  optimization: {
    noEmitOnErrors: true // NoEmitOnErrorsPlugin
  }
};
