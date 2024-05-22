const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/yahtzee.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{test: /\.ts$/, use: 'ts-loader'}],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
};
