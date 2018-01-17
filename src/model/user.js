module.exports = function (app) {
    var schema = app.db.Schema({
        username: String,
        password: String,
        role: String,           // admin, user, mc
        point: Number,
        active: Boolean
    });
    schema.methods.equalPassword = function (password) {
        return app.crypt.compareSync(password, this.password);
    };

    var model = app.db.model('User', schema);
    app.model.User = {
        init: function () {
            model.findOne({role: 'admin'}, function (error, user) {
                if (error == null && user == null) {
                    model.remove({username: 'admin'}, function () {
                        model.create({
                            username: 'admin',
                            password: '12345678',
                            role: 'admin',
                            point: 0,
                            active: true
                        });
                    });
                }
            });
        },

        create: function (data, done) {
            model.findOne({username: data.username}, function (error, user) {
                if (error != null || user != null) {
                    done(null);
                } else {
                    data.password = app.model.User.hashPassword(data.password);
                    model.create(data, function (error, user) {
                        done(error ? null : user);
                    });
                }
            });
        },

        update: function (id, changes, done) {
            model.findOneAndUpdate({_id: id}, {$set: changes}, {new: true}, done);
        },

        setLockAll: function (done) {
            model.find({}, function (err, totalTeam) {
                if (err) {
                    done('Set lock all have error !');
                } else if (totalTeam.length > 0) {
                    var currentStatus = totalTeam[totalTeam.length - 1].active;
                    for (var i = 0; i < totalTeam.length; i++) {
                        model.findOneAndUpdate(
                            {_id: totalTeam[i]._id},
                            {$set: {active: !currentStatus}},
                            {new: true},
                            function (err) {
                                if (err) done('Set lock all have error !');
                                return;
                            });
                    }
                    done(err, totalTeam);
                } else {
                    done('Set lock all have error !')
                }
            })
        },

        getAll: function (done) {
            model.find({}).sort({username: 1}).exec(function (error, users) {
                done(error ? [] : users);
            });
        },

        getAllUsers: function (done) {
            model.find({role: 'user'}).sort({username: 1}).exec(function (error, users) {
                done(error ? [] : users);
            });
        },

        getPoint: function (done) {
            model.find({role: 'user'}).sort({username: 1}).exec(function (error, users) {
                var points = {};
                if (error == null) {
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        points[user.username] = user.point;
                    }
                }
                done(points);
            });
        },

        deleteById: function (ids, done) {
            model.remove({_id: {$in: ids.split(',')}}, function (error) {
                done(error);
            });
        },

        auth: function (username, password, done) {
            model.findOne({username: username}, function (error, user) {
                if (error != null || user == null) {
                    done(false);
                } else {
                    done(user.equalPassword(password) ? user : false);
                }
            });
        },

        hashPassword: function (password) {
            return app.crypt.hashSync(password, app.crypt.genSaltSync(8), null);
        }
    };

    app.model.User.init();
};