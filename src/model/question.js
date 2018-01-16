module.exports = function (app) {
    var schema = app.db.Schema({
        index: Number,
        content: String,
        answerA: String,
        answerB: String,
        answerC: String,
        answerD: String,
        clipUrl: String,
        Hint: String
    });

    var model = app.db.model('Question', schema);
    var reorderIndex = (done) => {
        model.find({}).sort({index: 1}).exec((error, questions) => {
            if (error) {
                done(error);
            } else {
                var solve = (index) => {
                    if (index < questions.length) {
                        var question = questions[index];
                        question.index = index;
                        question.save((error) => {
                            if (error) {
                                done(error);
                            } else {
                                solve(index + 1);
                            }
                        });
                    } else {
                        done(null);
                    }
                };
                solve(0);
            }
        });
    };

    app.model.Question = {
        create: function (data, done) {
            data.index = 1000000000;
            model.create(data, (error) => {
                if (error) {
                    done(error);
                } else {
                    reorderIndex(done);
                }
            });
        },

        getAll: function (done) {
            model.find({}).sort({index: 1}).exec((error, questions) => {
                done(error ? [] : questions);
            });
        },
    };
};