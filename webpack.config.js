const path = require('path');

module.exports = {
  entry: './src/core/index.js',
  output: {
    filename: 'slidekit.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'SlideKit',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  devtool: 'source-map'
}; 