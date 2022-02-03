const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const args = process.argv.slice(2);
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpackMode = /--mode[\s|=]?\s+?"?production"?/.test(args.join(' '))
  ? 'production'
  : NODE_ENV;
const isDev = webpackMode !== 'production';

const SRC_PATH = path.resolve(__dirname, 'src');
const PORT = process.env.PORT || 3001;
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

module.exports = {
  devtool: isDev ? 'eval-source-map' : 'source-map',
  devServer: {
    compress: true,
    historyApiFallback: true,
    port: PORT,
  },
  entry: {
    main: [path.resolve(SRC_PATH, 'index.tsx')],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[fullhash:8].js',
    chunkFilename: '[name].[fullhash:8].chunk.js',
    assetModuleFilename: 'images/[hash][ext]',
    publicPath: PUBLIC_PATH,
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    descriptionFiles: ['package.json'],
    modules: ['node_modules'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [SRC_PATH],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_PATH, 'index.html'),
      publicPath: PUBLIC_PATH,
    }),
    new ForkTsCheckerWebpackPlugin(),
    isDev && new ReactRefreshWebpackPlugin(),
    isDev && new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
};
