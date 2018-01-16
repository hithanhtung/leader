module.exports = (app, moduleViewPath) => {
    app.get('/admin(.html)?', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            res.render(moduleViewPath + 'admin', options);
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });

    app.get('/state/round', (req, res) => {
        app.model.Setting.getByKey('round', (value) => {
            if (value) {
                res.send({round: value});
            } else {
                app.model.Setting.create({key: 'round', value: 0}, () => {
                    res.send({round: 0});
                });
            }
        });
    });

    app.put('/state/round', (req, res) => {
        var options = app.defaultOptions(req),
            key = req.body.key,
            value = req.body.value;
        if (options.user && options.user.role == 'admin') {
            app.model.Setting.update({key: key, value: value}, (error) => {
                if (error == null) {
                    app.io.emit('round', value);
                }
                res.send({error: error});
            });
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });
};