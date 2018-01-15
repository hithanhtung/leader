module.exports = (app, moduleViewPath) => {
    app.get('/admin(.html)?', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            res.render(moduleViewPath + 'adminQuestion', options);
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });
};