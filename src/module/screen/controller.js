module.exports = (app, moduleViewPath) => {
    app.get('/screen(.html)?', function (req, res) {
        var options = app.defaultOptions(req);
        res.render(moduleViewPath + 'screen', options);
    });
};