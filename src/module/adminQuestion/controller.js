module.exports = (app, moduleViewPath) => {
    app.get('/adminQuestion', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            res.render(moduleViewPath + 'adminQuestion', options);
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });
    app.get('/adminQuestion/getAll', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            app.model.Question.getAll((questions) => {
                res.send(questions);
            });
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });
    app.post('/adminQuestion', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            var question = {
                id : req.body.id,
                content: req.body.content,
                answerA: req.body.answerA,
                answerB: req.body.answerB,
                answerC: req.body.answerC,
                answerD: req.body.answerD,
                result : req.body.result,
                clipUrl: req.body.clipUrl,
                hint: req.body.hint
            };
            app.model.Question.create(question,(error, qs) => {
                res.send({error: error});
            })
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });
    app.put('/adminQuestion', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            var id = req.body.id,
                changes = {};
            if(req.body.content) changes.content = req.body.content;
            if(req.body.answerA) changes.answerA = req.body.answerA;
            if(req.body.answerB) changes.answerB = req.body.answerB;
            if(req.body.answerC) changes.answerC = req.body.answerC;
            if(req.body.answerD) changes.answerD = req.body.answerD;
            if(req.body.result) changes.result = req.body.result;
            if(req.body.hint) changes.hint = req.body.hint;
            if(req.body.clipUrl) changes.clipUrl = req.body.clipUrl;

            app.model.Question.update(id, changes, (error, question) => {
                res.send({error: error, item: question});
            })
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });
    app.put('/adminQuestion/move', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            var id = req.body.id,
                status = req.body.status;

            app.model.Question.moveUp(id, status, (error) => {
                res.send({error: error});
            })
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });
    app.delete('/adminQuestion', function (req, res) {
        var options = app.defaultOptions(req);
        if (options.user == null) {
            res.redirect('/login.html');
        } else if (options.user.role == 'admin') {
            var id = req.body.id;
            app.model.Question.deleteById(id,(error) => {
                res.send({error: error});
            })
        } else if (options.user.role == 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });
};