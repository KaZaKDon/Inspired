const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : false;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name].[contenthash].js',
    publicPath: '/', // Важно для корректных путей к ассетам
    assetModuleFilename: 'assets/[name][ext]', // для прочих ресурсов
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // Для копирования статичных файлов, если понадобится
    // new CopyPlugin({
    //   patterns: [{ from: 'src/fonts', to: 'fonts' }],
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: devMode,
              url: true, // Включаем обработку url() в CSS
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: devMode,
              postcssOptions: {
                plugins: [require('postcss-preset-env')],
              },
            },
          },
          'group-css-media-queries-loader',
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: devMode,
              root: path.resolve(__dirname, 'src'),
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // Нужно true, чтобы resolve-url-loader работал корректно
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]', // шрифты попадут в dist/fonts
        },
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]', // картинки в dist/images
        },
        use: devMode
          ? []
          : [
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: { progressive: true },
                  optipng: { enabled: false },
                  pngquant: { quality: [0.65, 0.9], speed: 4 },
                  gifsicle: { interlaced: false },
                  webp: { quality: 75 },
                },
              },
            ],
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css'],
    alias: {
      '@fonts': path.resolve(__dirname, 'src/fonts'), // удобный алиас для шрифтов
      '@images': path.resolve(__dirname, 'src/images'), // для картинок
      '@styles': path.resolve(__dirname, 'src/styles'), // для стилей
    },
  },
};