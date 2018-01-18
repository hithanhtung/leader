module.exports = (app, moduleViewPath) => {
    var renderRoot = (req, res) => {
        var options = app.defaultOptions(req);
        res.render(moduleViewPath + 'home', options);
    };
    app.get('/', renderRoot);
    app.get('/index(.html)?', renderRoot);
};