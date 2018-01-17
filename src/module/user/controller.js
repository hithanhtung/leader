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

    app.put('/user/round1/question/:questionIndex', (req, res) => {
        var options = app.defaultOptions(req),
            questionIndex = req.params.questionIndex;
        if (options.user && options.user.role == 'user') {
            try {
                app.questions[options.user.username] = questionIndex;
                res.send({error: null, questions: app.questions});
                app.io.emit('questions_state', {questions: app.questions, answers: app.answers});
            } catch (ex) {
                res.send({error: 'Error on store user question index!'});
            }
        } else {
            res.send({error: 'Insufficient privileges!'});
        }
    });
};