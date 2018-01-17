module.exports = (app) => {
    var schema = app.db.Schema({
        index: Number,
        content: String,
        answerA: String,
        answerB: String,
        answerC: String,
        answerD: String,
        result: String,
        clipUrl: String,
        hint: String
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
                        question.index = index + 1;
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
        create: (data, done) => {
            data.index = 1000000000;
            model.create(data, (error) => {
                if (error) {
                    done(error);
                } else {
                    reorderIndex(done);
                }
            });
        },

        getAll: (done) => {
            model.find({}).sort({index: 1}).exec((error, questions) => {
                done(error ? [] : questions);
            });
        },

        getByIndex: (index, done) => {
            model.findOne({index: index}, done);
        },

        deleteById: (ids, done)=> {
            model.remove({_id: {$in: ids.split(',')}}, (error) => {
                done(error);
            });
        },

        update: (id, changes, done) => {
            model.findOneAndUpdate({_id: id}, {$set: changes}, {new: true}, done);
        },

        moveUp: (id, status, done) => {
            console.log(status);
            model.findOne({_id: id}, (error, question) => {
                if (error) {
                    done(error)
                } else {
                    var idx = question.index;
                    question.index = (status == 'true') ? idx - 1.5 : idx + 1.5;
                    question.save((error2) => {
                        if (error2) {
                            done(error2);
                        } else {
                            reorderIndex(done);
                        }
                    })
                }
            })
        }
    };
};