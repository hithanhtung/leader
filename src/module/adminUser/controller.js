module.exports = (app, moduleViewPath) => {
    app.get('/adminUser', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            res.render(moduleViewPath + 'adminUser', options);
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else if (options.user.role == 'mc') {
            res.redirect('/mc');
        } else {
            res.redirect('/');
        }
    });

    app.get('/admin/user/getAll', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            app.model.User.getAll(function (users) {
                res.send(users);
            });
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });

    app.post('/admin/user', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            var data = {
                username: req.body.username.trim(),
                password: req.body.password,
                point: 0,
                role: req.body.role,
                active: req.body.active.toString().toLowerCase() == 'true'
            };
            app.model.User.create(data, function (user) {
                if (user == null) {
                    res.send({error: 'Create user have error !'});
                } else {
                    res.send({error: null, user: user})
                }
            });
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });

    app.put('/admin/user', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            var id = req.body.id,
                changes = {};
            if (req.body.username) changes.username = req.body.username;
            if (req.body.password) changes.password = req.body.password;
            if (req.body.role) changes.role = req.body.role;
            if (req.body.active) changes.active = req.body.active;

            app.model.User.update(id, changes, function (error, item) {
                res.send({error: error, item: item})
            })
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });
    app.put('/admin/user/lockAll', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            app.model.User.setLockAll(function (err, totalItem) {
                var result = {err: err, item: totalItem};
                res.send(result);
            })
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });

    app.delete('/admin/user', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            var id = req.body.id;
            app.model.User.deleteById(id, function (error) {
                res.send({error: error})
            });
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    })
};