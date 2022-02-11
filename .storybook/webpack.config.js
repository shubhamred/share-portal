const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      app: path.resolve(__dirname, '../src/js')
    }
  },
  plugins: [
    new webpack.IgnorePlugin(/^(buffertools)$/),
    new webpack.DefinePlugin({
      ENV: {
        logDispatcher: true
      }
    }),
    new CopyWebpackPlugin([
      { from: './assets', to: './assets' }
    ])
  ],
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
  }
};
