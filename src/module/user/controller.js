module.exports = (app, moduleViewPath) => {
    app.get('/user(.html)?', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            res.redirect('/admin');
        } else if (options.user.role == 'user') {
            res.render(moduleViewPath + 'user', options);
        } else {
            res.redirect('/');
        }
    });
};