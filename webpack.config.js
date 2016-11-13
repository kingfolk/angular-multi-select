var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './example',
    debug: true,
    output: {
        path: path.join(__dirname, 'example'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'raw',
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            loader: "style-loader!css-loader",
            exclude: /node_modules/
        },
        {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")
    ],
};
