module.exports = function (app) {
    var schema = app.db.Schema({
        key: String,
        value: String
    });

    var model = app.db.model('Setting', schema);
    app.model.Setting = {
        create: (data, done) => {
            model.create(data, done);
        },

        update: (data, done) => {
            model.findOne({key: data.key}, (error, item) => {
                if (error) {
                    done(error);
                } else if (item) {
                    item.value = data.value;
                    item.save(done);
                } else {
                    model.create(data, done);
                }
            });
        },

        getByKey: (key, done) => {
            model.findOne({key: key}, (error, item) => {
                done(error || item == null ? null : item.value);
            });
        },
    };
};