module.exports = (app, moduleViewPath) => {
    app.get('/mc(.html)?', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            res.redirect('/admin');
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else if (options.user.role == 'mc') {
            res.render(moduleViewPath + 'mc', options);
        } else {
            res.redirect('/');
        }
    });
};