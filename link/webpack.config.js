// var webpack = require('webpack');
// var path = require('path');


module.exports = {
    // entry:'./src/main.js',
    // output:{
    //     path:path.resolve(__dirname, './dist/'),
    //     filename:'build.js'
    // },
    //设置开发者工具的端口号,不设置则默认为8080端口
    devServer: {
        inline: true,
        port: 8181,
        historyApiFallback: true
    },
    // module:{
    //     loaders:[
    //         {
    //             test:/\.js?$/,
    //             exclude:/node_modules/,
    //             loader:'babel-loader',
    //             query:{
    //                 presets:['es2015','react']
    //             }
    //         },
    //         {
    //             test:/\.css$/,
    //             loader:'style-loader!css-loader'
    //         }
    //     ]
    // }
};
