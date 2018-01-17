module.exports = (app, moduleViewPath) => {
    app.get('/admin(.html)?', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            res.render(moduleViewPath + 'admin', options);
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else if (options.user.role == 'mc') {
            res.redirect('/mc');
        } else {
            res.redirect('/');
        }
    });

    app.get('/state/screen', (req, res) => {
        app.model.Setting.getByKey('screen', (value) => {
            if (value) {
                res.send({screen: value});
            } else {
                app.model.Setting.update({key: 'screen', value: 'empty'}, () => {
                    res.send({screen: 'empty'});
                });
            }
        });
    });
    app.put('/state/screen/:value', (req, res) => {
        var options = app.defaultOptions(req);
        if (options.user && options.user.role == 'admin') {
            var value = req.params.value.toLowerCase();
            if (value == 'empty' || value == 'point' || value == 'question') {
                app.model.Setting.update({key: 'screen', value: value}, (error) => {
                    if (error == null) {
                        app.io.emit('screen', value);
                    }
                    res.send({error: error});
                });
            }
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });

    app.get('/state/online', (req, res) => {
        res.send(app.online);
    });
    app.get('/state/questions', (req, res) => {
        res.send({questions: app.questions, answers: app.answers});
    });

    app.get('/state/point', (req, res) => {
        app.model.User.getPoint((points) => {
            res.send({points: points});
        });
    });
    app.put('/state/point', (req, res) => {
        var options = app.defaultOptions(req);
        if (options.user && options.user.role == 'admin') {
            var username = req.body.username,
                point = req.body.point;
            app.model.User.addPoint(username, point, (error) => {
                res.send({error: error});
                app.model.User.getPoint((points) => {
                    app.io.emit('point', points);
                });
            });
        }
    });

    app.get('/state/round', (req, res) => {
        app.model.Setting.getByKey('round', (value) => {
            if (value) {
                res.send({round: value});
            } else {
                app.model.Setting.update({key: 'round', value: 0}, () => {
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
                app.model.Setting.update({key: 'round1Action', value: action}, () => {
                });
            }

            app.model.Setting.getByKey('round1QuestionIndex', (questionIndex) => {
                if (questionIndex == null) {
                    questionIndex = 1;
                    app.model.Setting.update({key: 'round1QuestionIndex', value: questionIndex}, () => {
                    });
                }

                var options = app.defaultOptions(req),
                    result = {action: action, questionIndex: questionIndex};
                app.model.Question.getByIndex(questionIndex, (error, question) => {
                    if (error == null && question != null) {
                        result.question = {
                            index: question.index,
                            content: question.content,
                            answerA: question.answerA,
                            answerB: question.answerB,
                            answerC: question.answerC,
                            answerD: question.answerD,
                            clipUrl: question.clipUrl
                        };
                        if (options.user) {
                            if (options.user.role == 'admin' || options.user.role == 'mc') {
                                result.question = question;
                            } else if (action == 'result') {
                                result.result = question.result;
                            }
                        }
                    }
                    res.send(result);
                });
            });
        });
    });
    app.put('/admin/round1/:action/:questionIndex', (req, res) => {
        var options = app.defaultOptions(req),
            action = req.params.action,
            questionIndex = req.params.questionIndex;

        if (options.user && options.user.role == 'admin') {
            app.model.Setting.getByKey('round', (roundIndex) => {
                if (roundIndex == 1) {
                    app.model.Setting.update({key: 'round1QuestionIndex', value: questionIndex}, (error) => {
                        if (error) {
                            res.send({error: 'Save question state has errors!'});
                        } else {
                            app.model.Setting.update({key: 'round1Action', value: action}, (error) => {
                                if (error) {
                                    res.send({error: 'Save question state has errors!'});
                                } else {
                                    var result = {action: action, questionIndex: questionIndex};
                                    //TODO: do action => send, show, start, pause, restart, result
                                    if (action == 'send') {
                                        app.model.Question.getByIndex(questionIndex, (error, question) => {
                                            if (error == null && question) {
                                                result.question = {
                                                    index: question.index,
                                                    content: question.content,
                                                    answerA: question.answerA,
                                                    answerB: question.answerB,
                                                    answerC: question.answerC,
                                                    answerD: question.answerD,
                                                    clipUrl: question.clipUrl
                                                };
                                                app.io.emit('round1Do', result);
                                            }
                                        });
                                    } else if (action == 'show') {
                                        app.io.emit('round1Do', result);
                                    } else {
                                        //TODO: delete
                                        app.io.emit('round1Do', result);
                                    }

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