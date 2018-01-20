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

    app.put('/user/round1/answer/:questionIndex/:answer/:point', (req, res) => {
        var now = (new Date()).getTime(),
            options = app.defaultOptions(req),
            point = req.params.point,
            answer = req.params.answer;
        if (!(options.user && options.user.role == 'user')) {
            res.send({error: 'Insufficient privileges!'});
        } else if (app.answerDeadline == null) {
            res.send({error: 'The test doesn\'t start!'});
        } else if (app.answerDeadline < now) {
            res.send({error: 'Your answer has been late!'});
        } else {
            var currentAnswer = app.answers[options.user.username];
            if (currentAnswer == undefined || currentAnswer == null || currentAnswer.answer != answer) {
                app.answers[options.user.username] = {answer: answer, point: point};
                res.send({point: point});

                app.io.emit('questions_state', {questions: app.questions, answers: app.answers});
                app.io.emit('user_choice', {user: options.user.username, answer: answer, point: point});
            } else {
                res.send({point: point});
            }
        }
    });
};