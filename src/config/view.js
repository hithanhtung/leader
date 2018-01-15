module.exports = (app, express) => {

    // Compress responses =====================================================
    var compression = require('compression');
    app.use(compression());

    // Favicon ================================================================
    var favicon = require('serve-favicon');
    app.use(favicon(app.faviconPath));

    // Setup PUG view engine ==================================================
    app.viewEngine = require('pug');
    app.set('views', app.viewPath);
    app.set('view engine', 'pug');

    // Setup public folder ====================================================
    var oneYear = 1 * 365 * 24 * 60 * 60 * 1000;
    app.use('/', express.static(app.publicPath, {maxAge: oneYear}));
};