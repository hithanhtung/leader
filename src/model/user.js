module.exports = function (app) {

    var schema = app.db.Schema({
        username: String,
        password: String,
        role: String,           // admin, user
        active: Boolean
    });
    schema.methods.equalPassword = function(password) {
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
                            password: app.model.User.hashPassword('12345678'),
                            role: 'admin',
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
                    model.create(data, function (error, user) {
                        done(error ? null : user);
                    });
                }
            });
        },

        update: function (id, changes, done) {
            model.findOneAndUpdate({_id: id}, {$set: changes}, {new: true}, done);
        },

        getAll: function (done) {
            model.find({}, function (error, users) {
                done(error ? [] : users);
            });
        },

        deleteById: function (ids, done) {
            model.remove({_id: {$in: ids.split(',')}}, function (error) {
                done(error == null);
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