module.exports = (app) => {

    // Connect DBs --------------------------------------------------------------------------------
    app.db = require('mongoose');
    app.db.connect(app.mongodb, {useMongoClient: true});

    // MongoDB connection events ------------------------------------------------------------------
    var connection = app.db.connection;
    connection.on("error", console.error.bind(console, "The MongoDB connection error"));
    connection.once("open", (callback) => {
        app.debug("The MongoDB connection succeeded.");
    });

    // Define all models --------------------------------------------------------------------------
    app.model = {};
};