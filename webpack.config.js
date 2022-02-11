const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('config');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
    alias: {
      app: path.resolve(__dirname, 'src/js')
    }
  },
  entry: './src/js/app.jsx',
  output: {
    path: path.join(__dirname, '/public'),
    // filename: 'bundle.js'
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
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
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[local]-[hash:base64:5]'
              }
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
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8090,
    hot: true
    // watchOptions: {
    //   poll: 1000,
    //   ignored: ['node_modules']
    // }
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './assets', to: './assets' }
      ]
    }),
    // new CopyWebpackPlugin([{ from: './assets', to: './assets' }]),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, './src/index.html')
    }),
    new webpack.IgnorePlugin(/^(buffertools)$/),
    new webpack.DefinePlugin({
      ENV: JSON.stringify(config.webpack),
      appConfig: JSON.stringify(config.clientConfig),
      authConfig: JSON.stringify(config.authConfig)
    }),
    new webpack.LoaderOptionsPlugin({ debug: process.env === 'production' })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    noEmitOnErrors: true // NoEmitOnErrorsPlugin
  },
  devtool: 'eval-source-map'
};
