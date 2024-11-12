/* eslint-disable strict */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = (env, argv) => {
  const pluginsToAdd = [];
  const mode = argv.mode;

  pluginsToAdd.push(
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  );
  pluginsToAdd.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './sdk-config.json',
          to: './'
        },
        {
          from: './assets/img/*',
          to: './'
        },
        {
          from: './assets/css/*',
          to: './'
        },
        {
          from: './node_modules/@pega/auth/lib/oauth-client/authDone.html',
          to: './auth.html'
        },
        {
          from: './node_modules/@pega/auth/lib/oauth-client/authDone.js',
          to: './'
        },
        {
          from: './node_modules/@pega/constellationjs/dist/bootstrap-shell*',
          to: './constellation/[name][ext]'
        },
        {
          from: './node_modules/@pega/constellationjs/dist/lib_asset.json',
          to: './constellation'
        },
        {
          from: './node_modules/@pega/constellationjs/dist/constellation-core*',
          to: './constellation/prerequisite/[name][ext]'
        },
        {
          from: './assets/icons/*',
          to: './constellation/icons/[name][ext]'
        },
        {
          from: './node_modules/@pega/constellationjs/dist/js',
          to: './constellation/prerequisite/js'
        }
      ]
    })
  );

  // Enable gzip and brotli compression
  // Exclude constellation-core and bootstrap-shell files since
  // client receives these files in gzip and brotli format
  if (mode === 'production') {
    pluginsToAdd.push(
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.js$|\.ts$|\.css$|\.html$/,
        exclude: /constellation-core*|bootstrap-shell*|531.*.js/,
        threshold: 10240,
        minRatio: 0.8
      })
    );
    pluginsToAdd.push(
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|ts|css|html|svg)$/,
        exclude: /constellation-core*|bootstrap-shell*|531.*.js/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11
          }
        },
        threshold: 10240,
        minRatio: 0.8
      })
    );
  }

  // need to set mode to 'development' to get LiveReload to work
  // and for debugger statements to not be stripped out of the bundle
  return {
    mode,
    entry: {
      app: './src/index.ts'
    },
    devServer: {
      static: path.join(__dirname, 'dist'),
      historyApiFallback: true,
      host: 'localhost',
      port: 3501,
      open: false
    },
    devtool: mode === 'production' ? false : 'inline-source-map',
    plugins: pluginsToAdd,
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.ts[x]?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, 'src'),
          use: ['style-loader', 'css-loader']
        },
        { test: /\.s[a|c]ss$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }] },
        { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
        {
          test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/font-woff2' }
        },
        {
          test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: 'url-loader',
          options: { limit: 10000, mimetype: 'application/font-woff' }
        },
        { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    }
  };
};
