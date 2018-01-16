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
    app.model.Question = {
        getAll: function (done) {
            model.find({}).sort({index: 1}).exec((error, questions) => {
                done(error ? [] : questions);
            });
        },
    };
};