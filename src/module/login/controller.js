module.exports = (app, moduleViewPath) => {
    app.get('/login(.html)?', (req, res) => {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.render(moduleViewPath + 'login', options);
        } else if (options.user.role == 'admin') {
            res.redirect('/admin');
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });

    app.get('/logout(.html)?', (req, res)=> {
        req.session.user = null;
        res.redirect('/');
    });

    app.post('/login(.html)?', (req, res) => {
        var id = req.body.id.trim(),
            password = req.body.password;
        app.model.User.auth(id, password, (user) => {
            if (user) {
                req.session.user = user;
                res.send({error: null, role: user.role});
            } else {
                res.send({error: 'Invalid username or password'});
            }
        });
    });
};