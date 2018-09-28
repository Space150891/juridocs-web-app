const express = require('express')
const debug = require('debug')('app:server')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.config')
const config = require('../config')
const compress = require('compression')
const path = require('path')
const history = require('connect-history-api-fallback')

const app = express()
const router = express.Router()
const paths = config.utils_paths

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

// Apply gzip compression
app.use(compress())

// If no router match fallback to serve index.html
app.use(history())


// ----------------------------
// Apply Webpack HMR Middleware
// ----------------------------
if (config.env === 'development') {
    const compiler = webpack(webpackConfig)

    debug('Enable webpack dev')
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath  : webpackConfig.output.publicPath,
        contentBase : paths.client(),
        hot         : false,
        quiet       : config.compiler_quiet,
        noInfo      : config.compiler_quiet,
        lazy        : false,
        stats       : config.compiler_stats
    }))

    // Serve static assets from ~/src/static since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    app.use(express.static(paths.client('static')))
} else {

    // Serving ~/dist by default. Ideally these files should be served by
    // the web server and not the app server, but this helps to demo the
    // server in production.
    app.use(express.static(paths.dist()))
}

module.exports = app
