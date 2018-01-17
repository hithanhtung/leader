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

    app.get('/admin/round1/state', (req, res) => {
        app.model.Setting.getByKey('round1Action', (action) => {
            if (action == null) {
                action = '';
                app.model.Setting.create({key: 'round1Action', value: action}, () => {
                });

                app.model.Setting.getByKey('round1QuestionIndex', (questionIndex) => {
                    if (questionIndex == null) {
                        questionIndex = 1;
                        app.model.Setting.create({key: 'round1QuestionIndex', value: questionIndex}, () => {
                        });
                    }

                    res.send({action: action, questionIndex: questionIndex});
                });
            }
        });
    });
    app.put('/admin/round1/:action/:questionIndex', (req, res) => {
        var options = app.defaultOptions(req),
            action = req.params.action,
            questionIndex = req.params.questionIndex;
        if (options.user && options.user.role == 'admin') {
            app.model.Setting.getByKey('round', (roundIndex) => {
                if (roundIndex == 1) {
                    app.model.Setting.create({key: 'round1QuestionIndex', value: questionIndex}, (error) => {
                        if (error) {
                            res.send({error: 'Save question state has errors!'});
                        } else {
                            app.model.Setting.create({key: 'round1Action', value: action}, (error) => {
                                if (error) {
                                    res.send({error: 'Save question state has errors!'});
                                } else {
                                    app.io.emit('round1Do', {action: action, questionIndex: questionIndex});
                                    res.send({error: null});
                                }
                            });
                        }
                    });
                } else {
                    res.send({error: 'Invalid round!'});
                }
            });
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });
};