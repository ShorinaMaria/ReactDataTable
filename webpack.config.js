var webpack = require('webpack');
var NpmInstallPlugin = require('npm-install-webpack-plugin');

module.exports = {

    entry: {
        main: ['./src/index.js', 'webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8081/'],
        test: ['./src/test/index.js', 'webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8081/']
    },
    output: {
        path: __dirname + '/public/build/',
        publicPath: "build/",
        filename: "[name].bundle.js"
    },
    plugins: [
        //new NpmInstallPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        preLoaders: [
            /*
          {
            test: /\.js$/,
            loaders: ['eslint'],
            exclude: [/node_modules/, /public/]
          }
          */
        ],
        loaders: [
            {
              test: /\.js$/,
              loaders: ['react-hot', 'babel-loader'],
              exclude: [/node_modules/, /public/],
              plugins: ['transform-runtime']
            },
            {
                test: /\.js$/,
                loader: "babel",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader!autoprefixer-loader",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!autoprefixer-loader!less",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.gif$/,
                loader: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.jpg$/,
                loader: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=10000&mimetype=image/png"
            },
            {
                test: /\.svg/,
                loader: "url-loader?limit=26000&mimetype=image/svg+xml"
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    }
}
