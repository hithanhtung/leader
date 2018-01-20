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
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });
    app.put('/state/all_point/:point', (req, res) => {
        var options = app.defaultOptions(req),
            point = req.params.point;
        if (options.user && options.user.role == 'admin') {
            Object.keys(app.answers).forEach(function eachKey(userId) {
                app.answers[userId].point = point;
            });
            res.send({error: null});
        } else {
            res.send({error: 'Insufficient privileges!'});
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

    var defaultSettingTime = {
        round1: 10,
        round2: 3 * 60,
        round3: 10 * 60,
        round4: 7 * 60
    };
    var getRoundTime = () => {
        app.model.Setting.getByKey('time', (value) => {
            app.roundTime = value ? JSON.parse(value) : defaultSettingTime;
        });
    };
    getRoundTime();
    app.get('/state/time', (req, res) => {
        if (!app.roundTime) {
            getRoundTime();
        }
        res.send(app.roundTime);
    });
    app.put('/state/time/:roundIndex/:roundTime', (req, res) => {
        var options = app.defaultOptions(req);
        if (options.user && options.user.role == 'admin') {
            var roundIndex = req.params.roundIndex,
                roundTime = req.params.roundTime;
            app.model.Setting.getByKey('time', (value) => {
                value = value != null ? JSON.parse(value) : Object.assign({}, defaultSettingTime);
                value['round' + roundIndex] = roundTime;

                app.model.Setting.update({key: 'time', value: JSON.stringify(value)}, () => {
                    app.roundTime = value;
                });
                res.send({error: null});
            });
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });

    app.get('/state/round2User', (req, res) => {
        app.model.Setting.getByKey('round2User', (value) => {
            if (value) {
                res.send({round2User: value});
            } else {
                app.model.Setting.update({key: 'round2User', value: ''}, () => {
                    res.send({round2User: ''});
                });
            }
        });
    });
    app.put('/state/round2User/:username', (req, res) => {
        var options = app.defaultOptions(req),
            username = req.params.username;
        if (username == '0') username = '';

        if (options.user && options.user.role == 'admin') {
            app.model.Setting.getByKey('round2User', (round2User) => {
                if (round2User != username) {
                    app.model.Setting.update({key: 'round2User', value: username}, (error) => {
                        if (error == null) {
                            app.round2Deadline = new Date().getTime() + app.roundTime * 1000;
                            app.io.emit('round2User', {round2User: username});
                            //TODO: SetTimeout
                        }
                        res.send({error: error});
                    });
                } else {
                    res.send({error: null});
                }
            });
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });
    app.delete('/state/round2User', (req, res) => {
        //TODO
    });

    app.get('/state/round3User', (req, res) => {
        app.model.Setting.getByKey('round3User1', (round3User1) => {
            if (round3User1 == null) round3User1 = '';

            app.model.Setting.getByKey('round3User2', (round3User2) => {
                if (round3User2 == null) round3User2 = '';

                app.model.Setting.getByKey('round3User3', (round3User3) => {
                    if (round3User3 == null) round3User3 = '';

                    app.model.Setting.getByKey('round3User4', (round3User4) => {
                        if (round3User4 == null) round3User4 = '';

                        res.send({
                            round3User1: round3User1, round3User2: round3User2,
                            round3User3: round3User3, round3User4: round3User4
                        });
                    });
                });
            });
        });
    });
    app.put('/state/round3User/:index/:username', (req, res) => {
        var options = app.defaultOptions(req),
            index = req.params.index,
            username = req.params.username;
        if (options.user && options.user.role == 'admin') {
            app.model.Setting.update({key: 'round3User' + index, value: username}, (error) => {
                if (error == null) {
                    app.io.emit('round3User');
                }
                res.send({error: error});
            });
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });

    app.get('/state/round4User', (req, res) => {
        app.model.Setting.getByKey('round4User1', (round4User1) => {
            if (round4User1 == null) round4User1 = '';

            app.model.Setting.getByKey('round4User2', (round4User2) => {
                if (round4User2 == null) round4User2 = '';

                res.send({round4User1: round4User1, round4User2: round4User2});
            });
        });
    });
    app.put('/state/round4User/:index/:username', (req, res) => {
        var options = app.defaultOptions(req),
            index = req.params.index,
            username = req.params.username;
        if (options.user && options.user.role == 'admin') {
            app.model.Setting.update({key: 'round4User' + index, value: username}, (error) => {
                if (error == null) {
                    app.io.emit('round4User');
                }
                res.send({error: error});
            });
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });

    // Action => send, show, start, pause, restart, result
    app.round1TimeoutId = null;
    app.get('/admin/round1/state', (req, res) => {
        app.model.Setting.getByKey('round1Action', (action) => {
            if (action == null) {
                action = 'stop';
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
                            clipUrl: question.clipUrl,
                        };

                        if (action == 'show') {
                            result.remainTime = app.roundTime.round1 * 1000;
                        } else if (action == 'start') {
                            result.remainTime = app.answerDeadline - (new Date()).getTime();
                        } else if (action == 'result') {
                            result.result = question.result;
                        }

                        if (options.user) {
                            if (options.user.role == 'admin' || options.user.role == 'mc') {
                                result.question = question;
                            } else if (options.user.role == 'user') {
                                result.answer = app.answers[options.user.username];
                            }
                        }
                    }
                    console.log(result);
                    res.send(result);
                });
            });
        });
    });
    app.put('/admin/round1/:action/:questionIndex', (req, res) => {
        var options = app.defaultOptions(req),
            action = req.params.action,
            questionIndex = req.params.questionIndex;

        var solveAction = (currentAction) => {
            var validAction =
                (action == 'send') || (action == 'result') ||
                (action == 'show' && currentAction == 'send') ||
                (action == 'start' && (currentAction == 'show' || currentAction == 'pause')) ||
                (action == 'pause' && currentAction == 'start') ||
                (action == 'restart' && (currentAction == 'start' || currentAction == 'pause' || currentAction == 'stop')) ||
                (action == 'result' && currentAction == 'stop');

            if (validAction) {
                var now = new Date().getTime();

                if (action == 'send') {
                    app.answers = {};
                    if (app.round1TimeoutId != null) {
                        clearTimeout(app.round1TimeoutId);
                        app.round1TimeoutId = null;
                    }
                } else if (action == 'start') {
                    if (currentAction == 'pause') {
                        app.answerDeadline = now + app.round1RemainTime;
                    } else {
                        app.answerDeadline = now + app.roundTime.round1 * 1000;
                    }
                } else if (action == 'pause') {
                    app.round1RemainTime = Math.max(0, app.answerDeadline - now);
                } else if (action == 'restart') {
                    action = 'start';
                }

                app.model.Setting.update({key: 'round1Action', value: action}, (error) => {
                    if (error) {
                        res.send({error: 'Save question state has errors!'});
                    } else {
                        res.send({error: null});
                        app.io.emit('round1Do', {
                            action: action,
                            questionIndex: questionIndex
                        });

                        if (action == 'start') {
                            setTimeout(() => {
                                var stopAction = 'stop';
                                app.model.Setting.update({key: 'round1Action', value: stopAction}, (error) => {
                                    // action => stop
                                    app.io.emit('round1Do', {
                                        action: stopAction,
                                        questionIndex: questionIndex
                                    });
                                });
                            }, app.answerDeadline - now + 2000);
                        }
                    }
                });
            }
        };

        if (options.user && options.user.role == 'admin') {
            app.model.Setting.getByKey('round', (roundIndex) => {
                if (roundIndex == 1) {
                    app.model.Setting.update({key: 'round1QuestionIndex', value: questionIndex}, (error) => {
                        if (error) {
                            res.send({error: 'Save question state has errors!'});
                        } else {
                            app.model.Setting.getByKey('round1Action', (currentAction) => {
                                if (currentAction != null) {
                                    solveAction(currentAction);
                                } else {
                                    res.send({error: 'Invalid round!'});
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