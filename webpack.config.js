var webpack = require('webpack');
var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var HtmlWebpackPlugin = require('html-webpack-plugin');

const LAUNCH_COMMAND = process.env.npm_lifecycle_event

const isProduction = LAUNCH_COMMAND === 'production'
process.env.BABEL_ENV = LAUNCH_COMMAND

const PATHS = {
  app: path.join(__dirname, 'src/client'),
  build: path.join(__dirname, 'dist'),
}

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: PATHS.app + '/index.html',
  filename: 'index.html',
  inject: 'body'
})
const productionPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
})
var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
	publicPath: 'http://localhost:8080'
  },
  	module : {
    loaders : [
      {
	    test : /\.jsx?/,
        include : APP_DIR,
		loaders: ['react-hot', 'babel'], include: path.join(__dirname, 'src')
        
      },
	  {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style!css?sourceMap&modules&localIdentName=[name]__[local]___[hash:base64:5]'},
	  {test: /\.(jpe?g|png|gif|svg)$/i,loaders: ['file?hash=sha512&digest=hex&name=[hash].[ext]',
	   'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']
      }
    ]
  },
   resolve: {
    root: path.resolve('./src/client/app')
  }
};

const developmentConfig = {
  devtool: 'cheap-module-inline-source-map',
  devServer: {
    contentBase: PATHS.build,
    hot: true,
    inline: true,
    progress: true,
  },
  plugins: [HTMLWebpackPluginConfig, new webpack.HotModuleReplacementPlugin()]
}

const productionConfig = {
  devtool: 'cheap-module-source-map',
  plugins: [HTMLWebpackPluginConfig, productionPlugin]
}
module.exports = config,(isProduction === true ? productionConfig : developmentConfig);